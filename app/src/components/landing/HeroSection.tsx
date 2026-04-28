"use client";

import Link from "next/link";
import { Link as I18nLink } from "@/i18n/navigation";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import FadeInUp from "./motion/FadeInUp";
import HeroProductMockup from "./HeroProductMockup";

export default function HeroSection() {
  const t = useTranslations("landing");

  const trustItems = [t("heroTrust1"), t("heroTrust2"), t("heroTrust3")];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-[var(--color-bg)] to-[var(--color-bg)]">
      {/* 背景裝飾 */}
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-brand-100/50 blur-3xl" />
        <div className="absolute -right-32 top-40 hidden h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl lg:block" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* 文字欄 */}
          <div className="lg:col-span-7 xl:col-span-6">
            <FadeInUp delay={0}>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand-700">
                <Sparkles className="h-4 w-4" />
                {t("heroTitle")}
              </div>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
                {t("letJobEfficiency")}
                <br />
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent bg-clip-text text-transparent">
                  {t("heroHighlight")}
                </span>
              </h1>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="mt-6 max-w-xl text-lg leading-8 text-text-light">
                {t("heroSubtitle")}
              </p>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <I18nLink
                  href="/register"
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-neu-hover active:translate-y-0 active:shadow-neu-pressed motion-reduce:transform-none"
                >
                  {/* shimmer */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full motion-reduce:hidden"
                  />
                  <span className="relative">{t("heroCta")}</span>
                  <ArrowRight className="relative h-5 w-5 transition-transform duration-base group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </I18nLink>

                <Link
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-100/80 bg-white px-6 py-3.5 text-base font-semibold text-text shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-neu-hover active:translate-y-0 active:shadow-neu-pressed motion-reduce:transform-none"
                >
                  {t("heroSecondary")}
                </Link>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <div className="mt-6 flex flex-col gap-2 text-sm text-text-light sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">
                {trustItems.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-brand-600" />
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-text-light/80">{t("heroNote")}</p>
            </FadeInUp>
          </div>

          {/* 視覺欄 */}
          <div className="lg:col-span-5 xl:col-span-6">
            <div className="flex justify-center lg:justify-end">
              <HeroProductMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
