"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function ResumeSubscriptionButton() {
  const router = useRouter();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResume = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/resume-subscription", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tc("saveFailed"));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tc("saveFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleResume} loading={isLoading} variant="primary">
        {t("resumeSub")}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
