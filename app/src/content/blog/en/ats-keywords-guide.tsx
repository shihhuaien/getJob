import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "ats-keywords-guide",
  title: "Three Steps to Naturally Weave ATS Keywords Into Your Resume",
  description:
    "Your resume may be filtered by an ATS before any human sees it. These three steps help you pass the machine without sounding like a keyword stuffer.",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-12",
  updatedAt: "2026-04-12",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Compare your resume against the JD with AI",
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
        <li>Why ATS systems are common at scaled-up companies in Taiwan</li>
        <li>Step 1: extract hard skills, soft skills, and industry terms from the JD</li>
        <li>Step 2: weave keywords into experience bullets, not into a flat skills list</li>
        <li>Step 3: aim for 70%+ keyword coverage</li>
        <li>Common formatting mistakes that break ATS parsing</li>
      </ul>
    </>
  );
}
