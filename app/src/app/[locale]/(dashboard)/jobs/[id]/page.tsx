import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import JobDetail from "@/components/dashboard/JobDetail";
import type { JobTag } from "@/types/tags";

export default async function JobDetailPage({
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

  const [jobResult, jobTagsResult, tagsResult] = await Promise.all([
    supabase
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("job_application_tags")
      .select("tag_id")
      .eq("job_id", id),
    supabase
      .from("job_tags")
      .select("*")
      .eq("user_id", user.id)
      .order("name"),
  ]);

  if (!jobResult.data) notFound();

  return (
    <JobDetail
      job={jobResult.data}
      initialTagIds={jobTagsResult.data?.map((r) => r.tag_id) ?? []}
      allTags={(tagsResult.data ?? []) as JobTag[]}
    />
  );
}
