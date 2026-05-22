"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles, ChevronDown } from "lucide-react";
import AiLanguageSelector from "./AiLanguageSelector";
import { createClient } from "@/lib/supabase/client";
import { titleSchema } from "@/lib/validations";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";

interface ResumeOption {
  id: string;
  title: string;
}

interface JobOption {
  id: string;
  company_name: string;
  job_title: string;
  has_description: boolean;
}

type AiLang = "zh-TW" | "en" | null;

export default function CreateCoverLetterButton({
  userId,
  isPro = false,
  resumes = [],
  jobs = [],
  initialAiLanguage = null,
}: {
  userId: string;
  isPro?: boolean;
  resumes?: ResumeOption[];
  jobs?: JobOption[];
  initialAiLanguage?: AiLang;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations("coverLetter");
  const tc = useTranslations("common");
  const locale = useLocale();

  // AI 生成相關
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [extraInstructions, setExtraInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aiLanguage, setAiLanguage] = useState<AiLang>(initialAiLanguage);

  const aiGeneratingPhases = t.raw("aiGeneratingPhases") as string[];
  const aiGeneratingLabel = aiGeneratingPhases[phaseIdx % aiGeneratingPhases.length];

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setPhaseIdx((i) => i + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const resetState = () => {
    setTitle("");
    setError(null);
    setSelectedJobId("");
    setSelectedResumeId("");
    setIsGenerating(false);
    setIsSubmitting(false);
    setStreamingText("");
    setExtraInstructions("");
    setShowAdvanced(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = titleSchema.safeParse(title);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { data, error: dbError } = await supabase
        .from("cover_letters")
        .insert({
          user_id: userId,
          title: validation.data,
          content: "",
        })
        .select("id")
        .single();
      if (dbError) throw dbError;
      resetState();
      setShowForm(false);
      router.push(`/cover-letter/${data.id}`);
    } catch {
      setError(tc("createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedJobId || !selectedResumeId) {
      setError(t("selectJobAndResume"));
      return;
    }

    setError(null);
    setIsGenerating(true);
    setStreamingText("");

    try {
      const res = await fetch("/api/cover-letter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: selectedJobId,
          resume_id: selectedResumeId,
          locale: aiLanguage ?? locale,
          extra_instructions: extraInstructions.trim() || undefined,
        }),
      });

      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({ error: t("generateFailed") }));
        // 同一職缺已有求職信：直接跳轉至既有紀錄
        if (res.status === 409 && data.existing_id) {
          resetState();
          setShowForm(false);
          router.push(`/cover-letter/${data.existing_id}`);
          return;
        }
        setError(
          res.status === 409 ? tc("duplicateCoverLetter") : (data.error || t("generateFailed"))
        );
        setIsGenerating(false);
        return;
      }

      const DONE_SENTINEL = "\n---OFFERY_DONE---\n";
      const ERROR_SENTINEL = "\n---OFFERY_ERROR---\n";
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalId: string | null = null;
      let streamError: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const errorIdx = buffer.indexOf(ERROR_SENTINEL);
        if (errorIdx !== -1) {
          const visible = buffer.slice(0, errorIdx);
          setStreamingText(visible);
          const payload = buffer.slice(errorIdx + ERROR_SENTINEL.length).trim();
          try {
            streamError = JSON.parse(payload).error as string;
          } catch {
            streamError = t("generateFailed");
          }
          break;
        }

        const doneIdx = buffer.indexOf(DONE_SENTINEL);
        if (doneIdx !== -1) {
          const visible = buffer.slice(0, doneIdx);
          setStreamingText(visible);
          const payload = buffer.slice(doneIdx + DONE_SENTINEL.length).trim();
          try {
            finalId = JSON.parse(payload).id as string;
          } catch {
            streamError = t("generateFailed");
          }
          break;
        }

        setStreamingText(buffer);
      }

      if (streamError) {
        setError(streamError);
        setIsGenerating(false);
        return;
      }

      if (!finalId) {
        setError(t("generateFailedRetry"));
        setIsGenerating(false);
        return;
      }

      resetState();
      setShowForm(false);
      router.push(`/cover-letter/${finalId}`);
    } catch {
      setError(t("generateFailedRetry"));
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        {t("addCoverLetter")}
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-text">{t("addCoverLetter")}</h3>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            {/* 方式一：空白建立 */}
            <form onSubmit={handleCreate}>
              <div className="mt-4">
                <label className="block text-sm font-medium text-text">
                  {t("coverLetterTitle")}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={t("titlePlaceholder")}
                  disabled={isSubmitting || isGenerating}
                />
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isGenerating}
                  variant="primary"
                >
                  {t("createBlank")}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetState();
                  }}
                  disabled={isGenerating}
                  variant="secondary"
                >
                  {tc("cancel")}
                </Button>
              </div>
            </form>

            {/* 分隔線 */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-brand-100" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-text-placeholder">{tc("or")}</span>
              </div>
            </div>

            {/* 方式二：AI 生成 */}
            <div className="rounded-lg border border-dashed border-brand-200 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-text">
                <Sparkles className="h-4 w-4 text-brand-600" />
                {t("aiGenerate")}
                {!isPro && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    {tc("pro")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-text-light">
                {t("aiGenerateDesc")}
              </p>

              {!isPro ? (
                <p className="mt-3 text-xs text-text-placeholder">
                  {tc("proUpgrade")}
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {/* 職缺選擇 */}
                  <div>
                    <label className="block text-xs font-medium text-text-light">
                      {t("selectJob")}
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      disabled={isGenerating || isSubmitting}
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
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
                  </div>

                  {/* 履歷選擇 */}
                  <div>
                    <label className="block text-xs font-medium text-text-light">
                      {t("selectResume")}
                    </label>
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      disabled={isGenerating || isSubmitting}
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                    >
                      <option value="">{t("selectResumePlaceholder")}</option>
                      {resumes.map((resume) => (
                        <option key={resume.id} value={resume.id}>
                          {resume.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-text-placeholder">
                    {tc("aiDisclaimer")}
                  </p>

                  {/* 進階設定 */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced((v) => !v)}
                      disabled={isGenerating || isSubmitting}
                      className="flex items-center gap-1 text-xs text-text-light hover:text-text transition-colors disabled:opacity-50"
                    >
                      <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                      {tc("advancedSettings")}
                    </button>
                    {showAdvanced && (
                      <div className="mt-2 space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-text-light">
                            {tc("extraInstructions")}
                          </label>
                          <textarea
                            value={extraInstructions}
                            onChange={(e) => setExtraInstructions(e.target.value)}
                            maxLength={500}
                            rows={3}
                            disabled={isGenerating || isSubmitting}
                            placeholder={tc("extraInstructionsPlaceholder")}
                            className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-xs resize-none focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                          />
                          <p className="mt-0.5 text-right text-xs text-text-placeholder">
                            {extraInstructions.length} / 500
                          </p>
                        </div>
                        <AiLanguageSelector value={aiLanguage} onChange={setAiLanguage} disabled={isGenerating || isSubmitting} />
                      </div>
                    )}
                  </div>

                  {/* 串流預覽 */}
                  {isGenerating && streamingText && (
                    <div className="rounded-lg border border-brand-100 bg-[color:var(--color-bg)] p-3">
                      <p className="mb-1.5 text-xs font-medium text-brand-700">
                        {t("streamingLabel")}
                      </p>
                      <pre className="max-h-48 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-text">
                        {streamingText}
                      </pre>
                    </div>
                  )}

                  {/* 生成按鈕 */}
                  <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!selectedJobId || !selectedResumeId || isSubmitting}
                    loading={isGenerating}
                    variant="primary"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                    className="w-full"
                  >
                    {isGenerating ? aiGeneratingLabel : t("aiGenerateBtn")}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
