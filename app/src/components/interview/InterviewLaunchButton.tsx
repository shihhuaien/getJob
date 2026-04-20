"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mic, Loader2 } from "lucide-react";
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

export default function InterviewLaunchButton({
  jobId,
  jobTitle,
  companyName,
  hasDescription,
}: Props) {
  const t = useTranslations("interview");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState<ResumeOption[]>([]);

  const handleOpen = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("resumes")
      .select("id, title")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setResumes(data ?? []);
    setOpen(true);
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg border border-brand-500 bg-white px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50 transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
        {t("launchButton")}
      </button>
      {open && (
        <StartInterviewModal
          jobId={jobId}
          jobTitle={jobTitle}
          companyName={companyName}
          hasDescription={hasDescription}
          resumes={resumes}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
