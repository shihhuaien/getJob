import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { questionBankInsertSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = questionBankInsertSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const {
      question_text,
      category,
      source_session_id,
      source_job_id,
    } = validation.data;

    // 同一 session 的同一題不重複收藏
    if (source_session_id) {
      const { data: existing } = await supabase
        .from("interview_question_bank")
        .select("id")
        .eq("user_id", user.id)
        .eq("source_session_id", source_session_id)
        .eq("question_text", question_text)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ data: { id: existing.id, already: true } });
      }
    }

    const { data, error } = await supabase
      .from("interview_question_bank")
      .insert({
        user_id: user.id,
        question_text,
        category: category ?? null,
        source_session_id: source_session_id ?? null,
        source_job_id: source_job_id ?? null,
      })
      .select("id")
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }

    return NextResponse.json({ data: { id: data.id, already: false } });
  } catch (err) {
    console.error("[/api/interview/bank POST] Error:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
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
      .from("interview_question_bank")
      .select(
        "id, question_text, category, source_session_id, source_job_id, user_notes, created_at"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to load" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[/api/interview/bank GET] Error:", err);
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}
