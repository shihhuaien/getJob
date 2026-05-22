"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Sparkles, X, Loader2, CheckCircle2, AlertTriangle, XCircle, ChevronDown } from "lucide-react";
import type { AtsAnalysis } from "@/lib/optimize-resume";

interface JobOption {
  id: string;
  company_name: string;
  job_title: string;
  has_description: boolean;
}

interface Props {
  resumeId: string;
  jobs: JobOption[];
  onClose: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 70
      ? "text-green-500"
      : score >= 50
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-text-placeholder"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${color}`}>{score}</span>
        <span className="text-xs text-text-light">/ 100</span>
      </div>
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations("resume");
  if (score >= 90) return <span className="text-sm font-medium text-green-600">{t("matchExcellent")}</span>;
  if (score >= 70) return <span className="text-sm font-medium text-green-600">{t("matchGood")}</span>;
  if (score >= 50) return <span className="text-sm font-medium text-yellow-600">{t("matchMedium")}</span>;
  if (score >= 30) return <span className="text-sm font-medium text-red-600">{t("matchLow")}</span>;
  return <span className="text-sm font-medium text-red-600">{t("matchPoor")}</span>;
}

const sectionKeys: Record<string, string> = {
  summary: "sectionSummary",
  experience: "sectionExperience",
  skills: "sectionSkills",
  education: "sectionEducation",
  general: "sectionGeneral",
};

export default function ResumeOptimizeModal({
  resumeId,
  jobs,
  onClose,
}: Props) {
  const router = useRouter();
  const t = useTranslations("resume");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [step, setStep] = useState<"select" | "loading" | "result">("select");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analyzePhaseIdx, setAnalyzePhaseIdx] = useState(0);
  const [generatePhaseIdx, setGeneratePhaseIdx] = useState(0);
  const [extraInstructions, setExtraInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const analyzingPhases = t.raw("analyzingPhases") as string[];
  const analyzingLabel = analyzingPhases[analyzePhaseIdx % analyzingPhases.length];

  const generatingPhases = t.raw("generatingPhases") as string[];
  const generatingLabel = generatingPhases[generatePhaseIdx % generatingPhases.length];

  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setAnalyzePhaseIdx((i) => i + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setGeneratePhaseIdx((i) => i + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!selectedJobId) return;
    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_id: resumeId,
          job_id: selectedJobId,
          locale,
          extra_instructions: extraInstructions.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 同名履歷已存在：自動跳轉至既有版本
        if (res.status === 409 && data.existing_id) {
          router.push(`/resume/${data.existing_id}`);
          return;
        }
        setError(
          res.status === 409 ? tc("duplicateResume") : (data.error || t("generateFailed"))
        );
        setIsGenerating(false);
        return;
      }

      router.push(`/resume/${data.data.id}`);
    } catch {
      setError(t("generateFailed"));
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedJobId) {
      setError(t("selectJob"));
      return;
    }

    setError(null);
    setStep("loading");

    try {
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, job_id: selectedJobId, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("analyzeFailed"));
        setStep("select");
        return;
      }

      setAnalysis(data.data);
      setStep("result");
    } catch {
      setError(t("analyzeFailedRetry"));
      setStep("select");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-100 bg-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-text">
              {t("optimizeTitle")}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-text-placeholder hover:bg-brand-50 hover:text-text-light"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: 選擇職缺 */}
          {step === "select" && (
            <div>
              <label className="block text-sm font-medium text-text">
                {t("selectJob")}
              </label>
              {jobs.length === 0 ? (
                <div className="mt-4 rounded-lg bg-[color:var(--color-bg)] p-6 text-center">
                  <p className="text-sm text-text-light">
                    {t("noJobs")}
                  </p>
                </div>
              ) : (
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">{t("selectJobPlaceholder")}</option>
                  {jobs.map((job) => (
                    <option
                      key={job.id}
                      value={job.id}
                      disabled={!job.has_description}
                    >
                      {job.company_name} — {job.job_title}
                      {!job.has_description ? tc("noDescription") : ""}
                    </option>
                  ))}
                </select>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
                >
                  {tc("cancel")}
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedJobId || jobs.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("startAnalysis")}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="mt-3 text-sm text-text-light">
                {analyzingLabel}
              </p>
              <p className="mt-1 text-xs text-text-placeholder">
                {t("analyzingNote")}
              </p>
            </div>
          )}

          {/* Step 3: 結果 */}
          {step === "result" && analysis && (
            <div className="space-y-6">
              {/* ATS 分數 */}
              <div className="flex flex-col items-center gap-2 rounded-xl bg-[color:var(--color-bg)] py-6">
                <ScoreRing score={analysis.score} />
                <ScoreLabel score={analysis.score} />
                <p className="mt-2 max-w-md text-center text-sm text-text-light">
                  {analysis.summary}
                </p>
              </div>

              {/* 關鍵字比對 */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* 已匹配 */}
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <h4 className="text-sm font-semibold text-green-800">
                      {t("matchedKeywords")}（{analysis.matched_keywords.length}）
                    </h4>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.matched_keywords.length > 0 ? (
                      analysis.matched_keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-green-600">{t("noMatchedKeywords")}</p>
                    )}
                  </div>
                </div>

                {/* 缺少 */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <h4 className="text-sm font-semibold text-red-800">
                      {t("missingKeywords")}（{analysis.missing_keywords.length}）
                    </h4>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {analysis.missing_keywords.length > 0 ? (
                      analysis.missing_keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                        >
                          {kw}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-red-600">{t("noMissingKeywords")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 改善建議 */}
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h4 className="text-sm font-semibold text-text">
                    {t("suggestions")}
                  </h4>
                </div>
                <div className="mt-3 space-y-3">
                  {analysis.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-brand-100 bg-white p-4"
                    >
                      <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-text-light">
                        {sectionKeys[s.section] ? t(sectionKeys[s.section] as "sectionSummary" | "sectionExperience" | "sectionSkills" | "sectionEducation" | "sectionGeneral") : s.section}
                      </span>
                      <p className="mt-2 text-sm text-text">
                        {s.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-text-placeholder">
                {tc("aiDisclaimer")}
              </p>

              {/* 進階設定 */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  disabled={isGenerating}
                  className="flex items-center gap-1 text-xs text-text-light hover:text-text transition-colors disabled:opacity-50"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                  {tc("advancedSettings")}
                </button>
                {showAdvanced && (
                  <div className="mt-2">
                    <label className="block text-xs font-medium text-text-light">
                      {tc("extraInstructions")}
                    </label>
                    <textarea
                      value={extraInstructions}
                      onChange={(e) => setExtraInstructions(e.target.value)}
                      maxLength={500}
                      rows={3}
                      disabled={isGenerating}
                      placeholder={tc("extraInstructionsPlaceholder")}
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-xs resize-none focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                    />
                    <p className="mt-0.5 text-right text-xs text-text-placeholder">
                      {extraInstructions.length} / 500
                    </p>
                  </div>
                )}
              </div>

              {/* 操作按鈕 */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isGenerating}
                  className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors disabled:opacity-50"
                >
                  {tc("close")}
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {generatingLabel}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {t("generateResume")}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
