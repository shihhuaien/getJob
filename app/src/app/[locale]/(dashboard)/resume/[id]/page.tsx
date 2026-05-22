import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ResumeEditor from "@/components/dashboard/ResumeEditor";

export default async function ResumeEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 平行查詢履歷、訂閱狀態、職缺列表
  const [resumeResult, profileResult, jobsResult] = await Promise.all([
    supabase
      .from("resumes")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("profiles")
      .select("subscription_tier, ai_output_language")
      .eq("id", user.id)
      .single(),
    supabase
      .from("job_applications")
      .select("id, company_name, job_title, job_description")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
  ]);

  if (!resumeResult.data) notFound();

  const isPro = profileResult.data?.subscription_tier === "pro";
  const jobs = (jobsResult.data ?? []).map((j) => ({
    id: j.id,
    company_name: j.company_name,
    job_title: j.job_title,
    has_description: Boolean(j.job_description),
  }));

  return (
    <ResumeEditor
      resume={resumeResult.data}
      isPro={isPro}
      jobs={jobs}
      aiOutputLanguage={profileResult.data?.ai_output_language ?? null}
    />
  );
}
