"use client";

import Link from "next/link";
import { Link as I18nLink } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-[var(--color-bg)] to-[var(--color-bg)]">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100/50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <div className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles className="h-4 w-4" />
            {t("heroTitle")}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            {t("letJobEfficiency")}
            <br />
            <span className="text-brand-600">{t("heroHighlight")}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            {t("heroSubtitle")}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <I18nLink
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors"
            >
              {t("heroCta")}
              <ArrowRight className="h-5 w-5" />
            </I18nLink>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              {t("heroSecondary")}
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            {t("heroNote")}
          </p>
        </div>
      </div>
    </section>
  );
}
