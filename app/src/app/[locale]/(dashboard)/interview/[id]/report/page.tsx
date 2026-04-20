import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import InterviewReport from "@/components/interview/InterviewReport";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: session } = await supabase
    .from("interview_sessions")
    .select(
      "id, status, questions, answers, report, persona, interview_type, job_applications(company_name, job_title)"
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
          {t("reportTitle")}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {job?.company_name ?? t("unknownCompany")} · {job?.job_title ?? ""} ·{" "}
          {t(`persona_${session.persona}`)} ·{" "}
          {t(`type_${session.interview_type}`)}
        </p>
      </div>

      <InterviewReport questions={questions} answers={answers} report={report} />
    </div>
  );
}
