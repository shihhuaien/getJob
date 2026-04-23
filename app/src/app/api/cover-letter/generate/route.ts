import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateCoverLetterSchema } from "@/lib/validations";
import { generateCoverLetterStream } from "@/lib/generate-cover-letter";
import type { ResumeContent } from "@/types/resume";

export const DONE_SENTINEL = "\n---OFFERY_DONE---\n";
export const ERROR_SENTINEL = "\n---OFFERY_ERROR---\n";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 檢查訂閱狀態
    const { data: profile } = await supabase
      .from("profiles")
      .select("subscription_tier")
      .eq("id", user.id)
      .single();

    if (profile?.subscription_tier !== "pro") {
      return NextResponse.json(
        { error: "Pro plan required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = generateCoverLetterSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { resume_id, job_id } = validation.data;

    // 平行查詢履歷與職缺
    const [resumeResult, jobResult] = await Promise.all([
      supabase
        .from("resumes")
        .select("content")
        .eq("id", resume_id)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("job_applications")
        .select("job_description, job_title, company_name")
        .eq("id", job_id)
        .eq("user_id", user.id)
        .single(),
    ]);

    if (!resumeResult.data) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    if (!jobResult.data) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (!jobResult.data.job_description) {
      return NextResponse.json(
        { error: "Job has no description" },
        { status: 400 }
      );
    }

    const resumeContent = resumeResult.data
      .content as unknown as ResumeContent;
    const { job_description, company_name, job_title } = jobResult.data;
    const locale = body.locale;

    const titleText = locale === "en"
      ? `Cover Letter for ${company_name}`
      : `致${company_name}的求職信`;

    const encoder = new TextEncoder();
    const userId = user.id;

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let fullText = "";
        try {
          for await (const chunk of generateCoverLetterStream(
            resumeContent,
            job_description,
            company_name,
            job_title,
            locale
          )) {
            fullText += chunk;
            controller.enqueue(encoder.encode(chunk));
          }

          const content = fullText.trim();
          const serverSupabase = await createClient();
          const { data: coverLetter, error: dbError } = await serverSupabase
            .from("cover_letters")
            .insert({
              user_id: userId,
              title: titleText,
              content,
              job_application_id: job_id,
            })
            .select("id")
            .single();

          if (dbError || !coverLetter) {
            controller.enqueue(
              encoder.encode(
                ERROR_SENTINEL +
                  JSON.stringify({ error: "Failed to create cover letter" })
              )
            );
          } else {
            controller.enqueue(
              encoder.encode(DONE_SENTINEL + JSON.stringify({ id: coverLetter.id }))
            );
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to generate cover letter";
          controller.enqueue(
            encoder.encode(ERROR_SENTINEL + JSON.stringify({ error: message }))
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[/api/cover-letter/generate] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to generate cover letter";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
