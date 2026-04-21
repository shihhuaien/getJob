"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center bg-[var(--color-bg)] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-neu text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FCEAEA] text-[#D96B6B]">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold tracking-widest text-[#D96B6B]">
          {t("code")}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-base font-semibold text-white shadow-neu transition-all duration-150 ease-out hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed sm:w-auto"
          >
            <RefreshCw className="h-5 w-5" />
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-brand-600 shadow-neu ring-1 ring-brand-600 transition-all duration-150 ease-out hover:bg-brand-50 hover:shadow-neu-hover sm:w-auto"
          >
            <Home className="h-5 w-5" />
            {t("backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
