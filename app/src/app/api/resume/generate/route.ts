import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { optimizeResumeRequestSchema } from "@/lib/validations";
import { analyzeResume, generateOptimizedResume } from "@/lib/optimize-resume";
import type { ResumeContent } from "@/types/resume";
import type { Database } from "@/types/database";

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
        .select("title, content")
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

    const resumeContent = resumeResult.data
      .content as unknown as ResumeContent;
    const jobDescription = jobResult.data.job_description;
    const locale = profile?.ai_output_language ?? body.locale;

    const titleText = locale === "en"
      ? `Resume for ${jobResult.data.company_name}`
      : `針對${jobResult.data.company_name}的履歷`;

    // 去重：同名履歷若已存在，直接回傳 409（避免浪費 AI token）
    const { data: existingResume } = await supabase
      .from("resumes")
      .select("id")
      .eq("user_id", user.id)
      .eq("title", titleText)
      .maybeSingle();

    if (existingResume) {
      return NextResponse.json(
        { error: "Duplicate resume", existing_id: existingResume.id },
        { status: 409 }
      );
    }

    const analysis = await analyzeResume(resumeContent, jobDescription, locale);
    const optimizedContent = await generateOptimizedResume(
      resumeContent,
      jobDescription,
      analysis,
      locale
    );

    const { data: newResume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: titleText,
        target_job_title: jobResult.data.job_title || null,
        content:
          optimizedContent as unknown as Database["public"]["Tables"]["resumes"]["Insert"]["content"],
      })
      .select("id")
      .single();

    if (dbError) {
      // 競態：pre-check 後另一請求已建立
      if (dbError.code === "23505") {
        return NextResponse.json(
          { error: "Duplicate resume" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create resume" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: newResume.id } });
  } catch (err) {
    console.error("[/api/resume/generate] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate resume";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
