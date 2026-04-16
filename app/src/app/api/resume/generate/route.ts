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
      return NextResponse.json({ error: "找不到該履歷" }, { status: 404 });
    }

    if (!jobResult.data) {
      return NextResponse.json({ error: "找不到該職缺" }, { status: 404 });
    }

    if (!jobResult.data.job_description) {
      return NextResponse.json(
        { error: "該職缺沒有描述內容，無法生成優化履歷" },
        { status: 400 }
      );
    }

    const resumeContent = resumeResult.data
      .content as unknown as ResumeContent;
    const jobDescription = jobResult.data.job_description;

    // 先分析，再根據分析結果生成優化履歷
    const analysis = await analyzeResume(resumeContent, jobDescription);
    const optimizedContent = await generateOptimizedResume(
      resumeContent,
      jobDescription,
      analysis
    );

    // 建立新履歷
    const { data: newResume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title: `針對${jobResult.data.company_name}的履歷`,
        target_job_title: jobResult.data.job_title || null,
        content:
          optimizedContent as unknown as Database["public"]["Tables"]["resumes"]["Insert"]["content"],
      })
      .select("id")
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "建立履歷失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: newResume.id } });
  } catch (err) {
    console.error("[/api/resume/generate] Error:", err);
    const message =
      err instanceof Error ? err.message : "生成優化履歷失敗，請稍後再試";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
