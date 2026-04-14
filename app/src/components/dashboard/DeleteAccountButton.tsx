"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== "刪除帳號") return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "發生錯誤");
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "刪除失敗，請稍後再試");
      setIsLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <button
        onClick={() => setShowConfirm(true)}
        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
      >
        刪除帳號
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-medium text-red-800">
        此操作無法復原！你的所有資料（職缺、履歷、求職信、人脈）將被永久刪除。
      </p>
      <p className="mt-2 text-sm text-red-700">
        請輸入「刪除帳號」來確認：
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="mt-2 block w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder="刪除帳號"
      />
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isLoading || confirmText !== "刪除帳號"}
          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? "刪除中..." : "永久刪除帳號"}
        </button>
        <button
          onClick={() => {
            setShowConfirm(false);
            setConfirmText("");
            setError(null);
          }}
          disabled={isLoading}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
