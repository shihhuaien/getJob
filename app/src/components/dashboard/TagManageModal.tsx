"use client";

import { useState } from "react";
import { X, Pencil, Trash2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { TAG_COLORS, TAG_COLOR_KEYS } from "@/lib/theme";
import type { JobTag, TagColor } from "@/types/tags";

interface TagManageModalProps {
  tags: JobTag[];
  onRename: (id: string, name: string) => Promise<void>;
  onRecolor: (id: string, color: TagColor) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export function TagManageModal({ tags, onRename, onRecolor, onDelete, onClose }: TagManageModalProps) {
  const t = useTranslations("tags");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(tag: JobTag) {
    setEditingId(tag.id);
    setEditName(tag.name);
    setDeletingId(null);
  }

  async function saveEdit(tag: JobTag) {
    const name = editName.trim();
    if (!name || name === tag.name || saving) return;
    setSaving(true);
    try {
      await onRename(tag.id, name);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleRecolor(tag: JobTag, color: TagColor) {
    if (color === tag.color) return;
    await onRecolor(tag.id, color);
  }

  async function confirmDelete(id: string) {
    setSaving(true);
    try {
      await onDelete(id);
      setDeletingId(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-gray-200">
        {/* 標題 */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-semibold text-text">{t("manageTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-text-light hover:text-text transition-colors duration-fast"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 標籤列表 */}
        <div className="max-h-80 overflow-y-auto px-5 pb-5 space-y-2">
          {tags.length === 0 && (
            <p className="text-sm text-text-light text-center py-6">{t("noTags")}</p>
          )}

          {tags.map((tag) => {
            const colors = TAG_COLORS[tag.color as keyof typeof TAG_COLORS] ?? TAG_COLORS.sage;
            const isEditing = editingId === tag.id;
            const isDeleting = deletingId === tag.id;

            return (
              <div key={tag.id} className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 space-y-2">
                {/* 名稱行 */}
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); saveEdit(tag); }
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      maxLength={30}
                      autoFocus
                      className="flex-1 text-sm px-2 py-1 rounded-lg bg-background border border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-400"
                    />
                  ) : (
                    <span
                      className="flex-1 text-sm font-medium px-2 py-1 rounded-full"
                      style={{ backgroundColor: colors.bg, color: colors.text }}
                    >
                      {tag.name}
                    </span>
                  )}

                  {isEditing ? (
                    <button
                      type="button"
                      onClick={() => saveEdit(tag)}
                      disabled={saving}
                      className="text-brand-600 hover:text-brand-700 disabled:opacity-40"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startEdit(tag)}
                      className="text-text-light hover:text-text transition-colors duration-fast"
                      aria-label={t("renameTag")}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setDeletingId(isDeleting ? null : tag.id)}
                      className="text-text-light hover:text-error transition-colors duration-fast"
                      aria-label={t("deleteTag")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* 改色列 */}
                {!isDeleting && (
                  <div className="flex gap-1.5 pl-1">
                    {TAG_COLOR_KEYS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleRecolor(tag, color)}
                        className={[
                          "w-4 h-4 rounded-full transition-transform duration-fast",
                          tag.color === color ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : "hover:scale-110",
                        ].join(" ")}
                        style={{ backgroundColor: TAG_COLORS[color].bg, border: `1.5px solid ${TAG_COLORS[color].text}` }}
                        aria-label={color}
                      />
                    ))}
                  </div>
                )}

                {/* 刪除確認 */}
                {isDeleting && (
                  <div className="flex items-center gap-2 pl-1">
                    <p className="text-xs text-error flex-1">
                      {t("deleteTagConfirm", { name: tag.name })}
                    </p>
                    <button
                      type="button"
                      onClick={() => confirmDelete(tag.id)}
                      disabled={saving}
                      className="text-xs text-error font-medium hover:underline disabled:opacity-40"
                    >
                      {t("deleteTag")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(null)}
                      className="text-xs text-text-light hover:text-text"
                    >
                      取消
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TagManageModal;
