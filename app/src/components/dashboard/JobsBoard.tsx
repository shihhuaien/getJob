"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Building2, ExternalLink, Search, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type JobApplication = Database["public"]["Tables"]["job_applications"]["Row"];
type ApplicationStatus = Database["public"]["Enums"]["application_status"];

const statusColumns: { key: ApplicationStatus; label: string; color: string }[] = [
  { key: "saved", label: "已儲存", color: "bg-gray-100 text-gray-700" },
  { key: "applied", label: "已投遞", color: "bg-blue-100 text-blue-700" },
  { key: "interview", label: "面試中", color: "bg-yellow-100 text-yellow-700" },
  { key: "offer", label: "已錄取", color: "bg-green-100 text-green-700" },
  { key: "rejected", label: "未錄取", color: "bg-red-100 text-red-700" },
];

interface Props {
  initialJobs: JobApplication[];
  userId: string;
}

export default function JobsBoard({ initialJobs, userId }: Props) {
  const [jobs, setJobs] = useState(initialJobs);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    company_name: "",
    job_title: "",
    job_url: "",
    status: "saved" as ApplicationStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      !searchQuery ||
      job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("job_applications")
        .insert({
          user_id: userId,
          company_name: newJob.company_name,
          job_title: newJob.job_title,
          job_url: newJob.job_url || null,
          status: newJob.status,
        })
        .select()
        .single();

      if (error) throw error;

      setJobs((prev) => [data, ...prev]);
      setNewJob({ company_name: "", job_title: "", job_url: "", status: "saved" });
      setShowAddForm(false);
    } catch {
      setFormError("儲存失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: ApplicationStatus) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("job_applications")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (!error) {
      setJobs((prev) =>
        prev.map((job) => (job.id === id ? { ...job, status } : job))
      );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增職缺
        </button>
      </div>

      {/* 搜尋與篩選 */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2 pl-9 pr-9 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            placeholder="搜尋公司名稱或職位..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as ApplicationStatus | "all")
          }
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="all">所有狀態</option>
          {statusColumns.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddJob}
          className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                公司名稱
              </label>
              <input
                type="text"
                required
                value={newJob.company_name}
                onChange={(e) =>
                  setNewJob({ ...newJob, company_name: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="例：台積電"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                職位名稱
              </label>
              <input
                type="text"
                required
                value={newJob.job_title}
                onChange={(e) =>
                  setNewJob({ ...newJob, job_title: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="例：前端工程師"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                職缺連結（選填）
              </label>
              <input
                type="url"
                value={newJob.job_url}
                onChange={(e) =>
                  setNewJob({ ...newJob, job_url: e.target.value })
                }
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                placeholder="https://..."
              />
            </div>
          </div>
          {formError && (
            <p className="mt-3 text-sm text-red-600">{formError}</p>
          )}
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "儲存中..." : "儲存"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {statusColumns.map((col) => {
          const columnJobs = filteredJobs.filter((job) => job.status === col.key);
          return (
            <div key={col.key} className="rounded-xl bg-gray-100/50 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${col.color}`}
                >
                  {col.label}
                </span>
                <span className="text-xs text-gray-500">
                  {columnJobs.length}
                </span>
              </div>
              <div className="space-y-2">
                {columnJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-lg bg-white p-3 shadow-sm ring-1 ring-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="min-w-0 hover:opacity-75 transition-opacity"
                      >
                        <p className="truncate text-sm font-medium text-gray-900">
                          {job.job_title}
                        </p>
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                          <Building2 className="h-3 w-3" />
                          {job.company_name}
                        </div>
                      </Link>
                      {job.job_url && (
                        <a
                          href={job.job_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="mt-2">
                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleStatusChange(
                            job.id,
                            e.target.value as ApplicationStatus
                          )
                        }
                        className="w-full rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 focus:border-brand-500 focus:outline-none"
                      >
                        {statusColumns.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
                {columnJobs.length === 0 && (
                  <p className="py-4 text-center text-xs text-gray-400">
                    尚無職缺
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
