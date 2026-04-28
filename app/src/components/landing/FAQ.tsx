"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import FadeInUp from "./motion/FadeInUp";
import { FAQ_KEYS } from "./faqKeys";

export default function FAQ() {
  const t = useTranslations("landing");

  return (
    <section className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("faqTitle")}
          </h2>
          <p className="mx-auto mt-4 text-lg text-text-light">
            {t("faqSubtitle")}
          </p>
        </FadeInUp>

        <FadeInUp className="mt-12 space-y-3" delay={0.1}>
          {FAQ_KEYS.map((item) => (
            <details
              key={item.qKey}
              className="group rounded-2xl bg-white shadow-neu ring-1 ring-brand-100/40 transition-shadow duration-base hover:shadow-neu-hover open:shadow-neu-hover"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-text marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                <span className="text-base">{t(item.qKey)}</span>
                <ChevronDown
                  className="h-5 w-5 flex-shrink-0 text-brand-600 transition-transform duration-base ease-out-quart group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden
                />
              </summary>
              <div className="px-5 pb-5 pt-1">
                <p className="text-sm leading-7 text-text-light">
                  {t(item.aKey)}
                </p>
              </div>
            </details>
          ))}
        </FadeInUp>
      </div>
    </section>
  );
}
