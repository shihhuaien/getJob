"use client";

import Link from "next/link";
import { Link as I18nLink } from "@/i18n/navigation";
import { useState } from "react";
import { Briefcase, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <I18nLink href="/" className="flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-brand-600" />
          <span className="text-xl font-bold text-gray-900">Offery</span>
        </I18nLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t("features")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t("pricing")}
          </Link>
          <LocaleSwitcher />
          <I18nLink
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            {t("login")}
          </I18nLink>
          <I18nLink
            href="/register"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            {t("register")}
          </I18nLink>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={t("toggleMenu")}
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link
              href="#features"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              {t("features")}
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              {t("pricing")}
            </Link>
            <I18nLink
              href="/login"
              className="text-sm font-medium text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              {t("login")}
            </I18nLink>
            <I18nLink
              href="/register"
              className="rounded-lg bg-brand-600 px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              {t("register")}
            </I18nLink>
            <LocaleSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}
