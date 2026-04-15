import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    // 驗證 next 為站內相對路徑，防止 open redirect
    const safeNext =
      next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${safeNext}`);
      }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  } catch {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }
}
