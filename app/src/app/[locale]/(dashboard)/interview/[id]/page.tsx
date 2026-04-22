import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import InterviewRunner from "@/components/interview/InterviewRunner";
import type {
  InterviewAnswer,
  InterviewMode,
  InterviewQuestion,
} from "@/types/interview";

export default async function InterviewRunnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("interview");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("interview_sessions")
    .select(
      "id, status, questions, answers, persona, interview_type, mode, locale, job_applications(company_name, job_title)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!session) notFound();

  if (session.status === "completed") {
    redirect(`/interview/${id}/report`);
  }

  const questions = session.questions as unknown as InterviewQuestion[];
  const answers = (session.answers as unknown as InterviewAnswer[]) || [];
  const job = Array.isArray(session.job_applications)
    ? session.job_applications[0]
    : session.job_applications;

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/interview"
          className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-text">
          {job?.company_name ?? t("unknownCompany")} · {job?.job_title ?? ""}
        </h1>
        <p className="mt-1 text-sm text-text-light">
          {t(`persona_${session.persona}`)} ·{" "}
          {t(`type_${session.interview_type}`)} ·{" "}
          {t(`mode_${session.mode}`)}
        </p>
      </div>

      <InterviewRunner
        sessionId={id}
        questions={questions}
        initialAnswers={answers}
        mode={session.mode as InterviewMode}
        locale={session.locale}
      />
    </div>
  );
}
