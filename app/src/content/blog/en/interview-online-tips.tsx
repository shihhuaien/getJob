import type { ArticleMeta } from "@/lib/blog/types";

export const meta: ArticleMeta = {
  slug: "interview-online-tips",
  title: "Three Underrated Things That Make Video Interviews Harder",
  description:
    "Eye contact, audio, and silence—these three small things are amplified on video. Fix them and your scores jump.",
  category: "interview",
  personaTags: ["has-interview", "evergreen"],
  publishedAt: "2026-04-21",
  updatedAt: "2026-04-21",
  readingMinutes: 4,
  author: "Offery Team",
  ctaTool: "interview",
  ctaText: "Practice on-camera presence with an AI mock interview",
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
        <li>Eye contact: position the video window directly under your camera</li>
        <li>Audio: a basic wired headset beats most laptop mics</li>
        <li>Silence: narrate your pauses so they don&apos;t get misread</li>
        <li>Three hidden advantages of video interviews you can use</li>
      </ul>
    </>
  );
}
