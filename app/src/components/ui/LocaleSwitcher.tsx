"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";

const localeLabels: Record<string, string> = {
  "zh-TW": "中文",
  en: "EN",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "zh-TW" ? "en" : "zh-TW";

  const handleSwitch = () => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={handleSwitch}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-text-light hover:bg-brand-50 hover:text-text transition-colors"
      aria-label="Switch language"
    >
      <Globe className="h-4 w-4" />
      {localeLabels[nextLocale]}
    </button>
  );
}
