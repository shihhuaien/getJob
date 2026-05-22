"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, Loader2, ChevronDown } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import AiLanguageSelector from "./AiLanguageSelector";
import type { Database } from "@/types/database";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

interface ParsedResult {
  company_name: string;
  job_title: string;
  salary_min: number | null;
  salary_max: number | null;
  job_description: string;
}

type AiLang = "zh-TW" | "en" | null;

interface Props {
  onClose: () => void;
  initialAiLanguage?: AiLang;
  onSave: (job: {
    company_name: string;
    job_title: string;
    job_url: string;
    job_description: string;
    salary_min: number | null;
    salary_max: number | null;
    status: ApplicationStatus;
  }) => void;
}

export default function ParseJobModal({ onClose, onSave, initialAiLanguage = null }: Props) {
  const t = useTranslations("jobs");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [step, setStep] = useState<"input" | "loading" | "review">("input");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [jobUrl, setJobUrl] = useState("");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [aiLanguage, setAiLanguage] = useState<AiLang>(initialAiLanguage);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const parsingPhases = t.raw("parsingPhases") as string[];
  const parsingLabel = parsingPhases[phaseIdx % parsingPhases.length];

  useEffect(() => {
    if (step !== "loading") return;
    const interval = setInterval(() => {
      setPhaseIdx((i) => i + 1);
    }, 2000);
    return () => clearInterval(interval);
  }, [step]);

  const handleParse = async () => {
    setError(null);
    if (!rawText.trim()) {
      setError(t("inputRequired"));
      return;
    }

    setStep("loading");

    try {
      const res = await fetch("/api/jobs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText, locale: aiLanguage ?? locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t("parseFailed"));
        setStep("input");
        return;
      }

      setResult(data.data);
      setStep("review");
    } catch {
      setError(t("parseFailedRetry"));
      setStep("input");
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSave({
      company_name: result.company_name,
      job_title: result.job_title,
      job_url: jobUrl,
      job_description: result.job_description,
      salary_min: result.salary_min,
      salary_max: result.salary_max,
      status: "saved",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-text">
              {t("parseTitle")}
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

          {step === "input" && (
            <div>
              <label className="block text-sm font-medium text-text">
                {t("description")}
              </label>
              <p className="mt-1 text-xs text-text-light">
                {t("parseDesc")}
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
                maxLength={10000}
                className="mt-2 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("parsePlaceholder")}
                autoFocus
              />
              <div className="mt-1 text-right text-xs text-text-placeholder">
                {t("parseCharCount", { count: rawText.length })}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  className="flex items-center gap-1 text-xs text-text-light hover:text-text transition-colors"
                >
                  <ChevronDown className={`h-3 w-3 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                  {tc("advancedSettings")}
                </button>
                {showAdvanced && (
                  <div className="mt-2">
                    <AiLanguageSelector value={aiLanguage} onChange={setAiLanguage} />
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
                >
                  {tc("cancel")}
                </button>
                <button
                  onClick={handleParse}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  {t("startParse")}
                </button>
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="mt-3 text-sm text-text-light">{parsingLabel}</p>
            </div>
          )}

          {step === "review" && result && (
            <div className="space-y-4">
              <p className="text-sm text-text-light">
                {t("parseConfirm")}
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("companyName")}
                  </label>
                  <input
                    type="text"
                    value={result.company_name}
                    onChange={(e) =>
                      setResult({ ...result, company_name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("jobTitle")}
                  </label>
                  <input
                    type="text"
                    value={result.job_title}
                    onChange={(e) =>
                      setResult({ ...result, job_title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("minSalary")}
                  </label>
                  <input
                    type="number"
                    value={result.salary_min ?? ""}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        salary_min: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder={t("salaryMinPlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("maxSalary")}
                  </label>
                  <input
                    type="number"
                    value={result.salary_max ?? ""}
                    onChange={(e) =>
                      setResult({
                        ...result,
                        salary_max: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder={t("salaryMaxPlaceholder")}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text">
                    {t("jobUrl")}
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text">
                  {t("description")}
                </label>
                <textarea
                  value={result.job_description}
                  onChange={(e) =>
                    setResult({ ...result, job_description: e.target.value })
                  }
                  rows={6}
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setStep("input");
                    setResult(null);
                  }}
                  className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
                >
                  {t("reParse")}
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                  {t("saveJob")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
