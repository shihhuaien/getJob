"use client";

import { Link, usePathname } from "@/i18n/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Mail,
  BarChart3,
  Mic,
  Settings,
  LogOut,
  Briefcase as Logo,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

const navItems = [
  { href: "/dashboard" as const, labelKey: "overview" as const, icon: LayoutDashboard },
  { href: "/jobs" as const, labelKey: "jobs" as const, icon: Briefcase },
  { href: "/resume" as const, labelKey: "resume" as const, icon: FileText },
  { href: "/cover-letter" as const, labelKey: "coverLetter" as const, icon: Mail },
  { href: "/interview" as const, labelKey: "interview" as const, icon: Mic },
  { href: "/analytics" as const, labelKey: "analytics" as const, icon: BarChart3 },
  { href: "/settings" as const, labelKey: "settings" as const, icon: Settings },
];

export default function DashboardSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-brand-100/60 bg-[var(--color-bg-card)]">
      <div className="flex h-16 items-center gap-2 border-b border-brand-100/60 px-6">
        <Logo className="h-5 w-5 text-brand-600" />
        <span className="text-lg font-bold text-[color:var(--color-text)]">
          Offery
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onNavigate?.()}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-brand-50 text-brand-700 shadow-neu-inset"
                  : "text-[color:var(--color-text-light)] hover:bg-brand-50/60 hover:text-[color:var(--color-text)]"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-100/60 p-3">
        <div className="mb-1 px-3">
          <LocaleSwitcher />
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[color:var(--color-text-light)] transition-colors duration-150 hover:bg-brand-50/60 hover:text-[color:var(--color-text)]"
        >
          <LogOut className="h-5 w-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );
}
