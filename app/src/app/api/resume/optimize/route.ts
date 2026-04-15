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
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    // 檢查訂閱狀態
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_tier !== "pro") {
      return NextResponse.json(
        { error: "此功能需要 Pro 方案" },
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
      return NextResponse.json({ error: "找不到該履歷" }, { status: 404 });
    }

    if (!jobResult.data) {
      return NextResponse.json({ error: "找不到該職缺" }, { status: 404 });
    }

    if (!jobResult.data.job_description) {
      return NextResponse.json(
        { error: "該職缺沒有描述內容，無法進行分析" },
        { status: 400 }
      );
    }

    const resumeContent = resumeResult.data.content as unknown as ResumeContent;
    const analysis = await analyzeResume(
      resumeContent,
      jobResult.data.job_description
    );

    return NextResponse.json({ data: analysis });
  } catch (err) {
    console.error("[/api/resume/optimize] Error:", err);
    const message =
      err instanceof Error ? err.message : "分析失敗，請稍後再試";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
