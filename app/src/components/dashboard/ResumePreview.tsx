"use client";

import Link from "next/link";
import { ArrowLeft, Download, Mail, Phone, MapPin } from "lucide-react";
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
  // 處理 "2024-06" 格式
  const [year, month] = dateStr.split("-");
  return month ? `${year}/${month}` : year;
}

interface Props {
  resume: Resume;
}

export default function ResumePreview({ resume }: Props) {
  const content = parseContent(resume.content);
  const { personal, education, experience, skills } = content;

  const handlePrint = () => {
    window.print();
  };


  const hasPersonalInfo =
    personal.name || personal.email || personal.phone || personal.location;
  const hasContent =
    hasPersonalInfo ||
    personal.summary ||
    education.length > 0 ||
    experience.length > 0 ||
    skills.length > 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 操作列 - 列印時隱藏 */}
      <div className="print:hidden sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link
            href={`/resume/${resume.id}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            返回編輯
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{resume.title}</span>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              匯出 PDF
            </button>
          </div>
        </div>
      </div>

      {/* 履歷內容 */}
      <div className="mx-auto max-w-4xl px-6 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="bg-white shadow-sm print:shadow-none">
          <div className="px-12 py-10 print:px-16 print:py-12">
            {!hasContent ? (
              <p className="text-center text-gray-400">
                履歷內容為空，請先填寫資料
              </p>
            ) : (
              <div className="space-y-8">
                {/* 個人資訊 */}
                {hasPersonalInfo && (
                  <header className="text-center">
                    {personal.name && (
                      <h1 className="text-2xl font-bold text-gray-900">
                        {personal.name}
                      </h1>
                    )}
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
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
                    </div>
                  </header>
                )}

                {/* 自我介紹 */}
                {personal.summary && (
                  <section>
                    <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-700">
                      自我介紹
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                      {personal.summary}
                    </p>
                  </section>
                )}

                {/* 工作經歷 */}
                {experience.length > 0 && (
                  <section>
                    <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-700">
                      工作經歷
                    </h2>
                    <div className="mt-3 space-y-4">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">
                                {exp.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {exp.company}
                              </p>
                            </div>
                            {(exp.start_date || exp.end_date) && (
                              <span className="flex-shrink-0 text-xs text-gray-500">
                                {formatDate(exp.start_date)}
                                {exp.start_date && " — "}
                                {exp.end_date
                                  ? formatDate(exp.end_date)
                                  : "至今"}
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="mt-1.5 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 學歷 */}
                {education.length > 0 && (
                  <section>
                    <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-700">
                      學歷
                    </h2>
                    <div className="mt-3 space-y-3">
                      {education.map((edu) => (
                        <div
                          key={edu.id}
                          className="flex items-start justify-between"
                        >
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {edu.school}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {[edu.degree, edu.field]
                                .filter(Boolean)
                                .join(" — ")}
                            </p>
                          </div>
                          {(edu.start_date || edu.end_date) && (
                            <span className="flex-shrink-0 text-xs text-gray-500">
                              {formatDate(edu.start_date)}
                              {edu.start_date && " — "}
                              {edu.end_date
                                ? formatDate(edu.end_date)
                                : "至今"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* 技能 */}
                {skills.length > 0 && (
                  <section>
                    <h2 className="border-b border-gray-300 pb-1 text-sm font-bold uppercase tracking-wider text-gray-700">
                      技能
                    </h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded bg-gray-100 px-2.5 py-1 text-sm text-gray-700 print:border print:border-gray-300 print:bg-transparent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
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
