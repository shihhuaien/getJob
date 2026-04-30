import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "linkedin-profile-optimization",
  title: "The Three-Layer LinkedIn Profile: Searched, Opened, Contacted",
  description:
    "Recruiters move from search to click to read. Each layer has different optimization priorities—miss one and you stay invisible.",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-19",
  updatedAt: "2026-04-19",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Save interesting roles to your tracking board",
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
        <li>Layer 1 (be searchable): Headline structure + curated Skills</li>
        <li>Layer 2 (be clicked): photo, banner, and the first line of About</li>
        <li>Layer 3 (be contacted): Experience bullets and the Featured section</li>
        <li>Three common LinkedIn mistakes and how to avoid them</li>
      </ul>
    </>
  );
}
