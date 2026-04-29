import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import type { ArticleCtaTool } from "@/lib/blog/types";
import { CTA_TOOL_HREF } from "@/lib/blog/categories";

interface Props {
  ctaTool: ArticleCtaTool;
  ctaText: string;
  buttonLabel: string;
}

/**
 * 文章末尾的「現在就試試對應工具」CTA 卡片。
 * 是把使用者從「閱讀」帶回「行動」的最重要轉化點。
 */
export default function ArticleCTA({ ctaTool, ctaText, buttonLabel }: Props) {
  return (
    <aside className="mx-auto mt-12 max-w-[720px]">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-neu sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50 shadow-neu-inset">
            <Sparkles className="h-5 w-5 text-brand-600" aria-hidden="true" />
          </div>
          <p className="text-sm leading-relaxed text-text">{ctaText}</p>
        </div>
        <Link
          href={CTA_TOOL_HREF[ctaTool]}
          className={[
            "group inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5",
            "text-sm font-semibold text-white shadow-neu",
            "transition-all duration-base ease-out-quart",
            "hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-neu-hover",
            "active:translate-y-0 active:scale-[0.98] active:shadow-neu-pressed",
            "motion-reduce:transform-none",
          ].join(" ")}
        >
          {buttonLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </aside>
  );
}
