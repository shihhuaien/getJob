import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hashToken } from "@/lib/auth/verify-api-token";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    const { data: tokens } = await supabase
      .from("api_tokens")
      .select("id, name, created_at, last_used_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ data: tokens ?? [] });
  } catch {
    return NextResponse.json({ error: "載入失敗" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未授權" }, { status: 401 });
    }

    // 產生隨機 token
    const rawBytes = new Uint8Array(32);
    crypto.getRandomValues(rawBytes);
    const plainToken = Array.from(rawBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const tokenHash = await hashToken(plainToken);

    const { error: dbError } = await supabase.from("api_tokens").insert({
      user_id: user.id,
      token_hash: tokenHash,
      name: "Chrome 擴充功能",
    });

    if (dbError) {
      return NextResponse.json({ error: "建立失敗" }, { status: 500 });
    }

    // 只回傳一次明文 token
    return NextResponse.json({ token: plainToken });
  } catch {
    return NextResponse.json({ error: "建立失敗" }, { status: 500 });
  }
}
