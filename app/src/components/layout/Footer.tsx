"use client";

import Link from "next/link";
import { Link as I18nLink } from "@/i18n/navigation";
import { Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const tFooter = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tMeta = useTranslations("metadata");

  return (
    <footer className="border-t border-brand-100/60 bg-[var(--color-bg)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <I18nLink
              href="/"
              className="flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Briefcase className="h-5 w-5 text-brand-600" />
              <span className="text-lg font-bold text-[color:var(--color-text)]">
                Offery
              </span>
            </I18nLink>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-text-light)]">
              {tMeta("description")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[color:var(--color-text)]">
              {tFooter("product")}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tNav("features")}
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tNav("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[color:var(--color-text)]">
              {tFooter("resources")}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tFooter("jobGuide")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tFooter("resumeTemplate")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tFooter("interviewTips")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[color:var(--color-text)]">
              {tFooter("legal")}
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <I18nLink
                  href="/privacy"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tFooter("privacy")}
                </I18nLink>
              </li>
              <li>
                <I18nLink
                  href="/terms"
                  className="text-sm text-[color:var(--color-text-light)] transition-colors duration-150 hover:text-[color:var(--color-text)]"
                >
                  {tFooter("terms")}
                </I18nLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-brand-100/60 pt-8">
          <p className="text-center text-sm text-[color:var(--color-text-placeholder)]">
            {tFooter("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
