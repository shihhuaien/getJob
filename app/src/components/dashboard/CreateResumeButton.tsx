"use client";

import { useState, useRef } from "react";
import { Plus, Sparkles, Upload, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { titleSchema } from "@/lib/validations";
import { useRouter } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";

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
  const t = useTranslations("resume");
  const tc = useTranslations("common");
  const locale = useLocale();

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
    } catch (err) {
      const code = (err as { code?: string } | null)?.code;
      setError(code === "23505" ? tc("duplicateResume") : tc("createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.type !== "application/pdf") {
      setError(t("pdfTypeError"));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(t("pdfSizeError"));
      return;
    }

    setPdfFile(file);
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) return;
    setError(null);

    if (!isPro) {
      setError(tc("proRequired"));
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
        reader.onerror = () => reject(new Error(tc("fileReadError")));
        reader.readAsDataURL(pdfFile);
      });

      const resumeTitle = title.trim() || t("pdfDefaultTitle");

      const res = await fetch("/api/resume/parse-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdf_base64: base64, title: resumeTitle, locale }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          res.status === 409 ? tc("duplicateResume") : (data.error || t("pdfParseFailed"))
        );
        return;
      }

      resetState();
      setShowForm(false);
      router.push(`/resume/${data.data.id}`);
    } catch {
      setError(t("pdfParseFailedRetry"));
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
        {t("addResume")}
      </button>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-text">{t("addResume")}</h3>

            {/* 履歷標題（兩種方式共用） */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-text">
                {t("resumeTitle")}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("titlePlaceholder")}
                disabled={isSubmitting || isUploading}
              />
            </div>

            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

            {/* 方式一：空白建立 */}
            <form onSubmit={handleCreate}>
              <div className="mt-4 flex gap-3">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isUploading}
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
                  disabled={isUploading}
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

            {/* 方式二：PDF 上傳 */}
            <div className="rounded-lg border border-dashed border-brand-200 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-text">
                <Sparkles className="h-4 w-4 text-brand-600" />
                {t("aiParsePdf")}
                {!isPro && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
                    {tc("pro")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-text-light">
                {t("pdfDesc")}
              </p>

              {!isPro ? (
                <p className="mt-3 text-xs text-text-placeholder">
                  {tc("proUpgrade")}
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
                    <div className="flex items-center gap-2 rounded-lg bg-[color:var(--color-bg)] px-3 py-2">
                      <FileText className="h-4 w-4 text-text-light" />
                      <span className="flex-1 truncate text-sm text-text">
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
                        className="text-xs text-text-placeholder hover:text-text-light"
                      >
                        {t("remove")}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-200 px-3 py-2 text-sm text-text-light hover:bg-[color:var(--color-bg)] transition-colors disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" />
                      {t("selectPdf")}
                    </button>
                  )}

                  {/* 上傳按鈕 */}
                  <Button
                    type="button"
                    onClick={handlePdfUpload}
                    disabled={!pdfFile || isSubmitting}
                    loading={isUploading}
                    variant="primary"
                    leftIcon={<Sparkles className="h-4 w-4" />}
                    className="mt-3 w-full"
                  >
                    {isUploading ? t("aiParsing") : t("uploadAndParse")}
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
