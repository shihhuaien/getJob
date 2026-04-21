import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

type Padding = "none" | "sm" | "md" | "lg";
type Variant = "default" | "hoverable" | "inset";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: Padding;
  variant?: Variant;
};

const paddingClass: Record<Padding, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

const variantClass: Record<Variant, string> = {
  default: "bg-white shadow-neu",
  hoverable:
    "bg-white shadow-neu transition-shadow duration-150 ease-out hover:shadow-neu-hover",
  inset: "bg-[var(--color-bg)] shadow-neu-inset",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      padding = "md",
      variant = "default",
      className = "",
      children,
      ...rest
    },
    ref,
  ) => {
    const classes = [
      "rounded-2xl",
      variantClass[variant],
      paddingClass[padding],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export function CardHeader({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mb-4 ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={`text-lg font-semibold text-gray-900 ${className}`.trim()}
      {...rest}
    >
      {children}
    </h2>
  );
}

export function CardDescription({
  className = "",
  children,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`mt-1 text-xs text-gray-500 ${className}`.trim()} {...rest}>
      {children}
    </p>
  );
}

export default Card;
