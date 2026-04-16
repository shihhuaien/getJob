"use client";

import { useState, useRef } from "react";
import { Plus, Sparkles, Upload, Loader2, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { titleSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function CreateResumeButton({
  userId,
  isPro = false,
}: {
  userId: string;
  isPro?: boolean;
}) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // PDF 上傳相關
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setTitle("");
    setError(null);
    setPdfFile(null);
    setIsUploading(false);
    setIsSubmitting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        .from("resumes")
        .insert({
          user_id: userId,
          title: validation.data,
          content: {},
        })
        .select("id")
        .single();
      if (dbError) throw dbError;
      resetState();
      setShowForm(false);
      router.push(`/resume/${data.id}`);
    } catch {
      setError("建立失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== "application/pdf") {
      setError("請選擇 PDF 格式的檔案");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("檔案大小不可超過 5MB");
      return;
    }

    setPdfFile(file);
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) return;
    setError(null);

    if (!isPro) {
      setError("此功能需要 Pro 方案");
      return;
    }

    setIsUploading(true);

    try {
      // 讀取 PDF 為 base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // 去除 data:application/pdf;base64, 前綴
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error("讀取檔案失敗"));
        reader.readAsDataURL(pdfFile);
      });

      const resumeTitle = title.trim() || "PDF 匯入履歷";

      const res = await fetch("/api/resume/parse-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_base64: base64, title: resumeTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "PDF 解析失敗");
        return;
      }

      resetState();
      setShowForm(false);
      router.push(`/resume/${data.data.id}`);
    } catch {
      setError("PDF 解析失敗，請稍後再試");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
      >
        <Plus className="h-4 w-4" />
        新增履歷
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">新增履歷</h3>

            {/* 履歷標題（兩種方式共用） */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                履歷標題
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="例：前端工程師履歷"
                disabled={isSubmitting || isUploading}
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            {/* 方式一：空白建立 */}
            <form onSubmit={handleCreate}>
              <div className="mt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "建立中..." : "建立空白履歷"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetState();
                  }}
                  disabled={isUploading}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  取消
                </button>
              </div>
            </form>

            {/* 分隔線 */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400">或</span>
              </div>
            </div>

            {/* 方式二：PDF 上傳 */}
            <div className="rounded-lg border border-dashed border-gray-300 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Sparkles className="h-4 w-4 text-brand-600" />
                AI 解析 PDF 履歷
                {!isPro && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    Pro
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                上傳現有的 PDF 履歷，AI 自動擷取資料填入各欄位
              </p>

              {!isPro ? (
                <p className="mt-3 text-xs text-gray-400">
                  升級 Pro 方案即可使用 AI 功能
                </p>
              ) : (
                <div className="mt-3">
                  {/* 檔案選擇 */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading || isSubmitting}
                  />

                  {pdfFile ? (
                    <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="flex-1 truncate text-sm text-gray-700">
                        {pdfFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfFile(null);
                          if (fileInputRef.current)
                            fileInputRef.current.value = "";
                        }}
                        disabled={isUploading}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        移除
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      選擇 PDF 檔案
                    </button>
                  )}

                  {/* 上傳按鈕 */}
                  <button
                    type="button"
                    onClick={handlePdfUpload}
                    disabled={!pdfFile || isUploading || isSubmitting}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        AI 解析中...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        上傳並解析
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
