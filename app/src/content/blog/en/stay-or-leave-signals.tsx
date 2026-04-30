import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "stay-or-leave-signals",
  title: "Stay or Leave? Three Signals That Tell You How Much Longer to Invest",
  description:
    "A senior coach's view: \"unhappy\" isn't a good reason to leave, and \"not growing\" is too vague. Three concrete signals about whether the company is still investing in you.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Build an external pipeline to keep your options open",
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
        <li>Signal 1: are the tasks you&apos;re given expanding or shrinking in scope?</li>
        <li>Signal 2: will the skills you&apos;re building still have market value in three years?</li>
        <li>Signal 3: are you still learning from your manager?</li>
        <li>The decision matrix: combining the three signals into a stay/leave call</li>
        <li>Why &ldquo;keeping market awareness&rdquo; while still happy is the cheapest career insurance</li>
      </ul>
    </>
  );
}
