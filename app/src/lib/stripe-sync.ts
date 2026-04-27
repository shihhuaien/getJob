import type Stripe from "stripe";

export type ProfileSubscriptionUpdate = {
  subscription_tier: "free" | "pro";
  plan_period: "monthly" | "yearly" | null;
  current_period_end: string | null;
  stripe_subscription_id: string | null;
};

// Stripe API 2025-XX 起，current_period_end 從 Subscription 移至 SubscriptionItem
export function subscriptionToProfileUpdate(
  sub: Stripe.Subscription
): ProfileSubscriptionUpdate {
  const isActive = sub.status === "active" || sub.status === "trialing";
  const item = sub.items.data[0];
  const interval = item?.price.recurring?.interval;
  const periodEnd = item?.current_period_end;

  return {
    subscription_tier: isActive ? "pro" : "free",
    plan_period: isActive ? (interval === "year" ? "yearly" : "monthly") : null,
    current_period_end:
      isActive && periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    stripe_subscription_id: isActive ? sub.id : null,
  };
}

export const SUBSCRIPTION_RESET: ProfileSubscriptionUpdate = {
  subscription_tier: "free",
  plan_period: null,
  current_period_end: null,
  stripe_subscription_id: null,
};
