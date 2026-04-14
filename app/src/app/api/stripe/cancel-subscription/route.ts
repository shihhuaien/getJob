import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, subscription_tier")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "找不到訂閱資訊" },
        { status: 400 }
      );
    }

    if (profile.subscription_tier !== "pro") {
      return NextResponse.json(
        { error: "目前沒有有效訂閱" },
        { status: 400 }
      );
    }

    // 取得該客戶的有效訂閱
    const subscriptions = await getStripe().subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: "找不到有效訂閱" },
        { status: 400 }
      );
    }

    // 在帳期結束時取消（不立即取消，讓使用者用完已付費期間）
    await getStripe().subscriptions.update(subscriptions.data[0].id, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "取消訂閱失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
