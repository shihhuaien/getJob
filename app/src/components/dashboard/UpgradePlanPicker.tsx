"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import UpgradeButton from "./UpgradeButton";

type Period = "monthly" | "yearly";

export default function UpgradePlanPicker() {
  const t = useTranslations("landing");
  const ts = useTranslations("settings");
  const [period, setPeriod] = useState<Period>("monthly");

  const priceKey = period === "yearly" ? "proPriceYearly" : "proPriceMonthly";
  const periodKey =
    period === "yearly" ? "proPeriodYearly" : "proPeriodMonthly";
  const approxKey =
    period === "yearly" ? "proApproxYearly" : "proApproxMonthly";
  const approx = t(approxKey);
  const disclaimer = t("pricingDisclaimer");

  return (
    <div className="rounded-xl bg-brand-50 p-5 shadow-neu-inset">
      {/* 月/年 toggle */}
      <div className="flex justify-center">
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
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
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
            className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              period === "yearly"
                ? "bg-brand-600 text-white shadow-neu"
                : "text-text-light hover:text-text"
            }`}
          >
            {t("billingToggleYearly")}
            <span className="ml-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-white">
              {t("savePercentBadge")}
            </span>
          </button>
        </div>
      </div>

      {/* 動態價格 */}
      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-text">{t(priceKey)}</span>
          <span className="text-sm text-text-light">{t(periodKey)}</span>
        </div>
        {approx && <p className="mt-1 text-xs text-text-light">{approx}</p>}
        {period === "yearly" && (
          <p className="mt-1 text-xs text-text-light">
            {t("proYearlyEquivalent")}
          </p>
        )}
      </div>

      {/* 升級按鈕（依 toggle 傳對應 plan） */}
      <div className="mt-5 flex justify-center">
        <UpgradeButton plan={period} label={ts("upgradePro")} />
      </div>

      {disclaimer && (
        <p className="mt-4 text-center text-[10px] leading-relaxed text-text-light">
          {disclaimer}
        </p>
      )}
    </div>
  );
}
