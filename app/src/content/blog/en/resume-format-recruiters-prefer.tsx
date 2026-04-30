import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-format-recruiters-prefer",
  title: "PDF, Word, Web Page, LinkedIn—Which Do Interviewers Actually Open?",
  description:
    "From the interviewer's chair: you sent three formats; we open one. The real reading order, devices, and the format choices that quietly help or hurt you.",
  category: "resume",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "AI helps you nail the PDF format interviewers actually open",
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
        <li>HR first-pass: 80% PDF on mobile, almost nobody clicks LinkedIn links</li>
        <li>Hiring manager review: 90% PDF on desktop, prints / pastes into deck</li>
        <li>The pre-interview 5 minutes: when LinkedIn becomes the last impression</li>
        <li>Four formatting disasters that quietly disqualify you</li>
        <li>The truth about LinkedIn: where its value actually lies</li>
      </ul>
    </>
  );
}
