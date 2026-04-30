import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-career-gap",
  title: "How to Address Career Gaps on Your Resume—Honestly",
  description:
    "Career breaks, study, caregiving, failed startups—everyone has gaps. Owning them with a clear narrative beats hiding them every time.",
  category: "resume",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-20",
  updatedAt: "2026-04-20",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Use the AI optimizer to add narrative to gap periods",
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
        <li>Why hidden gaps hurt more than honest ones</li>
        <li>How to frame a self-directed career break</li>
        <li>How to frame study or upskilling time with concrete output</li>
        <li>How to frame caregiving leave without minimizing it</li>
        <li>A 60-second answer template for the interview question</li>
      </ul>
    </>
  );
}
