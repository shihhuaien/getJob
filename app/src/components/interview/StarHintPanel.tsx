"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Lightbulb, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import type { StarHint } from "@/lib/interview/generate-hint";

interface Props {
  sessionId: string;
  questionId: string;
  currentAnswer: string;
}

export default function StarHintPanel({
  sessionId,
  questionId,
  currentAnswer,
}: Props) {
  const t = useTranslations("interview");
  const [hint, setHint] = useState<StarHint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/interview/sessions/${sessionId}/hint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: questionId,
          current_answer: currentAnswer,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || t("hintFailed"));
        return;
      }
      setHint(json.data);
      setExpanded(true);
    } catch {
      setError(t("hintFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={hint ? () => setExpanded(!expanded) : handleFetch}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 hover:bg-amber-100 transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Lightbulb className="h-3.5 w-3.5" />
          )}
          {hint ? t("hintToggle") : t("hintButton")}
          {hint && (expanded ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          ))}
        </button>
        {hint && (
          <button
            type="button"
            onClick={handleFetch}
            disabled={isLoading}
            className="text-xs text-text-light hover:text-text transition-colors"
          >
            {t("hintRefresh")}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {hint && expanded && (
        <div className="mt-3 space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            {t("hintTitle")}
          </p>
          <div className="space-y-2 text-sm text-text">
            <HintLine label={t("starSituation")} text={hint.situation} />
            <HintLine label={t("starTask")} text={hint.task} />
            <HintLine label={t("starAction")} text={hint.action} />
            <HintLine label={t("starResult")} text={hint.result} />
          </div>
        </div>
      )}
    </div>
  );
}

function HintLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 rounded bg-amber-200 px-1.5 py-0.5 text-[10px] font-semibold text-amber-900">
        {label}
      </span>
      <span className="leading-relaxed">{text}</span>
    </div>
  );
}
