import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";
import QuestionBankList from "@/components/interview/QuestionBankList";

export default async function InterviewBankPage() {
  const t = await getTranslations("interview");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: items } = await supabase
    .from("interview_question_bank")
    .select(
      "id, question_text, category, user_notes, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/interview"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-gray-900">
          {t("bankTitle")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{t("bankSubtitle")}</p>
      </div>

      {items && items.length > 0 ? (
        <QuestionBankList items={items} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white py-16">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t("bankEmpty")}
          </h3>
          <p className="mt-1 max-w-md text-center text-sm text-gray-500">
            {t("bankEmptyDesc")}
          </p>
        </div>
      )}
    </div>
  );
}
