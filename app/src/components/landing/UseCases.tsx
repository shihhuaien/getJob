"use client";

import { useTranslations } from "next-intl";
import { Quote } from "lucide-react";
import FadeInUp from "./motion/FadeInUp";
import StaggerContainer from "./motion/StaggerContainer";
import StaggerItem from "./motion/StaggerItem";

const cases = [
  {
    personaKey: "useCase1Persona",
    initialsKey: "useCase1Initials",
    problemLabelKey: "useCase1ProblemLabel",
    problemKey: "useCase1Problem",
    solutionLabelKey: "useCase1SolutionLabel",
    solutionKey: "useCase1Solution",
    avatarClass: "bg-gradient-to-br from-brand-400 to-brand-600",
  },
  {
    personaKey: "useCase2Persona",
    initialsKey: "useCase2Initials",
    problemLabelKey: "useCase2ProblemLabel",
    problemKey: "useCase2Problem",
    solutionLabelKey: "useCase2SolutionLabel",
    solutionKey: "useCase2Solution",
    avatarClass: "bg-gradient-to-br from-accent to-[#B8633F]",
  },
  {
    personaKey: "useCase3Persona",
    initialsKey: "useCase3Initials",
    problemLabelKey: "useCase3ProblemLabel",
    problemKey: "useCase3Problem",
    solutionLabelKey: "useCase3SolutionLabel",
    solutionKey: "useCase3Solution",
    avatarClass: "bg-gradient-to-br from-info to-[#3F77B0]",
  },
] as const;

export default function UseCases() {
  const t = useTranslations("landing");

  return (
    <section className="bg-[var(--color-bg)] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeInUp className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-text/[0.06] px-3 py-1 text-xs font-semibold text-text-light">
            <Quote className="h-3.5 w-3.5" />
            {t("useCasesTag")}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("useCasesTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-light">
            {t("useCasesSubtitle")}
          </p>
        </FadeInUp>

        <StaggerContainer
          className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
          staggerDelay={0.1}
        >
          {cases.map((c) => (
            <StaggerItem
              key={c.personaKey}
              className="group flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-neu transition-all duration-base ease-out-quart hover:-translate-y-1 hover:shadow-neu-hover motion-reduce:transform-none"
            >
              {/* Persona */}
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full font-bold text-white ${c.avatarClass}`}
                >
                  {t(c.initialsKey)}
                </div>
                <span className="text-sm font-semibold text-text">
                  {t(c.personaKey)}
                </span>
              </div>

              {/* Problem */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-light/80">
                  {t(c.problemLabelKey)}
                </h4>
                <p className="mt-2 text-sm leading-7 text-text">
                  {t(c.problemKey)}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-brand-100/60" />

              {/* Solution */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  {t(c.solutionLabelKey)}
                </h4>
                <p className="mt-2 text-sm leading-7 text-text">
                  {t(c.solutionKey)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
