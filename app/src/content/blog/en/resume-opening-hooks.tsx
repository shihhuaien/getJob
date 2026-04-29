import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-opening-hooks",
  title: "Three Resume Openings That Get Read",
  description:
    "Recruiters spend 6 to 8 seconds on a resume. These three opening structures grab attention without flowery language.",
  category: "resume",
  personaTags: ["no-resume", "applied-without-interview", "evergreen"],
  publishedAt: "2026-04-15",
  updatedAt: "2026-04-15",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Use the AI resume optimizer to check your opening",
  featured: true,
};

export default function Article() {
  return (
    <>
      <p>
        The English translation for this article is being prepared. In the
        meantime, the Traditional Chinese version is available—switch the
        site language from the top-right menu.
      </p>
      <p>
        <strong>What this article covers:</strong>
      </p>
      <ul>
        <li>Why the first 6 seconds of a resume matter the most</li>
        <li>Opening structure 1: lead with a quantified achievement</li>
        <li>Opening structure 2: align with the JD&apos;s top keywords + your evidence</li>
        <li>Opening structure 3: start with strong action verbs</li>
        <li>Three common mistakes to avoid</li>
      </ul>
    </>
  );
}
