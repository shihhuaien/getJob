import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { verifyRequest } from "@/lib/auth/verify-api-token";
import { parseJobRequestSchema } from "@/lib/validations";
import { parseJobDescription } from "@/lib/parse-job";

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);

    if (auth.tier !== "pro") {
      return NextResponse.json(
        { error: "Pro plan required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = parseJobRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    // 讀取 AI 產出語言偏好（使用 admin client 以支援 Bearer token 認證路徑）
    const { data: profile } = await getSupabaseAdmin()
      .from("profiles")
      .select("ai_output_language")
      .eq("id", auth.userId)
      .single();
    const locale = (typeof body.locale === "string" ? body.locale : undefined) ?? profile?.ai_output_language ?? "zh-TW";

    const parsed = await parseJobDescription(validation.data.text, locale);
    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("[/api/jobs/parse] Error:", err);
    const message = err instanceof Error ? err.message : "Parse failed";
    if (message === "Unauthorized" || message === "Invalid API key") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: "Parse failed" }, { status: 500 });
  }
}
