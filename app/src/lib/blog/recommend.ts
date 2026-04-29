/**
 * 部落格文章個人化推薦：規則式引擎（無 ML）
 *
 * 規則優先序（命中即套用）：
 *   1. 沒履歷           → 履歷起步類
 *   2. 沒職缺           → 求職策略起步類
 *   3. 有 interview 職缺 → 面試準備類
 *   4. applied >= 5 且無面試 → 履歷優化 + 求職策略
 *   5. 預設            → featured + 最新
 *
 * 詳見 BLOG.md §6。
 */
import type {
  Article,
  RecommendationResult,
  RecommendationIntentKey,
  UserPipelineState,
} from "./types";

interface Rule {
  when: (state: UserPipelineState) => boolean;
  weight: (article: Article) => number;
  intentKey: RecommendationIntentKey;
}

const RULES: Rule[] = [
  {
    when: (s) => !s.hasResume,
    weight: (a) =>
      (a.personaTags.includes("no-resume") ? 100 : 0) +
      (a.category === "resume" ? 30 : 0),
    intentKey: "intentNoResume",
  },
  {
    when: (s) => !s.hasJob,
    weight: (a) =>
      (a.personaTags.includes("no-job") ? 100 : 0) +
      (a.category === "job-search" ? 30 : 0),
    intentKey: "intentNoJob",
  },
  {
    when: (s) => s.hasInterview,
    weight: (a) =>
      (a.personaTags.includes("has-interview") ? 100 : 0) +
      (a.category === "interview" ? 30 : 0),
    intentKey: "intentHasInterview",
  },
  {
    when: (s) => s.appliedWithoutInterview >= 5,
    weight: (a) =>
      (a.personaTags.includes("applied-without-interview") ? 100 : 0) +
      (a.category === "resume" ? 25 : 0) +
      (a.category === "job-search" ? 15 : 0),
    intentKey: "intentAppliedWithoutInterview",
  },
];

function compareDateDesc(a: Article, b: Article): number {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export function pickArticles(
  state: UserPipelineState,
  articles: Article[],
  limit = 3,
): RecommendationResult {
  const matched = RULES.find((r) => r.when(state));

  if (matched) {
    const ranked = articles
      .map((a) => ({ a, w: matched.weight(a) }))
      .filter(({ w }) => w > 0)
      .sort((x, y) => y.w - x.w || compareDateDesc(x.a, y.a))
      .slice(0, limit)
      .map(({ a }) => a);

    if (ranked.length > 0) {
      return { articles: ranked, intentKey: matched.intentKey };
    }
    // 規則命中但無對應文章 → 落回預設
  }

  // 預設：featured 優先，不足再補最新
  const featured = articles
    .filter((a) => a.featured)
    .sort(compareDateDesc)
    .slice(0, limit);

  if (featured.length >= limit) {
    return { articles: featured, intentKey: "intentDefault" };
  }

  const featuredSlugs = new Set(featured.map((a) => a.slug));
  const fillers = articles
    .filter((a) => !featuredSlugs.has(a.slug))
    .sort(compareDateDesc)
    .slice(0, limit - featured.length);

  return {
    articles: [...featured, ...fillers],
    intentKey: "intentDefault",
  };
}
