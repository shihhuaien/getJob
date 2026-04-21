"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function UpgradeButton() {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tc("saveFailed"));
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError(tc("saveFailed"));
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleUpgrade} loading={isLoading} variant="primary">
        {t("upgradePro")}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
