import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mic, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import type { InterviewReport } from "@/types/interview";

export default async function InterviewPage() {
  const t = await getTranslations("interview");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [sessionsResult, profileResult] = await Promise.all([
    supabase
      .from("interview_sessions")
      .select(
        "id, persona, interview_type, mode, status, report, created_at, completed_at, job_applications(company_name, job_title)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single(),
  ]);

  const sessions = sessionsResult.data ?? [];
  const isPro = profileResult.data?.subscription_tier === "pro";

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">{t("subtitle")}</p>
        </div>
        <Link
          href="/interview/bank"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          {t("bankLink")}
        </Link>
      </div>

      {!isPro && (
        <div className="mb-6 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold">{t("proRequired")}</span>
          </div>
          <p className="mt-1 text-brand-700">{t("proRequiredDesc")}</p>
          <Link
            href="/settings"
            className="mt-3 inline-flex items-center gap-1 text-brand-700 hover:underline"
          >
            {t("upgradeCta")}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
          <Mic className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t("emptyTitle")}
          </h3>
          <p className="mt-1 max-w-md text-center text-sm text-gray-500">
            {t("emptyDesc")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sessions.map((s) => {
            const report = s.report as unknown as InterviewReport | null;
            const overall = report?.scorecard?.overall;
            const job = Array.isArray(s.job_applications)
              ? s.job_applications[0]
              : s.job_applications;
            return (
              <Link
                key={s.id}
                href={
                  s.status === "completed"
                    ? `/interview/${s.id}/report`
                    : `/interview/${s.id}`
                }
                className="block rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                      {job?.company_name ?? t("unknownCompany")}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {job?.job_title ?? t("unknownJob")}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                        {t(`persona_${s.persona}`)}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                        {t(`type_${s.interview_type}`)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          s.status === "completed"
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {t(`status_${s.status}`)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(s.created_at).toLocaleString()}
                    </p>
                  </div>
                  {typeof overall === "number" && (
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-2xl font-bold ${
                          overall >= 80
                            ? "text-green-600"
                            : overall >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {overall}
                      </span>
                      <span className="text-[10px] text-gray-400">/ 100</span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
