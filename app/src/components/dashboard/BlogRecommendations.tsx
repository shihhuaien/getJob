import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight, BookOpen } from "lucide-react";
import ArticleCard from "@/components/blog/ArticleCard";
import { listArticles } from "@/lib/blog/articles";
import { pickArticles } from "@/lib/blog/recommend";
import { CATEGORY_LABEL_KEY } from "@/lib/blog/categories";
import type { ArticleLocale, UserPipelineState } from "@/lib/blog/types";

interface Props {
  state: UserPipelineState;
}

/**
 * Dashboard 上的「為你而選的求職指南」區塊。
 * 依使用者 pipeline 狀態挑 3 篇文章 + 切換情境化副標題。
 */
export default async function BlogRecommendations({ state }: Props) {
  const locale = (await getLocale()) as ArticleLocale;
  const t = await getTranslations({ locale, namespace: "blog" });

  const all = listArticles(locale);
  const { articles, intentKey } = pickArticles(state, all, 3);

  if (articles.length === 0) return null;

  const readMoreLabel = t("readMore");

  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-text">
            <BookOpen
              className="h-5 w-5 text-brand-600"
              aria-hidden="true"
            />
            {t("dashboardSectionTitle")}
          </h2>
          <p className="mt-1 text-sm text-text-light">{t(intentKey)}</p>
        </div>
        <Link
          href="/blog"
          className="group inline-flex flex-shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-600"
        >
          {t("viewAll")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            categoryLabel={t(CATEGORY_LABEL_KEY[article.category])}
            readingMinutesText={t("readingMinutes", {
              n: article.readingMinutes,
            })}
            readMoreLabel={readMoreLabel}
          />
        ))}
      </div>
    </section>
  );
}
