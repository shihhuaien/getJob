"use client";

import { useEffect, useState } from "react";
import { Menu, X, Briefcase } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-brand-600" />
          <span className="text-lg font-bold text-gray-900">Offery</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("toggleMenu")}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <aside className="hidden h-full md:block">
        <DashboardSidebar />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative z-50 flex h-full w-72 max-w-[80vw] flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
              className="absolute right-3 top-3 rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <DashboardSidebar onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
