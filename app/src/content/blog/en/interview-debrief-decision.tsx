import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-debrief-decision",
  title: "What Happens in the Debrief Room—Three Keywords That Decide Your Fate",
  description:
    "From the interviewer's chair: 30 minutes after you leave, three interviewers gather to decide your fate. The real flow of a debrief and the three keywords that come up again and again.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 6,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "AI mocks identify the points that&apos;ll bite you in debrief",
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
        <li>The four phases of a typical 60-minute debrief</li>
        <li>Why the first-round &ldquo;gut call&rdquo; usually becomes the final decision</li>
        <li>Keyword 1: &ldquo;Can they ramp up?&rdquo;—evidence we look for</li>
        <li>Keyword 2: &ldquo;Will they bring poison?&rdquo;—signals that kill an offer</li>
        <li>Keyword 3: &ldquo;How long will they stay?&rdquo;—how to defuse the concern</li>
        <li>Three signals that can flip a leaning-no debrief into hire</li>
      </ul>
    </>
  );
}
