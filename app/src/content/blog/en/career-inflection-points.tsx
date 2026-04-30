import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "career-inflection-points",
  title: "30, 35, 40—Three Walls Every Career Hits",
  description:
    "A senior coach's view: each age bracket has a specific career wall that shows up reliably. Knowing the shape ahead of time changes how you prepare.",
  category: "career",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 7,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Plan the moves needed to clear your next wall",
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
        <li>The 30 wall: identity crisis—did I pick the wrong field, or just hit reality?</li>
        <li>The 35 wall: the &ldquo;sorting moment&rdquo; into manager track vs senior IC track</li>
        <li>The 40 wall: market value re-evaluated—what irreplaceable judgment do you offer?</li>
        <li>Why preparing five years ahead beats reacting at the wall</li>
        <li>The two viable strategies after 40: go up (Director/VP) or go out (consult/board/founder)</li>
      </ul>
    </>
  );
}
