import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createInterviewSessionSchema } from "@/lib/validations";
import { generateInterviewQuestions } from "@/lib/interview/generate-questions";
import type { ResumeContent } from "@/types/resume";
import type { InterviewQuestion } from "@/types/interview";
import type { Json } from "@/types/database";

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
    const validation = createInterviewSessionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { job_id, resume_id, persona, interview_type, mode, drill_down_enabled, extra_instructions } =
      validation.data;
    const requestLocale = typeof body.locale === "string" ? body.locale : "zh-TW";
    // AI 產出語言偏好優先於介面語系；未設定時跟隨介面語系。此處解析一次後存入 session，
    // 供後續 hint/answer/complete 沿用（避免中途切換造成同一場面試中英混雜）
    const locale = profile?.ai_output_language ?? requestLocale;

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
    const { job_description, company_name, job_title } = jobResult.data;

    const questions: InterviewQuestion[] = await generateInterviewQuestions(
      resumeContent,
      job_description,
      company_name,
      job_title,
      persona,
      interview_type,
      locale,
      extra_instructions
    );

    const { data: session, error: dbError } = await supabase
      .from("interview_sessions")
      .insert({
        user_id: user.id,
        job_application_id: job_id,
        resume_id,
        persona,
        interview_type,
        mode,
        drill_down_enabled,
        status: "in_progress",
        questions: questions as unknown as Json,
        answers: [],
        locale,
      })
      .select("id")
      .single();

    if (dbError || !session) {
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: session.id } });
  } catch (err) {
    console.error("[/api/interview/sessions] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to start interview";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("interview_sessions")
      .select(
        "id, job_application_id, persona, interview_type, mode, status, report, created_at, completed_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to load sessions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[/api/interview/sessions GET] Error:", err);
    return NextResponse.json(
      { error: "Failed to load sessions" },
      { status: 500 }
    );
  }
}
