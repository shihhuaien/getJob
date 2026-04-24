"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { coverLetterUpdateSchema } from "@/lib/validations";
import { useAutosave } from "@/hooks/useAutosave";
import AutosaveIndicator from "@/components/ui/AutosaveIndicator";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Database } from "@/types/database";

type CoverLetter = Database["public"]["Tables"]["cover_letters"]["Row"];

interface Props {
  coverLetter: CoverLetter;
}

export default function CoverLetterEditor({ coverLetter }: Props) {
  const router = useRouter();
  const t = useTranslations("coverLetter");
  const tc = useTranslations("common");
  const tb = useTranslations("breadcrumb");
  const [title, setTitle] = useState(coverLetter.title);
  const [content, setContent] = useState(coverLetter.content);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formData = useMemo(() => ({ title, content }), [title, content]);

  const persist = useCallback(
    async (data: { title: string; content: string }) => {
      const validation = coverLetterUpdateSchema.safeParse(data);
      if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
      }
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("cover_letters")
        .update({
          title: validation.data.title,
          content: validation.data.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", coverLetter.id);
      if (dbError) throw new Error(tc("saveFailed"));
    },
    [coverLetter.id, tc]
  );

  const { status, savedAt, flush } = useAutosave({
    data: formData,
    onSave: persist,
  });

  const handleManualSave = async () => {
    try {
      await flush();
      toast.success(tc("saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tc("saveFailed"));
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", coverLetter.id);

    if (dbError) {
      toast.error(tc("deleteFailed"));
      setIsDeleting(false);
    } else {
      toast.success(tc("deleted"));
      router.push("/cover-letter");
    }
  };

  return (
    <div>
      <Breadcrumb
        className="mb-3"
        items={[
          { href: "/cover-letter", label: tb("coverLetter") },
          { label: title || coverLetter.title },
        ]}
      />

      {/* 頂部導航 */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/cover-letter"
          className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>
        <div className="flex items-center gap-3">
          <AutosaveIndicator status={status} savedAt={savedAt} />
          <button
            onClick={handleManualSave}
            disabled={status === "saving"}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {status === "saving" ? tc("saving") : tc("save")}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 刪除確認 */}
      {showDeleteConfirm && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {t("deleteConfirm")}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? tc("deleting") : tc("confirmDelete")}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
            >
              {tc("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* 標題 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
        <label className="block text-sm font-medium text-text">
          {t("coverLetterTitle")}
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder={t("titlePlaceholder")}
        />
      </div>

      {/* 內容編輯 */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
        <label className="block text-sm font-medium text-text">
          {t("content")}
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm leading-relaxed focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder={t("contentPlaceholder")}
        />
      </div>
    </div>
  );
}
