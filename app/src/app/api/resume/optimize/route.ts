import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { optimizeResumeRequestSchema } from "@/lib/validations";
import { analyzeResume } from "@/lib/optimize-resume";
import type { ResumeContent } from "@/types/resume";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier, ai_output_language")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_tier !== "pro") {
      return NextResponse.json(
        { error: "Pro plan required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = optimizeResumeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { resume_id, job_id } = validation.data;

    // 平行查詢履歷與職缺
    const [resumeResult, jobResult] = await Promise.all([
      supabase
        .from("resumes")
        .select("content")
        .eq("id", resume_id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("job_applications")
        .select("job_description, job_title, company_name")
        .eq("id", job_id)
        .eq("user_id", user.id)
        .single(),
    ]);

    if (!resumeResult.data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!jobResult.data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!jobResult.data.job_description) {
      return NextResponse.json(
        { error: "Job has no description" },
        { status: 400 }
      );
    }

    const resumeContent = resumeResult.data.content as unknown as ResumeContent;
    const locale = (typeof body.locale === "string" ? body.locale : undefined) ?? profile?.ai_output_language ?? "zh-TW";
    const analysis = await analyzeResume(
      resumeContent,
      jobResult.data.job_description,
      locale
    );

    return NextResponse.json({ data: analysis });
  } catch (err) {
    console.error("[/api/resume/optimize] Error:", err);
    const message =
      err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
