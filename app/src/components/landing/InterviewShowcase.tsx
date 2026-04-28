"use client";

import { Link as I18nLink } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "motion/react";
import { ArrowRight, Sparkles, User2 } from "lucide-react";
import FadeInUp from "./motion/FadeInUp";

const bullets = [
  { titleKey: "showcaseBullet1Title", descKey: "showcaseBullet1Desc" },
  { titleKey: "showcaseBullet2Title", descKey: "showcaseBullet2Desc" },
  { titleKey: "showcaseBullet3Title", descKey: "showcaseBullet3Desc" },
  { titleKey: "showcaseBullet4Title", descKey: "showcaseBullet4Desc" },
  { titleKey: "showcaseBullet5Title", descKey: "showcaseBullet5Desc" },
] as const;

// 雷達圖固定尺寸
const RADAR_SIZE = 220;
const RADAR_CENTER = RADAR_SIZE / 2;
const RADAR_RADIUS = 80;
const AXES = [
  { key: "relevance", angleDeg: 90, labelKey: "showcaseAxisRelevance" },
  { key: "logic", angleDeg: 210, labelKey: "showcaseAxisLogic" },
  { key: "confidence", angleDeg: 330, labelKey: "showcaseAxisConfidence" },
] as const;

const latestScores = { relevance: 85, logic: 78, confidence: 72 };
const averageScores = { relevance: 70, logic: 65, confidence: 60 };

function toPoint(angleDeg: number, value: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const r = (RADAR_RADIUS * value) / 100;
  return {
    x: RADAR_CENTER + r * Math.cos(rad),
    y: RADAR_CENTER - r * Math.sin(rad),
  };
}

function polygonPoints(scores: Record<string, number>): string {
  return AXES.map((a) => {
    const p = toPoint(a.angleDeg, scores[a.key]);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(" ");
}

function ChatDemo() {
  const t = useTranslations("landing");
  const reduce = useReducedMotion();

  // 三泡進場 + 分數浮現的 delay 配置
  const seq = (i: number) => (reduce ? 0 : 0.4 + i * 0.55);

  return (
    <div className="relative rounded-2xl bg-white p-5 shadow-neu ring-1 ring-brand-100/60">
      {/* 視窗條：persona */}
      <div className="mb-4 flex items-center justify-between border-b border-brand-100/50 pb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
          <Sparkles className="h-3 w-3" />
          {t("showcaseChatPersona")}
        </span>
        <span className="font-mono text-[10px] text-text-light/60">
          AI · live
        </span>
      </div>

      {/* AI 提問 */}
      <m.div
        initial={reduce ? false : { opacity: 0, x: -16 }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, delay: seq(0), ease: [0.25, 1, 0.5, 1] }}
        className="mb-3 flex items-start gap-2"
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="rounded-2xl rounded-tl-sm bg-brand-50 px-3.5 py-2.5 text-sm text-text">
          {t("showcaseChatAi1")}
        </div>
      </m.div>

      {/* 使用者回答 */}
      <m.div
        initial={reduce ? false : { opacity: 0, x: 16 }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, delay: seq(1), ease: [0.25, 1, 0.5, 1] }}
        className="mb-3 flex items-start justify-end gap-2"
      >
        <div className="rounded-2xl rounded-tr-sm bg-text/[0.04] px-3.5 py-2.5 text-sm text-text">
          {t("showcaseChatUser")}
        </div>
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-text-light/10 text-text-light">
          <User2 className="h-3.5 w-3.5" />
        </div>
      </m.div>

      {/* AI Drill-down */}
      <m.div
        initial={reduce ? false : { opacity: 0, x: -16 }}
        whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.5, delay: seq(2), ease: [0.25, 1, 0.5, 1] }}
        className="flex items-start gap-2"
      >
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
            Drill-down
          </span>
          <div className="rounded-2xl rounded-tl-sm bg-brand-50 px-3.5 py-2.5 text-sm text-text">
            {t("showcaseChatAi2")}
          </div>
        </div>
      </m.div>

      {/* 分數浮動標籤 */}
      <m.div
        initial={reduce ? false : { opacity: 0, scale: 0.7, y: 6 }}
        whileInView={reduce ? undefined : { opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{
          duration: 0.45,
          delay: seq(3),
          ease: [0.34, 1.56, 0.64, 1],
        }}
        className="absolute -right-3 -top-3 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1 text-xs font-semibold text-white shadow-neu-hover"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {t("showcaseScoreLabel")}
      </m.div>
    </div>
  );
}

