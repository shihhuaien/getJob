"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelSubscriptionButton() {
  const router = useRouter();
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
      if (!res.ok) throw new Error(data.error || "發生錯誤");
      setShowConfirm(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "取消失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        取消訂閱
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <p className="text-sm text-amber-800">
        確定要取消訂閱嗎？取消後你仍可使用 Pro 功能至本帳期結束。
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "處理中..." : "確認取消"}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setError(null);
          }}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          返回
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
