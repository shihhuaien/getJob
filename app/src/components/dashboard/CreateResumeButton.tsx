"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { titleSchema } from "@/lib/validations";
import { useRouter } from "next/navigation";

export default function CreateResumeButton({ userId }: { userId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
      setTitle("");
      setShowForm(false);
      router.push(`/resume/${data.id}`);
    } catch {
      setError("建立失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
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
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900">新增履歷</h3>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                履歷標題
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="例：前端工程師履歷"
              />
            </div>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "建立中..." : "建立"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
