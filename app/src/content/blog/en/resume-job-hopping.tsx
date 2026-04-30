import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-job-hopping",
  title: "Four Jobs in Three Years—How to Explain the \"Why\" on Your Resume",
  description:
    "Job hopping is no longer taboo, but every transition gets stitched into a story. Three honest, defensible versions for the most common reasons.",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Reframe each transition with help from AI",
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
        <li>Reframing &ldquo;didn&apos;t click with the manager&rdquo; without sounding personal</li>
        <li>Making &ldquo;wanted to learn something new&rdquo; specific instead of vague</li>
        <li>Owning &ldquo;the company had problems&rdquo; with reflection, not blame</li>
        <li>Stitching multiple transitions into one coherent main narrative</li>
        <li>The patterns that no narrative can rescue—and what to do then</li>
      </ul>
    </>
  );
}
