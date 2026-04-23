"use client";

import { useTranslations } from "next-intl";

export default function CelebrationOverlay() {
  const t = useTranslations("interview");

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-[color:var(--color-bg)]/95 backdrop-blur-sm stagger-item"
    >
      <svg
        width={96}
        height={96}
        viewBox="0 0 96 96"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx={48}
          cy={48}
          r={44}
          fill="var(--color-primary-50)"
          stroke="var(--color-primary)"
          strokeWidth={2}
        />
        <path
          d="M30 50 L44 62 L66 36"
          stroke="var(--color-primary)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="celebration-check-path"
        />
      </svg>
      <div className="text-center">
        <p className="text-xl font-semibold text-text">
          {t("celebrationTitle")}
        </p>
        <p className="mt-1 text-sm text-text-light">
          {t("celebrationSubtitle")}
        </p>
      </div>
    </div>
  );
}
