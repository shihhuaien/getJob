import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "salary-negotiation-basics",
  title: "Don't Say Yes Too Fast: Three Steps to Negotiating an Offer",
  description:
    "Recruiters expect you to negotiate—candidates who don't are leaving money on the table. Here's how to do it without being pushy.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-05",
  updatedAt: "2026-04-05",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Track your offers side-by-side on the board",
  featured: false,
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
        <li>Step 1: prepare three numbers before any conversation (market, current, target)</li>
        <li>Step 2: never accept on the spot—always ask for a day or two</li>
        <li>Step 3: a script that&apos;s firm but warm, with three reasons to anchor</li>
        <li>Three common psychological traps and how to avoid them</li>
        <li>What to ask for if base salary is locked</li>
      </ul>
    </>
  );
}
