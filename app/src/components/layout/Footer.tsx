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
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <I18nLink href="/" className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-brand-600" />
              <span className="text-lg font-bold text-gray-900">
                Offery
              </span>
            </I18nLink>
            <p className="mt-3 text-sm text-gray-500">
              {tMeta("description")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{tFooter("product")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tNav("features")}
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tNav("pricing")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{tFooter("resources")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tFooter("jobGuide")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tFooter("resumeTemplate")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tFooter("interviewTips")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{tFooter("legal")}</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tFooter("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {tFooter("terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            {tFooter("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
