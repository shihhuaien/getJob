import { Link } from "@/i18n/navigation";
import {
  CATEGORY_FILTER_ORDER,
  CATEGORY_LABEL_KEY,
} from "@/lib/blog/categories";
import type { ArticleCategory } from "@/lib/blog/types";

interface Props {
  /** 已翻譯好的標籤對應表（包含 'all'） */
  labels: Record<ArticleCategory | "all", string>;
  current: ArticleCategory | "all";
}

export default function CategoryTab({ labels, current }: Props) {
  return (
    <nav
      className="flex flex-wrap gap-2"
      aria-label="Blog category filter"
    >
      {CATEGORY_FILTER_ORDER.map((category) => {
        const isActive = category === current;
        const href =
          category === "all" ? "/blog" : `/blog?category=${category}`;
        return (
          <Link
            key={category}
            href={href}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-600 text-white shadow-neu"
                : "bg-white text-text-light shadow-neu hover:bg-brand-50 hover:text-brand-700",
            ].join(" ")}
            aria-current={isActive ? "page" : undefined}
          >
            {labels[category]}
          </Link>
        );
      })}
    </nav>
  );
}

/** 給呼叫端用：把 label key 對應到 i18n 結果 */
export const CATEGORY_LABEL_KEY_MAP = CATEGORY_LABEL_KEY;
