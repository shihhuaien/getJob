"use client";

import { X } from "lucide-react";
import { TAG_COLORS } from "@/lib/theme";
import type { JobTag } from "@/types/tags";

interface TagPillProps {
  tag: JobTag;
  onRemove?: () => void;
  size?: "sm" | "md";
  interactive?: boolean;
  selected?: boolean;
}

export function TagPill({ tag, onRemove, size = "md", interactive = false, selected = false }: TagPillProps) {
  const colors = TAG_COLORS[tag.color as keyof typeof TAG_COLORS] ?? TAG_COLORS.sage;

  const sizeClass = size === "sm"
    ? "text-[10px] px-1.5 py-0.5 gap-0.5"
    : "text-xs px-2 py-1 gap-1";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium shrink-0 transition-all duration-fast",
        sizeClass,
        interactive && "cursor-pointer hover:opacity-80",
        selected && "ring-2 ring-offset-1",
      ].filter(Boolean).join(" ")}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        ...(selected ? { outlineColor: colors.text } : {}),
      }}
    >
      <span className="truncate max-w-[80px]">{tag.name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="shrink-0 hover:opacity-60 transition-opacity duration-fast"
          aria-label={`移除標籤 ${tag.name}`}
        >
          <X className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
        </button>
      )}
    </span>
  );
}

export default TagPill;
