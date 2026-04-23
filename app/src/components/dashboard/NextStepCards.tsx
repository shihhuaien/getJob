import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Briefcase, FileText, Mic, ArrowRight } from "lucide-react";

interface Props {
  hasJob: boolean;
  hasResume: boolean;
  hasInterview: boolean;
}

export default async function NextStepCards({
  hasJob,
  hasResume,
  hasInterview,
}: Props) {
  const t = await getTranslations("dashboard");

  const steps: {
    key: "job" | "resume" | "interview";
    done: boolean;
    title: string;
    desc: string;
    cta: string;
    href: string;
    icon: typeof Briefcase;
  }[] = [
    {
      key: "job",
      done: hasJob,
      title: t("nextStepJobTitle"),
      desc: t("nextStepJobDesc"),
      cta: t("nextStepJobCta"),
      href: "/jobs",
      icon: Briefcase,
    },
    {
      key: "resume",
      done: hasResume,
      title: t("nextStepResumeTitle"),
      desc: t("nextStepResumeDesc"),
      cta: t("nextStepResumeCta"),
      href: "/resume",
      icon: FileText,
    },
    {
      key: "interview",
      done: hasInterview,
      title: t("nextStepInterviewTitle"),
      desc: t("nextStepInterviewDesc"),
      cta: t("nextStepInterviewCta"),
      href: "/jobs",
      icon: Mic,
    },
  ];

  const pending = steps.filter((s) => !s.done);

  if (pending.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-text">{t("nextStepsTitle")}</h2>
      <p className="mt-1 text-sm text-text-light">{t("nextStepsSubtitle")}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {pending.map((step) => (
          <Link
            key={step.key}
            href={step.href}
            className="group rounded-2xl bg-white p-5 shadow-neu transition-transform hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 shadow-neu-inset">
              <step.icon
                className="h-5 w-5 text-brand-600"
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-text">
              {step.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-text-light">
              {step.desc}
            </p>
            <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-700">
              {step.cta}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
