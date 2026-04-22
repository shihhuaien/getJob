"use client";

import { useState } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { jobUpdateSchema, isValidHttpUrl } from "@/lib/validations";
import type { Database } from "@/types/database";
import InterviewLaunchButton from "@/components/interview/InterviewLaunchButton";
import InterviewTriggerBanner from "@/components/interview/InterviewTriggerBanner";

type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

const statusKeys: { key: ApplicationStatus; labelKey: string }[] = [
  { key: "saved", labelKey: "saved" },
  { key: "applied", labelKey: "applied" },
  { key: "interview", labelKey: "interview" },
  { key: "offer", labelKey: "offer" },
  { key: "rejected", labelKey: "rejected" },
];

interface Props {
  job: JobApplication;
}

export default function JobDetail({ job }: Props) {
  const t = useTranslations("jobs");
  const tc = useTranslations("common");
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    company_name: job.company_name,
    job_title: job.job_title,
    job_url: job.job_url || "",
    job_description: job.job_description || "",
    status: job.status,
    salary_min: job.salary_min?.toString() || "",
    salary_max: job.salary_max?.toString() || "",
    notes: job.notes || "",
    applied_at: job.applied_at?.split("T")[0] || "",
  });

  const handleSave = async () => {
    setError(null);
    setSuccess(false);

    const validation = jobUpdateSchema.safeParse({
      company_name: form.company_name,
      job_title: form.job_title,
      job_url: form.job_url || "",
      job_description: form.job_description || "",
      notes: form.notes || "",
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      applied_at: form.applied_at || null,
    });

    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsSaving(true);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("job_applications")
      .update({
        company_name: validation.data.company_name,
        job_title: validation.data.job_title,
        job_url: form.job_url || null,
        job_description: form.job_description || null,
        status: form.status,
        salary_min: validation.data.salary_min,
        salary_max: validation.data.salary_max,
        notes: form.notes || null,
        applied_at: form.applied_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (dbError) {
      setError(tc("saveFailed"));
    } else {
      setSuccess(true);
      setIsEditing(false);
      router.refresh();
    }
    setIsSaving(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("job_applications")
      .delete()
      .eq("id", job.id);

    if (dbError) {
      setError(tc("deleteFailed"));
      setIsDeleting(false);
    } else {
      router.push("/jobs");
    }
  };

  const handleCancel = () => {
    setForm({
      company_name: job.company_name,
      job_title: job.job_title,
      job_url: job.job_url || "",
      job_description: job.job_description || "",
      status: job.status,
      salary_min: job.salary_min?.toString() || "",
      salary_max: job.salary_max?.toString() || "",
      notes: job.notes || "",
      applied_at: job.applied_at?.split("T")[0] || "",
    });
    setError(null);
    setSuccess(false);
    setIsEditing(false);
  };

  return (
    <div>
      {/* 頂部導航 */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm text-text-light hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToList")}
        </Link>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <InterviewLaunchButton
                jobId={job.id}
                jobTitle={job.job_title}
                companyName={job.company_name}
                hasDescription={Boolean(job.job_description)}
              />
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                {tc("edit")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-lg border border-red-300 p-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? tc("saving") : tc("save")}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-text hover:bg-[color:var(--color-bg)] transition-colors"
              >
                {tc("cancel")}
              </button>
            </>
          )}
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

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 rounded-lg bg-green-50 p-3 text-sm text-green-700">
          {tc("updated")}
        </div>
      )}

      {job.status === "interview" && !isEditing && (
        <InterviewTriggerBanner
          jobId={job.id}
          jobTitle={job.job_title}
          companyName={job.company_name}
          hasDescription={Boolean(job.job_description)}
        />
      )}

      <div className="space-y-6">
        {/* 基本資訊 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <h2 className="text-lg font-semibold text-text">{t("basicInfo")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text">
                {t("companyName")}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) =>
                    setForm({ ...form, company_name: e.target.value })
                  }
                  required
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p className="mt-1 text-sm text-text">
                  {job.company_name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("jobTitle")}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.job_title}
                  onChange={(e) =>
                    setForm({ ...form, job_title: e.target.value })
                  }
                  required
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p className="mt-1 text-sm text-text">{job.job_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("status")}
              </label>
              {isEditing ? (
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value as ApplicationStatus,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {statusKeys.map((s) => (
                    <option key={s.key} value={s.key}>
                      {t(s.labelKey)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-sm text-text">
                  {t(statusKeys.find((s) => s.key === job.status)?.labelKey ?? "saved")}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("applyDate")}
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={form.applied_at}
                  onChange={(e) =>
                    setForm({ ...form, applied_at: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p className="mt-1 text-sm text-text">
                  {job.applied_at
                    ? new Date(job.applied_at).toLocaleDateString("zh-TW")
                    : tc("notSet")}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-text">
                {t("jobUrl")}
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={form.job_url}
                  onChange={(e) =>
                    setForm({ ...form, job_url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="https://..."
                />
              ) : job.job_url ? (
                isValidHttpUrl(job.job_url) ? (
                  <a
                    href={job.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
                  >
                    {job.job_url}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-text">{job.job_url}</p>
                )
              ) : (
                <p className="mt-1 text-sm text-text-placeholder">{tc("notSet")}</p>
              )}
            </div>
          </div>
        </div>

        {/* 薪資範圍 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <h2 className="text-lg font-semibold text-text">{t("salary")}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-text">
                {t("salaryMin")}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={form.salary_min}
                  onChange={(e) =>
                    setForm({ ...form, salary_min: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={t("salaryMinPlaceholder")}
                />
              ) : (
                <p className="mt-1 text-sm text-text">
                  {job.salary_min
                    ? `NT$ ${job.salary_min.toLocaleString()}`
                    : tc("notSet")}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-text">
                {t("salaryMax")}
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={form.salary_max}
                  onChange={(e) =>
                    setForm({ ...form, salary_max: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder={t("salaryMaxPlaceholder")}
                />
              ) : (
                <p className="mt-1 text-sm text-text">
                  {job.salary_max
                    ? `NT$ ${job.salary_max.toLocaleString()}`
                    : tc("notSet")}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 職缺描述 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <h2 className="text-lg font-semibold text-text">{t("description")}</h2>
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={form.job_description}
                onChange={(e) =>
                  setForm({ ...form, job_description: e.target.value })
                }
                rows={6}
                className="block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("descriptionPlaceholder")}
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm text-text">
                {job.job_description || t("noDescription")}
              </p>
            )}
          </div>
        </div>

        {/* 備註 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-100">
          <h2 className="text-lg font-semibold text-text">{t("notes")}</h2>
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                rows={4}
                className="block w-full rounded-lg border border-brand-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder={t("notesPlaceholder")}
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm text-text">
                {job.notes || t("noNotes")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
