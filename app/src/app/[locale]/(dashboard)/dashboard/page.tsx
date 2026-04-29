import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import {
  Briefcase,
  FileText,
  Mail,
  TrendingUp,
  Circle,
} from "lucide-react";
import OnboardingModal from "@/components/dashboard/OnboardingModal";
import NextStepCards from "@/components/dashboard/NextStepCards";
import MilestoneBadge from "@/components/dashboard/MilestoneBadge";
import BlogRecommendations from "@/components/dashboard/BlogRecommendations";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const tJobs = await getTranslations("jobs");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  const showOnboarding = !profile?.onboarding_completed_at;

  const { count: jobCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: resumeCount } = await supabase
    .from("resumes")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: coverLetterCount } = await supabase
    .from("cover_letters")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: interviewCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "interview");

  const { count: completedInterviewCount } = await supabase
    .from("interview_sessions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  // 用於部落格情境化推薦：status='applied' 的職缺數
  const { count: appliedCount } = await supabase
    .from("job_applications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "applied");

  const hasJob = (jobCount ?? 0) > 0;
  const hasResume = (resumeCount ?? 0) > 0;
  const hasCoverLetter = (coverLetterCount ?? 0) > 0;
  const hasCompletedInterview = (completedInterviewCount ?? 0) > 0;
  const hasInterview = (interviewCount ?? 0) > 0;

  // 最近活動：最近更新的職缺
  const { data: recentJobs } = await supabase
    .from("job_applications")
    .select("id, company_name, job_title, status, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  const statusLabels: Record<string, string> = {
    saved: tJobs("saved"),
    applied: tJobs("applied"),
    interview: tJobs("interview"),
    offer: tJobs("offer"),
    rejected: tJobs("rejected"),
  };

  const statusDotColors: Record<string, string> = {
    saved: "text-text-placeholder",
    applied: "text-blue-500",
    interview: "text-yellow-500",
    offer: "text-green-500",
    rejected: "text-red-500",
  };

  function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return t("justNow");
    if (diffMin < 60) return t("minutesAgo", { n: diffMin });
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return t("hoursAgo", { n: diffHr });
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return t("daysAgo", { n: diffDay });
    return date.toLocaleDateString("zh-TW");
  }

  const stats = [
    {
      label: t("trackingJobs"),
      value: jobCount ?? 0,
      icon: Briefcase,
      color: "text-brand-600 bg-brand-50",
    },
    {
      label: t("resumeCount"),
      value: resumeCount ?? 0,
      icon: FileText,
      color: "text-[color:var(--color-accent)] bg-[color:var(--color-accent)]/10",
    },
    {
      label: t("coverLetterCount"),
      value: coverLetterCount ?? 0,
      icon: Mail,
      color: "text-[color:var(--color-secondary)] bg-[color:var(--color-secondary)]/15",
    },
    {
      label: t("interviewing"),
      value: interviewCount ?? 0,
      icon: TrendingUp,
      color: "text-[color:var(--color-success)] bg-[color:var(--color-success)]/15",
    },
  ];

  return (
    <div>
      {showOnboarding && <OnboardingModal />}

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text">
          {t("welcome")}
        </h1>
        <p className="mt-1 text-sm text-text-light">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl bg-white p-6 shadow-neu"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg shadow-neu-inset ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-text-light">{stat.label}</p>
                <p className="text-2xl font-bold text-text">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-neu">
          <h2 className="text-lg font-semibold text-text">{t("quickActions")}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/jobs"
              className="flex items-center gap-3 rounded-lg border border-brand-100 p-4 hover:bg-[color:var(--color-bg)] transition-colors"
            >
              <Briefcase className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-text">
                {t("addJob")}
              </span>
            </Link>
            <Link
              href="/resume"
              className="flex items-center gap-3 rounded-lg border border-brand-100 p-4 hover:bg-[color:var(--color-bg)] transition-colors"
            >
              <FileText className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-text">
                {t("createResume")}
              </span>
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-neu">
          <h2 className="text-lg font-semibold text-text">{t("recentActivity")}</h2>
          {recentJobs && recentJobs.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-[color:var(--color-bg)] transition-colors"
                >
                  <Circle
                    className={`h-2.5 w-2.5 flex-shrink-0 fill-current ${statusDotColors[job.status]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">
                      {job.job_title}
                    </p>
                    <p className="text-xs text-text-light">
                      {job.company_name} · {statusLabels[job.status]}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-text-placeholder">
                    {timeAgo(job.updated_at)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center py-8 text-sm text-text-placeholder">
              {t("noActivity")}
            </div>
          )}
        </div>
      </div>

      <NextStepCards
        hasJob={hasJob}
        hasResume={hasResume}
        hasInterview={hasCompletedInterview}
      />

      <BlogRecommendations
        state={{
          hasResume,
          hasJob,
          hasInterview,
          appliedWithoutInterview: appliedCount ?? 0,
        }}
      />

      <MilestoneBadge
        hasJob={hasJob}
        hasResume={hasResume}
        hasCoverLetter={hasCoverLetter}
        hasInterview={hasCompletedInterview}
      />
    </div>
  );
}
