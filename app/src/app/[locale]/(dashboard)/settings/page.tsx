import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getStripe } from "@/lib/stripe";
import UpgradeButton from "@/components/dashboard/UpgradeButton";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import ResumeSubscriptionButton from "@/components/dashboard/ResumeSubscriptionButton";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import ProfileForm from "@/components/dashboard/ProfileForm";
import ApiTokenManager from "@/components/dashboard/ApiTokenManager";
export default async function SettingsPage() {
  const t = await getTranslations("settings");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // 查詢 Stripe 訂閱狀態（是否已排定取消）
  let cancelAtPeriodEnd = false;
  let periodEndDate: string | null = null;

  if (profile?.stripe_customer_id && profile.subscription_tier === "pro") {
    try {
      const subscriptions = await getStripe().subscriptions.list({
        customer: profile.stripe_customer_id,
        status: "active",
        limit: 1,
      });
      if (subscriptions.data.length > 0) {
        const sub = subscriptions.data[0];
        cancelAtPeriodEnd = sub.cancel_at_period_end;
        if (sub.cancel_at_period_end && sub.cancel_at) {
          periodEndDate = new Date(
            sub.cancel_at * 1000
          ).toLocaleDateString("zh-TW");
        }
      }
    } catch {
      // Stripe 查詢失敗不影響頁面顯示
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-light">{t("subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* Profile section */}
        <div className="rounded-2xl bg-white p-6 shadow-neu">
          <h2 className="text-lg font-semibold text-text">{t("profile")}</h2>
          <div className="mt-4">
            <ProfileForm
              email={user.email || ""}
              fullName={profile?.full_name ?? null}
            />
          </div>
        </div>

        {/* Subscription section */}
        <div className="rounded-2xl bg-white p-6 shadow-neu">
          <h2 className="text-lg font-semibold text-text">{t("subscription")}</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">
                  {profile?.subscription_tier === "pro"
                    ? t("proPlan")
                    : t("freePlan")}
                </p>
                <p className="mt-0.5 text-xs text-text-light">
                  {cancelAtPeriodEnd && periodEndDate
                    ? t("cancelScheduled", { date: periodEndDate })
                    : profile?.subscription_tier === "pro"
                      ? t("proActive")
                      : t("freeUpgrade")}
                </p>
              </div>
              {profile?.subscription_tier === "pro" ? (
                cancelAtPeriodEnd ? (
                  <ResumeSubscriptionButton />
                ) : (
                  <CancelSubscriptionButton />
                )
              ) : (
                <UpgradeButton />
              )}
            </div>
          </div>
        </div>

        {/* API Token */}
        <ApiTokenManager />

        {/* Danger zone */}
        <div className="rounded-2xl bg-white p-6 shadow-neu ring-1 ring-red-200">
          <h2 className="text-lg font-semibold text-red-600">{t("dangerZone")}</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text">
                  {t("deleteAccount")}
                </p>
                <p className="mt-0.5 text-xs text-text-light">
                  {t("deleteAccountDesc")}
                </p>
              </div>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
