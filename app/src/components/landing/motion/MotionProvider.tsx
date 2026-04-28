"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation } from "motion/react";

// LazyMotion + domAnimation 將 motion 套件 tree-shake 至約 12KB（vs 完整 ~50KB）
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
