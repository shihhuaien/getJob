import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-neu ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 shadow-neu-inset">
        <Icon className="h-7 w-7 text-brand-600" aria-hidden="true" />
      </div>
      <h3 className="mt-5 text-base font-semibold text-text">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-center text-sm text-text-light">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export default EmptyState;
