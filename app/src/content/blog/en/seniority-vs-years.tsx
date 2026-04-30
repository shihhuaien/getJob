import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "seniority-vs-years",
  title: "Seniority vs Years on the Job—Why 8 Years Often Looks Like 5",
  description:
    "From the interviewer's chair: \"I have 10 years of experience\" doesn't move me. Seniority signals are concrete, and years is just the surface. Here's what we actually evaluate.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Plan a next role that demonstrates seniority signals",
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
        <li>Signal 1: complexity ceiling—the most complex decision you&apos;ve made</li>
        <li>Signal 2: do you frame problems, or just solve given ones?</li>
        <li>Signal 3: precise self-assessment across four levels (lead / do / know / unaware)</li>
        <li>Signal 4: can you mentor others?</li>
        <li>The pattern of 5-year &ldquo;senior&rdquo; that beats common 8-year resumes</li>
        <li>Five flags that mean your 8 years look like 4 to interviewers</li>
      </ul>
    </>
  );
}
