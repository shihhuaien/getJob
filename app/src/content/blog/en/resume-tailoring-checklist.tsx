import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "resume-tailoring-checklist",
  title: "The 5-Minute Resume Tailoring Checklist",
  description:
    "Tailoring isn't rewriting—it's five precise tweaks. This checklist boosts hit rate without burning your weekend.",
  category: "resume",
  personaTags: ["applied-without-interview", "evergreen"],
  publishedAt: "2026-04-18",
  updatedAt: "2026-04-18",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "resume-optimizer",
  ctaText: "Get tailoring suggestions in seconds with AI",
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
        <li>Check 1: opening line includes the JD&apos;s top 2-3 keywords</li>
        <li>Check 2: most relevant bullets reordered to the top of each role</li>
        <li>Check 3: job titles match the JD&apos;s wording exactly</li>
        <li>Check 4: irrelevant content removed, every bullet earns its space</li>
        <li>Check 5: file name is &ldquo;YourName_Resume_Company.pdf&rdquo;</li>
      </ul>
    </>
  );
}
