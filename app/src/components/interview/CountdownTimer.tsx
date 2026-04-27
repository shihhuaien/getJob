"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface Props {
  durationSec: number;
  paused?: boolean;
}

export default function CountdownTimer({ durationSec, paused = false }: Props) {
  const [remaining, setRemaining] = useState(durationSec);

  useEffect(() => {
    if (remaining <= 0 || paused) return;
    const t = setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [remaining, paused]);

  const mm = Math.floor(remaining / 60)
    .toString()
    .padStart(2, "0");
  const ss = (remaining % 60).toString().padStart(2, "0");
  const warn = remaining <= 30;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
        warn ? "bg-red-50 text-red-700" : "bg-brand-50 text-text"
      }`}
    >
      <Clock className="h-3.5 w-3.5" />
      {mm}:{ss}
    </div>
  );
}
