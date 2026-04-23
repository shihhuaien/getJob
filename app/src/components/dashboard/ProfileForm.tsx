"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

interface ProfileFormProps {
  email: string;
  fullName: string | null;
}

export default function ProfileForm({ email, fullName }: ProfileFormProps) {
  const router = useRouter();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(fullName || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error(tc("saveFailed"));
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tc("saveFailed"));
      toast.success(tc("updated"));
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tc("saveFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(fullName || "");
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-text">
          {t("email")}
        </label>
        <p className="mt-1 text-sm text-text">{email}</p>
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-text"
        >
          {t("name")}
        </label>
        {isEditing ? (
          <div className="mt-1">
            <input
              id="full_name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder={t("namePlaceholder")}
              maxLength={100}
            />
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleSave}
                loading={isLoading}
                variant="primary"
                size="sm"
              >
                {tc("save")}
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isLoading}
                variant="secondary"
                size="sm"
              >
                {tc("cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-1 flex items-center gap-3">
            <p className="text-sm text-text">
              {fullName || tc("notSet")}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
            >
              {tc("edit")}
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
