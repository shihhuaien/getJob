"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StartInterviewModal from "./StartInterviewModal";

interface ResumeOption {
  id: string;
  title: string;
}

interface JobOption {
  id: string;
  job_title: string;
  company_name: string;
  hasDescription: boolean;
}

export default function NewInterviewButton() {
  const t = useTranslations("interview");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async () => {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const [jobsRes, resumesRes] = await Promise.all([
      supabase
        .from("job_applications")
        .select("id, job_title, company_name, job_description")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("resumes")
        .select("id, title")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
    ]);

    const jobList: JobOption[] = (jobsRes.data ?? [])
      .map((j) => ({
        id: j.id,
        job_title: j.job_title,
        company_name: j.company_name,
        hasDescription: Boolean(j.job_description),
      }))
      // 把有描述的職缺排在前面，方便使用者選擇
      .sort((a, b) => Number(b.hasDescription) - Number(a.hasDescription));

    setJobs(jobList);
    setResumes(resumesRes.data ?? []);

    if (jobList.length === 0) {
      setError(t("noJobsForInterview"));
      setLoading(false);
      return;
    }
    if ((resumesRes.data ?? []).length === 0) {
      setError(t("noResumes"));
      setLoading(false);
      return;
    }

    setOpen(true);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        {t("newInterviewButton")}
      </button>

      {error && (
        <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {open && (
        <StartInterviewModal
          jobs={jobs}
          resumes={resumes}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
