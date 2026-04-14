import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import CoverLetterEditor from "@/components/dashboard/CoverLetterEditor";

export default async function CoverLetterEditorPage({
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

  const { data: coverLetter } = await supabase
    .from("cover_letters")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!coverLetter) notFound();

  return <CoverLetterEditor coverLetter={coverLetter} />;
}
