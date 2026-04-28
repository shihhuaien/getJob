import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import TrustStrip from "@/components/landing/TrustStrip";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesSection from "@/components/landing/FeaturesSection";
import InterviewShowcase from "@/components/landing/InterviewShowcase";
import AnalyticsPreview from "@/components/landing/AnalyticsPreview";
import UseCases from "@/components/landing/UseCases";
import PricingSection from "@/components/landing/PricingSection";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import MotionProvider from "@/components/landing/motion/MotionProvider";
import StructuredData from "@/components/seo/StructuredData";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <>
      <StructuredData locale={locale} />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <MotionProvider>
          <HeroSection />
          <TrustStrip />
          <HowItWorks />
          <FeaturesSection />
          <InterviewShowcase />
          <AnalyticsPreview />
          <UseCases />
          <PricingSection />
          <FAQ />
          <CTASection />
        </MotionProvider>
      </main>
      <Footer />
    </>
  );
}
