import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const yearlyPriceId = process.env.STRIPE_PRO_YEARLY_PRICE_ID;
  if (!yearlyPriceId) {
    return NextResponse.json(
      { error: "Yearly price not configured" },
      { status: 500 }
    );
  }

  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id, subscription_tier, plan_period")
      .eq("id", user.id)
      .single();

    if (!profile?.stripe_customer_id || profile.subscription_tier !== "pro") {
      return NextResponse.json(
        { error: "No active subscription" },
        { status: 400 }
      );
    }

    if (profile.plan_period === "yearly") {
      return NextResponse.json(
        { error: "Already on yearly plan" },
        { status: 400 }
      );
    }

    const subscriptions = await getStripe().subscriptions.list({
      customer: profile.stripe_customer_id,
      status: "active",
      limit: 1,
    });

    const sub = subscriptions.data[0];
    if (!sub) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const item = sub.items.data[0];
    if (!item) {
      return NextResponse.json(
        { error: "Subscription item missing" },
        { status: 500 }
      );
    }

    // Stripe 預設會立即扣款本期剩餘差額，DB 由 customer.subscription.updated webhook 同步
    await getStripe().subscriptions.update(sub.id, {
      items: [{ id: item.id, price: yearlyPriceId }],
      proration_behavior: "create_prorations",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to switch to annual plan" },
      { status: 500 }
    );
  }
}
