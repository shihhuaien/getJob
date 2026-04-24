import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import type { ComponentProps } from "react";

export type BreadcrumbItem = {
  href?: ComponentProps<typeof Link>["href"];
  label: string;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
  ariaLabel?: string;
  className?: string;
};

export function Breadcrumb({ items, ariaLabel, className = "" }: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel ?? "Breadcrumb"} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${idx}-${item.label}`} className="flex items-center gap-1.5">
              {idx > 0 && (
                <ChevronRight
                  className="h-3.5 w-3.5 text-[color:var(--color-text-placeholder)]"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="rounded text-[color:var(--color-text-light)] transition-colors hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={
                    isLast
                      ? "font-medium text-[color:var(--color-text)]"
                      : "text-[color:var(--color-text-light)]"
                  }
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
