import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "promotion-stuck-paths",
  title: "Stuck on Promotion? Three Paths Forward (Up, Sideways, Out)",
  description:
    "A senior coach's view: being stuck doesn't mean leaving is the only answer. Diagnose first—organizational, capability, or timing—then pick the right path.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Build an external pipeline to keep leverage internally",
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
        <li>Three root causes of being stuck: organizational, capability, timing</li>
        <li>Path 1 (Up): direct conversation, stretch project, upward visibility</li>
        <li>Path 2 (Sideways): the underrated option of internal team transfer</li>
        <li>Path 3 (Out): targeting a level-up at a growing company</li>
        <li>Three diagnostic questions to figure out which path fits you</li>
        <li>Why having external options strengthens your internal negotiation</li>
      </ul>
    </>
  );
}
