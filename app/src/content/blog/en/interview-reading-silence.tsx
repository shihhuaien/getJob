import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-reading-silence",
  title: "When the Interviewer Goes Quiet—Reading Five Micro-Signals",
  description:
    "A senior coach's view: silence in an interview means different things. Reading five micro-signals helps you decide whether to keep talking or stop.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Practice reading interviewer reactions in AI mocks",
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
        <li>Signal 1: they&apos;re taking notes (positive—stay silent)</li>
        <li>Signal 2: they&apos;re thinking of a follow-up (very positive—wait)</li>
        <li>Signal 3: they expect more from you (lean in with the most interesting thread)</li>
        <li>Signal 4: they&apos;re unsure you answered the question (recoverable—self-check)</li>
        <li>Signal 5: they want to move on (stop immediately)</li>
        <li>Three ways to train your sensitivity to these signals</li>
      </ul>
    </>
  );
}
