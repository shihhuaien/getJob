"use client";

import { useTranslations } from "next-intl";

type AiLang = "zh-TW" | "en" | null;

interface Props {
  value: AiLang;
  onChange: (next: AiLang) => void;
  disabled?: boolean;
}

export default function AiLanguageSelector({ value, onChange, disabled = false }: Props) {
  const tc = useTranslations("common");

  const options: { value: AiLang; label: string }[] = [
    { value: null, label: tc("aiLanguageAuto") },
    { value: "zh-TW", label: tc("aiLanguageZh") },
    { value: "en", label: tc("aiLanguageEn") },
  ];

  const handleChange = (next: AiLang) => {
    if (disabled || next === value) return;
    onChange(next);
    fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ai_output_language: next }),
    }).catch(() => {});
  };

  return (
    <div>
      <span className="block text-xs font-medium text-text-light mb-1.5">
        {tc("aiLanguage")}
      </span>
      <div className="inline-flex rounded-lg border border-brand-200 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value ?? "auto"}
            type="button"
            onClick={() => handleChange(opt.value)}
            disabled={disabled}
            className={`px-3 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              value === opt.value
                ? "bg-brand-600 text-white"
                : "bg-white text-text-light hover:bg-brand-50 hover:text-text"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
