"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
};

export default function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
}: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15%" }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </m.div>
  );
}
