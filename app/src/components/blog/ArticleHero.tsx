import { Clock, Calendar, User } from "lucide-react";
import { CATEGORY_BADGE_CLASS } from "@/lib/blog/categories";
import type { Article } from "@/lib/blog/types";

interface Props {
  article: Article;
  categoryLabel: string;
  readingMinutesText: string;
  updatedDateText: string;
}

export default function ArticleHero({
  article,
  categoryLabel,
  readingMinutesText,
  updatedDateText,
}: Props) {
  return (
    <header className="mx-auto max-w-[720px]">
      <span
        className={[
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
          CATEGORY_BADGE_CLASS[article.category],
        ].join(" ")}
      >
        {categoryLabel}
      </span>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {article.title}
      </h1>

      <p className="mt-3 text-base leading-7 text-text-light">
        {article.description}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-placeholder">
        <span className="inline-flex items-center gap-1.5">
          <User className="h-4 w-4" aria-hidden="true" />
          {article.author}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-4 w-4" aria-hidden="true" />
          {updatedDateText}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {readingMinutesText}
        </span>
      </div>
    </header>
  );
}
