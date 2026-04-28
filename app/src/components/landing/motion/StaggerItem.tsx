"use client";

import type { ReactNode } from "react";
import { m, useReducedMotion } from "motion/react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function StaggerItem({ children, className }: Props) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] },
        },
      }}
    >
      {children}
    </m.div>
  );
}
