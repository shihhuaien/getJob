import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "first-job-search-playbook",
  title: "Don't Know Where to Start? A Five-Move Job Search Opening",
  description:
    "Job-search paralysis is rarely about effort—it's about rhythm. These five moves give you a daily routine from day one.",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-10",
  updatedAt: "2026-04-10",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Add roles you're interested in to your tracking board",
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
        <li>Move 1: write down what you don&apos;t want first</li>
        <li>Move 2: use three discovery channels in parallel (job boards, referrals, cold outreach)</li>
        <li>Move 3: set action-based daily goals you can actually control</li>
        <li>Move 4: track every single application</li>
        <li>Move 5: ship a 80% resume now, iterate on real responses</li>
      </ul>
    </>
  );
}
