import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-what-they-evaluate",
  title: "What Interviewers Are Really Evaluating—Three You Think vs Three That Decide",
  description:
    "A senior coach's view: candidates think they're judged on skills and experience. The actual decision often comes down to three subtler signals.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Practice the three hidden signals with AI mocks",
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
        <li>The three explicit criteria (relevance, skill, achievements) only get you in the room</li>
        <li>Hidden signal 1: how easy it feels to work with you</li>
        <li>Hidden signal 2: depth of self-awareness about your strengths and gaps</li>
        <li>Hidden signal 3: specificity of &ldquo;why this company&rdquo; (proves research and intention)</li>
        <li>Three preparation methods that don&apos;t move these signals at all</li>
      </ul>
    </>
  );
}
