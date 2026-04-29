import { Link } from "@/i18n/navigation";
import { Clock, ArrowRight } from "lucide-react";
import type { Article } from "@/lib/blog/types";
import { CATEGORY_BADGE_CLASS } from "@/lib/blog/categories";

interface Props {
  article: Article;
  /** 已翻譯好的分類名稱（如「履歷」） */
  categoryLabel: string;
  /** 已翻譯好的閱讀時間（如「5 分鐘」） */
  readingMinutesText: string;
  /** 已翻譯好的「閱讀」CTA 文字 */
  readMoreLabel: string;
  variant?: "compact" | "featured";
}

/**
 * 文章卡片：dashboard 區塊與 /blog 列表共用。
 * - compact：dashboard widget 用，緊湊 3 欄
 * - featured：列表頁推薦置頂用，較大、resource-hero 視覺
 */
export default function ArticleCard({
  article,
  categoryLabel,
  readingMinutesText,
  readMoreLabel,
  variant = "compact",
}: Props) {
  const padding = variant === "featured" ? "p-6" : "p-5";
  const titleSize = variant === "featured" ? "text-lg" : "text-base";

  return (
    <Link
      href={`/blog/${article.slug}`}
      className={[
        "group flex h-full flex-col rounded-2xl bg-white shadow-neu",
        "transition-all duration-base ease-out-quart",
        "hover:-translate-y-0.5 hover:shadow-neu-hover",
        "motion-reduce:transform-none",
        padding,
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span
          className={[
            "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
            CATEGORY_BADGE_CLASS[article.category],
          ].join(" ")}
        >
          {categoryLabel}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-text-placeholder">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {readingMinutesText}
        </span>
      </div>

      <h3
        className={[
          "mt-3 font-semibold text-text",
          "transition-colors group-hover:text-brand-700",
          titleSize,
        ].join(" ")}
      >
        {article.title}
      </h3>

      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-light">
        {article.description}
      </p>

      <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
        {readMoreLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
