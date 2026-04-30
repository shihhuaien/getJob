import type { ReactNode } from "react";

/**
 * 文章內文閱讀容器。
 * 用 Tailwind v4 的後代選擇器（[&_h2]:...）統一樣式內部 HTML 元素，
 * 讓每篇文章 TSX 只需寫純 <p>/<h2>/<ul> 即可。
 */
export default function ArticleProse({ children }: { children: ReactNode }) {
  return (
    <div
      className={[
        "mx-auto max-w-[720px]",
        "text-base text-text-light",
        "[&>*:first-child]:mt-0",
        "[&_p]:mt-4 [&_p]:leading-7",
        "[&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-text",
        "[&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-text",
        "[&_ul]:mt-3 [&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:leading-7",
        "[&_ol]:mt-3 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:leading-7",
        "[&_strong]:font-semibold [&_strong]:text-text",
        "[&_a]:text-brand-600 [&_a]:underline hover:[&_a]:text-brand-700",
        "[&_blockquote]:mt-5 [&_blockquote]:rounded-r-lg [&_blockquote]:border-l-4 [&_blockquote]:border-brand-200 [&_blockquote]:bg-brand-50/40 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_blockquote]:italic [&_blockquote]:text-text",
        "[&_table]:mt-5 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-lg [&_table]:text-sm [&_table]:shadow-neu",
        "[&_th]:bg-brand-50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-text",
        "[&_td]:border-t [&_td]:border-brand-100 [&_td]:bg-white [&_td]:px-3 [&_td]:py-2 [&_td]:text-text-light",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
