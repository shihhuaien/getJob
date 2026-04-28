"use client";

import { ClipboardPaste, Wand2, Mic } from "lucide-react";
import { useTranslations } from "next-intl";
import FadeInUp from "./motion/FadeInUp";
import StaggerContainer from "./motion/StaggerContainer";
import StaggerItem from "./motion/StaggerItem";

const steps = [
  {
    icon: ClipboardPaste,
    numberKey: "step1Number",
    titleKey: "step1Title",
    descKey: "step1Desc",
  },
  {
    icon: Wand2,
    numberKey: "step2Number",
    titleKey: "step2Title",
    descKey: "step2Desc",
  },
  {
    icon: Mic,
    numberKey: "step3Number",
    titleKey: "step3Title",
    descKey: "step3Desc",
  },
] as const;

export default function HowItWorks() {
  const t = useTranslations("landing");

  return (
    <section className="relative bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("howItWorksTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-light">
            {t("howItWorksSubtitle")}
          </p>
        </FadeInUp>

        <div className="relative mt-16">
          {/* 桌機橫向連接線 */}
          <div
            aria-hidden
            className="absolute left-[16.67%] right-[16.67%] top-12 hidden h-px md:block"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--color-brand-200, #B8CFC1) 20%, var(--color-brand-200, #B8CFC1) 80%, transparent)",
            }}
          />

          <StaggerContainer
            className="relative grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6"
            staggerDelay={0.12}
          >
            {steps.map((step) => (
              <StaggerItem
                key={step.numberKey}
                className="group relative flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-neu-hover motion-reduce:transform-none"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold tabular-nums text-brand-600/70">
                    {t(step.numberKey)}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                    <step.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text">
                  {t(step.titleKey)}
                </h3>
                <p className="text-sm leading-7 text-text-light">
                  {t(step.descKey)}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
