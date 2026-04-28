"use client";

import {
  FileText,
  Kanban,
  Mail,
  Search,
  BarChart3,
  Mic,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "motion/react";
import FadeInUp from "./motion/FadeInUp";
import StaggerContainer from "./motion/StaggerContainer";
import StaggerItem from "./motion/StaggerItem";

// 小卡：標準功能
const smallCards = [
  { icon: Mail, titleKey: "feature3Title", descKey: "feature3Desc" },
  { icon: Kanban, titleKey: "feature2Title", descKey: "feature2Desc" },
  { icon: Search, titleKey: "feature4Title", descKey: "feature4Desc" },
  { icon: BarChart3, titleKey: "feature5Title", descKey: "feature5Desc" },
  { icon: Mic, titleKey: "feature6Title", descKey: "feature6Desc" },
] as const;

function AtsGauge() {
  const t = useTranslations("landing");
  const reduce = useReducedMotion();
  const beforePct = 52;
  const afterPct = 87;

  return (
    <div className="mt-6 rounded-xl bg-[var(--color-bg)] p-4 ring-1 ring-brand-100/60">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-text-light">
          {t("featuresAtsLabel")}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[11px] font-bold text-success">
          <ArrowRight className="h-3 w-3" />
          {t("featuresAtsDelta")}
        </span>
      </div>

      {/* Before bar */}
      <div className="mb-3">
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[11px] text-text-light">
            {t("featuresAtsBefore")}
          </span>
          <span className="text-sm font-bold tabular-nums text-text-light">
            {t("featuresAtsBeforeScore")}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-text/[0.06]">
          <m.div
            initial={reduce ? false : { width: 0 }}
            whileInView={reduce ? undefined : { width: `${beforePct}%` }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="h-full rounded-full bg-text-light/40"
          />
        </div>
      </div>

      {/* After bar */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <span className="text-[11px] font-medium text-brand-700">
            {t("featuresAtsAfter")}
          </span>
          <span className="text-sm font-bold tabular-nums text-brand-700">
            {t("featuresAtsAfterScore")}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-brand-100/50">
          <m.div
            initial={reduce ? false : { width: 0 }}
            whileInView={reduce ? undefined : { width: `${afterPct}%` }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: [0.25, 1, 0.5, 1],
            }}
            className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600"
          />
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  const t = useTranslations("landing");

  return (
    <section id="features" className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("featuresTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-light">
            {t("featuresSubtitle")}
          </p>
        </FadeInUp>

        <StaggerContainer
          className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-fr"
          staggerDelay={0.08}
        >
          {/* 大卡：AI 履歷建立器 + ATS gauge */}
          <StaggerItem className="group relative flex flex-col rounded-2xl bg-white p-7 shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-neu-hover motion-reduce:transform-none md:col-span-2 md:row-span-2">
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <FileText className="h-7 w-7" />
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                <Sparkles className="h-3 w-3" />
                ATS
              </span>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-text sm:text-2xl">
              {t("feature1Title")}
            </h3>
            <p className="mt-3 text-sm leading-7 text-text-light">
              {t("feature1Desc")}
            </p>
            <AtsGauge />
          </StaggerItem>

          {/* 5 張小卡 */}
          {smallCards.map((feature) => (
            <StaggerItem
              key={feature.titleKey}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-neu-hover motion-reduce:transform-none"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-text">
                {t(feature.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-light">
                {t(feature.descKey)}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
