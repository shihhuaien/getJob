import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetterSchema } from "@/lib/validations";
import { generateCoverLetter } from "@/lib/generate-cover-letter";
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
    const validation = generateCoverLetterSchema.safeParse(body);

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
        { error: "該職缺沒有描述內容，無法生成求職信" },
        { status: 400 }
      );
    }

    const resumeContent = resumeResult.data
      .content as unknown as ResumeContent;
    const { job_description, company_name, job_title } = jobResult.data;

    const content = await generateCoverLetter(
      resumeContent,
      job_description,
      company_name,
      job_title
    );

    // 建立求職信
    const { data: coverLetter, error: dbError } = await supabase
      .from("cover_letters")
      .insert({
        user_id: user.id,
        title: `致${company_name}的求職信`,
        content,
        job_application_id: job_id,
      })
      .select("id")
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "建立求職信失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: coverLetter.id } });
  } catch (err) {
    console.error("[/api/cover-letter/generate] Error:", err);
    const message =
      err instanceof Error ? err.message : "生成求職信失敗，請稍後再試";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
