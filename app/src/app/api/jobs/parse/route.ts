import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/auth/verify-api-token";
import { parseJobRequestSchema } from "@/lib/validations";
import { parseJobDescription } from "@/lib/parse-job";

export async function POST(request: Request) {
  try {
    const auth = await verifyRequest(request);

    if (auth.tier !== "pro") {
      return NextResponse.json(
        { error: "此功能需要 Pro 方案" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = parseJobRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const parsed = await parseJobDescription(validation.data.text);
    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("[/api/jobs/parse] Error:", err);
    const message = err instanceof Error ? err.message : "解析失敗，請稍後再試";
    if (message === "未授權" || message === "無效的 API 金鑰") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    return NextResponse.json({ error: "解析失敗，請稍後再試" }, { status: 500 });
  }
}
