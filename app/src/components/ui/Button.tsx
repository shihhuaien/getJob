"use client";

import { forwardRef } from "react";
import dynamic from "next/dynamic";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
};

// 微擬物觸覺：hover 抬升 2px + active 塌陷；遵循 prefers-reduced-motion
const lift =
  "hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none";

const base =
  `inline-flex items-center justify-center gap-2 font-semibold transition-all duration-base ease-out-quart disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 ${lift}`;

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-neu hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed",
  secondary:
    "bg-white text-brand-600 ring-1 ring-brand-600 shadow-neu hover:bg-brand-50 hover:shadow-neu-hover active:shadow-neu-pressed",
  ghost:
    "bg-transparent text-brand-600 hover:bg-brand-50 focus-visible:bg-brand-50",
  danger:
    "bg-error text-white shadow-neu hover:shadow-neu-hover active:shadow-neu-pressed",
};

// sm 觸控區：手機保留 h-10（符合 HIG 44px 建議），桌機維持 h-8 緊湊
const sizeClass: Record<Size, string> = {
  sm: "h-10 sm:h-8 px-3 text-xs rounded-md",
  md: "h-10 px-4 py-2.5 text-sm rounded-lg",
  lg: "h-12 px-6 py-3 text-base rounded-xl",
};

const spinnerPx: Record<Size, number> = { sm: 16, md: 20, lg: 24 };

const SvgSpinner = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className="animate-spin"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
      className="opacity-25"
    />
    <path
      d="M4 12a8 8 0 018-8"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const LottieSpinner = dynamic(() => import("./LottieSpinner"), {
  ssr: false,
  loading: () => <SvgSpinner size={20} />,
});

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const classes = [base, variantClass[variant], sizeClass[size], className]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={classes}
        {...rest}
      >
        {loading ? <LottieSpinner size={spinnerPx[size]} /> : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
