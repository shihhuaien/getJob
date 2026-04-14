import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { full_name } = body;

    if (typeof full_name !== "string" || full_name.trim().length === 0) {
      return NextResponse.json(
        { error: "姓名不可為空" },
        { status: 400 }
      );
    }

    if (full_name.trim().length > 100) {
      return NextResponse.json(
        { error: "姓名不可超過 100 字" },
        { status: 400 }
      );
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ full_name: full_name.trim() })
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
