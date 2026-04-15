import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "未授權" }, { status: 401 });
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

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ full_name: result.data.full_name })
      .eq("id", user.id);

    if (dbError) {
      return NextResponse.json(
        { error: "更新失敗，請稍後再試" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "更新失敗，請稍後再試" },
      { status: 500 }
    );
  }
}
