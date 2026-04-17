"use client";

import {
  FileText,
  Kanban,
  Mail,
  Search,
  BarChart3,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

const featureKeys = [
  { icon: FileText, titleKey: "feature1Title", descKey: "feature1Desc" },
  { icon: Kanban, titleKey: "feature2Title", descKey: "feature2Desc" },
  { icon: Mail, titleKey: "feature3Title", descKey: "feature3Desc" },
  { icon: Search, titleKey: "feature4Title", descKey: "feature4Desc" },
  { icon: BarChart3, titleKey: "feature5Title", descKey: "feature5Desc" },
  { icon: Users, titleKey: "feature6Title", descKey: "feature6Desc" },
] as const;

export default function FeaturesSection() {
  const t = useTranslations("landing");

  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t("featuresTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            {t("featuresSubtitle")}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map((feature) => (
            <div
              key={feature.titleKey}
              className="group rounded-xl border border-gray-200 p-6 transition-all hover:border-brand-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {t(feature.titleKey)}
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                {t(feature.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
