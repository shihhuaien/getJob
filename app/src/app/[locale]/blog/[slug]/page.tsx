import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ArticleHero from "@/components/blog/ArticleHero";
import ArticleProse from "@/components/blog/ArticleProse";
import ArticleCTA from "@/components/blog/ArticleCTA";
import ArticleCard from "@/components/blog/ArticleCard";
import {
  getArticleBySlug,
  getRelatedArticles,
  listAllSlugs,
} from "@/lib/blog/articles";
import { CATEGORY_LABEL_KEY } from "@/lib/blog/categories";
import { routing } from "@/i18n/routing";
import type { ArticleLocale } from "@/lib/blog/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.thdg.site";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function isLocale(value: string): value is ArticleLocale {
  return value === "zh-TW" || value === "en";
}

export function generateStaticParams() {
  const slugs = listAllSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const article = getArticleBySlug(locale, slug);
  if (!article) return {};

  const localePath = locale === routing.defaultLocale ? "" : `/${locale}`;
  const canonical = `${SITE_URL}${localePath}/blog/${slug}`;

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical,
      languages: {
        "zh-TW": `${SITE_URL}/blog/${slug}`,
        en: `${SITE_URL}/en/blog/${slug}`,
        "x-default": `${SITE_URL}/blog/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      url: canonical,
      title: article.title,
      description: article.description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

function formatDate(iso: string, locale: ArticleLocale): string {
  return new Date(iso).toLocaleDateString(
    locale === "zh-TW" ? "zh-TW" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const article = getArticleBySlug(locale, slug);
  if (!article) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });
  const Content = article.Content;

  const categoryLabel = t(CATEGORY_LABEL_KEY[article.category]);
  const readingMinutesText = t("readingMinutes", {
    n: article.readingMinutes,
  });
  const updatedDateText = t("updatedOn", {
    date: formatDate(article.updatedAt, locale),
  });
  const readMoreLabel = t("readMore");

  const related = getRelatedArticles(locale, article, 3);

  // Article JSON-LD（提升 SEO 與 Google 文章卡片呈現機率）
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.author },
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${
        locale === routing.defaultLocale ? "" : `/${locale}`
      }/blog/${slug}`,
    },
  };

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 bg-[var(--color-bg)] py-12 focus:outline-none sm:py-16"
      >
        <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ArticleHero
            article={article}
            categoryLabel={categoryLabel}
            readingMinutesText={readingMinutesText}
            updatedDateText={updatedDateText}
          />

          <div className="mt-10">
            <ArticleProse>
              <Content />
            </ArticleProse>
          </div>

          <ArticleCTA
            ctaTool={article.ctaTool}
            ctaText={article.ctaText}
            buttonLabel={t("ctaButton")}
          />

          {related.length > 0 && (
            <section className="mx-auto mt-16 max-w-[920px]">
              <h2 className="text-xl font-semibold text-text">
                {t("relatedTitle")}
              </h2>
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                {related.map((rel) => (
                  <ArticleCard
                    key={rel.slug}
                    article={rel}
                    categoryLabel={t(CATEGORY_LABEL_KEY[rel.category])}
                    readingMinutesText={t("readingMinutes", {
                      n: rel.readingMinutes,
                    })}
                    readMoreLabel={readMoreLabel}
                  />
                ))}
              </div>
            </section>
          )}
        </article>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </main>
      <Footer />
    </>
  );
}
