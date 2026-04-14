import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import CreateCoverLetterButton from "@/components/dashboard/CreateCoverLetterButton";

export default async function CoverLetterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: coverLetters } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">求職信</h1>
          <p className="mt-1 text-sm text-gray-500">
            使用 AI 產生針對每個職缺客製化的求職信
          </p>
        </div>
        <CreateCoverLetterButton userId={user.id} />
      </div>

      {coverLetters && coverLetters.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coverLetters.map((letter: { id: string; title: string; updated_at: string }) => (
            <div
              key={letter.id}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow"
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
            </div>
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
            <CreateCoverLetterButton userId={user.id} />
          </div>
        </div>
      )}
    </div>
  );
}
