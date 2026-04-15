import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  Mail,
  TrendingUp,
  Circle,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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

  // 最近活動：最近更新的職缺
  const { data: recentJobs } = await supabase
    .from("job_applications")
    .select("id, company_name, job_title, status, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(5);

  const statusLabels: Record<string, string> = {
    saved: "已儲存",
    applied: "已投遞",
    interview: "面試中",
    offer: "已錄取",
    rejected: "未錄取",
  };

  const statusDotColors: Record<string, string> = {
    saved: "text-gray-400",
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
    if (diffMin < 1) return "剛剛";
    if (diffMin < 60) return `${diffMin} 分鐘前`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} 小時前`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 30) return `${diffDay} 天前`;
    return date.toLocaleDateString("zh-TW");
  }

  const stats = [
    {
      label: "追蹤中職缺",
      value: jobCount ?? 0,
      icon: Briefcase,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "履歷數量",
      value: resumeCount ?? 0,
      icon: FileText,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "求職信",
      value: coverLetterCount ?? 0,
      icon: Mail,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "面試中",
      value: interviewCount ?? 0,
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          歡迎回來 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          這是你的求職總覽儀表板
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">快速操作</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link
              href="/jobs"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-gray-700">
                新增職缺
              </span>
            </Link>
            <Link
              href="/resume"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-gray-700">
                建立履歷
              </span>
            </Link>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">最近活動</h2>
          {recentJobs && recentJobs.length > 0 ? (
            <div className="mt-4 space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-gray-50 transition-colors"
                >
                  <Circle
                    className={`h-2.5 w-2.5 flex-shrink-0 fill-current ${statusDotColors[job.status]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {job.job_title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {job.company_name} · {statusLabels[job.status]}
                    </p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-400">
                    {timeAgo(job.updated_at)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center py-8 text-sm text-gray-400">
              開始追蹤職缺，你的活動紀錄將顯示在這裡
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
