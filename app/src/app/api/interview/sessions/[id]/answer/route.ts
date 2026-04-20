import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitInterviewAnswerSchema } from "@/lib/validations";
import { generateDrillDown } from "@/lib/interview/generate-drill-down";
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
    const {
      question_id,
      answer_text,
      audio_duration_sec,
      drill_down_question,
      drill_down_answer,
    } = validation.data;

    const isDrillDownSubmit =
      typeof drill_down_question === "string" &&
      drill_down_question.length > 0 &&
      typeof drill_down_answer === "string";

    if (!isDrillDownSubmit && typeof answer_text !== "string") {
      return NextResponse.json(
        { error: "answer_text is required for initial submission" },
        { status: 400 }
      );
    }

    const { data: session, error: fetchError } = await supabase
      .from("interview_sessions")
      .select("questions, answers, status, drill_down_enabled, locale")
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
    const question = questions.find((q) => q.id === question_id);
    if (!question) {
      return NextResponse.json({ error: "Invalid question_id" }, { status: 400 });
    }

    const existingAnswers =
      (session.answers as unknown as InterviewAnswer[]) || [];

    let updatedAnswers: InterviewAnswer[];

    if (isDrillDownSubmit) {
      // 追問作答：只更新既有答案的 drill_down 欄位，保留原 answer_text
      const existing = existingAnswers.find((a) => a.question_id === question_id);
      if (!existing) {
        return NextResponse.json(
          { error: "Initial answer not found for drill-down" },
          { status: 400 }
        );
      }
      updatedAnswers = existingAnswers.map((a) =>
        a.question_id === question_id
          ? {
              ...a,
              drill_down: {
                question: drill_down_question,
                answer: drill_down_answer,
              },
            }
          : a
      );
    } else {
      // 初次作答：寫入 / 覆寫答案
      const filtered = existingAnswers.filter(
        (a) => a.question_id !== question_id
      );
      const newAnswer: InterviewAnswer = {
        question_id,
        answer_text: answer_text ?? "",
        audio_duration_sec,
        submitted_at: new Date().toISOString(),
      };
      updatedAnswers = [...filtered, newAnswer];
    }

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

    // 初次作答 + drill_down_enabled → 判斷是否觸發追問
    let followUp: string | null = null;
    if (!isDrillDownSubmit && session.drill_down_enabled && answer_text) {
      try {
        followUp = await generateDrillDown(
          question.text,
          answer_text,
          session.locale
        );
      } catch (err) {
        console.error("[/answer] drill-down generation failed:", err);
      }
    }

    return NextResponse.json({
      data: { ok: true, drill_down_question: followUp },
    });
  } catch (err) {
    console.error("[/api/interview/sessions/[id]/answer] Error:", err);
    return NextResponse.json(
      { error: "Failed to save answer" },
      { status: 500 }
    );
  }
}
