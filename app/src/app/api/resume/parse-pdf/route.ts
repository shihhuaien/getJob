import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseResumePdfSchema } from "@/lib/validations";
import { parseResumePdf } from "@/lib/parse-resume-pdf";
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
    const validation = parseResumePdfSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pdf_base64, title } = validation.data;
    const locale = profile?.ai_output_language ?? body.locale;

    const content = await parseResumePdf(pdf_base64, locale);

    // 建立履歷
    const { data: resume, error: dbError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        title,
        content: content as unknown as Database["public"]["Tables"]["resumes"]["Insert"]["content"],
      })
      .select("id")
      .single();

    if (dbError) {
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

    return NextResponse.json({ data: { id: resume.id } });
  } catch (err) {
    console.error("[/api/resume/parse-pdf] Error:", err);
    const message =
      err instanceof Error ? err.message : "PDF parsing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
