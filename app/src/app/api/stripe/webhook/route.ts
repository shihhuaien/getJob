import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import {
  SUBSCRIPTION_RESET,
  subscriptionToProfileUpdate,
} from "@/lib/stripe-sync";
import type Stripe from "stripe";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  const supabaseAdmin = getSupabaseAdmin();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (!session.customer || !session.subscription) break;

      // session.subscription 可能是 ID 或展開物件，統一以 retrieve 取最新狀態
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription.id;
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      const update = subscriptionToProfileUpdate(sub);

      const { error: dbError } = await supabaseAdmin
        .from("profiles")
        .update(update)
        .eq("stripe_customer_id", session.customer as string);
      if (dbError) {
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      if (!subscription.customer) break;

      const update = subscriptionToProfileUpdate(subscription);
      const { error: dbError } = await supabaseAdmin
        .from("profiles")
        .update(update)
        .eq("stripe_customer_id", subscription.customer as string);
      if (dbError) {
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      if (!subscription.customer) break;

      const { error: dbError } = await supabaseAdmin
        .from("profiles")
        .update(SUBSCRIPTION_RESET)
        .eq("stripe_customer_id", subscription.customer as string);
      if (dbError) {
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
