import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Briefcase,
  FileText,
  Mail,
  TrendingUp,
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
            <a
              href="/jobs"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <Briefcase className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-gray-700">
                新增職缺
              </span>
            </a>
            <a
              href="/resume"
              className="flex items-center gap-3 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
            >
              <FileText className="h-5 w-5 text-brand-600" />
              <span className="text-sm font-medium text-gray-700">
                建立履歷
              </span>
            </a>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">最近活動</h2>
          <div className="mt-4 flex items-center justify-center py-8 text-sm text-gray-400">
            開始追蹤職缺，你的活動紀錄將顯示在這裡
          </div>
        </div>
      </div>
    </div>
  );
}
