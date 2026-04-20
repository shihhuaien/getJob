import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { generateStarHint } from "@/lib/interview/generate-hint";
import type { InterviewQuestion } from "@/types/interview";

const bodySchema = z.object({
  question_id: z.string().min(1),
  current_answer: z.string().max(10000).optional().default(""),
});

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
    const validation = bodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const { question_id, current_answer } = validation.data;

    const { data: session, error: fetchError } = await supabase
      .from("interview_sessions")
      .select("questions, locale")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const questions = session.questions as unknown as InterviewQuestion[];
    const question = questions.find((q) => q.id === question_id);
    if (!question) {
      return NextResponse.json({ error: "Invalid question_id" }, { status: 400 });
    }

    const hint = await generateStarHint(
      question.text,
      current_answer,
      session.locale
    );

    return NextResponse.json({ data: hint });
  } catch (err) {
    console.error("[/api/interview/sessions/[id]/hint] Error:", err);
    return NextResponse.json(
      { error: "Failed to generate hint" },
      { status: 500 }
    );
  }
}
