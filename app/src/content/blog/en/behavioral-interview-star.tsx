import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "behavioral-interview-star",
  title: "Behavioral Interviews Aren't Conversations: Three STAR Examples",
  description:
    "\"Tell me about a time you handled conflict\" is a make-or-break question. The STAR framework keeps your answer structured and impactful.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-08",
  updatedAt: "2026-04-08",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Run a mock behavioral interview with AI",
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
        <li>Why behavioral questions ask for past examples (not opinions)</li>
        <li>The STAR framework: Situation, Task, Action, Result</li>
        <li>Time allocation: spend most of it on Action</li>
        <li>Worked example 1: handling cross-team conflict</li>
        <li>Worked example 2: discussing a failure with reflection</li>
        <li>Worked example 3: mentoring without being a manager</li>
      </ul>
    </>
  );
}
