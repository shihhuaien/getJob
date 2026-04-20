import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { evaluateSession } from "@/lib/interview/evaluate-session";
import type {
  InterviewAnswer,
  InterviewMode,
  InterviewQuestion,
} from "@/types/interview";
import type { ResumeContent } from "@/types/resume";
import type { Json } from "@/types/database";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_tier !== "pro") {
      return NextResponse.json(
        { error: "Pro plan required" },
        { status: 403 }
      );
    }

    const { data: session, error: fetchError } = await supabase
      .from("interview_sessions")
      .select(
        "questions, answers, mode, locale, status, job_application_id, resume_id"
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status === "completed" && session) {
      return NextResponse.json({ data: { ok: true } });
    }

    const [jobResult, resumeResult] = await Promise.all([
      session.job_application_id
        ? supabase
            .from("job_applications")
            .select("job_description")
            .eq("id", session.job_application_id)
            .eq("user_id", user.id)
            .single()
        : Promise.resolve({ data: null }),
      session.resume_id
        ? supabase
            .from("resumes")
            .select("content")
            .eq("id", session.resume_id)
            .eq("user_id", user.id)
            .single()
        : Promise.resolve({ data: null }),
    ]);

    const jobDescription = jobResult.data?.job_description || "";
    const resumeContent =
      (resumeResult.data?.content as unknown as ResumeContent | undefined) ||
      null;

    const questions = session.questions as unknown as InterviewQuestion[];
    const answers = (session.answers as unknown as InterviewAnswer[]) || [];

    const report = await evaluateSession(
      questions,
      answers,
      resumeContent,
      jobDescription,
      session.mode as InterviewMode,
      session.locale
    );

    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({
        status: "completed",
        report: report as unknown as Json,
        completed_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to save report" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    console.error("[/api/interview/sessions/[id]/complete] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
