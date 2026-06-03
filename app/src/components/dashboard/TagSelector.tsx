"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Check, Tag } from "lucide-react";
import { useTranslations } from "next-intl";
import { TAG_COLORS, TAG_COLOR_KEYS } from "@/lib/theme";
import TagPill from "@/components/ui/TagPill";
import type { JobTag, TagColor } from "@/types/tags";

interface TagSelectorProps {
  allTags: JobTag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  onCreateTag: (name: string, color: TagColor) => Promise<void>;
  disabled?: boolean;
}

export function TagSelector({
  allTags,
  selectedTagIds,
  onToggleTag,
  onCreateTag,
  disabled = false,
}: TagSelectorProps) {
  const t = useTranslations("tags");
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState<TagColor>("sage");
  const [creating, setCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function handleCreate() {
    const name = newName.trim();
    if (!name || creating) return;
    setCreating(true);
    try {
      await onCreateTag(name, newColor);
      setNewName("");
      setNewColor("sage");
    } finally {
      setCreating(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); handleCreate(); }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-xs text-text-light hover:text-brand-600 transition-colors duration-fast disabled:opacity-50"
      >
        <Tag className="w-3.5 h-3.5" />
        {t("addJobTags")}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-56 rounded-xl bg-white/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-gray-200 overflow-hidden">
          {/* 已有標籤列表 */}
          <div className="max-h-40 overflow-y-auto">
            {allTags.length === 0 ? (
              <p className="px-3 py-4 text-xs text-text-light text-center">{t("noTagsHint")}</p>
            ) : (
              allTags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => onToggleTag(tag.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors duration-fast text-left"
                  >
                    <Check className={["w-3.5 h-3.5 shrink-0", selected ? "opacity-100 text-brand-600" : "opacity-0"].join(" ")} />
                    <TagPill tag={tag} size="md" />
                  </button>
                );
              })
            )}
          </div>

          {/* 新增標籤區 */}
          <div className="border-t border-gray-200 bg-gray-50/80 p-2 space-y-2">
            <input
              ref={inputRef}
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t("newTagPlaceholder")}
              maxLength={30}
              className="w-full text-xs px-2 py-1.5 rounded-lg bg-background border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-400 placeholder:text-text-placeholder"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {TAG_COLOR_KEYS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewColor(color)}
                    className={["w-4 h-4 rounded-full transition-transform duration-fast", newColor === color ? "scale-125 ring-2 ring-offset-1 ring-gray-400" : ""].join(" ")}
                    style={{ backgroundColor: TAG_COLORS[color].bg, border: `1.5px solid ${TAG_COLORS[color].text}` }}
                    aria-label={color}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newName.trim() || creating}
                className="flex items-center gap-0.5 text-xs text-brand-600 font-medium disabled:opacity-40 hover:text-brand-700 transition-colors duration-fast"
              >
                <Plus className="w-3.5 h-3.5" />
                {t("addTag")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagSelector;
