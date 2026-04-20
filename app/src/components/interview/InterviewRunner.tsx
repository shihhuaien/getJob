"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Loader2, ChevronRight, Flag, AlertTriangle, SkipForward } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import StarHintPanel from "./StarHintPanel";
import type { InterviewQuestion, InterviewAnswer } from "@/types/interview";

interface Props {
  sessionId: string;
  questions: InterviewQuestion[];
  initialAnswers: InterviewAnswer[];
}

export default function InterviewRunner({
  sessionId,
  questions,
  initialAnswers,
}: Props) {
  const router = useRouter();
  const t = useTranslations("interview");
  const tc = useTranslations("common");

  const answerMap = new Map(initialAnswers.map((a) => [a.question_id, a]));
  const firstUnansweredIdx = questions.findIndex((q) => !answerMap.has(q.id));
  const startIdx =
    firstUnansweredIdx === -1 ? questions.length - 1 : firstUnansweredIdx;

  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const [answer, setAnswer] = useState(
    answerMap.get(questions[startIdx]?.id)?.answer_text ?? ""
  );
  const [drillDownQuestion, setDrillDownQuestion] = useState<string | null>(null);
  const [drillDownAnswer, setDrillDownAnswer] = useState("");
  const [pendingAdvance, setPendingAdvance] = useState<"next" | "complete" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[currentIdx];
  const isLast = currentIdx === questions.length - 1;

  const saveInitialAnswer = async (): Promise<{ drill_down_question: string | null }> => {
    const res = await fetch(`/api/interview/sessions/${sessionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: current.id,
        answer_text: answer,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || t("saveAnswerFailed"));
    }
    return {
      drill_down_question: json.data?.drill_down_question ?? null,
    };
  };

  const saveDrillDown = async () => {
    if (!drillDownQuestion) return;
    const res = await fetch(`/api/interview/sessions/${sessionId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: current.id,
        drill_down_question: drillDownQuestion,
        drill_down_answer: drillDownAnswer,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || t("saveAnswerFailed"));
    }
  };

  const moveToNext = () => {
    const nextIdx = currentIdx + 1;
    setCurrentIdx(nextIdx);
    const existing = answerMap.get(questions[nextIdx]?.id);
    setAnswer(existing?.answer_text ?? "");
    setDrillDownQuestion(null);
    setDrillDownAnswer("");
  };

  const completeSession = async () => {
    setIsCompleting(true);
    try {
      const res = await fetch(
        `/api/interview/sessions/${sessionId}/complete`,
        { method: "POST" }
      );
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t("completeFailed"));
      }
      router.push(`/interview/${sessionId}/report`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("completeFailed"));
      setIsCompleting(false);
    }
  };

  const handleSubmitAnswer = async (advanceMode: "next" | "complete") => {
    setError(null);
    setIsSubmitting(true);
    try {
      const { drill_down_question } = await saveInitialAnswer();
      answerMap.set(current.id, {
        question_id: current.id,
        answer_text: answer,
        submitted_at: new Date().toISOString(),
      });

      if (drill_down_question) {
        setDrillDownQuestion(drill_down_question);
        setDrillDownAnswer("");
        setPendingAdvance(advanceMode);
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      if (advanceMode === "complete") {
        await completeSession();
      } else {
        moveToNext();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveAnswerFailed"));
      setIsSubmitting(false);
    }
  };

  const handleSubmitDrillDown = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await saveDrillDown();
      setDrillDownQuestion(null);
      setDrillDownAnswer("");
      const mode = pendingAdvance;
      setPendingAdvance(null);
      setIsSubmitting(false);
      if (mode === "complete") {
        await completeSession();
      } else {
        moveToNext();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveAnswerFailed"));
      setIsSubmitting(false);
    }
  };

  const handleSkipDrillDown = async () => {
    const mode = pendingAdvance;
    setDrillDownQuestion(null);
    setDrillDownAnswer("");
    setPendingAdvance(null);
    if (mode === "complete") {
      await completeSession();
    } else {
      moveToNext();
    }
  };

  if (!current) {
    return <p className="text-sm text-gray-500">{tc("loadFailed")}</p>;
  }

  const progress = ((currentIdx + 1) / questions.length) * 100;
  const inDrillDown = drillDownQuestion !== null;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
          <span>
            {t("progressLabel", {
              current: currentIdx + 1,
              total: questions.length,
            })}
          </span>
          <CountdownTimer
            key={current.id}
            durationSec={current.expected_duration_sec}
          />
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
          {current.category}
        </span>
        <p className="mt-3 text-base font-medium text-gray-900">
          {current.text}
        </p>
      </div>

      {!inDrillDown ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("yourAnswer")}
            </label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
              placeholder={t("answerPlaceholder")}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            <div className="mt-2 flex items-start justify-between gap-3">
              <div className="flex-1">
                <StarHintPanel
                  sessionId={sessionId}
                  questionId={current.id}
                  currentAnswer={answer}
                />
              </div>
              <p className="shrink-0 text-xs text-gray-400">
                {t("charCount", { count: answer.length })}
              </p>
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (currentIdx > 0) {
                  const prev = questions[currentIdx - 1];
                  setCurrentIdx(currentIdx - 1);
                  setAnswer(answerMap.get(prev.id)?.answer_text ?? "");
                }
              }}
              disabled={currentIdx === 0 || isSubmitting || isCompleting}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {tc("back")}
            </button>

            {!isLast ? (
              <button
                onClick={() => handleSubmitAnswer("next")}
                disabled={isSubmitting || isCompleting}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {tc("saving")}
                  </>
                ) : (
                  <>
                    {t("nextQuestion")}
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => handleSubmitAnswer("complete")}
                disabled={isSubmitting || isCompleting}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting || isCompleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isCompleting ? t("generatingReport") : tc("saving")}
                  </>
                ) : (
                  <>
                    <Flag className="h-4 w-4" />
                    {t("completeInterview")}
                  </>
                )}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4 rounded-xl border-2 border-amber-300 bg-amber-50/40 p-5">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm font-semibold">
              {t("drillDownBannerTitle")}
            </span>
          </div>
          <p className="text-sm text-gray-800">{drillDownQuestion}</p>
          <textarea
            value={drillDownAnswer}
            onChange={(e) => setDrillDownAnswer(e.target.value)}
            rows={6}
            placeholder={t("drillDownPlaceholder")}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={handleSkipDrillDown}
              disabled={isSubmitting || isCompleting}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <SkipForward className="h-4 w-4" />
              {t("drillDownSkip")}
            </button>
            <button
              onClick={handleSubmitDrillDown}
              disabled={isSubmitting || isCompleting}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting || isCompleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isCompleting ? t("generatingReport") : tc("saving")}
                </>
              ) : (
                <>
                  {pendingAdvance === "complete"
                    ? t("drillDownSubmitAndComplete")
                    : t("drillDownSubmitAndNext")}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
