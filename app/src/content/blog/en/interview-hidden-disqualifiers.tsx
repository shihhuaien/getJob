import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-hidden-disqualifiers",
  title: "Strong Interview, Still Rejected? Three Hidden Deductions Nobody Tells You",
  description:
    "From the interviewer's chair: you thought you nailed it. We rejected you in debrief—not for skill, but for three signals you won't ever be told about.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "AI catches the hidden deductions you can&apos;t see",
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
        <li>Disqualifier 1: &ldquo;no questions&rdquo; or &ldquo;wrong questions&rdquo; at the end</li>
        <li>Disqualifier 2: correct answers that are over-explained</li>
        <li>Disqualifier 3: a &ldquo;why are you leaving&rdquo; answer that triggers concern</li>
        <li>The PREP structure that fixes over-explanation</li>
        <li>Five secondary red flags that compound into rejection</li>
      </ul>
    </>
  );
}
