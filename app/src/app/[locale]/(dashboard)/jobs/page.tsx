import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import JobsBoard from "@/components/dashboard/JobsBoard";
import type { JobTag } from "@/types/tags";

export default async function JobsPage() {
  const t = await getTranslations("jobs");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [jobsResult, profileResult, tagsResult] = await Promise.all([
    supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false }),
    supabase
      .from("profiles")
      .select("subscription_tier, ai_output_language")
      .eq("id", user.id)
      .single(),
    supabase
      .from("job_tags")
      .select("*")
      .eq("user_id", user.id)
      .order("name"),
  ]);

  const isPro = profileResult.data?.subscription_tier === "pro";
  const jobIds = jobsResult.data?.map((j) => j.id) ?? [];

  // 載入職缺標籤關聯
  const jobTagMap: Record<string, string[]> = {};
  if (jobIds.length > 0) {
    const { data: junctionData } = await supabase
      .from("job_application_tags")
      .select("job_id, tag_id")
      .in("job_id", jobIds);

    for (const row of junctionData ?? []) {
      (jobTagMap[row.job_id] ??= []).push(row.tag_id);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text vt-page-title">{t("title")}</h1>
          <p className="mt-1 text-sm text-text-light">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <JobsBoard
        initialJobs={jobsResult.data ?? []}
        userId={user.id}
        isPro={isPro}
        aiOutputLanguage={profileResult.data?.ai_output_language ?? null}
        initialTags={(tagsResult.data ?? []) as JobTag[]}
        initialJobTagMap={jobTagMap}
      />
    </div>
  );
}
