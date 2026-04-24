"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type AiLang = "zh-TW" | "en" | null;

interface Props {
  initialValue: AiLang;
}

export default function AiLanguageForm({ initialValue }: Props) {
  const router = useRouter();
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const [value, setValue] = useState<AiLang>(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (next: AiLang) => {
    if (next === value) return;
    const prev = value;
    setValue(next);
    setIsSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ai_output_language: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || tc("saveFailed"));
      toast.success(t("aiLanguageSaved"));
      router.refresh();
    } catch (err) {
      setValue(prev);
      toast.error(err instanceof Error ? err.message : tc("saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const options: { value: AiLang; label: string }[] = [
    { value: null, label: t("aiLanguageFollowLocale") },
    { value: "zh-TW", label: t("aiLanguageZh") },
    { value: "en", label: t("aiLanguageEn") },
  ];

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-light">{t("aiLanguageDesc")}</p>
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={opt.value ?? "auto"}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              name="ai_output_language"
              checked={value === opt.value}
              onChange={() => handleChange(opt.value)}
              disabled={isSaving}
              className="h-4 w-4 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-sm text-text">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
