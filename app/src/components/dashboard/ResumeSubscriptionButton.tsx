"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResumeSubscriptionButton() {
  const router = useRouter();
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
      if (!res.ok) throw new Error(data.error || "發生錯誤");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "恢復失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleResume}
        disabled={isLoading}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {isLoading ? "處理中..." : "恢復訂閱"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
