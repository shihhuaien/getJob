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

const base =
  "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 ease-out disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-neu hover:bg-brand-700 hover:shadow-neu-hover active:shadow-neu-pressed",
  secondary:
    "bg-white text-brand-600 ring-1 ring-brand-600 shadow-neu hover:bg-brand-50 hover:shadow-neu-hover active:shadow-neu-pressed",
  ghost: "bg-transparent text-brand-600 hover:bg-brand-50",
  danger:
    "bg-[#D96B6B] text-white shadow-neu hover:bg-[#C65959] hover:shadow-neu-hover active:shadow-neu-pressed",
};

const sizeClass: Record<Size, string> = {
  sm: "h-8 px-3 text-xs rounded-md",
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
