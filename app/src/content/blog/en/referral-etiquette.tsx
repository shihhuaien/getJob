import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "referral-etiquette",
  title: "Asking for Referrals the Right Way: Build Relationship First",
  description:
    "Referrals can boost your callback rate 10x—but asking too early burns the relationship. A three-step etiquette guide.",
  category: "job-search",
  personaTags: ["no-job", "evergreen"],
  publishedAt: "2026-04-16",
  updatedAt: "2026-04-16",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "jobs",
  ctaText: "Track the roles you want referrals for in one place",
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
        <li>Step 1: ask for an informational chat first, not a referral</li>
        <li>Step 2: three categories of questions that lead to a natural offer</li>
        <li>Step 3: make it easy for them once they say yes</li>
        <li>Three landmines that destroy a referral relationship</li>
      </ul>
    </>
  );
}
