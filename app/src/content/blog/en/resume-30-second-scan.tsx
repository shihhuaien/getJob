import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-30-second-scan",
  title: "An Interviewer's 30-Second Resume Scan: The Three Spots That Matter",
  description:
    "From the interviewer's chair: 50 resumes a week, 30 seconds each. The actual scanning path—and which parts you think matter that we don't even read.",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Optimize for the 30-second battlefield with AI",
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
        <li>Seconds 1-10: title, latest title, second-latest title (in that order)</li>
        <li>Seconds 11-20: only the first two bullets of the most recent role</li>
        <li>Seconds 21-30: the bottom-to-top sweep for red flags</li>
        <li>Five things candidates over-invest in that interviewers never read</li>
        <li>The brutal truth about Yes / Maybe / No piles—and why no reply isn&apos;t always rejection</li>
      </ul>
    </>
  );
}
