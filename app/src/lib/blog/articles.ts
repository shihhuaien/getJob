/**
 * Blog 文章資料層：集中註冊所有 zh-TW / en 文章模組。
 *
 * 採靜態 import：build time 即可驗證所有檔案存在、型別正確；
 * SSG 不需要 dynamic import，整個 registry 一次載入即可。
 */
import type { Article, ArticleLocale, ArticleMeta } from "./types";

// ─── zh-TW 文章 ───
import * as ResumeOpeningHooksZh from "@/content/blog/zh-TW/resume-opening-hooks";
import * as AtsKeywordsGuideZh from "@/content/blog/zh-TW/ats-keywords-guide";
import * as FirstJobSearchPlaybookZh from "@/content/blog/zh-TW/first-job-search-playbook";
import * as BehavioralInterviewStarZh from "@/content/blog/zh-TW/behavioral-interview-star";
import * as SalaryNegotiationBasicsZh from "@/content/blog/zh-TW/salary-negotiation-basics";

// ─── en 文章 ───
import * as ResumeOpeningHooksEn from "@/content/blog/en/resume-opening-hooks";
import * as AtsKeywordsGuideEn from "@/content/blog/en/ats-keywords-guide";
import * as FirstJobSearchPlaybookEn from "@/content/blog/en/first-job-search-playbook";
import * as BehavioralInterviewStarEn from "@/content/blog/en/behavioral-interview-star";
import * as SalaryNegotiationBasicsEn from "@/content/blog/en/salary-negotiation-basics";

interface ArticleModule {
  meta: ArticleMeta;
  default: React.ComponentType;
}

function toArticle(mod: ArticleModule, locale: ArticleLocale): Article {
  return { ...mod.meta, locale, Content: mod.default };
}

const ZH_TW_ARTICLES: Article[] = [
  toArticle(ResumeOpeningHooksZh, "zh-TW"),
  toArticle(AtsKeywordsGuideZh, "zh-TW"),
  toArticle(FirstJobSearchPlaybookZh, "zh-TW"),
  toArticle(BehavioralInterviewStarZh, "zh-TW"),
  toArticle(SalaryNegotiationBasicsZh, "zh-TW"),
];

const EN_ARTICLES: Article[] = [
  toArticle(ResumeOpeningHooksEn, "en"),
  toArticle(AtsKeywordsGuideEn, "en"),
  toArticle(FirstJobSearchPlaybookEn, "en"),
  toArticle(BehavioralInterviewStarEn, "en"),
  toArticle(SalaryNegotiationBasicsEn, "en"),
];

const ARTICLES_BY_LOCALE: Record<ArticleLocale, Article[]> = {
  "zh-TW": ZH_TW_ARTICLES,
  en: EN_ARTICLES,
};

export function listArticles(locale: ArticleLocale): Article[] {
  return ARTICLES_BY_LOCALE[locale];
}

export function getArticleBySlug(
  locale: ArticleLocale,
  slug: string,
): Article | null {
  return ARTICLES_BY_LOCALE[locale].find((a) => a.slug === slug) ?? null;
}

export function getRelatedArticles(
  locale: ArticleLocale,
  article: Article,
  limit = 3,
): Article[] {
  return ARTICLES_BY_LOCALE[locale]
    .filter(
      (a) => a.slug !== article.slug && a.category === article.category,
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, limit);
}

/** 用於 generateStaticParams：所有文章共用同一份 slug（每個 slug 都有兩個語系） */
export function listAllSlugs(): string[] {
  return Array.from(new Set(ZH_TW_ARTICLES.map((a) => a.slug)));
}
