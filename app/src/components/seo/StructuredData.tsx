import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { FAQ_KEYS } from "@/components/landing/faqKeys";

type Locale = (typeof routing.locales)[number];

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.thdg.site";

type Props = {
  locale: Locale;
};

export default async function StructuredData({ locale }: Props) {
  const url = locale === "zh-TW" ? SITE_URL : `${SITE_URL}/en`;
  const tMeta = await getTranslations({ locale, namespace: "metadata" });
  const t = await getTranslations({ locale, namespace: "landing" });
  const description = tMeta("description");

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Offery",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-mark.png`,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Offery",
    url: SITE_URL,
    inLanguage: ["zh-TW", "en"],
  };

  const application = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Offery",
    url,
    description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        name: locale === "zh-TW" ? "免費方案" : "Free",
        price: "0",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Pro",
        price: "9.99",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "9.99",
          priceCurrency: "USD",
          billingDuration: "P1M",
        },
      },
      {
        "@type": "Offer",
        name: "Pro Yearly",
        price: "77.88",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "77.88",
          priceCurrency: "USD",
          billingDuration: "P1Y",
        },
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((item) => ({
      "@type": "Question",
      name: t(item.qKey),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(item.aKey),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(application) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
