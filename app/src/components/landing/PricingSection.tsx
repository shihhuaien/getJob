"use client";

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

export default function PricingSection() {
  const t = useTranslations("landing");

  const plans = [
    {
      nameKey: "freePlan" as const,
      priceKey: "freePrice" as const,
      periodKey: "freePeriod" as const,
      descKey: "freeDesc" as const,
      featureKeys: freeFeatureKeys,
      ctaKey: "freeCta" as const,
      href: "/register",
      highlighted: false,
    },
    {
      nameKey: "proPlan" as const,
      priceKey: "proPrice" as const,
      periodKey: "proPeriod" as const,
      descKey: "proDesc" as const,
      featureKeys: proFeatureKeys,
      ctaKey: "proCta" as const,
      href: "/register",
      highlighted: true,
    },
  ];

  return (
    <section id="pricing" className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("pricingTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            {t("pricingSubtitle")}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 sm:max-w-2xl lg:max-w-4xl lg:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.nameKey}
              className={`rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-brand-600 text-white ring-2 ring-brand-600 shadow-xl"
                  : "bg-white text-gray-900 ring-1 ring-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-semibold ${plan.highlighted ? "text-brand-100" : "text-brand-600"}`}
              >
                {t(plan.nameKey)}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{t(plan.priceKey)}</span>
                <span
                  className={`text-sm ${plan.highlighted ? "text-brand-200" : "text-gray-500"}`}
                >
                  {t(plan.periodKey)}
                </span>
              </div>
              <p
                className={`mt-2 text-sm ${plan.highlighted ? "text-brand-200" : "text-gray-500"}`}
              >
                {t(plan.descKey)}
              </p>

              <ul className="mt-8 space-y-3">
                {plan.featureKeys.map((featureKey) => (
                  <li key={featureKey} className="flex items-start gap-3">
                    <Check
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${plan.highlighted ? "text-brand-200" : "text-brand-600"}`}
                    />
                    <span className="text-sm">{t(featureKey)}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold shadow-neu transition-all duration-150 hover:shadow-neu-hover active:shadow-neu-pressed ${
                  plan.highlighted
                    ? "bg-white text-brand-600 hover:bg-brand-50"
                    : "bg-brand-600 text-white hover:bg-brand-700"
                }`}
              >
                {t(plan.ctaKey)}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
