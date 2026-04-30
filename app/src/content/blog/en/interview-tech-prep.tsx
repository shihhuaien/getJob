import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-tech-prep",
  title: "A Two-Week Technical Interview Prep Rhythm",
  description:
    "Two weeks is enough to prep for a technical interview—if you have a rhythm. A daily plan from fundamentals to mock.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-23",
  updatedAt: "2026-04-23",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Run an AI mock interview to find your weak spots",
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
        <li>Week 1: rebuild fundamentals, two hours per day</li>
        <li>The six common Taiwan interview patterns to drill</li>
        <li>Week 2: realistic problems, mock interviews, behavioral prep</li>
        <li>Three habits that wreck a good prep plan</li>
      </ul>
    </>
  );
}
