import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-panel-decision-maker",
  title: "Who Holds Veto Power in an Interview Panel? Misread This and You're Done",
  description:
    "From the interviewer's chair: five interviewers don't vote equally. The real weight each role carries, and how to identify who you must impress.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "AI mocks switch personas across panel roles",
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
        <li>The typical 5-round panel and the actual weight per role</li>
        <li>HR (10-15%), Peers (15-20%), Hiring Manager (30-40%), Skip-level (20-30%), Bar Raiser (10-15%)</li>
        <li>Three quick ways to identify which interviewer you&apos;re currently with</li>
        <li>Three common weighting mistakes candidates make</li>
        <li>Where to spend 80% of your prep time</li>
      </ul>
    </>
  );
}
