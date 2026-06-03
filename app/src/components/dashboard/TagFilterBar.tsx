"use client";

import { Settings2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { TAG_COLORS } from "@/lib/theme";
import type { JobTag } from "@/types/tags";

interface TagFilterBarProps {
  allTags: JobTag[];
  selectedTagIds: string[];
  onToggleTag: (tagId: string) => void;
  onClearAll: () => void;
  onManage: () => void;
}

export function TagFilterBar({
  allTags,
  selectedTagIds,
  onToggleTag,
  onClearAll,
  onManage,
}: TagFilterBarProps) {
  const t = useTranslations("tags");

  if (allTags.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none">
      <span className="text-xs text-text-light shrink-0">{t("filterLabel")}：</span>

      <div className="flex items-center gap-1.5 flex-1 overflow-x-auto scrollbar-none">
        {allTags.map((tag) => {
          const selected = selectedTagIds.includes(tag.id);
          const colors = TAG_COLORS[tag.color as keyof typeof TAG_COLORS] ?? TAG_COLORS.sage;
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onToggleTag(tag.id)}
              className={[
                "inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium shrink-0 transition-all duration-fast",
                selected ? "ring-2 ring-offset-1" : "opacity-70 hover:opacity-100",
              ].join(" ")}
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                ...(selected ? { ringColor: colors.text } : {}),
              }}
            >
              {tag.name}
            </button>
          );
        })}
      </div>

      {selectedTagIds.length > 0 && (
        <button
          type="button"
          onClick={onClearAll}
          className="shrink-0 flex items-center gap-0.5 text-xs text-text-light hover:text-text transition-colors duration-fast"
        >
          <X className="w-3 h-3" />
          {t("clearFilter")}
        </button>
      )}

      <button
        type="button"
        onClick={onManage}
        className="shrink-0 text-text-light hover:text-brand-600 transition-colors duration-fast"
        aria-label={t("manageTitle")}
      >
        <Settings2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default TagFilterBar;
