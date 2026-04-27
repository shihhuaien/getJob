import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.thdg.site";

const PROTECTED_PATHS = [
  "/dashboard",
  "/jobs",
  "/resume",
  "/cover-letter",
  "/settings",
  "/analytics",
  "/interview",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          ...PROTECTED_PATHS,
          ...PROTECTED_PATHS.map((p) => `/en${p}`),
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
