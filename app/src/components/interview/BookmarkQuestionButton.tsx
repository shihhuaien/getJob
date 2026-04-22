"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";

interface Props {
  questionText: string;
  category: string;
  sessionId: string;
  jobId: string | null;
  initiallySaved?: boolean;
}

export default function BookmarkQuestionButton({
  questionText,
  category,
  sessionId,
  jobId,
  initiallySaved,
}: Props) {
  const t = useTranslations("interview");
  const [saved, setSaved] = useState(Boolean(initiallySaved));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (saved || isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview/bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: questionText,
          category,
          source_session_id: sessionId,
          source_job_id: jobId,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || t("bankSaveFailed"));
        setIsLoading(false);
        return;
      }
      setSaved(true);
    } catch {
      setError(t("bankSaveFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={saved || isLoading}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
          saved
            ? "border-brand-300 bg-brand-50 text-brand-700 cursor-default"
            : "border-brand-200 text-text hover:bg-[color:var(--color-bg)]"
        } disabled:opacity-70`}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("bankSaving")}
          </>
        ) : saved ? (
          <>
            <BookmarkCheck className="h-3.5 w-3.5" />
            {t("bankSaved")}
          </>
        ) : (
          <>
            <Bookmark className="h-3.5 w-3.5" />
            {t("bankAdd")}
          </>
        )}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
