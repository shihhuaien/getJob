"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, CloudOff, Loader2 } from "lucide-react";
import type { AutosaveStatus } from "@/hooks/useAutosave";

interface Props {
  status: AutosaveStatus;
  savedAt: Date | null;
  className?: string;
}

// 每 30 秒重新計算 savedAt 的顯示文字（避免時間跳動）
function useTickingTime(date: Date | null) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!date) return;
    const id = setInterval(() => setTick((v) => v + 1), 30_000);
    return () => clearInterval(id);
  }, [date]);
}

export default function AutosaveIndicator({
  status,
  savedAt,
  className = "",
}: Props) {
  const t = useTranslations("autosave");
  useTickingTime(savedAt);

  if (status === "idle") return null;

  const timeLabel = savedAt
    ? savedAt.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const tone: Record<AutosaveStatus, string> = {
    idle: "",
    dirty: "text-text-placeholder",
    saving: "text-text-light",
    saved: "text-text-light",
    error: "text-error",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${tone[status]} ${className}`}
      aria-live="polite"
    >
      {status === "saving" && (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          {t("saving")}
        </>
      )}
      {status === "dirty" && <span>{t("unsaved")}</span>}
      {status === "saved" && (
        <>
          <Check className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
          {t("savedAt", { time: timeLabel })}
        </>
      )}
      {status === "error" && (
        <>
          <CloudOff className="h-3.5 w-3.5" aria-hidden="true" />
          {t("failed")}
        </>
      )}
    </span>
  );
}
