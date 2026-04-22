"use client";

import Image from "next/image";
import Link from "next/link";
import { Link as I18nLink } from "@/i18n/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("nav");

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-100/60 bg-[var(--color-bg)]/85 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--color-bg)]/70">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <I18nLink
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand/logo-mark.svg"
            alt="Offery"
            width={28}
            height={32}
            priority
          />
          <span className="text-xl font-bold text-[color:var(--color-text)]">
            Offery
          </span>
        </I18nLink>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
          >
            {t("features")}
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
          >
            {t("pricing")}
          </Link>
          <LocaleSwitcher />
          <I18nLink
            href="/login"
            className="text-sm font-medium text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
          >
            {t("login")}
          </I18nLink>
          <I18nLink
            href="/register"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-neu transition-all duration-150 hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed"
          >
            {t("register")}
          </I18nLink>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[color:var(--color-text)] transition-colors hover:bg-brand-50 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={t("toggleMenu")}
          aria-expanded={mobileOpen}
        >
          <Menu
            className={`h-6 w-6 transition-transform duration-200 ${
              mobileOpen ? "rotate-90" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div className="md:hidden" aria-hidden={!mobileOpen}>
        <button
          type="button"
          aria-label={t("closeMenu")}
          tabIndex={mobileOpen ? 0 : -1}
          onClick={closeMenu}
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-300 ${
            mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <aside
          className={`fixed inset-y-0 right-0 z-50 flex w-[82vw] max-w-sm flex-col bg-[var(--color-bg)] shadow-neu motion-safe:transition-transform motion-safe:duration-[280ms] motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)] ${
            mobileOpen ? "translate-x-0" : "pointer-events-none translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center border-b border-brand-100/60 px-5">
            <I18nLink
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-2"
              tabIndex={mobileOpen ? 0 : -1}
            >
              <Image
                src="/brand/logo-mark.svg"
                alt="Offery"
                width={26}
                height={30}
              />
              <span className="text-lg font-bold text-[color:var(--color-text)]">
                Offery
              </span>
            </I18nLink>
          </div>

          <nav className="flex flex-1 flex-col space-y-1 px-3 py-4">
            <Link
              href="#features"
              className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
              onClick={closeMenu}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {t("features")}
            </Link>
            <Link
              href="#pricing"
              className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
              onClick={closeMenu}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {t("pricing")}
            </Link>
            <I18nLink
              href="/login"
              className="rounded-xl px-4 py-3 text-base font-medium text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
              onClick={closeMenu}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {t("login")}
            </I18nLink>
          </nav>

          <div className="mt-auto flex flex-col gap-3 border-t border-brand-100/60 p-4">
            <div className="px-1">
              <LocaleSwitcher />
            </div>
            <I18nLink
              href="/register"
              className="block w-full rounded-xl bg-brand-600 py-3 text-center text-base font-semibold text-white shadow-neu transition-all duration-150 hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed"
              onClick={closeMenu}
              tabIndex={mobileOpen ? 0 : -1}
            >
              {t("register")}
            </I18nLink>
          </div>
        </aside>
      </div>
    </header>
  );
}
