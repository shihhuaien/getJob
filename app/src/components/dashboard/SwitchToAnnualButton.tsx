"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function SwitchToAnnualButton() {
  const router = useRouter();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSwitch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/switch-to-annual", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tc("saveFailed"));
      setShowConfirm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tc("saveFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <Button onClick={() => setShowConfirm(true)} variant="primary" size="sm">
        {t("switchToAnnual")}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-brand-200 bg-brand-50 p-4">
      <p className="text-sm text-brand-700">{t("switchToAnnualConfirm")}</p>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleSwitch}
          loading={isLoading}
          variant="primary"
          size="sm"
        >
          {t("switchToAnnual")}
        </Button>
        <Button
          onClick={() => {
            setShowConfirm(false);
            setError(null);
          }}
          disabled={isLoading}
          variant="secondary"
          size="sm"
        >
          {tc("back")}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
