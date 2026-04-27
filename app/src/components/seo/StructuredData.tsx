import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://offery.thdg.site";

const DESCRIPTIONS: Record<Locale, string> = {
  "zh-TW":
    "AI 驅動的求職工具，幫助你追蹤職缺、優化履歷、準備面試，讓求職效率提升 68%。",
  en: "AI-powered job search tool. Track applications, optimize resumes, prepare for interviews — boost your job search efficiency by 68%.",
};

type Props = {
  locale: Locale;
};

export default function StructuredData({ locale }: Props) {
  const description = DESCRIPTIONS[locale];
  const url = locale === "zh-TW" ? SITE_URL : `${SITE_URL}/en`;

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
    </>
  );
}
