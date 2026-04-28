"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export default function FadeInUp({
  children,
  className,
  delay = 0,
  y = 24,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 1, 0.5, 1],
      }}
    >
      {children}
    </m.div>
  );
}
