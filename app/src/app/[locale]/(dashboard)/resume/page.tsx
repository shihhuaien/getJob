import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FileText } from "lucide-react";
import CreateResumeButton from "@/components/dashboard/CreateResumeButton";
export default async function ResumePage() {
  const t = await getTranslations("resume");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [resumesResult, profileResult] = await Promise.all([
    supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single(),
  ]);

  const resumes = resumesResult.data;
  const isPro = profileResult.data?.subscription_tier === "pro";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {t("subtitle")}
          </p>
        </div>
        <CreateResumeButton userId={user.id} isPro={isPro} />
      </div>

      {resumes && resumes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link
              href={`/resume/${resume.id}`}
              key={resume.id}
              className="block rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
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
                      {t("targetJob", { title: resume.target_job_title })}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-400">
                    {tCommon("updatedAt", {
                      date: new Date(resume.updated_at).toLocaleDateString("zh-TW"),
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
          <FileText className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t("noResumes")}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {t("noResumesDesc")}
          </p>
          <div className="mt-4">
            <CreateResumeButton userId={user.id} isPro={isPro} />
          </div>
        </div>
      )}
    </div>
  );
}
