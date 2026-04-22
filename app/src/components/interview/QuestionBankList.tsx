"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Trash2, Pencil, Save, X, Loader2 } from "lucide-react";

export interface BankItem {
  id: string;
  question_text: string;
  category: string | null;
  user_notes: string | null;
  created_at: string;
}

interface Props {
  items: BankItem[];
}

export default function QuestionBankList({ items }: Props) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <BankRow key={item.id} item={item} />
      ))}
    </div>
  );
}

function BankRow({ item }: { item: BankItem }) {
  const router = useRouter();
  const t = useTranslations("interview");
  const tc = useTranslations("common");
  const [editing, setEditing] = useState(false);
  const [notes, setNotes] = useState(item.user_notes ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const res = await fetch(`/api/interview/bank/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_notes: notes }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || tc("saveFailed"));
        setIsSaving(false);
        return;
      }
      setEditing(false);
      router.refresh();
    } catch {
      setError(tc("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/interview/bank/${item.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || tc("deleteFailed"));
        setIsDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setError(tc("deleteFailed"));
      setIsDeleting(false);
    }
  };

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-brand-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          {item.category && (
            <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-text">
              {item.category}
            </span>
          )}
          <p className="mt-2 text-sm font-medium text-text">
            {item.question_text}
          </p>
          <p className="mt-1 text-xs text-text-placeholder">
            {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {!editing && !confirmDelete && (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="rounded-lg p-1.5 text-text-placeholder hover:bg-brand-50 hover:text-text transition-colors"
                aria-label={t("bankEditNotes")}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="rounded-lg p-1.5 text-text-placeholder hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label={tc("delete")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <div className="mt-3 space-y-2">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder={t("bankNotesPlaceholder")}
            className="block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {tc("saving")}
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  {tc("save")}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setNotes(item.user_notes ?? "");
                setError(null);
              }}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors disabled:opacity-50"
            >
              <X className="h-3.5 w-3.5" />
              {tc("cancel")}
            </button>
          </div>
        </div>
      ) : item.user_notes ? (
        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-[color:var(--color-bg)] p-3 text-sm text-text">
          {item.user_notes}
        </p>
      ) : null}

      {confirmDelete && (
        <div className="mt-3 rounded-lg bg-red-50 p-3">
          <p className="text-sm text-red-800">{t("bankDeleteConfirm")}</p>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {tc("deleting")}
                </>
              ) : (
                tc("confirmDelete")
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                setError(null);
              }}
              disabled={isDeleting}
              className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors disabled:opacity-50"
            >
              {tc("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
