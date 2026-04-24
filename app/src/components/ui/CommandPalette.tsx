"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Search,
  LayoutDashboard,
  Briefcase,
  FileText,
  Mail,
  Mic,
  BarChart3,
  Settings,
  CornerDownLeft,
  X,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export const COMMAND_PALETTE_OPEN_EVENT = "offery:open-command-palette";

export function openCommandPalette() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_OPEN_EVENT));
}

type NavHref =
  | "/dashboard"
  | "/jobs"
  | "/resume"
  | "/cover-letter"
  | "/interview"
  | "/analytics"
  | "/settings";

type CommandGroupKey =
  | "groupPages"
  | "groupJobs"
  | "groupResumes"
  | "groupCoverLetters";

type BaseItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  group: CommandGroupKey;
};

type NavItem = BaseItem & {
  kind: "nav";
  href: NavHref;
};

type DynamicItem = BaseItem & {
  kind: "dynamic";
  href: string;
};

type CommandItem = NavItem | DynamicItem;

const NAV_ITEMS: Omit<NavItem, "title">[] = [
  {
    kind: "nav",
    id: "nav-dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    group: "groupPages",
  },
  {
    kind: "nav",
    id: "nav-jobs",
    href: "/jobs",
    icon: Briefcase,
    group: "groupPages",
  },
  {
    kind: "nav",
    id: "nav-resume",
    href: "/resume",
    icon: FileText,
    group: "groupPages",
  },
  {
    kind: "nav",
    id: "nav-cover-letter",
    href: "/cover-letter",
    icon: Mail,
    group: "groupPages",
  },
  {
    kind: "nav",
    id: "nav-interview",
    href: "/interview",
    icon: Mic,
    group: "groupPages",
  },
  {
    kind: "nav",
    id: "nav-analytics",
    href: "/analytics",
    icon: BarChart3,
    group: "groupPages",
  },
  {
    kind: "nav",
    id: "nav-settings",
    href: "/settings",
    icon: Settings,
    group: "groupPages",
  },
];

type NavLabelKey =
  | "overview"
  | "jobs"
  | "resume"
  | "coverLetter"
  | "interview"
  | "analytics"
  | "settings";

const NAV_LABEL_KEYS: Record<NavHref, NavLabelKey> = {
  "/dashboard": "overview",
  "/jobs": "jobs",
  "/resume": "resume",
  "/cover-letter": "coverLetter",
  "/interview": "interview",
  "/analytics": "analytics",
  "/settings": "settings",
};

const MAC_PLATFORM_RE = /Mac|iPhone|iPad|iPod/;

function subscribeNoop() {
  return () => {};
}

function useIsMac() {
  return useSyncExternalStore(
    subscribeNoop,
    () => MAC_PLATFORM_RE.test(navigator.platform),
    () => false
  );
}

