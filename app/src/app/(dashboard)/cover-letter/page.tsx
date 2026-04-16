import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import CreateCoverLetterButton from "@/components/dashboard/CreateCoverLetterButton";

export default async function CoverLetterPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">求職信</h1>
          <p className="mt-1 text-sm text-gray-500">
            使用 AI 產生針對每個職缺客製化的求職信
          </p>
        </div>
        <CreateCoverLetterButton userId={user.id} isPro={isPro} resumes={resumes} jobs={jobs} />
      </div>

      {coverLetters && coverLetters.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters.map((letter: { id: string; title: string; updated_at: string }) => (
            <Link
              href={`/cover-letter/${letter.id}`}
              key={letter.id}
              className="block rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {letter.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    更新於{" "}
                    {new Date(letter.updated_at).toLocaleDateString("zh-TW")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
          <Mail className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            還沒有求職信
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            建立你的第一封求職信
          </p>
          <div className="mt-4">
            <CreateCoverLetterButton userId={user.id} isPro={isPro} resumes={resumes} jobs={jobs} />
          </div>
        </div>
      )}
    </div>
  );
}
