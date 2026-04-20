"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Trash2, Loader2 } from "lucide-react";
import type { InterviewReport } from "@/types/interview";

interface JobSummary {
  company_name: string | null;
  job_title: string | null;
}

interface Props {
  id: string;
  persona: string;
  interviewType: string;
  status: "in_progress" | "completed" | "abandoned";
  report: InterviewReport | null;
  createdAt: string;
  job: JobSummary | null;
}

export default function InterviewSessionCard({
  id,
  persona,
  interviewType,
  status,
  report,
  createdAt,
  job,
}: Props) {
  const router = useRouter();
  const t = useTranslations("interview");
  const tc = useTranslations("common");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const overall = report?.scorecard?.overall;
  const href = status === "completed" ? `/interview/${id}/report` : `/interview/${id}`;

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/interview/sessions/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || tc("deleteFailed"));
        setIsDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      setError(tc("deleteFailed"));
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative rounded-xl bg-white shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-shadow">
      <Link href={href} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 pr-8">
            <h3 className="truncate text-sm font-semibold text-gray-900">
              {job?.company_name ?? t("unknownCompany")}
            </h3>
            <p className="mt-0.5 truncate text-xs text-gray-500">
              {job?.job_title ?? t("unknownJob")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                {t(`persona_${persona}` as "persona_hr_friendly")}
              </span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
                {t(`type_${interviewType}` as "type_behavioral")}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 ${
                  status === "completed"
                    ? "bg-green-50 text-green-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {t(`status_${status}` as "status_completed")}
              </span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
          {typeof overall === "number" && (
            <div className="flex shrink-0 flex-col items-center">
              <span
                className={`text-2xl font-bold ${
                  overall >= 80
                    ? "text-green-600"
                    : overall >= 60
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {overall}
              </span>
              <span className="text-[10px] text-gray-400">/ 100</span>
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowConfirm(true);
        }}
        className="absolute right-2 top-2 rounded-lg p-1.5 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 transition-opacity"
        aria-label={tc("delete")}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {showConfirm && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center rounded-xl bg-white/95 p-5">
          <p className="text-sm text-gray-800">{t("deleteConfirm")}</p>
          {error && (
            <p className="mt-2 text-xs text-red-600">{error}</p>
          )}
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {tc("deleting")}
                </>
              ) : (
                tc("confirmDelete")
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                setError(null);
              }}
              disabled={isDeleting}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {tc("cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
