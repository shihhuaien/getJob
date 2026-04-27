"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

type Plan = "monthly" | "yearly";

type UpgradeButtonProps = {
  plan?: Plan;
  label?: string;
};

export default function UpgradeButton({
  plan = "monthly",
  label,
}: UpgradeButtonProps) {
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
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
        {label ?? t("upgradePro")}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
