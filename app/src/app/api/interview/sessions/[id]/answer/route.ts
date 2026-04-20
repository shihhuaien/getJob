import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitInterviewAnswerSchema } from "@/lib/validations";
import type { InterviewAnswer, InterviewQuestion } from "@/types/interview";
import type { Json } from "@/types/database";

export async function POST(
  request: Request,
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

    const body = await request.json();
    const validation = submitInterviewAnswerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const { question_id, answer_text, audio_duration_sec } = validation.data;

    const { data: session, error: fetchError } = await supabase
      .from("interview_sessions")
      .select("questions, answers, status")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.status !== "in_progress") {
      return NextResponse.json(
        { error: "Session is not in progress" },
        { status: 400 }
      );
    }

    const questions = session.questions as unknown as InterviewQuestion[];
    if (!questions.some((q) => q.id === question_id)) {
      return NextResponse.json({ error: "Invalid question_id" }, { status: 400 });
    }

    const existingAnswers = (session.answers as unknown as InterviewAnswer[]) || [];
    const filtered = existingAnswers.filter(
      (a) => a.question_id !== question_id
    );
    const newAnswer: InterviewAnswer = {
      question_id,
      answer_text,
      audio_duration_sec,
      submitted_at: new Date().toISOString(),
    };
    const updatedAnswers = [...filtered, newAnswer];

    const { error: updateError } = await supabase
      .from("interview_sessions")
      .update({ answers: updatedAnswers as unknown as Json })
      .eq("id", id)
      .eq("user_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to save answer" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { ok: true } });
  } catch (err) {
    console.error("[/api/interview/sessions/[id]/answer] Error:", err);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 }
    );
  }
}