function MiniRadar() {
  const t = useTranslations("landing");
  const reduce = useReducedMotion();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-neu ring-1 ring-brand-100/60">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-text">
            <span className="h-2 w-2 rounded-full bg-brand-600" />
            {t("showcaseRadarLatest")}
          </span>
          <span className="inline-flex items-center gap-1.5 text-text-light">
            <span className="h-2 w-2 rounded-full bg-brand-200" />
            {t("showcaseRadarAverage")}
          </span>
        </div>
        <span className="text-[10px] tabular-nums text-text-light/70">
          n = 5
        </span>
      </div>

      <div className="flex justify-center">
        <svg
          width={RADAR_SIZE}
          height={RADAR_SIZE}
          viewBox={`0 0 ${RADAR_SIZE} ${RADAR_SIZE}`}
          aria-hidden
        >
          {/* 三層格線 */}
          {[0.33, 0.66, 1].map((scale) => (
            <polygon
              key={scale}
              points={AXES.map((a) => {
                const p = toPoint(a.angleDeg, scale * 100);
                return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
              }).join(" ")}
              fill="none"
              stroke="currentColor"
              className="text-brand-100"
              strokeWidth="1"
            />
          ))}

          {/* 軸線 */}
          {AXES.map((a) => {
            const end = toPoint(a.angleDeg, 100);
            return (
              <line
                key={a.key}
                x1={RADAR_CENTER}
                y1={RADAR_CENTER}
                x2={end.x}
                y2={end.y}
                stroke="currentColor"
                className="text-brand-100"
                strokeWidth="1"
              />
            );
          })}

          {/* 平均：虛線、淺色 */}
          <m.polygon
            points={polygonPoints(averageScores)}
            fill="currentColor"
            className="text-brand-200"
            fillOpacity="0.18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.7,
              delay: 0.2,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{ transformOrigin: `${RADAR_CENTER}px ${RADAR_CENTER}px` }}
          />

          {/* 最新：實心、品牌色 */}
          <m.polygon
            points={polygonPoints(latestScores)}
            fill="currentColor"
            className="text-brand-600"
            fillOpacity="0.32"
            stroke="currentColor"
            strokeWidth="2"
            initial={reduce ? false : { scale: 0, opacity: 0 }}
            whileInView={reduce ? undefined : { scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: [0.25, 1, 0.5, 1],
            }}
            style={{ transformOrigin: `${RADAR_CENTER}px ${RADAR_CENTER}px` }}
          />

          {/* 軸標籤 */}
          {AXES.map((a) => {
            const labelPoint = toPoint(a.angleDeg, 130);
            return (
              <text
                key={a.key}
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-text-light text-[10px] font-medium"
              >
                {t(a.labelKey)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function InterviewShowcase() {
  const t = useTranslations("landing");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[var(--color-bg)] via-brand-50/30 to-[var(--color-bg)] py-20 sm:py-28">
      {/* 背景裝飾 */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-accent/8 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-brand-100/40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            {t("showcaseTag")}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("showcaseTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-light">
            {t("showcaseSubtitle")}
          </p>
        </FadeInUp>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          {/* 左：bullets + CTA */}
          <FadeInUp className="lg:col-span-6" delay={0.1}>
            <ul className="space-y-5">
              {bullets.map((bullet) => (
                <li key={bullet.titleKey} className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-text">
                    {t(bullet.titleKey)}
                  </h3>
                  <p className="text-sm leading-6 text-text-light">
                    {t(bullet.descKey)}
                  </p>
                </li>
              ))}
            </ul>
            <I18nLink
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-neu-hover active:translate-y-0 active:shadow-neu-pressed motion-reduce:transform-none"
            >
              {t("showcaseCta")}
              <ArrowRight className="h-4 w-4" />
            </I18nLink>
          </FadeInUp>

          {/* 右：chat + radar */}
          <FadeInUp className="lg:col-span-6" delay={0.2}>
            <div className="flex flex-col gap-5">
              <ChatDemo />
              <MiniRadar />
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
