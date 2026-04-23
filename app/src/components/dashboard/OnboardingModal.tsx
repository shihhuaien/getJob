"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import {
  JOB_SEARCH_STATUSES,
  type JobSearchStatus,
} from "@/lib/validations";

const TOTAL_STEPS = 3;

export default function OnboardingModal() {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [status, setStatus] = useState<JobSearchStatus | "">("");
  const [targetRole, setTargetRole] = useState("");
  const [stepError, setStepError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const goNext = () => {
    setStepError("");
    if (step === 2 && !status) {
      setStepError(t("selectStatusRequired"));
      return;
    }
    if (step === 3) {
      void handleSubmit();
      return;
    }
    setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
  };

  const goBack = () => {
    setStepError("");
    setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile/onboarding", { method: "PATCH" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      toast.error(t("submitFailed"));
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!status) {
      setStep(2);
      setStepError(t("selectStatusRequired"));
      return;
    }
    const trimmed = targetRole.trim();
    if (!trimmed) {
      setStepError(t("targetRoleRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_search_status: status,
          target_role: trimmed,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? t("submitFailed"));
      }
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("submitFailed"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-brand-100 px-6 py-4">
          <span className="text-xs font-medium text-text-light">
            {t("stepLabel", { current: step, total: TOTAL_STEPS })}
          </span>
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1 text-xs text-text-light hover:text-text transition-colors disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            {t("skip")}
          </button>
        </div>

        <div className="px-6 pb-6 pt-8">
          <div className="mb-6 flex gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  idx < step ? "bg-brand-600" : "bg-brand-100"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 shadow-neu-inset">
                <Sparkles className="h-6 w-6 text-brand-600" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold text-text">
                {t("step1Title")}
              </h2>
              <p className="mt-1 text-sm text-text-light">{t("step1Subtitle")}</p>
              <p className="mt-4 text-sm leading-relaxed text-text">
                {t("step1Desc")}
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  t("step1Feature1"),
                  t("step1Feature2"),
                  t("step1Feature3"),
                ].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-text"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-text">
                {t("step2Title")}
              </h2>
              <p className="mt-1 text-sm text-text-light">{t("step2Subtitle")}</p>
              <div className="mt-5 grid grid-cols-1 gap-2">
                {JOB_SEARCH_STATUSES.map((s) => {
                  const selected = status === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setStatus(s);
                        setStepError("");
                      }}
                      className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                        selected
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-brand-200 text-text hover:bg-[color:var(--color-bg)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {t(`status_${s}`)}
                        </span>
                        {selected && <Check className="h-4 w-4 text-brand-600" />}
                      </div>
                      <p className="mt-1 text-xs text-text-light">
                        {t(`status_${s}_desc`)}
                      </p>
                    </button>
                  );
                })}
              </div>
              {stepError && (
                <p className="mt-3 text-xs text-error">{stepError}</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-text">
                {t("step3Title")}
              </h2>
              <p className="mt-1 text-sm text-text-light">{t("step3Subtitle")}</p>
              <label
                htmlFor="target_role"
                className="mt-5 block text-sm font-medium text-text"
              >
                {t("step3Label")}
              </label>
              <input
                id="target_role"
                type="text"
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value);
                  if (stepError) setStepError("");
                }}
                maxLength={120}
                placeholder={t("step3Placeholder")}
                className="mt-2 block w-full rounded-lg border border-brand-200 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                aria-invalid={Boolean(stepError)}
                aria-describedby={stepError ? "target-role-error" : undefined}
              />
              <p className="mt-2 text-xs text-text-placeholder">
                {t("step3Hint")}
              </p>
              {stepError && (
                <p id="target-role-error" className="mt-1 text-xs text-error">
                  {stepError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-brand-100 px-6 py-4">
          <button
            onClick={goBack}
            disabled={step === 1 || isSubmitting}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-light hover:text-text transition-colors disabled:invisible"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </button>
          <button
            onClick={goNext}
            disabled={isSubmitting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? t("saving")
              : step === TOTAL_STEPS
                ? t("finish")
                : t("next")}
            {!isSubmitting && step !== TOTAL_STEPS && (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
