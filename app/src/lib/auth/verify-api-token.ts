import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

interface AuthResult {
  userId: string;
  tier: "free" | "pro";
}

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * 雙重認證：先嘗試 Supabase cookie auth，再嘗試 Bearer token
 */
export async function verifyRequest(request: Request): Promise<AuthResult> {
  // 1. 嘗試 cookie auth（Web UI）
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single();

      return {
        userId: user.id,
        tier: (profile?.subscription_tier as "free" | "pro") ?? "free",
      };
    }
  } catch {
    // cookie auth 失敗，繼續嘗試 token auth
  }

  // 2. 嘗試 Bearer token auth（Chrome 擴充）
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.slice(7);
  const tokenHash = await hashToken(token);

  const admin = getSupabaseAdmin();

  const { data: tokenRow } = await admin
    .from("api_tokens")
    .select("user_id")
    .eq("token_hash", tokenHash)
    .single();

  if (!tokenRow) {
    throw new Error("Invalid API key");
  }

  // 更新 last_used_at
  admin
    .from("api_tokens")
    .update({ last_used_at: new Date().toISOString() })
    .eq("token_hash", tokenHash)
    .then();

  const { data: profile } = await admin
    .from("profiles")
    .select("subscription_tier")
    .eq("id", tokenRow.user_id)
    .single();

  return {
    userId: tokenRow.user_id,
    tier: (profile?.subscription_tier as "free" | "pro") ?? "free",
  };
}

export { hashToken };
