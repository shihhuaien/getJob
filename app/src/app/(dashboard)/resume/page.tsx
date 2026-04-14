import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { FileText, Plus } from "lucide-react";
export default async function ResumePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">履歷管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            建立和管理多份履歷，針對不同職缺客製化
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
          <Plus className="h-4 w-4" />
          新增履歷
        </button>
      </div>

      {resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {resume.title}
                  </h3>
                  {resume.target_job_title && (
                    <p className="mt-0.5 text-xs text-gray-500">
                      目標職位：{resume.target_job_title}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    更新於{" "}
                    {new Date(resume.updated_at).toLocaleDateString("zh-TW")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
          <FileText className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            還沒有履歷
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            建立你的第一份履歷，開始求職之旅
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors">
            <Plus className="h-4 w-4" />
            建立履歷
          </button>
        </div>
      )}
    </div>
  );
}
