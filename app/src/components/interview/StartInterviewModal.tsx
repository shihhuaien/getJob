"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, X, Loader2, Mic, Keyboard } from "lucide-react";
import type {
  InterviewType,
  Persona,
  InterviewMode,
} from "@/types/interview";

interface ResumeOption {
  id: string;
  title: string;
}

interface Props {
  jobId: string;
  jobTitle: string;
  companyName: string;
  hasDescription: boolean;
  resumes: ResumeOption[];
  onClose: () => void;
}

const PERSONAS: Persona[] = ["hr_friendly", "tech_strict", "ceo_business"];
const TYPES: InterviewType[] = [
  "behavioral",
  "technical",
  "case_study",
  "mixed",
];

export default function StartInterviewModal({
  jobId,
  jobTitle,
  companyName,
  hasDescription,
  resumes,
  onClose,
}: Props) {
  const router = useRouter();
  const t = useTranslations("interview");
  const tc = useTranslations("common");
  const locale = useLocale();

  const [resumeId, setResumeId] = useState(resumes[0]?.id ?? "");
  const [persona, setPersona] = useState<Persona>("hr_friendly");
  const [interviewType, setInterviewType] = useState<InterviewType>("mixed");
  const [mode, setMode] = useState<InterviewMode>("text");
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [drillDown, setDrillDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: unknown;
      webkitSpeechRecognition?: unknown;
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoiceSupported(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);

  const canStart = hasDescription && resumeId && !isLoading;

  const handleStart = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch("/api/interview/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: jobId,
          resume_id: resumeId,
          persona,
          interview_type: interviewType,
          mode,
          drill_down_enabled: drillDown,
          locale,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || t("startFailed"));
        setIsLoading(false);
        return;
      }
      router.push(`/interview/${json.data.id}`);
    } catch {
      setError(t("startFailed"));
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-text">
              {t("startTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-placeholder hover:bg-brand-50 hover:text-text-light"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <p className="text-sm text-text-light">
            {t("startSubtitle", { company: companyName, title: jobTitle })}
          </p>

          {!hasDescription && (
            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              {t("requireJobDescription")}
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text">
              {t("selectResume")}
            </label>
            {resumes.length === 0 ? (
              <p className="mt-2 text-sm text-red-600">{t("noResumes")}</p>
            ) : (
              <select
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
                className="mt-2 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text">
              {t("selectPersona")}
            </label>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {PERSONAS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPersona(p)}
                  className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    persona === p
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-brand-200 text-text hover:bg-[color:var(--color-bg)]"
                  }`}
                >
                  <div className="font-medium">{t(`persona_${p}`)}</div>
                  <div className="mt-0.5 text-xs text-text-light">
                    {t(`persona_${p}_desc`)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text">
              {t("selectType")}
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TYPES.map((ty) => (
                <button
                  key={ty}
                  type="button"
                  onClick={() => setInterviewType(ty)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    interviewType === ty
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-brand-200 text-text hover:bg-[color:var(--color-bg)]"
                  }`}
                >
                  {t(`type_${ty}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text">
              {t("selectMode")}
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  mode === "text"
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-brand-200 text-text hover:bg-[color:var(--color-bg)]"
                }`}
              >
                <Keyboard className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{t("mode_text")}</div>
                  <div className="text-xs text-text-light">
                    {t("mode_text_desc")}
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => voiceSupported && setMode("voice")}
                disabled={!voiceSupported}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  mode === "voice"
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-brand-200 text-text hover:bg-[color:var(--color-bg)]"
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                <Mic className="h-4 w-4" />
                <div className="text-left">
                  <div className="font-medium">{t("mode_voice")}</div>
                  <div className="text-xs text-text-light">
                    {voiceSupported ? t("mode_voice_desc") : t("voiceUnsupported")}
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={drillDown}
                onChange={(e) => setDrillDown(e.target.checked)}
                className="h-4 w-4 rounded border-brand-200 text-brand-600 focus:ring-brand-500"
              />
              <span>{t("drillDownLabel")}</span>
            </label>
            <p className="mt-1 text-xs text-text-light pl-6">
              {t("drillDownNote")}
            </p>
          </div>

          <p className="text-xs text-text-placeholder">{tc("aiDisclaimer")}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors disabled:opacity-50"
            >
              {tc("cancel")}
            </button>
            <button
              onClick={handleStart}
              disabled={!canStart}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("generatingQuestions")}
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {t("startButton")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
