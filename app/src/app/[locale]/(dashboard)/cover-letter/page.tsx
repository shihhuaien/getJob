import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mail } from "lucide-react";
import CreateCoverLetterButton from "@/components/dashboard/CreateCoverLetterButton";
import EmptyState from "@/components/ui/EmptyState";

export default async function CoverLetterPage() {
  const t = await getTranslations("coverLetter");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [coverLettersResult, profileResult, resumesResult, jobsResult] =
    await Promise.all([
      supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("subscription_tier")
        .eq("id", user.id)
        .single(),
      supabase
        .from("resumes")
        .select("id, title")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("job_applications")
        .select("id, company_name, job_title, job_description")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
    ]);

  const coverLetters = coverLettersResult.data;
  const isPro = profileResult.data?.subscription_tier === "pro";
  const resumes = (resumesResult.data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
  }));
  const jobs = (jobsResult.data ?? []).map((j) => ({
    id: j.id,
    company_name: j.company_name,
    job_title: j.job_title,
    has_description: !!j.job_description,
  }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text vt-page-title">{t("title")}</h1>
          <p className="mt-1 text-sm text-text-light">
            {t("subtitle")}
          </p>
        </div>
        <CreateCoverLetterButton userId={user.id} isPro={isPro} resumes={resumes} jobs={jobs} />
      </div>

      {coverLetters && coverLetters.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters.map((letter: { id: string; title: string; updated_at: string }, index: number) => (
            <Link
              href={`/cover-letter/${letter.id}`}
              key={letter.id}
              style={{ "--i": index } as React.CSSProperties}
              className="stagger-item block rounded-2xl bg-white p-6 shadow-neu hover:shadow-neu-hover transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-text">
                    {letter.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-placeholder">
                    {tCommon("updatedAt", {
                      date: new Date(letter.updated_at).toLocaleDateString("zh-TW"),
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Mail}
          title={t("noCoverLetters")}
          description={t("noCoverLettersDesc")}
          action={
            <CreateCoverLetterButton
              userId={user.id}
              isPro={isPro}
              resumes={resumes}
              jobs={jobs}
            />
          }
        />
      )}
    </div>
  );
}
