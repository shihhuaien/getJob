import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, ArrowLeft } from "lucide-react";
import QuestionBankList from "@/components/interview/QuestionBankList";
import EmptyState from "@/components/ui/EmptyState";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default async function InterviewBankPage() {
  const t = await getTranslations("interview");
  const tb = await getTranslations("breadcrumb");
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
      <Breadcrumb
        className="mb-3"
        items={[
          { href: "/interview", label: tb("interview") },
          { label: tb("interviewBank") },
        ]}
      />

      <div className="mb-6">
        <Link
          href="/interview"
          className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-text">
          {t("bankTitle")}
        </h1>
        <p className="mt-1 text-sm text-text-light">{t("bankSubtitle")}</p>
      </div>

      {items && items.length > 0 ? (
        <QuestionBankList items={items} />
      ) : (
        <EmptyState
          icon={BookOpen}
          title={t("bankEmpty")}
          description={t("bankEmptyDesc")}
        />
      )}
    </div>
  );
}
