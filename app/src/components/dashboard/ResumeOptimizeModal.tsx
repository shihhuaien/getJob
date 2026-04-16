"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, Loader2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
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
          className="text-gray-200"
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
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

function ScoreLabel({ score }: { score: number }) {
  if (score >= 90) return <span className="text-sm font-medium text-green-600">非常匹配</span>;
  if (score >= 70) return <span className="text-sm font-medium text-green-600">良好匹配</span>;
  if (score >= 50) return <span className="text-sm font-medium text-yellow-600">中等匹配</span>;
  if (score >= 30) return <span className="text-sm font-medium text-red-600">匹配度低</span>;
  return <span className="text-sm font-medium text-red-600">幾乎不匹配</span>;
}

const sectionLabels: Record<string, string> = {
  summary: "自我介紹",
  experience: "工作經歷",
  skills: "技能",
  education: "學歷",
  general: "整體",
};

export default function ResumeOptimizeModal({
  resumeId,
  jobs,
  onClose,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"select" | "loading" | "result">("select");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AtsAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedJobId) return;
    setError(null);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, job_id: selectedJobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "生成失敗");
        setIsGenerating(false);
        return;
      }

      router.push(`/resume/${data.data.id}`);
    } catch {
      setError("生成失敗，請稍後再試");
      setIsGenerating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedJobId) {
      setError("請選擇要比對的職缺");
      return;
    }

    setError(null);
    setStep("loading");

    try {
      const res = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume_id: resumeId, job_id: selectedJobId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "分析失敗");
        setStep("select");
        return;
      }

      setAnalysis(data.data);
      setStep("result");
    } catch {
      setError("分析失敗，請稍後再試");
      setStep("select");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI 履歷優化分析
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
              <label className="block text-sm font-medium text-gray-700">
                選擇要比對的職缺
              </label>
              <p className="mt-1 text-xs text-gray-500">
                AI 將比對你的履歷與該職缺描述，給出 ATS 評分與改善建議
              </p>
              {jobs.length === 0 ? (
                <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center">
                  <p className="text-sm text-gray-500">
                    尚無已儲存的職缺。請先到職缺追蹤新增職缺並填寫職缺描述。
                  </p>
                </div>
              ) : (
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  <option value="">請選擇職缺...</option>
                  {jobs.map((job) => (
                    <option
                      key={job.id}
                      value={job.id}
                      disabled={!job.has_description}
                    >
                      {job.company_name} — {job.job_title}
                      {!job.has_description ? "（無職缺描述）" : ""}
                    </option>
                  ))}
                </select>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={!selectedJobId || jobs.length === 0}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4" />
                  開始分析
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="mt-3 text-sm text-gray-500">
                AI 正在分析你的履歷與職缺匹配度...
              </p>
              <p className="mt-1 text-xs text-gray-400">
                這可能需要幾秒鐘
              </p>
            </div>
          )}

          {/* Step 3: 結果 */}
          {step === "result" && analysis && (
            <div className="space-y-6">
              {/* ATS 分數 */}
              <div className="flex flex-col items-center gap-2 rounded-xl bg-gray-50 py-6">
                <ScoreRing score={analysis.score} />
                <ScoreLabel score={analysis.score} />
                <p className="mt-2 max-w-md text-center text-sm text-gray-600">
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
                      已匹配關鍵字（{analysis.matched_keywords.length}）
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
                      <p className="text-xs text-green-600">無匹配關鍵字</p>
                    )}
                  </div>
                </div>

                {/* 缺少 */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <h4 className="text-sm font-semibold text-red-800">
                      缺少關鍵字（{analysis.missing_keywords.length}）
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
                      <p className="text-xs text-red-600">無缺少關鍵字</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 改善建議 */}
              <div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    改善建議
                  </h4>
                </div>
                <div className="mt-3 space-y-3">
                  {analysis.suggestions.map((s, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 bg-white p-4"
                    >
                      <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                        {sectionLabels[s.section] || s.section}
                      </span>
                      <p className="mt-2 text-sm text-gray-700">
                        {s.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400">
                AI 產出內容不一定完全正確，請先確認再使用
              </p>

              {/* 操作按鈕 */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isGenerating}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  關閉
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      生成履歷
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
