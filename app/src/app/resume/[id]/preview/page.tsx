import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import ResumePreview from "@/components/dashboard/ResumePreview";

export default async function ResumePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resume } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!resume) notFound();

  return <ResumePreview resume={resume} />;
}
