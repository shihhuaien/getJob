import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { BarChart3 } from "lucide-react";

type ApplicationStatus = "saved" | "applied" | "interview" | "offer" | "rejected";

function getWeekLabel(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}/${day}`;
}

function getWeekStart(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().split("T")[0];
}

export default async function AnalyticsPage() {
  const t = await getTranslations("analytics");
  const tJobs = await getTranslations("jobs");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: jobs } = await supabase
    .from("job_applications")
    .select("status, created_at, applied_at")
    .eq("user_id", user.id);

  const allJobs = jobs ?? [];
  const total = allJobs.length;

  const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
    saved: { label: tJobs("saved"), color: "bg-gray-500", bgColor: "bg-gray-100" },
    applied: { label: tJobs("applied"), color: "bg-blue-500", bgColor: "bg-blue-100" },
    interview: { label: tJobs("interview"), color: "bg-yellow-500", bgColor: "bg-yellow-100" },
    offer: { label: tJobs("offer"), color: "bg-green-500", bgColor: "bg-green-100" },
    rejected: { label: tJobs("rejected"), color: "bg-red-500", bgColor: "bg-red-100" },
  };

  // ── 狀態分佈 ──
  const statusCounts: Record<ApplicationStatus, number> = {
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };
  for (const job of allJobs) {
    statusCounts[job.status as ApplicationStatus]++;
  }

  // ── 轉換率 ──
  const appliedOrBeyond =
    statusCounts.applied + statusCounts.interview + statusCounts.offer + statusCounts.rejected;
  const interviewOrBeyond = statusCounts.interview + statusCounts.offer;

  const applyRate = total > 0 ? Math.round((appliedOrBeyond / total) * 100) : 0;
  const interviewRate = appliedOrBeyond > 0 ? Math.round((interviewOrBeyond / appliedOrBeyond) * 100) : 0;
  const offerRate = interviewOrBeyond > 0 ? Math.round((statusCounts.offer / interviewOrBeyond) * 100) : 0;

  const funnel = [
    { label: t("totalCount"), value: total, rate: null as number | null, color: "bg-gray-500" },
    { label: t("appliedCount"), value: appliedOrBeyond, rate: applyRate, color: "bg-blue-500" },
    { label: t("interviewCount"), value: interviewOrBeyond, rate: interviewRate, color: "bg-yellow-500" },
    { label: t("offerCount"), value: statusCounts.offer, rate: offerRate, color: "bg-green-500" },
  ];

  // ── 每週活動時間軸（最近 12 週）──
  const now = new Date();
  const weeks: { label: string; weekStart: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const weekStart = getWeekStart(d);
    const weekStartDate = new Date(weekStart);
    weeks.push({ label: getWeekLabel(weekStartDate), weekStart });
  }

  const weekCounts: Record<string, number> = {};
  for (const week of weeks) {
    weekCounts[week.weekStart] = 0;
  }
  for (const job of allJobs) {
    const weekStart = getWeekStart(new Date(job.created_at));
    if (weekStart in weekCounts) {
      weekCounts[weekStart]++;
    }
  }

  const weekData = weeks.map((w) => ({
    label: w.label,
    count: weekCounts[w.weekStart],
  }));
  const maxWeekCount = Math.max(...weekData.map((w) => w.count), 1);

  const isEmpty = total === 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {t("subtitle")}
        </p>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-12 shadow-neu">
          <BarChart3 className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-sm text-gray-400">
            {t("noData")}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 第一排：狀態分佈 + 轉換漏斗 */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* 狀態分佈 */}
            <div className="rounded-2xl bg-white p-6 shadow-neu">
              <h2 className="text-lg font-semibold text-gray-900">{t("statusDistribution")}</h2>
              <p className="mt-1 text-xs text-gray-500">
                {t("totalJobs", { total })}
              </p>
              <div className="mt-5 space-y-3">
                {(Object.keys(statusConfig) as ApplicationStatus[]).map((status) => {
                  const count = statusCounts[status];
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const config = statusConfig[status];
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{config.label}</span>
                        <span className="font-medium text-gray-900">
                          {count}
                          <span className="ml-1 text-xs text-gray-400">
                            ({pct}%)
                          </span>
                        </span>
                      </div>
                      <div className={`mt-1.5 h-2.5 w-full rounded-full ${config.bgColor}`}>
                        <div
                          className={`h-2.5 rounded-full ${config.color} transition-all`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 轉換漏斗 */}
            <div className="rounded-2xl bg-white p-6 shadow-neu">
              <h2 className="text-lg font-semibold text-gray-900">{t("conversionRate")}</h2>
              <p className="mt-1 text-xs text-gray-500">
                {t("conversionDesc")}
              </p>
              <div className="mt-5 space-y-4">
                {funnel.map((step, i) => {
                  const widthPct = total > 0 ? Math.max((step.value / total) * 100, 4) : 0;
                  return (
                    <div key={step.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{step.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {step.value}
                          </span>
                          {step.rate !== null && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                              {step.rate}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-1.5 flex justify-center">
                        <div
                          className={`h-3 rounded-full ${step.color} transition-all`}
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                      {i < funnel.length - 1 && (
                        <div className="mt-1 text-center text-[10px] text-gray-400">▼</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 第二排：每週活動時間軸 */}
          <div className="rounded-2xl bg-white p-6 shadow-neu">
            <h2 className="text-lg font-semibold text-gray-900">{t("weeklyActivity")}</h2>
            <p className="mt-1 text-xs text-gray-500">
              {t("weeklyActivityDesc")}
            </p>
            <div className="mt-5 flex items-end gap-2" style={{ height: 160 }}>
              {weekData.map((week) => (
                <div
                  key={week.label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <span className="text-xs font-medium text-gray-700">
                    {week.count > 0 ? week.count : ""}
                  </span>
                  <div
                    className={`w-full rounded-t ${week.count > 0 ? "bg-brand-500" : "bg-gray-100"} transition-all`}
                    style={{
                      height: week.count > 0
                        ? `${Math.max((week.count / maxWeekCount) * 120, 8)}px`
                        : "4px",
                    }}
                  />
                  <span className="text-[10px] text-gray-400">{week.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
