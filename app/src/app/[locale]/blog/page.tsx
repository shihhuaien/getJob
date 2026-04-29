import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleCard from "@/components/blog/ArticleCard";
import CategoryTab from "@/components/blog/CategoryTab";
import { listArticles } from "@/lib/blog/articles";
import { CATEGORY_LABEL_KEY } from "@/lib/blog/categories";
import { routing } from "@/i18n/routing";
import type { ArticleCategory, ArticleLocale } from "@/lib/blog/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.thdg.site";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

function isLocale(value: string): value is ArticleLocale {
  return value === "zh-TW" || value === "en";
}

function isCategory(value: string | undefined): value is ArticleCategory {
  return (
    value === "resume" ||
    value === "interview" ||
    value === "job-search" ||
    value === "career"
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: "blog" });
  const localePath = locale === routing.defaultLocale ? "" : `/${locale}`;
  const canonical = `${SITE_URL}${localePath}/blog`;

  return {
    title: t("indexTitle"),
    description: t("indexDescription"),
    alternates: {
      canonical,
      languages: {
        "zh-TW": `${SITE_URL}/blog`,
        en: `${SITE_URL}/en/blog`,
        "x-default": `${SITE_URL}/blog`,
      },
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: t("indexTitle"),
      description: t("indexDescription"),
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { category: rawCategory } = await searchParams;
  if (!isLocale(locale)) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "blog" });

  const all = listArticles(locale);
  const currentCategory = isCategory(rawCategory) ? rawCategory : "all";
  const filtered =
    currentCategory === "all"
      ? all
      : all.filter((a) => a.category === currentCategory);

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const labels: Record<ArticleCategory | "all", string> = {
    all: t("categoryAll"),
    resume: t(CATEGORY_LABEL_KEY.resume),
    interview: t(CATEGORY_LABEL_KEY.interview),
    "job-search": t(CATEGORY_LABEL_KEY["job-search"]),
    career: t(CATEGORY_LABEL_KEY.career),
  };
  const readMoreLabel = t("readMore");

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-[var(--color-bg)] py-12 focus:outline-none sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
              {t("indexTitle")}
            </h1>
            <p className="mt-3 text-base leading-7 text-text-light">
              {t("indexDescription")}
            </p>
          </header>

          <div className="mt-8">
            <CategoryTab labels={labels} current={currentCategory} />
          </div>

          {sorted.length === 0 ? (
            <p className="mt-12 text-sm text-text-placeholder">
              {t("emptyState")}
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((article) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  categoryLabel={t(CATEGORY_LABEL_KEY[article.category])}
                  readingMinutesText={t("readingMinutes", {
                    n: article.readingMinutes,
                  })}
                  readMoreLabel={readMoreLabel}
                  variant="featured"
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
