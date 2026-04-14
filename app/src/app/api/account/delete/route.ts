import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();

    // 取得 profile 資訊（需要 stripe_customer_id）
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, subscription_tier")
      .eq("id", user.id)
      .single();

    // 若有 Stripe 訂閱，先取消
    if (profile?.stripe_customer_id) {
      const subscriptions = await getStripe().subscriptions.list({
        customer: profile.stripe_customer_id,
        status: "active",
      });

      for (const sub of subscriptions.data) {
        await getStripe().subscriptions.cancel(sub.id);
      }
    }

    // 刪除使用者所有資料（RLS 會限制只刪除自己的資料，但用 admin 確保完整清除）
    await supabaseAdmin.from("cover_letters").delete().eq("user_id", user.id);
    await supabaseAdmin.from("job_applications").delete().eq("user_id", user.id);
    await supabaseAdmin.from("resumes").delete().eq("user_id", user.id);
    await supabaseAdmin.from("contacts").delete().eq("user_id", user.id);
    await supabaseAdmin.from("profiles").delete().eq("id", user.id);

    // 刪除 Supabase Auth 使用者
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      user.id
    );

    if (authError) {
      return NextResponse.json(
        { error: "帳號刪除失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "帳號刪除失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
