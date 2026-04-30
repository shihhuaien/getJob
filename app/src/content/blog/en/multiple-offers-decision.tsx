import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "multiple-offers-decision",
  title: "Choosing Between Offers: A Three-Dimension Weighted Framework",
  description:
    "\"Higher pay vs better fit\" is a false binary. Score offers on salary, growth, and culture with weights you set—then decide.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-14",
  updatedAt: "2026-04-14",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Compare your offers side-by-side on the tracking board",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        The English translation for this article is being prepared. The
        Traditional Chinese version is available now—switch the site
        language from the top-right menu.
      </p>
      <p>
        <strong>What this article covers:</strong>
      </p>
      <ul>
        <li>Dimension 1: total package, not just monthly base</li>
        <li>Dimension 2: growth—learning curve, resume value, career path</li>
        <li>Dimension 3: culture, judged by interview-process signals</li>
        <li>The weighting table: turn vague feelings into a defensible score</li>
        <li>Three decision traps to watch for</li>
      </ul>
    </>
  );
}
