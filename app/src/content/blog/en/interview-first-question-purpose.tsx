import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-first-question-purpose",
  title: "\"Tell Me About Yourself\"—The Hidden Purpose Behind the First Question",
  description:
    "From the interviewer's chair: the first question is not warm-up, it's evaluation. What we're listening for in those 90 seconds, and a structure that makes us lean in.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Practice your 90-second self-intro with AI",
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
        <li>Three things interviewers actually evaluate in your first 90 seconds</li>
        <li>The 30-30-30 structure: positioning hook, two strongest achievements, hand the floor back</li>
        <li>Three opening blunders that lock in a mediocre first impression</li>
        <li>Why &ldquo;reading your resume aloud&rdquo; gets you zero credit</li>
      </ul>
    </>
  );
}
