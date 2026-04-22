import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PrivacyZhTW from "@/content/legal/privacy.zh-TW";
import PrivacyEn from "@/content/legal/privacy.en";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  const Body = locale === "en" ? PrivacyEn : PrivacyZhTW;

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[var(--color-bg)] py-16 sm:py-20">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight text-text">
              {t("privacyTitle")}
            </h1>
            <p className="mt-2 text-sm text-text-light">{t("lastUpdated")}</p>
          </header>
          <div className="rounded-2xl bg-white p-6 shadow-neu sm:p-10">
            <Body />
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
