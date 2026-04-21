"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function CancelSubscriptionButton() {
  const router = useRouter();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/cancel-subscription", {
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
      <Button
        onClick={() => setShowConfirm(true)}
        variant="secondary"
      >
        {t("cancelSub")}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-800">
        {t("cancelConfirm")}
      </p>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleCancel}
          loading={isLoading}
          variant="danger"
          size="sm"
        >
          {t("confirmCancel")}
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