export default function CommandPalette() {
  const tCmd = useTranslations("commandPalette");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const isMac = useIsMac();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [dynamicItems, setDynamicItems] = useState<DynamicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fetchedRef = useRef(false);

  const navItems = useMemo<NavItem[]>(
    () =>
      NAV_ITEMS.map((item) => ({
        ...item,
        title: tNav(NAV_LABEL_KEYS[item.href]),
      })),
    [tNav]
  );

  const fetchDynamicItems = useCallback(async () => {
    if (fetchedRef.current) return;
    setIsLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        fetchedRef.current = true;
        return;
      }

      const [jobsResult, resumesResult, coverLettersResult] = await Promise.all([
        supabase
          .from("job_applications")
          .select("id, job_title, company_name, status")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(50),
        supabase
          .from("resumes")
          .select("id, title, target_job_title")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(30),
        supabase
          .from("cover_letters")
          .select("id, title")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(30),
      ]);

      const jobs: DynamicItem[] = (jobsResult.data ?? []).map((j) => ({
        kind: "dynamic",
        id: `job-${j.id}`,
        title: j.job_title,
        subtitle: j.company_name,
        icon: Briefcase,
        href: `/jobs/${j.id}`,
        group: "groupJobs",
      }));

      const resumes: DynamicItem[] = (resumesResult.data ?? []).map((r) => ({
        kind: "dynamic",
        id: `resume-${r.id}`,
        title: r.title,
        subtitle: r.target_job_title ?? undefined,
        icon: FileText,
        href: `/resume/${r.id}`,
        group: "groupResumes",
      }));

      const coverLetters: DynamicItem[] = (coverLettersResult.data ?? []).map(
        (c) => ({
          kind: "dynamic",
          id: `cover-${c.id}`,
          title: c.title,
          icon: Mail,
          href: `/cover-letter/${c.id}`,
          group: "groupCoverLetters",
        })
      );

      setDynamicItems([...jobs, ...resumes, ...coverLetters]);
      fetchedRef.current = true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 全域鍵盤快捷鍵：Cmd+K / Ctrl+K；也接受外部透過 CustomEvent 觸發
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isToggle =
        (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isToggle) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, onOpenEvent);
    };
  }, []);

  // 路由變動時自動關閉（避免跨頁殘留）
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 開啟後聚焦搜尋框、鎖定背景捲動、載入動態資料
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    fetchDynamicItems();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open, fetchDynamicItems]);

  // 關閉時清空查詢
  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  const allItems = useMemo<CommandItem[]>(
    () => [...navItems, ...dynamicItems],
    [navItems, dynamicItems]
  );

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((item) => {
      const haystack = `${item.title} ${item.subtitle ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [allItems, query]);

  // 篩選變動時重置指標
  useEffect(() => {
    setActiveIndex(0);
  }, [query, dynamicItems.length]);

  const grouped = useMemo(() => {
    const order: CommandGroupKey[] = [
      "groupPages",
      "groupJobs",
      "groupResumes",
      "groupCoverLetters",
    ];
    const map = new Map<CommandGroupKey, CommandItem[]>();
    for (const item of filteredItems) {
      const list = map.get(item.group) ?? [];
      list.push(item);
      map.set(item.group, list);
    }
    // 產生扁平化後的 index 對應，配合鍵盤選擇
    const sections: { key: CommandGroupKey; items: CommandItem[] }[] = [];
    let flatIndex = 0;
    const indexMap = new Map<string, number>();
    for (const key of order) {
      const items = map.get(key);
      if (!items || items.length === 0) continue;
      sections.push({ key, items });
      for (const item of items) {
        indexMap.set(item.id, flatIndex);
        flatIndex += 1;
      }
    }
    return { sections, indexMap, total: flatIndex };
  }, [filteredItems]);

  const handleSelect = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      router.push(item.href as NavHref);
    },
    [router]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((idx) => Math.min(idx + 1, Math.max(grouped.total - 1, 0)));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((idx) => Math.max(idx - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredItems[activeIndex];
      if (target) handleSelect(target);
    }
  };

  // 確保焦點項滾動至可見範圍
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={tCmd("placeholder")}
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-20 sm:pt-24"
    >
      <button
        type="button"
        aria-label={tCmd("close")}
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200"
      />
      <div
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-[var(--color-bg-card)] shadow-neu ring-1 ring-brand-100 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
      >
        <div className="flex items-center gap-3 border-b border-brand-100/60 px-4">
          <Search
            className="h-4 w-4 text-[color:var(--color-text-placeholder)]"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tCmd("placeholder")}
            className="h-12 flex-1 bg-transparent text-sm text-[color:var(--color-text)] placeholder:text-[color:var(--color-text-placeholder)] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={tCmd("close")}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[color:var(--color-text-light)] transition-colors hover:bg-brand-50 hover:text-[color:var(--color-text)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          ref={listRef}
          role="listbox"
          className="max-h-[60vh] overflow-y-auto py-2"
        >
          {isLoading && dynamicItems.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-[color:var(--color-text-light)]">
              {tCmd("loading")}
            </div>
          )}

          {grouped.total === 0 && !isLoading && (
            <div className="px-4 py-8 text-center text-sm text-[color:var(--color-text-light)]">
              {query.trim() ? tCmd("noResults") : tCmd("emptyHint")}
            </div>
          )}

          {grouped.sections.map((section) => (
            <div key={section.key} className="px-2 py-1">
              <div className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-light)]/80">
                {tCmd(section.key)}
              </div>
              {section.items.map((item) => {
                const idx = grouped.indexMap.get(item.id) ?? -1;
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    data-index={idx}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-brand-50 text-brand-700"
                        : "text-[color:var(--color-text)] hover:bg-brand-50/60"
                    }`}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex min-w-0 flex-1 items-baseline gap-2">
                      <span className="truncate font-medium">{item.title}</span>
                      {item.subtitle && (
                        <span className="truncate text-xs text-[color:var(--color-text-light)]">
                          {item.subtitle}
                        </span>
                      )}
                    </span>
                    {isActive && (
                      <CornerDownLeft
                        className="h-3.5 w-3.5 text-[color:var(--color-text-light)]"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-brand-100/60 px-4 py-2 text-[11px] text-[color:var(--color-text-light)]">
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-brand-200 bg-white px-1.5 py-0.5 font-mono text-[10px]">
              ↑↓
            </kbd>
            <kbd className="rounded border border-brand-200 bg-white px-1.5 py-0.5 font-mono text-[10px]">
              ↵
            </kbd>
            <kbd className="rounded border border-brand-200 bg-white px-1.5 py-0.5 font-mono text-[10px]">
              Esc
            </kbd>
          </div>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-brand-200 bg-white px-1.5 py-0.5 font-mono text-[10px]">
              {isMac ? tCmd("shortcutKey") : tCmd("shortcutKeyAlt")}
            </kbd>
            <kbd className="rounded border border-brand-200 bg-white px-1.5 py-0.5 font-mono text-[10px]">
              K
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
