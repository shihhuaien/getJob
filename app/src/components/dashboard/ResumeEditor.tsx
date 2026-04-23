"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, Plus, Trash2, X, Eye, Sparkles } from "lucide-react";
import { toast } from "sonner";
import ResumeOptimizeModal from "./ResumeOptimizeModal";
import { createClient } from "@/lib/supabase/client";
import { resumeUpdateSchema } from "@/lib/validations";
import { useAutosave } from "@/hooks/useAutosave";
import AutosaveIndicator from "@/components/ui/AutosaveIndicator";
import type { Database } from "@/types/database";
import type {
  ResumeContent,
  ResumeEducation,
  ResumeExperience,
  ResumePersonal,
} from "@/types/resume";
import { emptyResumeContent } from "@/types/resume";

type Resume = Database["public"]["Tables"]["resumes"]["Row"];

function generateId() {
  return crypto.randomUUID();
}

function parseContent(content: unknown): ResumeContent {
  if (
    content &&
    typeof content === "object" &&
    "personal" in content
  ) {
    return content as ResumeContent;
  }
  return emptyResumeContent;
}

interface JobOption {
  id: string;
  company_name: string;
  job_title: string;
  has_description: boolean;
}

interface Props {
  resume: Resume;
  isPro?: boolean;
  jobs?: JobOption[];
}

