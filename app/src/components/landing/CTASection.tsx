"use client";

import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CTASection() {
  const t = useTranslations("landing");

  return (
    <section className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand-600 px-6 py-16 text-center sm:px-12 lg:px-20">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            {t("ctaSubtitle")}
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-brand-600 shadow-neu transition-all duration-150 hover:bg-brand-50 hover:shadow-neu-hover active:shadow-neu-pressed"
          >
            {t("heroCta")}
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
