import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const result = profileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const updates: {
      full_name?: string;
      ai_output_language?: "zh-TW" | "en" | null;
    } = {};
    if (result.data.full_name !== undefined) {
      updates.full_name = result.data.full_name;
    }
    if (result.data.ai_output_language !== undefined) {
      updates.ai_output_language = result.data.ai_output_language;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (dbError) {
      console.error("[/api/profile] DB error:", dbError);
      return NextResponse.json(
        { error: "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[/api/profile] Error:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
