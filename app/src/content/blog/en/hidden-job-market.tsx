import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "hidden-job-market",
  title: "80% of Opportunities Aren't on Job Boards—Entering the Hidden Market",
  description:
    "A senior coach's view: most quality jobs are filled before being posted. Three paths into the hidden market that most candidates miss.",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Track target companies as you tap the hidden market",
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
        <li>Why 60-80% of quality roles are filled before posting</li>
        <li>Path 1: weak ties (Granovetter&apos;s research) outperform strong ones for job leads</li>
        <li>Path 2: building long-term relationships with industry recruiters</li>
        <li>Path 3: getting pulled in via personal brand (LinkedIn, talks, writing)</li>
        <li>The 40/30/20/10 time allocation that returns 3-5x vs all-applications</li>
      </ul>
    </>
  );
}
