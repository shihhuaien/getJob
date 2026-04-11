import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import JobsBoard from "@/components/dashboard/JobsBoard";

export default async function JobsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: jobs } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">職缺追蹤</h1>
          <p className="mt-1 text-sm text-gray-500">
            管理你所有的求職進度
          </p>
        </div>
      </div>

      <JobsBoard initialJobs={jobs ?? []} userId={user.id} />
    </div>
  );
}
