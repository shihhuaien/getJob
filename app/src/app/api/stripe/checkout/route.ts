import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  plan: z.enum(["monthly", "yearly"]).default("monthly"),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 容忍空 body：UpgradeButton 預設不送 body 時退回 monthly
  let payload: unknown = {};
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }
  const parsed = checkoutSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const { plan } = parsed.data;
  const priceId =
    plan === "yearly"
      ? process.env.STRIPE_PRO_YEARLY_PRICE_ID
      : process.env.STRIPE_PRO_PRICE_ID;
  if (!priceId) {
    return NextResponse.json(
      { error: "Price not configured" },
      { status: 500 }
    );
  }

  try {
    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await getStripe().customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const session = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
