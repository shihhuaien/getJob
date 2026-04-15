import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import UpgradeButton from "@/components/dashboard/UpgradeButton";
import CancelSubscriptionButton from "@/components/dashboard/CancelSubscriptionButton";
import ResumeSubscriptionButton from "@/components/dashboard/ResumeSubscriptionButton";
import DeleteAccountButton from "@/components/dashboard/DeleteAccountButton";
import ProfileForm from "@/components/dashboard/ProfileForm";
import ApiTokenManager from "@/components/dashboard/ApiTokenManager";
export default async function SettingsPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">設定</h1>
        <p className="mt-1 text-sm text-gray-500">管理你的帳號和訂閱</p>
      </div>

      <div className="space-y-6">
        {/* Profile section */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">個人資料</h2>
          <div className="mt-4">
            <ProfileForm
              email={user.email || ""}
              fullName={profile?.full_name ?? null}
            />
          </div>
        </div>

        {/* Subscription section */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">訂閱方案</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {profile?.subscription_tier === "pro"
                    ? "Pro 方案"
                    : "免費方案"}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {cancelAtPeriodEnd && periodEndDate
                    ? `你的 Pro 方案已排定取消，將於 ${periodEndDate} 到期後降為免費方案`
                    : profile?.subscription_tier === "pro"
                      ? "你正在使用 Pro 方案的所有功能"
                      : "升級 Pro 解鎖 AI 完整功能"}
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
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-red-200">
          <h2 className="text-lg font-semibold text-red-600">危險區域</h2>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  刪除帳號
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  永久刪除你的帳號和所有資料，此操作無法復原
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
