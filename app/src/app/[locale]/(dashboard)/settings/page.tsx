import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getStripe } from "@/lib/stripe";
import UpgradeButton from "@/components/dashboard/UpgradeButton";
import SwitchToAnnualButton from "@/components/dashboard/SwitchToAnnualButton";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import ResumeSubscriptionButton from "@/components/dashboard/ResumeSubscriptionButton";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import ProfileForm from "@/components/dashboard/ProfileForm";
import AiLanguageForm from "@/components/dashboard/AiLanguageForm";
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

  // 取消狀態仍需打 Stripe（cancel_at_period_end 未存於 DB）
  let cancelAtPeriodEnd = false;

  if (profile?.stripe_customer_id && profile.subscription_tier === "pro") {
    try {
      const subscriptions = await getStripe().subscriptions.list({
        customer: profile.stripe_customer_id,
        status: "active",
        limit: 1,
      });
      if (subscriptions.data.length > 0) {
        cancelAtPeriodEnd = subscriptions.data[0].cancel_at_period_end;
      }
    } catch {
      // Stripe 查詢失敗不影響頁面顯示
    }
  }

  const periodEndDate = profile?.current_period_end
    ? new Date(profile.current_period_end).toLocaleDateString("zh-TW")
    : null;
  const isYearly = profile?.plan_period === "yearly";
  const isMonthly = profile?.plan_period === "monthly";

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
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text">
                    {profile?.subscription_tier === "pro"
                      ? t("proPlan")
                      : t("freePlan")}
                  </p>
                  {isYearly && (
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-xs font-medium text-brand-700">
                      {t("yearlyBadge")}
                    </span>
                  )}
                  {isMonthly && (
                    <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-600">
                      {t("monthlyBadge")}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-text-light">
                  {cancelAtPeriodEnd && periodEndDate
                    ? t("cancelScheduled", { date: periodEndDate })
                    : profile?.subscription_tier === "pro"
                      ? periodEndDate
                        ? t("nextBillingDate", { date: periodEndDate })
                        : t("proActive")
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

            {/* 月繳用戶可切換到年繳（未排定取消時） */}
            {profile?.subscription_tier === "pro" &&
              isMonthly &&
              !cancelAtPeriodEnd && (
                <div className="mt-4 border-t border-brand-100 pt-4">
                  <SwitchToAnnualButton />
                </div>
              )}
          </div>
        </div>

        {/* AI 產出語言 */}
        <div className="rounded-2xl bg-white p-6 shadow-neu">
          <h2 className="text-lg font-semibold text-text">{t("aiLanguage")}</h2>
          <div className="mt-4">
            <AiLanguageForm initialValue={profile?.ai_output_language ?? null} />
          </div>
        </div>

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
