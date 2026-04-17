import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { verifyRequest } from "@/lib/auth/verify-api-token";
import { jobCreateApiSchema } from "@/lib/validations";

function getSupabaseAdmin() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);

    const body = await request.json();
    const validation = jobCreateApiSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const admin = getSupabaseAdmin();
    const { data, error: dbError } = await admin
      .from("job_applications")
      .insert({
        user_id: auth.userId,
        company_name: validation.data.company_name,
        job_title: validation.data.job_title,
        job_url: validation.data.job_url || null,
        job_description: validation.data.job_description || null,
        salary_min: validation.data.salary_min ?? null,
        salary_max: validation.data.salary_max ?? null,
        notes: validation.data.notes || null,
        status: validation.data.status,
        position: 0,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json(
        { error: "Save failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    if (message === "Unauthorized" || message === "Invalid API key") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: "Save failed" }, { status: 500 });
  }
}
