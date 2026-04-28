"use client";

import { useTranslations } from "next-intl";
import { m, useReducedMotion } from "motion/react";
import { Sparkles, TrendingUp } from "lucide-react";

// Hero 產品視覺占位（純 CSS 渲染的 Kanban 骨架）
// 用戶之後可將真實截圖放到 public/landing/hero-kanban.webp，
// 並把這個元件改寫成 next/image 引用。
//
// 推薦截圖規格：1600 × 1000 px、webp、亮色系背景以呼應暖燕麥白底。

type ColumnDef = {
  labelKey: "saved" | "applied" | "interview";
  // 使用品牌色 token，禁止硬編碼色票
  dotClass: string;
  pillClass: string;
  cards: Array<{
    avatarClass: string; // 公司 logo 圓點顏色
    titleWidth: string;
    metaWidth: string;
  }>;
};

const columns: ColumnDef[] = [
  {
    labelKey: "saved",
    dotClass: "bg-text-light/40",
    pillClass: "bg-[#F3F0ED] text-text-light",
    cards: [
      { avatarClass: "bg-gradient-to-br from-sky-400 to-sky-600", titleWidth: "w-3/4", metaWidth: "w-1/2" },
      { avatarClass: "bg-gradient-to-br from-amber-400 to-amber-600", titleWidth: "w-2/3", metaWidth: "w-2/5" },
    ],
  },
  {
    labelKey: "applied",
    dotClass: "bg-brand-500",
    pillClass: "bg-brand-100 text-brand-700",
    cards: [
      { avatarClass: "bg-gradient-to-br from-rose-400 to-rose-600", titleWidth: "w-4/5", metaWidth: "w-1/2" },
      { avatarClass: "bg-gradient-to-br from-violet-400 to-violet-600", titleWidth: "w-3/5", metaWidth: "w-2/5" },
      { avatarClass: "bg-gradient-to-br from-brand-400 to-brand-600", titleWidth: "w-2/3", metaWidth: "w-1/3" },
    ],
  },
  {
    labelKey: "interview",
    dotClass: "bg-warning",
    pillClass: "bg-[#FDF3E3] text-[#C48B2C]",
    cards: [
      { avatarClass: "bg-gradient-to-br from-emerald-400 to-emerald-600", titleWidth: "w-3/4", metaWidth: "w-2/5" },
    ],
  },
];

export default function HeroProductMockup() {
  const tJobs = useTranslations("jobs");
  const reduce = useReducedMotion();

  return (
    <div className="relative isolate w-full max-w-[640px]">
      {/* 後方光暈 */}
      <div
        aria-hidden
        className="absolute -inset-x-8 -inset-y-12 -z-10 rounded-[40px] bg-gradient-to-tr from-brand-100/60 via-brand-50/40 to-accent/10 blur-2xl"
      />

      {/* 主視覺：瀏覽器框 + Kanban */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 30, scale: 0.96 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        whileHover={reduce ? undefined : { y: -4 }}
        className="overflow-hidden rounded-2xl bg-white shadow-neu-hover ring-1 ring-brand-100/60"
        style={{
          transformPerspective: 1200,
        }}
      >
        {/* 視窗 chrome */}
        <div className="flex items-center justify-between border-b border-brand-100/50 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
          </div>
          <div className="hidden items-center gap-1.5 rounded-md bg-brand-50 px-3 py-1 text-[11px] text-text-light sm:flex">
            <span className="font-mono">offery.app/jobs</span>
          </div>
          <span className="h-2 w-8 rounded-full bg-brand-100/70" />
        </div>

        {/* Kanban 內容 */}
        <div className="grid grid-cols-3 gap-2.5 bg-[var(--color-bg)] p-3 sm:gap-4 sm:p-5">
          {columns.map((column, colIdx) => (
            <div key={column.labelKey} className="flex flex-col gap-2.5">
              {/* 欄位標題 */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs ${column.pillClass}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${column.dotClass}`} />
                  {tJobs(column.labelKey)}
                </span>
                <span className="text-[10px] tabular-nums text-text-light/60">
                  {column.cards.length}
                </span>
              </div>

              {/* 職缺卡片 */}
              <div className="flex flex-col gap-2">
                {column.cards.map((card, cardIdx) => (
                  <m.div
                    key={cardIdx}
                    initial={reduce ? false : { opacity: 0, y: 12 }}
                    animate={reduce ? undefined : { opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.45,
                      delay: 0.5 + colIdx * 0.1 + cardIdx * 0.06,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    className="rounded-lg bg-white p-2.5 shadow-neu sm:p-3"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`h-6 w-6 flex-shrink-0 rounded-md ${card.avatarClass}`} />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <div className={`h-2 rounded-full bg-text/15 ${card.titleWidth}`} />
                        <div className={`h-1.5 rounded-full bg-text/8 ${card.metaWidth}`} />
                      </div>
                    </div>
                  </m.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </m.div>

      {/* 浮動卡片：AI 優化提示 */}
      <m.div
        initial={reduce ? false : { opacity: 0, x: -20, y: 10 }}
        animate={reduce ? undefined : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 1.0 }}
        className="absolute -left-3 bottom-6 hidden rounded-xl bg-white px-3.5 py-2.5 shadow-neu-hover ring-1 ring-brand-100/70 sm:flex sm:items-center sm:gap-2.5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-text">ATS Score</span>
          <span className="text-[10px] text-text-light">+24 pts after AI</span>
        </div>
      </m.div>

      {/* 浮動卡片：成長軌跡 */}
      <m.div
        initial={reduce ? false : { opacity: 0, x: 20, y: -10 }}
        animate={reduce ? undefined : { opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1], delay: 1.2 }}
        className="absolute -right-3 -top-4 hidden rounded-xl bg-white px-3.5 py-2.5 shadow-neu-hover ring-1 ring-brand-100/70 sm:flex sm:items-center sm:gap-2.5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold text-text">Interview Score</span>
          <span className="text-[10px] text-text-light">8.2 / 10</span>
        </div>
      </m.div>
    </div>
  );
}
