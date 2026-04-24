"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  BarChart3,
  Mic,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

type NavLabelKey =
  | "overview"
  | "jobs"
  | "resume"
  | "coverLetter"
  | "interview"
  | "analytics"
  | "settings";

type NavHref =
  | "/dashboard"
  | "/jobs"
  | "/resume"
  | "/cover-letter"
  | "/interview"
  | "/analytics"
  | "/settings";

type NavItem = {
  href: NavHref;
  labelKey: NavLabelKey;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

type SidebarGroupKey =
  | "applications"
  | "materials"
  | "interview"
  | "account";

type NavGroup = {
  key: SidebarGroupKey;
  items: NavItem[];
};

// 側邊欄分組：申請管理 / 求職素材 / 面試準備 / 帳戶
const navGroups: NavGroup[] = [
  {
    key: "applications",
    items: [
      { href: "/dashboard", labelKey: "overview", icon: LayoutDashboard },
      { href: "/jobs", labelKey: "jobs", icon: Briefcase },
      { href: "/analytics", labelKey: "analytics", icon: BarChart3 },
    ],
  },
  {
    key: "materials",
    items: [
      { href: "/resume", labelKey: "resume", icon: FileText },
      { href: "/cover-letter", labelKey: "coverLetter", icon: Mail },
    ],
  },
  {
    key: "interview",
    items: [{ href: "/interview", labelKey: "interview", icon: Mic }],
  },
  {
    key: "account",
    items: [{ href: "/settings", labelKey: "settings", icon: Settings }],
  },
];

export default function DashboardSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");
  const tGroup = useTranslations("sidebarGroups");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-brand-100/60 bg-[var(--color-bg-card)]">
      <div className="flex h-16 items-center gap-2 border-b border-brand-100/60 px-6">
        <Image
          src="/brand/logo-mark.svg"
          alt=""
          width={20}
          height={24}
          aria-hidden="true"
        />
        <span className="text-lg font-bold text-[color:var(--color-text)]">
          Offery
        </span>
      </div>

      <nav
        aria-label={tGroup("applications")}
        className="flex-1 space-y-5 overflow-y-auto px-3 py-4"
      >
        {navGroups.map((group) => (
          <div key={group.key} className="space-y-1">
            <div
              id={`sidebar-group-${group.key}`}
              className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-light)]/80"
            >
              {tGroup(group.key)}
            </div>
            <ul
              aria-labelledby={`sidebar-group-${group.key}`}
              className="space-y-1"
            >
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onNavigate?.()}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)] ${
                        isActive
                          ? "bg-brand-50 text-brand-700 shadow-neu-inset"
                          : "text-[color:var(--color-text-light)] hover:bg-brand-50/60 hover:text-[color:var(--color-text)]"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-brand-100/60 p-3">
        <div className="mb-1 px-3">
          <LocaleSwitcher />
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[color:var(--color-text-light)] transition-colors duration-150 hover:bg-brand-50/60 hover:text-[color:var(--color-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]"
        >
          <LogOut className="h-5 w-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
