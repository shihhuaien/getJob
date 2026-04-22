import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Home, SearchX } from "lucide-react";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="flex flex-1 items-center justify-center bg-[var(--color-bg)] px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-neu text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          <SearchX className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold tracking-widest text-brand-600">
          {t("code")}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-text">{t("title")}</h1>
        <p className="mt-3 text-sm leading-6 text-text-light">
          {t("description")}
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 text-base font-semibold text-white shadow-neu transition-all duration-150 ease-out hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed"
        >
          <Home className="h-5 w-5" />
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
}
