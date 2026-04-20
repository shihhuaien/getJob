import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mic, BookOpen, Sparkles, ArrowRight } from "lucide-react";
import InterviewSessionCard from "@/components/interview/InterviewSessionCard";
import RadarChart from "@/components/interview/RadarChart";
import type { InterviewReport, Scorecard } from "@/types/interview";

function averageScorecard(list: Scorecard[]): Scorecard {
  const sum = list.reduce(
    (acc, s) => ({
      relevance: acc.relevance + s.relevance,
      logic: acc.logic + s.logic,
      confidence: acc.confidence + s.confidence,
      overall: acc.overall + s.overall,
    }),
    { relevance: 0, logic: 0, confidence: 0, overall: 0 }
  );
  const n = list.length;
  return {
    relevance: Math.round(sum.relevance / n),
    logic: Math.round(sum.logic / n),
    confidence: Math.round(sum.confidence / n),
    overall: Math.round(sum.overall / n),
  };
}

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

  const completedScorecards = sessions
    .filter((s) => s.status === "completed" && s.report)
    .map((s) => (s.report as unknown as InterviewReport).scorecard)
    .filter((sc): sc is Scorecard => Boolean(sc));
  const latestScorecard = completedScorecards[0] ?? null;
  const averageScorecardValue =
    completedScorecards.length > 0
      ? averageScorecard(completedScorecards)
      : null;

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

      {completedScorecards.length > 0 && (
        <div className="mb-6">
          <RadarChart
            latest={latestScorecard}
            average={averageScorecardValue}
            sessionCount={completedScorecards.length}
          />
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
            const job = Array.isArray(s.job_applications)
              ? s.job_applications[0]
              : s.job_applications;
            return (
              <InterviewSessionCard
                key={s.id}
                id={s.id}
                persona={s.persona}
                interviewType={s.interview_type}
                status={s.status}
                report={report}
                createdAt={s.created_at}
                job={job ?? null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
