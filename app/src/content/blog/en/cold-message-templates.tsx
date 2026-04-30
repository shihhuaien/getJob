import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "cold-message-templates",
  title: "Three Cold Message Openers That People Actually Reply To",
  description:
    "A 100-word cold message can win a 30-minute coffee chat—but only if you respect their time and make it easy to say no.",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-17",
  updatedAt: "2026-04-17",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Save target companies to track your cold outreach",
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
        <li>Template 1: alumni connection (highest reply rate)</li>
        <li>Template 2: warm intro through a mutual friend</li>
        <li>Template 3: completely cold—earn attention with specifics</li>
        <li>Three things you should never do in a cold message</li>
        <li>What to do when they actually reply</li>
      </ul>
    </>
  );
}
