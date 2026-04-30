import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-culture-fit-truth",
  title: "What \"Culture Fit\" Is Actually Filtering For—Three Hidden Truths",
  description:
    "From the interviewer's chair: \"culture fit\" sounds vague and politically loaded. In practice it filters for three concrete things—learn them and you stop guessing.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-30",
  updatedAt: "2026-04-30",
  readingMinutes: 5,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Practice culture-fit responses with AI",
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
        <li>Truth 1: culture fit = &ldquo;will I want to be in 5 meetings a week with you?&rdquo;</li>
        <li>Truth 2: culture fit = does your work rhythm match the team&apos;s</li>
        <li>Truth 3: culture fit = can you challenge us, but constructively</li>
        <li>Common debrief phrases that signal culture-fit failure</li>
        <li>Three myths about culture fit that get candidates rejected</li>
      </ul>
    </>
  );
}