export default function ResumeEditor({ resume, isPro = false, jobs = [] }: Props) {
  const router = useRouter();
  const t = useTranslations("resume");
  const tc = useTranslations("common");
  const [title, setTitle] = useState(resume.title);
  const [targetJobTitle, setTargetJobTitle] = useState(
    resume.target_job_title || ""
  );
  const [content, setContent] = useState<ResumeContent>(
    parseContent(resume.content)
  );
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "experience" | "skills"
  >("personal");
  const [showOptimize, setShowOptimize] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formData = useMemo(
    () => ({ title, targetJobTitle, content }),
    [title, targetJobTitle, content]
  );

  const persist = useCallback(
    async (data: {
      title: string;
      targetJobTitle: string;
      content: ResumeContent;
    }) => {
      const validation = resumeUpdateSchema.safeParse({
        title: data.title,
        target_job_title: data.targetJobTitle || "",
      });
      if (!validation.success) {
        throw new Error(validation.error.issues[0].message);
      }
      const supabase = createClient();
      const { error: dbError } = await supabase
        .from("resumes")
        .update({
          title: validation.data.title,
          target_job_title: data.targetJobTitle || null,
          content: data.content as unknown as Database["public"]["Tables"]["resumes"]["Update"]["content"],
          updated_at: new Date().toISOString(),
        })
        .eq("id", resume.id);
      if (dbError) throw new Error(tc("saveFailed"));
    },
    [resume.id, tc]
  );

  const { status, savedAt, flush } = useAutosave({
    data: formData,
    onSave: persist,
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resume.id);

    if (dbError) {
      toast.error(tc("deleteFailed"));
      setIsDeleting(false);
      return;
    }

    toast.success(tc("deleted"));
    router.push("/resume");
  };

  const handleManualSave = async () => {
    try {
      await flush();
      toast.success(tc("saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tc("saveFailed"));
    }
  };

  // 個人資訊
  const updatePersonal = (field: keyof ResumePersonal, value: string) => {
    setContent({
      ...content,
      personal: { ...content.personal, [field]: value },
    });
  };

  // 學歷
  const addEducation = () => {
    setContent({
      ...content,
      education: [
        ...content.education,
        {
          id: generateId(),
          school: "",
          degree: "",
          field: "",
          start_date: "",
          end_date: "",
        },
      ],
    });
  };

  const updateEducation = (
    id: string,
    field: keyof ResumeEducation,
    value: string
  ) => {
    setContent({
      ...content,
      education: content.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const removeEducation = (id: string) => {
    setContent({
      ...content,
      education: content.education.filter((edu) => edu.id !== id),
    });
  };

  // 工作經歷
  const addExperience = () => {
    setContent({
      ...content,
      experience: [
        ...content.experience,
        {
          id: generateId(),
          company: "",
          title: "",
          start_date: "",
          end_date: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (
    id: string,
    field: keyof ResumeExperience,
    value: string
  ) => {
    setContent({
      ...content,
      experience: content.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeExperience = (id: string) => {
    setContent({
      ...content,
      experience: content.experience.filter((exp) => exp.id !== id),
    });
  };

  // 技能
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const skill = newSkill.trim();
    if (skill && !content.skills.includes(skill)) {
      setContent({ ...content, skills: [...content.skills, skill] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setContent({
      ...content,
      skills: content.skills.filter((s) => s !== skill),
    });
  };

  const tabs = [
    { key: "personal" as const, label: t("personal") },
    { key: "education" as const, label: t("education") },
    { key: "experience" as const, label: t("experience") },
    { key: "skills" as const, label: t("skills") },
  ];

  return (
    <div>
      {/* 頂部導航 */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/resume"
          className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>
        <div className="flex items-center gap-3">
          <AutosaveIndicator status={status} savedAt={savedAt} />
          {isPro && (
            <button
              onClick={() => setShowOptimize(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100 transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              {t("aiOptimize")}
            </button>
          )}
          <Link
            href={`/resume/${resume.id}/preview`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
          >
            <Eye className="h-4 w-4" />
            {t("preview")}
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleManualSave}
            disabled={status === "saving"}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {status === "saving" ? tc("saving") : tc("save")}
          </button>
        </div>
      </div>

      {/* 刪除確認 */}
      {showDeleteConfirm && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            {t("deleteConfirm")}
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? tc("deleting") : tc("confirmDelete")}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
            >
              {tc("cancel")}
            </button>
          </div>
        </div>
      )}

      {/* 履歷標題 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-text">
              {t("resumeTitle")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder={t("titlePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text">
              {t("targetJobTitle")}
            </label>
            <input
              type="text"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder={t("targetJobPlaceholder")}
            />
          </div>
        </div>
      </div>

      {/* 分頁標籤 */}
      <div className="mb-6 flex gap-1 rounded-lg bg-brand-50 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-text shadow-sm"
                : "text-text-light hover:text-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 個人資訊 */}
      {activeTab === "personal" && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <h2 className="text-lg font-semibold text-text">{t("personal")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text">
                {t("name")}
              </label>
              <input
                type="text"
                value={content.personal.name}
                onChange={(e) => updatePersonal("name", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("email")}
              </label>
              <input
                type="email"
                value={content.personal.email}
                onChange={(e) => updatePersonal("email", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("phone")}
              </label>
              <input
                type="tel"
                value={content.personal.phone}
                onChange={(e) => updatePersonal("phone", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("location")}
              </label>
              <input
                type="text"
                value={content.personal.location}
                onChange={(e) => updatePersonal("location", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("locationPlaceholder")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text">
                {t("summary")}
              </label>
              <textarea
                value={content.personal.summary}
                onChange={(e) => updatePersonal("summary", e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("summaryPlaceholder")}
              />
            </div>
          </div>
        </div>
      )}

      {/* 學歷 */}
      {activeTab === "education" && (
        <div className="space-y-4">
          {content.education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text">
                  {edu.school || t("newEducation")}
                </h3>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-text-placeholder hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("school")}
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(edu.id, "school", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("degree")}
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder={t("degreePlaceholder")}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("field")}
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, "field", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder={t("fieldPlaceholder")}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text">
                      {t("startDate")}
                    </label>
                    <input
                      type="month"
                      value={edu.start_date}
                      onChange={(e) =>
                        updateEducation(edu.id, "start_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text">
                      {t("endDate")}
                    </label>
                    <input
                      type="month"
                      value={edu.end_date}
                      onChange={(e) =>
                        updateEducation(edu.id, "end_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 py-4 text-sm font-medium text-text-light hover:border-brand-500 hover:text-text transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("addEducation")}
          </button>
        </div>
      )}

      {/* 工作經歷 */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {content.experience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text">
                  {exp.company || t("newExperience")}
                </h3>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-text-placeholder hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("company")}
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text">
                    {t("jobTitleLabel")}
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(exp.id, "title", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text">
                      {t("startDate")}
                    </label>
                    <input
                      type="month"
                      value={exp.start_date}
                      onChange={(e) =>
                        updateExperience(exp.id, "start_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text">
                      {t("endDate")}
                    </label>
                    <input
                      type="month"
                      value={exp.end_date}
                      onChange={(e) =>
                        updateExperience(exp.id, "end_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-text">
                    {t("workDescription")}
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder={t("workDescPlaceholder")}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-200 py-4 text-sm font-medium text-text-light hover:border-brand-500 hover:text-text transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("addExperience")}
          </button>
        </div>
      )}

      {/* 技能 */}
      {activeTab === "skills" && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <h2 className="text-lg font-semibold text-text">{t("skills")}</h2>
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="block flex-1 rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("skillPlaceholder")}
              />
              <button
                onClick={addSkill}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                {t("addSkill")}
              </button>
            </div>
            {content.skills.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {content.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1.5 text-sm text-brand-700"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-brand-400 hover:text-brand-600 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-placeholder">{t("noSkills")}</p>
            )}
          </div>
        </div>
      )}

      {/* AI 優化分析 Modal */}
      {showOptimize && (
        <ResumeOptimizeModal
          resumeId={resume.id}
          jobs={jobs}
          onClose={() => setShowOptimize(false)}
        />
      )}
    </div>
  );
}
