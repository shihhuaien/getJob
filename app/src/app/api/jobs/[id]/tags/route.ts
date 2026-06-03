import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { jobTagsUpdateSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 確認職缺所有權
    const { data: job, error: jobError } = await supabase
      .from("job_applications")
      .select("id")
      .eq("id", jobId)
      .eq("user_id", user.id)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await request.json();
    const validation = jobTagsUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { tag_ids } = validation.data;

    // 刪除現有標籤關聯
    const { error: deleteError } = await supabase
      .from("job_application_tags")
      .delete()
      .eq("job_id", jobId);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to update tags" }, { status: 500 });
    }

    // 插入新的標籤關聯
    if (tag_ids.length > 0) {
      const rows = tag_ids.map((tag_id) => ({ job_id: jobId, tag_id }));
      const { error: insertError } = await supabase
        .from("job_application_tags")
        .insert(rows);

      if (insertError) {
        return NextResponse.json({ error: "Failed to update tags" }, { status: 500 });
      }
    }

    return NextResponse.json({ data: { tag_ids } });
  } catch (err) {
    console.error("[/api/jobs/[id]/tags PUT] Error:", err);
    return NextResponse.json({ error: "Failed to update tags" }, { status: 500 });
  }
}
