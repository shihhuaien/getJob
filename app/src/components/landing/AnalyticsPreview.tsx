"use client";

import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "motion/react";
import { Lock, Sparkles, TrendingUp } from "lucide-react";
import FadeInUp from "./motion/FadeInUp";

const funnelStages = [
  { key: "analyticsFunnelStage1", count: 47, pct: 100, locked: false },
  { key: "analyticsFunnelStage2", count: 31, pct: 66, locked: false },
  { key: "analyticsFunnelStage3", count: 13, pct: 28, locked: true },
  { key: "analyticsFunnelStage4", count: 6, pct: 13, locked: true },
] as const;

// 12 週的相對活動量（0–1）
const timelineWeeks = [
  0.32, 0.18, 0.55, 0.28, 0.78, 0.42, 0.65, 0.22, 0.48, 0.85, 0.6, 0.95,
];

function FunnelChart() {
  const t = useTranslations("landing");
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-neu ring-1 ring-brand-100/60">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text">
          {t("analyticsFunnelTitle")}
        </h3>
        <TrendingUp className="h-4 w-4 text-brand-600" />
      </div>

      <div className="space-y-3.5">
        {funnelStages.map((stage, idx) => (
          <div key={stage.key} className="space-y-1.5">
            <div className="flex items-baseline justify-between text-xs">
              <div className="inline-flex items-center gap-1.5">
                <span className="font-medium text-text">{t(stage.key)}</span>
                {stage.locked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold text-accent">
                    <Lock className="h-2.5 w-2.5" />
                    Pro
                  </span>
                )}
              </div>
              <span className="font-bold tabular-nums text-text-light">
                {stage.count}
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-text/[0.05]">
              <m.div
                initial={reduce ? false : { width: 0 }}
                whileInView={reduce ? undefined : { width: `${stage.pct}%` }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.9,
                  delay: idx * 0.12,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className={`h-full rounded-full ${
                  stage.locked
                    ? "bg-gradient-to-r from-brand-500 to-brand-600"
                    : "bg-text-light/40"
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-lg bg-brand-50 px-3.5 py-2.5">
        <span className="text-xs text-text-light">
          {t("analyticsFunnelConversion")}
        </span>
        <span className="text-base font-bold text-brand-700">12.7%</span>
      </div>
    </div>
  );
}

function WeeklyTimeline() {
  const t = useTranslations("landing");
  const reduce = useReducedMotion();
  const max = 100;

  return (
    <div className="relative rounded-2xl bg-white p-6 shadow-neu ring-1 ring-brand-100/60">
      {/* Pro badge 角標 */}
      <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
        <Lock className="h-2.5 w-2.5" />
        {t("analyticsBadgePro")}
      </span>

      <div className="mb-1 flex items-center gap-2 pr-16">
        <h3 className="text-base font-semibold text-text">
          {t("analyticsTimelineTitle")}
        </h3>
      </div>
      <p className="mb-5 text-xs text-text-light">
        {t("analyticsTimelineSubtitle")}
      </p>

      {/* 長條圖 */}
      <div className="flex h-32 items-end gap-1.5">
        {timelineWeeks.map((value, idx) => (
          <div
            key={idx}
            className="flex flex-1 flex-col items-center justify-end"
          >
            <m.div
              initial={reduce ? false : { height: 0 }}
              whileInView={
                reduce ? undefined : { height: `${value * max}%` }
              }
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                delay: idx * 0.04,
                ease: [0.25, 1, 0.5, 1],
              }}
              className={`w-full rounded-t-md ${
                value > 0.7
                  ? "bg-gradient-to-t from-brand-600 to-brand-400"
                  : value > 0.4
                  ? "bg-brand-300"
                  : "bg-brand-200"
              }`}
            />
          </div>
        ))}
      </div>

      {/* 軸標籤 */}
      <div className="mt-2 flex justify-between text-[10px] tabular-nums text-text-light/60">
        <span>W1</span>
        <span>W12</span>
      </div>

      {/* 高峰標記 */}
      <m.div
        initial={reduce ? false : { opacity: 0, scale: 0.8 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          duration: 0.5,
          delay: 0.8,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-semibold text-success"
      >
        <Sparkles className="h-3.5 w-3.5" />
        Peak: W12
      </m.div>
    </div>
  );
}

export default function AnalyticsPreview() {
  const t = useTranslations("landing");

  return (
    <section className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("analyticsTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-light">
            {t("analyticsSubtitle")}
          </p>
        </FadeInUp>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FadeInUp delay={0.1}>
            <FunnelChart />
          </FadeInUp>
          <FadeInUp delay={0.2}>
            <WeeklyTimeline />
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
