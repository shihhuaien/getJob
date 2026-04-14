import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import JobDetail from "@/components/dashboard/JobDetail";

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

  const { data: job } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!job) notFound();

  return <JobDetail job={job} />;
}
