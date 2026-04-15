"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, X, Eye } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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

interface Props {
  resume: Resume;
}

export default function ResumeEditor({ resume }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(resume.title);
  const [targetJobTitle, setTargetJobTitle] = useState(
    resume.target_job_title || ""
  );
  const [content, setContent] = useState<ResumeContent>(
    parseContent(resume.content)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "personal" | "education" | "experience" | "skills"
  >("personal");

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("resumes")
      .update({
        title,
        target_job_title: targetJobTitle || null,
        content: content as unknown as Database["public"]["Tables"]["resumes"]["Update"]["content"],
        updated_at: new Date().toISOString(),
      })
      .eq("id", resume.id);

    if (dbError) {
      setError("儲存失敗，請稍後再試");
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }
    setIsSaving(false);
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
    { key: "personal" as const, label: "個人資訊" },
    { key: "education" as const, label: "學歷" },
    { key: "experience" as const, label: "工作經歷" },
    { key: "skills" as const, label: "技能" },
  ];

  return (
    <div>
      {/* 頂部導航 */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/resume"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回履歷列表
        </Link>
        <div className="flex items-center gap-3">
          {success && (
            <span className="text-sm text-green-600">已儲存</span>
          )}
          {error && <span className="text-sm text-red-600">{error}</span>}
          <Link
            href={`/resume/${resume.id}/preview`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4" />
            預覽
          </Link>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "儲存中..." : "儲存"}
          </button>
        </div>
      </div>

      {/* 履歷標題 */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              履歷標題
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="例：前端工程師履歷"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              目標職位
            </label>
            <input
              type="text"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              placeholder="例：資深前端工程師"
            />
          </div>
        </div>
      </div>

      {/* 分頁標籤 */}
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 個人資訊 */}
      {activeTab === "personal" && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">個人資訊</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                type="text"
                value={content.personal.name}
                onChange={(e) => updatePersonal("name", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                電子郵件
              </label>
              <input
                type="email"
                value={content.personal.email}
                onChange={(e) => updatePersonal("email", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                電話
              </label>
              <input
                type="tel"
                value={content.personal.phone}
                onChange={(e) => updatePersonal("phone", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                所在地
              </label>
              <input
                type="text"
                value={content.personal.location}
                onChange={(e) => updatePersonal("location", e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="例：台北市"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                自我介紹
              </label>
              <textarea
                value={content.personal.summary}
                onChange={(e) => updatePersonal("summary", e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="簡述你的專業背景與求職目標..."
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
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {edu.school || "新學歷"}
                </h3>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    學校名稱
                  </label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) =>
                      updateEducation(edu.id, "school", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    學位
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, "degree", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="例：學士"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    科系
                  </label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) =>
                      updateEducation(edu.id, "field", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="例：資訊工程學系"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      開始日期
                    </label>
                    <input
                      type="month"
                      value={edu.start_date}
                      onChange={(e) =>
                        updateEducation(edu.id, "start_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      結束日期
                    </label>
                    <input
                      type="month"
                      value={edu.end_date}
                      onChange={(e) =>
                        updateEducation(edu.id, "end_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addEducation}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            新增學歷
          </button>
        </div>
      )}

      {/* 工作經歷 */}
      {activeTab === "experience" && (
        <div className="space-y-4">
          {content.experience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">
                  {exp.company || "新工作經歷"}
                </h3>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    公司名稱
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, "company", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    職位
                  </label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) =>
                      updateExperience(exp.id, "title", e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      開始日期
                    </label>
                    <input
                      type="month"
                      value={exp.start_date}
                      onChange={(e) =>
                        updateExperience(exp.id, "start_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">
                      結束日期
                    </label>
                    <input
                      type="month"
                      value={exp.end_date}
                      onChange={(e) =>
                        updateExperience(exp.id, "end_date", e.target.value)
                      }
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    工作描述
                  </label>
                  <textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, "description", e.target.value)
                    }
                    rows={4}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    placeholder="描述你的工作內容、成就與貢獻..."
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={addExperience}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            新增工作經歷
          </button>
        </div>
      )}

      {/* 技能 */}
      {activeTab === "skills" && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">技能</h2>
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
                className="block flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="輸入技能名稱，按 Enter 或點擊新增"
              />
              <button
                onClick={addSkill}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                新增
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
              <p className="mt-4 text-sm text-gray-400">尚未新增任何技能</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
