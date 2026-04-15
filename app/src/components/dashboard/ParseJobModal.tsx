"use client";

import { useState } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import type { Database } from "@/types/database";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];

interface ParsedResult {
  company_name: string;
  job_title: string;
  salary_min: number | null;
  salary_max: number | null;
  job_description: string;
}

interface Props {
  onClose: () => void;
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

export default function ParseJobModal({ onClose, onSave }: Props) {
  const [step, setStep] = useState<"input" | "loading" | "review">("input");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedResult | null>(null);
  const [jobUrl, setJobUrl] = useState("");

  const handleParse = async () => {
    setError(null);
    if (!rawText.trim()) {
      setError("請輸入職缺內容");
      return;
    }

    setStep("loading");

    try {
      const res = await fetch("/api/jobs/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: rawText }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "解析失敗");
        setStep("input");
        return;
      }

      setResult(data.data);
      setStep("review");
    } catch {
      setError("解析失敗，請稍後再試");
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
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              AI 智慧解析
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

          {/* Step 1: 貼上文字 */}
          {step === "input" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                貼上職缺內容
              </label>
              <p className="mt-1 text-xs text-gray-500">
                從 104、CakeResume、LinkedIn 等網站複製職缺描述，AI 將自動擷取結構化資訊
              </p>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={12}
                maxLength={10000}
                className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="貼上完整的職缺描述文字..."
                autoFocus
              />
              <div className="mt-1 text-right text-xs text-gray-400">
                {rawText.length} / 10000
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleParse}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                  <Sparkles className="h-4 w-4" />
                  開始解析
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
              <p className="mt-3 text-sm text-gray-500">AI 正在解析職缺內容...</p>
            </div>
          )}

          {/* Step 3: 審閱結果 */}
          {step === "review" && result && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                請確認解析結果，可直接編輯後儲存
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    公司名稱
                  </label>
                  <input
                    type="text"
                    value={result.company_name}
                    onChange={(e) =>
                      setResult({ ...result, company_name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    職位名稱
                  </label>
                  <input
                    type="text"
                    value={result.job_title}
                    onChange={(e) =>
                      setResult({ ...result, job_title: e.target.value })
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    最低月薪
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="例：40000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    最高月薪
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
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="例：60000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    職缺連結
                  </label>
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  職缺描述
                </label>
                <textarea
                  value={result.job_description}
                  onChange={(e) =>
                    setResult({ ...result, job_description: e.target.value })
                  }
                  rows={6}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setStep("input");
                    setResult(null);
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  重新解析
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
                >
                  儲存職缺
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
