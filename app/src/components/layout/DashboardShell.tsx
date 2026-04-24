"use client";

import { useEffect, useState } from "react";
import { Menu, X, Briefcase, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import DashboardSidebar from "./DashboardSidebar";
import CommandPalette, { openCommandPalette } from "@/components/ui/CommandPalette";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  const tCmd = useTranslations("commandPalette");
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
      <header className="flex h-14 items-center justify-between border-b border-brand-100/60 bg-[var(--color-bg-card)] px-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-brand-600" />
          <span className="text-lg font-bold text-[color:var(--color-text)]">
            Offery
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => openCommandPalette()}
            aria-label={tCmd("openShortcut")}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t("toggleMenu")}
            className="-mr-1 inline-flex h-11 w-11 items-center justify-center rounded-xl text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <aside className="hidden h-full md:block">
        <DashboardSidebar />
      </aside>

      <div className="md:hidden" role="dialog" aria-modal="true" aria-hidden={!open}>
        <button
          type="button"
          aria-label={t("closeMenu")}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm motion-safe:transition-opacity motion-safe:duration-300 ${
            open ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 max-w-[80vw] flex-col bg-[var(--color-bg-card)] shadow-neu motion-safe:transition-transform motion-safe:duration-[280ms] motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? "translate-x-0" : "pointer-events-none -translate-x-full"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("closeMenu")}
            tabIndex={open ? 0 : -1}
            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
          >
            <X className="h-5 w-5" />
          </button>
          <DashboardSidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 overflow-y-auto bg-[var(--color-bg)] p-4 focus:outline-none sm:p-6 lg:p-8"
      >
        {children}
      </main>

      <CommandPalette />
    </div>
  );
}
