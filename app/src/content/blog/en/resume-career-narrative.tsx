import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-career-narrative",
  title: "Your Resume Tells a Story—Do You Know What It's Saying?",
  description:
    "A senior coach's view: a resume is a sequence of facts that readers turn into a narrative. If you don't shape it, HR will—and not in your favor.",
  category: "resume",
  personaTags: ["evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Use the AI optimizer to reframe your career narrative",
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
        <li>Three accidental narratives that hurt you: directionless, plateaued, passive</li>
        <li>Three intentional archetypes to choose from: T-shaped expert, scope-expanding integrator, problem terminator</li>
        <li>The 60-second test: show your resume to three strangers and ask what story they read</li>
        <li>Why narrative is a choice you make about which facts to emphasize</li>
      </ul>
    </>
  );
}
