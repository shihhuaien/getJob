"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, TrendingUp } from "lucide-react";
import BookmarkQuestionButton from "./BookmarkQuestionButton";
import type {
  InterviewQuestion,
  InterviewAnswer,
  InterviewReport as Report,
} from "@/types/interview";

interface Props {
  sessionId: string;
  jobId: string | null;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  report: Report;
  savedQuestionTexts: Set<string>;
}

function scoreColor(score: number) {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  return "text-red-600";
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${scoreColor(score)}`}>
          {score}
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 80
              ? "bg-green-500"
              : score >= 60
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function InterviewReport({
  sessionId,
  jobId,
  questions,
  answers,
  report,
  savedQuestionTexts,
}: Props) {
  const t = useTranslations("interview");
  const tc = useTranslations("common");
  const answerMap = new Map(answers.map((a) => [a.question_id, a]));
  const feedbackMap = new Map(
    report.per_question.map((p) => [p.question_id, p])
  );

  return (
    <div className="space-y-6">
      {/* Scorecard */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {t("scorecardTitle")}
          </h2>
        </div>
        <div className="mt-4 flex flex-col items-center gap-1">
          <span className={`text-5xl font-bold ${scoreColor(report.scorecard.overall)}`}>
            {report.scorecard.overall}
          </span>
          <span className="text-sm text-gray-500">{t("overallScore")}</span>
        </div>
        <div className="mt-6 space-y-4">
          <ScoreBar label={t("scoreRelevance")} score={report.scorecard.relevance} />
          <ScoreBar label={t("scoreLogic")} score={report.scorecard.logic} />
          <ScoreBar label={t("scoreConfidence")} score={report.scorecard.confidence} />
        </div>
        <div className="mt-5 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
          {report.summary}
        </div>
      </div>

      {/* 逐題 Before/After */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          {t("perQuestionTitle")}
        </h2>
        <div className="space-y-4">
          {questions.map((q, i) => {
            const fb = feedbackMap.get(q.id);
            const ans = answerMap.get(q.id);
            return (
              <div
                key={q.id}
                className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                    Q{i + 1} · {q.category}
                  </span>
                  <BookmarkQuestionButton
                    questionText={q.text}
                    category={q.category}
                    sessionId={sessionId}
                    jobId={jobId}
                    initiallySaved={savedQuestionTexts.has(q.text)}
                  />
                </div>
                <p className="mt-2 font-medium text-gray-900">{q.text}</p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {t("rewriteBefore")}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                      {ans?.answer_text?.trim() || t("noAnswer")}
                    </p>
                  </div>

                  {ans?.drill_down && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                        {t("drillDownBannerTitle")}
                      </p>
                      <p className="mt-1 text-sm text-gray-800">
                        {ans.drill_down.question}
                      </p>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {t("yourAnswer")}
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                        {ans.drill_down.answer?.trim() || t("noAnswer")}
                      </p>
                    </div>
                  )}

                  {fb && (
                    <>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
                          {t("diagnosis")}
                        </p>
                        <p className="mt-1 text-sm text-gray-700">
                          {fb.diagnosis}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                          {t("rewriteAfter")}
                        </p>
                        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-green-50 p-3 text-sm text-gray-800">
                          {fb.rewritten_answer}
                        </p>
                      </div>
                      {fb.follow_up_predictions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("followUpPredictions")}
                          </p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
                            {fb.follow_up_predictions.map((fp, idx) => (
                              <li key={idx}>{fp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-400">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {tc("aiDisclaimer")}
      </div>
    </div>
  );
}
