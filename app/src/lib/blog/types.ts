/**
 * Offery 求職指南（Blog Hub）型別定義
 *
 * 文章內容採 TSX 模組（與 src/content/legal/* 同模式），
 * 不引入 MDX 依賴。詳見 BLOG.md §8。
 */
import type { ComponentType } from "react";

// ─── 分類與工具標籤 ───

export type ArticleCategory =
  | "resume"
  | "interview"
  | "job-search"
  | "career";

export type ArticleCtaTool =
  | "resume-optimizer"
  | "cover-letter"
  | "interview"
  | "jobs";

/** 個人化推薦使用的情境標籤 */
export type PersonaTag =
  | "no-resume"
  | "no-job"
  | "applied-without-interview"
  | "has-interview"
  | "evergreen";

export type ArticleLocale = "zh-TW" | "en";

// ─── Article ───

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: ArticleCategory;
  personaTags: PersonaTag[];
  /** ISO date (YYYY-MM-DD) */
  publishedAt: string;
  updatedAt: string;
  /** 預估閱讀時間（分鐘）— 手動填寫，避免引入 reading-time 套件 */
  readingMinutes: number;
  author: string;
  ctaTool: ArticleCtaTool;
  ctaText: string;
  /** 是否為 evergreen 編輯精選（預設推薦會優先取 featured） */
  featured?: boolean;
}

/** 已包含對應語系內容元件的完整 Article */
export interface Article extends ArticleMeta {
  locale: ArticleLocale;
  Content: ComponentType;
}

// ─── 個人化推薦 ───

/** Dashboard 已取得的使用者 pipeline 訊號 */
export interface UserPipelineState {
  hasResume: boolean;
  hasJob: boolean;
  /** 任一職缺處於 status='interview' */
  hasInterview: boolean;
  /** status='applied' 的職缺數（用於「投出但無回應」情境判斷） */
  appliedWithoutInterview: number;
}

/** 推薦結果：文章清單 + 用於副標題的 i18n key */
export interface RecommendationResult {
  articles: Article[];
  intentKey: RecommendationIntentKey;
}

export type RecommendationIntentKey =
  | "intentNoResume"
  | "intentNoJob"
  | "intentHasInterview"
  | "intentAppliedWithoutInterview"
  | "intentDefault";
