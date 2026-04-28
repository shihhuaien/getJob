"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import FadeInUp from "./motion/FadeInUp";

const techStack = ["Gemini", "Stripe", "Supabase"] as const;

export default function TrustStrip() {
  const t = useTranslations("landing");

  return (
    <section
      aria-label="Trust signals"
      className="border-y border-brand-100/60 bg-brand-50/40 py-5 sm:py-6"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="flex flex-col items-center justify-center gap-y-3 text-center sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {/* 主要數字 */}
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-text">
                {t("trustStat")}
              </span>
            </span>

            {/* 視覺分隔（桌機才出現） */}
            <span
              aria-hidden
              className="hidden h-1 w-1 rounded-full bg-brand-200 sm:inline-block"
            />

            {/* 技術 stack */}
            <span className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-text-light">
                {t("trustTechLabel")}
              </span>
              {techStack.map((tech, i) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-3 text-xs font-semibold text-text/80"
                >
                  {tech}
                  {i < techStack.length - 1 && (
                    <span aria-hidden className="text-text-light/40">
                      ·
                    </span>
                  )}
                </span>
              ))}
            </span>

            <span
              aria-hidden
              className="hidden h-1 w-1 rounded-full bg-brand-200 sm:inline-block"
            />

            {/* Taiwan */}
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="text-base leading-none">
                🇹🇼
              </span>
              <span className="text-xs font-medium text-text">
                {t("trustBuiltIn")}
              </span>
            </span>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}
