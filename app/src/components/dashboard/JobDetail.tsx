"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

const statusOptions: { key: ApplicationStatus; label: string }[] = [
  { key: "saved", label: "已儲存" },
  { key: "applied", label: "已投遞" },
  { key: "interview", label: "面試中" },
  { key: "offer", label: "已錄取" },
  { key: "rejected", label: "未錄取" },
];

interface Props {
  job: JobApplication;
}

export default function JobDetail({ job }: Props) {
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
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("job_applications")
      .update({
        company_name: form.company_name,
        job_title: form.job_title,
        job_url: form.job_url || null,
        job_description: form.job_description || null,
        status: form.status,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        notes: form.notes || null,
        applied_at: form.applied_at || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    if (dbError) {
      setError("儲存失敗，請稍後再試");
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
      setError("刪除失敗，請稍後再試");
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
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回職缺列表
        </Link>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
              >
                編輯
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
                {isSaving ? "儲存中..." : "儲存"}
              </button>
              <button
                onClick={handleCancel}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
            </>
          )}
        </div>
      </div>

      {/* 刪除確認 */}
      {showDeleteConfirm && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            確定要刪除此職缺嗎？此操作無法復原。
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "刪除中..." : "確認刪除"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
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
          已更新
        </div>
      )}

      <div className="space-y-6">
        {/* 基本資訊 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">基本資訊</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                公司名稱
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) =>
                    setForm({ ...form, company_name: e.target.value })
                  }
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {job.company_name}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                職位名稱
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.job_title}
                  onChange={(e) =>
                    setForm({ ...form, job_title: e.target.value })
                  }
                  required
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{job.job_title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                狀態
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
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                >
                  {statusOptions.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {statusOptions.find((s) => s.key === job.status)?.label}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                投遞日期
              </label>
              {isEditing ? (
                <input
                  type="date"
                  value={form.applied_at}
                  onChange={(e) =>
                    setForm({ ...form, applied_at: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {job.applied_at
                    ? new Date(job.applied_at).toLocaleDateString("zh-TW")
                    : "未設定"}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                職缺連結
              </label>
              {isEditing ? (
                <input
                  type="url"
                  value={form.job_url}
                  onChange={(e) =>
                    setForm({ ...form, job_url: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="https://..."
                />
              ) : job.job_url ? (
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
                <p className="mt-1 text-sm text-gray-400">未設定</p>
              )}
            </div>
          </div>
        </div>

        {/* 薪資範圍 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">薪資範圍</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                最低薪資
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={form.salary_min}
                  onChange={(e) =>
                    setForm({ ...form, salary_min: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="例：40000"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {job.salary_min
                    ? `NT$ ${job.salary_min.toLocaleString()}`
                    : "未設定"}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                最高薪資
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={form.salary_max}
                  onChange={(e) =>
                    setForm({ ...form, salary_max: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                  placeholder="例：60000"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  {job.salary_max
                    ? `NT$ ${job.salary_max.toLocaleString()}`
                    : "未設定"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 職缺描述 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">職缺描述</h2>
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={form.job_description}
                onChange={(e) =>
                  setForm({ ...form, job_description: e.target.value })
                }
                rows={6}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="貼上職缺描述..."
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {job.job_description || "尚無描述"}
              </p>
            )}
          </div>
        </div>

        {/* 備註 */}
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">備註</h2>
          <div className="mt-4">
            {isEditing ? (
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({ ...form, notes: e.target.value })
                }
                rows={4}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="記錄面試心得、聯絡人資訊等..."
              />
            ) : (
              <p className="whitespace-pre-wrap text-sm text-gray-700">
                {job.notes || "尚無備註"}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
