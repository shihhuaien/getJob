"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { coverLetterUpdateSchema } from "@/lib/validations";
import type { Database } from "@/types/database";

type CoverLetter = Database["public"]["Tables"]["cover_letters"]["Row"];

interface Props {
  coverLetter: CoverLetter;
}

export default function CoverLetterEditor({ coverLetter }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(coverLetter.title);
  const [content, setContent] = useState(coverLetter.content);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    const validation = coverLetterUpdateSchema.safeParse({ title, content });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsSaving(true);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("cover_letters")
      .update({
        title: validation.data.title,
        content: validation.data.content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", coverLetter.id);

    if (dbError) {
      setError("儲存失敗，請稍後再試");
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", coverLetter.id);

    if (dbError) {
      setError("刪除失敗，請稍後再試");
      setIsDeleting(false);
    } else {
      router.push("/cover-letter");
    }
  };

  return (
    <div>
      {/* 頂部導航 */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/cover-letter"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回求職信列表
        </Link>
        <div className="flex items-center gap-3">
          {success && (
            <span className="text-sm text-green-600">已儲存</span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "儲存中..." : "儲存"}
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
            確定要刪除此求職信嗎？此操作無法復原。
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "刪除中..." : "確認刪除"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 標題 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <label className="block text-sm font-medium text-gray-700">
          求職信標題
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder="例：應徵前端工程師求職信"
        />
      </div>

      {/* 內容編輯 */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <label className="block text-sm font-medium text-gray-700">
          求職信內容
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          placeholder={"親愛的招募經理：\n\n我對貴公司的職缺非常感興趣...\n\n在此附上我的履歷供參考，期待有機會進一步面談。\n\n此致\n敬禮"}
        />
      </div>
    </div>
  );
}
