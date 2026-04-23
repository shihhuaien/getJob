"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface Props {
  label: string;
  content: string;
}

// 輕量情境提示：hover / focus 時顯示說明
// 不引入額外 tooltip library，以 CSS 顯示即可
export default function InfoTooltip({ label, content }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center align-middle">
      <button
        type="button"
        aria-label={label}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full text-text-placeholder hover:text-text-light focus:outline-none focus:text-text-light"
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-lg bg-text px-3 py-2 text-xs leading-relaxed text-white shadow-neu"
        >
          {content}
        </span>
      )}
    </span>
  );
}
