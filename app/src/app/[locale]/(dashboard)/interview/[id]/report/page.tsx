import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import InterviewReport from "@/components/interview/InterviewReport";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type {
  InterviewAnswer,
  InterviewQuestion,
  InterviewReport as Report,
} from "@/types/interview";

export default async function InterviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("interview");
  const tb = await getTranslations("breadcrumb");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("interview_sessions")
    .select(
      "id, status, questions, answers, report, persona, interview_type, job_application_id, job_applications(company_name, job_title)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!session) notFound();

  const report = session.report as unknown as Report | null;
  if (!report || session.status !== "completed") {
    redirect(`/interview/${id}`);
  }

  const questions = session.questions as unknown as InterviewQuestion[];
  const answers = (session.answers as unknown as InterviewAnswer[]) || [];
  const job = Array.isArray(session.job_applications)
    ? session.job_applications[0]
    : session.job_applications;

  const { data: savedRows } = await supabase
    .from("interview_question_bank")
    .select("question_text")
    .eq("user_id", user.id)
    .eq("source_session_id", id);
  const savedQuestionTexts = new Set(
    (savedRows ?? []).map((r) => r.question_text)
  );

  const sessionLabel = `${job?.company_name ?? t("unknownCompany")} · ${job?.job_title ?? ""}`;

  return (
    <div>
      <Breadcrumb
        className="mb-3"
        items={[
          { href: "/interview", label: tb("interview") },
          { href: `/interview/${id}`, label: sessionLabel },
          { label: tb("interviewReport") },
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
        <h1 className="mt-3 text-2xl font-bold text-text vt-page-title">
          {t("reportTitle")}
        </h1>
        <p className="mt-1 text-sm text-text-light">
          {job?.company_name ?? t("unknownCompany")} · {job?.job_title ?? ""} ·{" "}
          {t(`persona_${session.persona}`)} ·{" "}
          {t(`type_${session.interview_type}`)}
        </p>
      </div>

      <InterviewReport
        sessionId={id}
        jobId={session.job_application_id}
        questions={questions}
        answers={answers}
        report={report}
        savedQuestionTexts={savedQuestionTexts}
      />
    </div>
  );
}
