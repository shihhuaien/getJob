import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "bridge-job-pivot",
  title: "You Can't Pivot in One Step—Use a Bridge Job",
  description:
    "A senior coach's view: trying to jump from finance to tech in one move usually fails. Bridge jobs split impossible pivots into two manageable steps.",
  category: "job-search",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Track bridge roles to map your pivot path",
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
        <li>Why HR avoids high-risk cross-domain candidates by default</li>
        <li>The bridge job formula: old industry × new function, or new industry × old function</li>
        <li>Three classic bridge paths: traditional → tech, sales → PM, accounting → operations</li>
        <li>How to find your bridge: reverse-engineer from people now in your target role</li>
        <li>Three myths that keep people from using bridges as a strategy</li>
      </ul>
    </>
  );
}
