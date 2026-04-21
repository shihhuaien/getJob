"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export default function DeleteAccountButton() {
  const router = useRouter();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== t("deleteAccountConfirmText")) return;

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tc("deleteFailed"));
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : tc("deleteFailed"));
      setIsLoading(false);
    }
  };

  if (!showConfirm) {
    return (
      <Button
        onClick={() => setShowConfirm(true)}
        variant="danger"
      >
        {t("deleteAccount")}
      </Button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="text-sm font-medium text-red-800">
        {t("deleteAccountWarning")}
      </p>
      <p className="mt-2 text-sm text-red-700">
        {t("deleteAccountConfirmLabel")}
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        className="mt-2 block w-full rounded-lg border border-red-300 px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        placeholder={t("deleteAccountConfirmText")}
      />
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleDelete}
          loading={isLoading}
          disabled={confirmText !== t("deleteAccountConfirmText")}
          variant="danger"
          size="sm"
        >
          {t("deleteAccountBtn")}
        </Button>
        <Button
          onClick={() => {
            setShowConfirm(false);
            setConfirmText("");
            setError(null);
          }}
          disabled={isLoading}
          variant="secondary"
          size="sm"
        >
          {tc("cancel")}
        </Button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
