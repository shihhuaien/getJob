/**
 * 分類與工具的展示用對應表（樣式 / i18n key / 連結目的地）。
 */
import type { ArticleCategory, ArticleCtaTool } from "./types";

/** Blog namespace 內的分類 i18n key */
export const CATEGORY_LABEL_KEY: Record<ArticleCategory, string> = {
  resume: "categoryResume",
  interview: "categoryInterview",
  "job-search": "categoryJobSearch",
  career: "categoryCareer",
};

/** 分類在卡片上呈現的 badge 顏色（呼應 dashboard 的 stats 配色） */
export const CATEGORY_BADGE_CLASS: Record<ArticleCategory, string> = {
  resume: "bg-brand-50 text-brand-700",
  interview:
    "bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]",
  "job-search":
    "bg-[color:var(--color-secondary)]/15 text-[color:var(--color-secondary)]",
  career:
    "bg-[color:var(--color-success)]/15 text-[color:var(--color-success)]",
};

/** 文末 CTA 對應的工具頁面 */
export const CTA_TOOL_HREF: Record<ArticleCtaTool, string> = {
  "resume-optimizer": "/resume",
  "cover-letter": "/cover-letter",
  interview: "/interview",
  jobs: "/jobs",
};

/** 列表頁分類 tab 的展示順序（含 'all'） */
export const CATEGORY_FILTER_ORDER: Array<ArticleCategory | "all"> = [
  "all",
  "resume",
  "interview",
  "job-search",
  "career",
];
