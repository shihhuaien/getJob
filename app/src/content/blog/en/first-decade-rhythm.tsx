import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "first-decade-rhythm",
  title: "Five Years, Three Years, Two Years—The Rhythm of Your First Decade",
  description:
    "A senior coach's view: \"how long should I stay?\" doesn't have one answer. The optimal duration shifts across your first three jobs—here's why.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Plan the next 3 years of your career rhythm",
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
        <li>First job: 4-6 years for foundation (rules, depth, network, habits)</li>
        <li>Second job: 3-4 years for validation and deepening</li>
        <li>Third job: 2-3 years for showcase and intentional stretch</li>
        <li>Three common rhythm mistakes: leaving too fast, staying too long, perfectly even hops</li>
        <li>When to break the rhythm—and when not to</li>
      </ul>
    </>
  );
}
