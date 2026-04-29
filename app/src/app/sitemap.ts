import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { listAllSlugs, listArticles } from "@/lib/blog/articles";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.thdg.site";

const publicRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/login", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/register", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries = publicRoutes.flatMap((route) =>
    routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      const trimmed = route.path === "/" ? "" : route.path;
      const zhUrl = `${SITE_URL}${trimmed || "/"}`;
      const enUrl = `${SITE_URL}/en${trimmed}`;
      return {
        url: `${SITE_URL}${prefix}${trimmed || (prefix ? "" : "/")}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            "zh-TW": zhUrl,
            en: enUrl,
            "x-default": zhUrl,
          },
        },
      };
    }),
  );

  // Blog 文章：每篇 slug × 每個 locale
  const slugs = listAllSlugs();
  const articleEntries = slugs.flatMap((slug) => {
    // 用 zh-TW 的 updatedAt 作為 lastModified（zh-TW 為主要語系）
    const zhArticle = listArticles("zh-TW").find((a) => a.slug === slug);
    const lastModified = zhArticle ? new Date(zhArticle.updatedAt) : now;
    const zhUrl = `${SITE_URL}/blog/${slug}`;
    const enUrl = `${SITE_URL}/en/blog/${slug}`;

    return routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      return {
        url: `${SITE_URL}${prefix}/blog/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: {
          languages: {
            "zh-TW": zhUrl,
            en: enUrl,
            "x-default": zhUrl,
          },
        },
      };
    });
  });

  return [...staticEntries, ...articleEntries];
}
