import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.app";

const publicRoutes = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/login", priority: 0.5, changeFrequency: "yearly" as const },
  { path: "/register", priority: 0.6, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return publicRoutes.flatMap((route) =>
    routing.locales.map((locale) => {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      const trimmed = route.path === "/" ? "" : route.path;
      return {
        url: `${SITE_URL}${prefix}${trimmed || (prefix ? "" : "/")}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      };
    }),
  );
}
