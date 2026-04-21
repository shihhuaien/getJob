"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LottieSpinner({ size = 20 }: { size?: number }) {
  return (
    <DotLottieReact
      src="/loading.lottie"
      autoplay
      loop
      style={{ width: size, height: size }}
    />
  );
}
