"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Mic, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import StartInterviewModal from "./StartInterviewModal";

interface Props {
  jobId: string;
  jobTitle: string;
  companyName: string;
  hasDescription: boolean;
}

interface ResumeOption {
  id: string;
  title: string;
}

const STORAGE_KEY = "interview_banner_dismissed";

function isDismissed(jobId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const list = JSON.parse(raw) as string[];
    return Array.isArray(list) && list.includes(jobId);
  } catch {
    return false;
  }
}

function setDismissed(jobId: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(jobId)) list.push(jobId);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // no-op
  }
}

export default function InterviewTriggerBanner({
  jobId,
  jobTitle,
  companyName,
  hasDescription,
}: Props) {
  const t = useTranslations("interview");
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [aiOutputLanguage, setAiOutputLanguage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!isDismissed(jobId));
  }, [jobId]);

  if (!visible) return null;

  const handleOpen = async () => {
    setLoadingResumes(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoadingResumes(false);
      return;
    }
    const [resumesRes, profileRes] = await Promise.all([
      supabase
        .from("resumes")
        .select("id, title")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("ai_output_language")
        .eq("id", user.id)
        .single(),
    ]);
    setResumes(resumesRes.data ?? []);
    setAiOutputLanguage(profileRes.data?.ai_output_language ?? null);
    setModalOpen(true);
    setLoadingResumes(false);
  };

  const handleDismiss = () => {
    setDismissed(jobId);
    setVisible(false);
  };

  return (
    <>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-4 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-orange-600 ring-1 ring-orange-200">
          <Mic className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-text">
            {t("bannerTitle")}
          </h3>
          <p className="mt-0.5 text-sm text-text">
            {t("bannerDescription", { company: companyName })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleOpen}
              disabled={loadingResumes}
              className="inline-flex items-center gap-1.5 rounded-lg bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loadingResumes ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
              {t("bannerCta")}
            </button>
            <button
              onClick={handleDismiss}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-light hover:bg-white/60 transition-colors"
            >
              {t("bannerDismiss")}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="shrink-0 rounded-lg p-1 text-text-placeholder hover:bg-white/60 hover:text-text-light transition-colors"
          aria-label={t("bannerDismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {modalOpen && (
        <StartInterviewModal
          jobs={[
            {
              id: jobId,
              job_title: jobTitle,
              company_name: companyName,
              hasDescription,
            },
          ]}
          resumes={resumes}
          onClose={() => setModalOpen(false)}
          initialAiLanguage={aiOutputLanguage}
        />
      )}
    </>
  );
}
