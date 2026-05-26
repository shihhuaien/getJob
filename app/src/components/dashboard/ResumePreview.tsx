"use client";

import { ArrowLeft, Download, Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Database } from "@/types/database";
import type { ResumeContent } from "@/types/resume";
import { emptyResumeContent } from "@/types/resume";

type Resume = Database["public"]["Tables"]["resumes"]["Row"];

function parseContent(content: unknown): ResumeContent {
  if (content && typeof content === "object" && "personal" in content) {
    return content as ResumeContent;
  }
  return emptyResumeContent;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  return month ? `${month}/${year}` : year;
}

interface Props {
  resume: Resume;
}

export default function ResumePreview({ resume }: Props) {
  const t = useTranslations("resume");
  const content = parseContent(resume.content);
  const { personal, education, experience, skills } = content;

  const handlePrint = () => {
    window.print();
  };

  const hasPersonalInfo =
    personal.name || personal.email || personal.phone || personal.location || personal.linkedin || personal.website;
  const hasContent =
    hasPersonalInfo ||
    personal.summary ||
    education.length > 0 ||
    experience.length > 0 ||
    skills.length > 0;

  return (
    <div className="min-h-screen bg-brand-50">
      <div className="print:hidden sticky top-0 z-10 border-b border-brand-100 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link
            href={`/resume/${resume.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToEdit")}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-light">{resume.title}</span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              {t("exportPdf")}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="bg-white shadow-sm print:shadow-none">
          <div className="px-12 py-10 print:px-16 print:py-12">
            {!hasContent ? (
              <p className="text-center text-text-placeholder">
                {t("emptyContent")}
              </p>
            ) : (
              <div className="space-y-8">
                {hasPersonalInfo && (
                  <header className="text-center">
                    {personal.name && (
                      <h1 className="text-2xl font-bold text-text">
                        {personal.name}
                      </h1>
                    )}
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-text-light">
                      {personal.email && (
                        <span className="inline-flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {personal.email}
                        </span>
                      )}
                      {personal.phone && (
                        <span className="inline-flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5" />
                          {personal.phone}
                        </span>
                      )}
                      {personal.location && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {personal.location}
                        </span>
                      )}
                      {personal.linkedin && (
                        <span className="inline-flex items-center gap-1">
                          <Linkedin className="h-3.5 w-3.5" />
                          {personal.linkedin}
                        </span>
                      )}
                      {personal.website && (
                        <span className="inline-flex items-center gap-1">
                          <Globe className="h-3.5 w-3.5" />
                          {personal.website}
                        </span>
                      )}
                    </div>
                  </header>
                )}

                {personal.summary && (
                  <section>
                    <h2 className="border-b border-brand-200 pb-1 text-sm font-bold uppercase tracking-wider text-text">
                      {t("summary")}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-text whitespace-pre-wrap">
                      {personal.summary}
                    </p>
                  </section>
                )}

                {experience.length > 0 && (
                  <section>
                    <h2 className="border-b border-brand-200 pb-1 text-sm font-bold uppercase tracking-wider text-text">
                      {t("experience")}
                    </h2>
                    <div className="mt-3 space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-text">
                                {exp.title}
                              </h3>
                              <p className="text-sm text-text-light">
                                {exp.company}
                              </p>
                            </div>
                            {(exp.start_date || exp.end_date) && (
                              <span className="flex-shrink-0 text-xs text-text-light">
                                {formatDate(exp.start_date)}
                                {exp.start_date && " — "}
                                {exp.end_date
                                  ? formatDate(exp.end_date)
                                  : t("present")}
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-text whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {education.length > 0 && (
                  <section>
                    <h2 className="border-b border-brand-200 pb-1 text-sm font-bold uppercase tracking-wider text-text">
                      {t("education")}
                    </h2>
                    <div className="mt-3 space-y-3">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="flex items-start justify-between"
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-text">
                              {edu.school}
                            </h3>
                            <p className="text-sm text-text-light">
                              {[edu.degree, edu.field]
                                .filter(Boolean)
                                .join(" — ")}
                            </p>
                          </div>
                          {(edu.start_date || edu.end_date) && (
                            <span className="flex-shrink-0 text-xs text-text-light">
                              {formatDate(edu.start_date)}
                              {edu.start_date && " — "}
                              {edu.end_date
                                ? formatDate(edu.end_date)
                                : t("present")}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {skills.length > 0 && (
                  <section>
                    <h2 className="border-b border-brand-200 pb-1 text-sm font-bold uppercase tracking-wider text-text">
                      {t("skills")}
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2 print:hidden">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-brand-50 px-2.5 py-1 text-sm text-text"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="mt-3 hidden text-sm text-text print:block">
                      {skills.join(", ")}
                    </p>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
