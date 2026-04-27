"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

const freeFeatureKeys = [
  "freeFeature1",
  "freeFeature2",
  "freeFeature3",
  "freeFeature4",
  "freeFeature5",
  "freeFeature6",
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

  const proPriceKey = period === "yearly" ? "proPriceYearly" : "proPriceMonthly";
  const proPeriodKey =
    period === "yearly" ? "proPeriodYearly" : "proPeriodMonthly";
  const proApproxKey =
    period === "yearly" ? "proApproxYearly" : "proApproxMonthly";
  const proApprox = t(proApproxKey);
  const freeApprox = t("freeApprox");
  const disclaimer = t("pricingDisclaimer");

  return (
    <section id="pricing" className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("pricingTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-text-light">
            {t("pricingSubtitle")}
          </p>
        </div>

        {/* 月/年 toggle */}
        <div className="mt-8 flex justify-center">
          <div
            role="tablist"
            aria-label={t("billingToggleAria")}
            className="inline-flex rounded-full bg-white p-1 shadow-neu-inset"
          >
            <button
              type="button"
              role="tab"
              aria-selected={period === "monthly"}
              onClick={() => setPeriod("monthly")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                period === "monthly"
                  ? "bg-brand-600 text-white shadow-neu"
                  : "text-text-light hover:text-text"
              }`}
            >
              {t("billingToggleMonthly")}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={period === "yearly"}
              onClick={() => setPeriod("yearly")}
              className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                period === "yearly"
                  ? "bg-brand-600 text-white shadow-neu"
                  : "text-text-light hover:text-text"
              }`}
            >
              {t("billingToggleYearly")}
              <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">
                {t("savePercentBadge")}
              </span>
            </button>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-md grid-cols-1 gap-8 sm:max-w-2xl lg:max-w-4xl lg:grid-cols-2">
          {/* Free 卡 */}
          <div className="rounded-2xl bg-white p-8 text-text ring-1 ring-brand-100">
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
            <ul className="mt-8 space-y-3">
              {freeFeatureKeys.map((featureKey) => (
                <li key={featureKey} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-600" />
                  <span className="text-sm">{t(featureKey)}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl bg-brand-600 py-3 text-center text-sm font-semibold text-white shadow-neu transition-all duration-150 hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed"
            >
              {t("freeCta")}
            </Link>
          </div>

          {/* Pro 卡 */}
          <div className="rounded-2xl bg-brand-600 p-8 text-white shadow-xl ring-2 ring-brand-600">
            <h3 className="text-lg font-semibold text-brand-100">
              {t("proPlan")}
            </h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold">{t(proPriceKey)}</span>
              <span className="text-sm text-brand-200">{t(proPeriodKey)}</span>
            </div>
            {proApprox && (
              <p className="mt-1 text-xs text-brand-200">{proApprox}</p>
            )}
            {period === "yearly" && (
              <p className="mt-1 text-xs text-brand-200">
                {t("proYearlyEquivalent")}
              </p>
            )}
            <p className="mt-2 text-sm text-brand-200">{t("proDesc")}</p>
            <ul className="mt-8 space-y-3">
              {proFeatureKeys.map((featureKey) => (
                <li key={featureKey} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-200" />
                  <span className="text-sm">{t(featureKey)}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="mt-8 block w-full rounded-xl bg-white py-3 text-center text-sm font-semibold text-brand-600 shadow-neu transition-all duration-150 hover:bg-brand-50 hover:shadow-neu-hover active:shadow-neu-pressed"
            >
              {t("proCta")}
            </Link>
          </div>
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
