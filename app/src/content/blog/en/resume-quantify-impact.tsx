import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-quantify-impact",
  title: "How to Quantify Impact When Your Job Has No KPIs",
  description:
    "You don't need to be in sales to quantify achievements. A three-layer formula that works for ops, support, design, and engineering.",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-22",
  updatedAt: "2026-04-22",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Use the AI optimizer to apply the quantification framework",
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
        <li>The three-layer formula: strong verb + scale + result</li>
        <li>How to quantify when there&apos;s no revenue or KPI to point to</li>
        <li>Worked examples for admin, customer service, and UI design roles</li>
        <li>Three common mistakes when quantifying achievements</li>
      </ul>
    </>
  );
}
