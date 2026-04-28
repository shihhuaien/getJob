"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import FadeInUp from "./motion/FadeInUp";

const freeFeatureKeys = [
  "freeFeature1",
  "freeFeature2",
  "freeFeature3",
  "freeFeature4",
  "freeFeature5",
] as const;

const proFeatureKeys = [
  "proFeature1",
  "proFeature2",
  "proFeature3",
  "proFeature4",
  "proFeature5",
  "proFeature6",
  "proFeature7",
  "proFeature8",
] as const;

type Period = "monthly" | "yearly";

export default function PricingSection() {
  const t = useTranslations("landing");
  const [period, setPeriod] = useState<Period>("monthly");
  const reduce = useReducedMotion();

  const proPriceKey = period === "yearly" ? "proPriceYearly" : "proPriceMonthly";
  const proPeriodKey =
    period === "yearly" ? "proPeriodYearly" : "proPeriodMonthly";
  const proApproxKey =
    period === "yearly" ? "proApproxYearly" : "proApproxMonthly";
  const proApprox = t(proApproxKey);
  const freeApprox = t("freeApprox");
  const disclaimer = t("pricingDisclaimer");

  return (
    <section
      id="pricing"
      className="relative bg-[var(--color-bg)] py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("pricingTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-light">
            {t("pricingSubtitle")}
          </p>
        </FadeInUp>

        {/* 月/年 segmented control，indicator 用 layoutId 滑動 */}
        <FadeInUp className="mt-8 flex justify-center" delay={0.1}>
          <div
            role="tablist"
            aria-label={t("billingToggleAria")}
            className="relative inline-flex rounded-full bg-white p-1 shadow-neu-inset"
          >
            {(["monthly", "yearly"] as const).map((p) => {
              const selected = period === p;
              return (
                <button
                  key={p}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setPeriod(p)}
                  className="relative z-10 rounded-full px-5 py-2 text-sm font-semibold transition-colors"
                >
                  {selected && !reduce && (
                    <m.span
                      layoutId="pricing-period-indicator"
                      className="absolute inset-0 -z-10 rounded-full bg-brand-600 shadow-neu"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  {selected && reduce && (
                    <span className="absolute inset-0 -z-10 rounded-full bg-brand-600 shadow-neu" />
                  )}
                  <span
                    className={
                      selected
                        ? "relative inline-flex items-center text-white"
                        : "relative inline-flex items-center text-text-light hover:text-text"
                    }
                  >
                    {t(p === "monthly" ? "billingToggleMonthly" : "billingToggleYearly")}
                    {p === "yearly" && (
                      <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                        <Sparkles className="h-2.5 w-2.5" />
                        {t("savePercentBadge")}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </FadeInUp>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 sm:max-w-2xl lg:max-w-4xl lg:grid-cols-2">
          {/* Free 卡 */}
          <FadeInUp delay={0.15}>
            <div className="flex h-full flex-col rounded-2xl bg-white p-8 text-text ring-1 ring-brand-100 transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-neu-hover motion-reduce:transform-none">
              <h3 className="text-lg font-semibold text-brand-600">
                {t("freePlan")}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t("freePrice")}</span>
                <span className="text-sm text-text-light">{t("freePeriod")}</span>
              </div>
              {freeApprox && (
                <p className="mt-1 text-xs text-text-light">{freeApprox}</p>
              )}
              <p className="mt-2 text-sm text-text-light">{t("freeDesc")}</p>
              <ul className="mt-8 flex-1 space-y-3">
                {freeFeatureKeys.map((featureKey) => (
                  <li key={featureKey} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                    <span className="text-sm">{t(featureKey)}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="mt-8 block w-full rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-neu-hover active:translate-y-0 active:shadow-neu-pressed motion-reduce:transform-none"
              >
                {t("freeCta")}
              </Link>
            </div>
          </FadeInUp>

          {/* Pro 卡：漸層邊框 */}
          <FadeInUp delay={0.25}>
            <div className="relative h-full rounded-2xl p-[1.5px] shadow-xl">
              {/* 漸層邊框背景 */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400 via-brand-600 to-accent opacity-90"
              />
              <div className="relative flex h-full flex-col rounded-[14px] bg-brand-600 p-8 text-white">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-brand-100">
                    {t("proPlan")}
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                    <Sparkles className="h-2.5 w-2.5" />
                    Pro
                  </span>
                </div>

                <div className="mt-4">
                  <AnimatePresence mode="wait" initial={false}>
                    <m.div
                      key={period}
                      initial={reduce ? false : { opacity: 0, y: 6 }}
                      animate={reduce ? undefined : { opacity: 1, y: 0 }}
                      exit={reduce ? undefined : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tabular-nums">
                          {t(proPriceKey)}
                        </span>
                        <span className="text-sm text-brand-200">
                          {t(proPeriodKey)}
                        </span>
                      </div>
                      {proApprox && (
                        <p className="mt-1 text-xs text-brand-200">{proApprox}</p>
                      )}
                      {period === "yearly" && (
                        <p className="mt-1 text-xs text-brand-200">
                          {t("proYearlyEquivalent")}
                        </p>
                      )}
                    </m.div>
                  </AnimatePresence>
                </div>

                <p className="mt-2 text-sm text-brand-200">{t("proDesc")}</p>
                <ul className="mt-8 flex-1 space-y-3">
                  {proFeatureKeys.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-200" />
                      <span className="text-sm">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-brand-600 shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-0.5 hover:bg-brand-50 hover:shadow-neu-hover active:translate-y-0 active:shadow-neu-pressed motion-reduce:transform-none"
                >
                  {t("proCta")}
                </Link>
              </div>
            </div>
          </FadeInUp>
        </div>

        {disclaimer && (
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-text-light">
            {disclaimer}
          </p>
        )}
      </div>
    </section>
  );
}
