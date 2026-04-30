import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-final-questions",
  title: "\"Any Questions for Me?\" Five Categories That Land",
  description:
    "The last 5 minutes of an interview are yours. Five question categories that gather real intel and leave a lasting impression.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-25",
  updatedAt: "2026-04-25",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Run a mock interview—including the final Q&A",
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
        <li>Category 1: the real shape of the work day-to-day</li>
        <li>Category 2: team dynamics and collaboration patterns</li>
        <li>Category 3: growth, learning, and career trajectory</li>
        <li>Category 4: culture and decision-making (in concrete scenarios)</li>
        <li>Category 5: process and the &ldquo;anything I haven&apos;t addressed?&rdquo; safety net</li>
      </ul>
    </>
  );
}
