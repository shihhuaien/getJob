import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-sounding-rehearsed",
  title: "Your Answer Was Too Polished—Why Interviewers Suspect You're Reading a Script",
  description:
    "From the interviewer's chair: too-perfect answers backfire. How we detect rehearsal vs real experience, and how to sound prepared yet authentic.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "AI mocks help you avoid &ldquo;rehearsed&rdquo; flatness",
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
        <li>Three telltale signs of a rehearsed answer (no thinking pause, too-precise vocabulary, collapses on follow-up)</li>
        <li>The right way to prepare: stories, not answers</li>
        <li>Why &ldquo;imperfect details&rdquo; signal authenticity</li>
        <li>Pause and reframe—small actions that buy huge credibility</li>
        <li>Three fake-authenticity tricks that backfire</li>
      </ul>
    </>
  );
}
