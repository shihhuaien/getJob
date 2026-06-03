import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { tagCreateSchema } from "@/lib/validations";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("job_tags")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    if (error) {
      return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("[/api/tags GET] Error:", err);
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validation = tagCreateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("job_tags")
      .insert({ user_id: user.id, ...validation.data })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A tag with this name already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    console.error("[/api/tags POST] Error:", err);
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}
