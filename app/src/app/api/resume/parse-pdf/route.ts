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
    const validation = parseResumePdfSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { pdf_base64, title } = validation.data;

    // AI 解析 PDF
    const content = await parseResumePdf(pdf_base64);

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
      return NextResponse.json(
        { error: "建立履歷失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { id: resume.id } });
  } catch (err) {
    console.error("[/api/resume/parse-pdf] Error:", err);
    const message =
      err instanceof Error ? err.message : "PDF 解析失敗，請稍後再試";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
