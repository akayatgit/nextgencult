import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, ui_mode_default = "dark", days } = body;

    if (!title || !Array.isArray(days)) {
      return NextResponse.json(
        { error: "Missing required fields: title, days[]" },
        { status: 400 }
      );
    }

    const templateId =
      id ||
      `tmpl_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const { data, error } = await supabase
      .from("custom_roadmap_templates")
      .insert([
        {
          id: templateId,
          title,
          ui_mode_default,
          data: { days },
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating template:", error);
      return NextResponse.json(
        { error: "Failed to create template: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (error) {
    console.error("Error in POST /api/custom-roadmap/templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("custom_roadmap_templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching template:", error);
      return NextResponse.json(
        { error: "Failed to fetch template: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      ui_mode_default: data.ui_mode_default,
      days: (data as any).data?.days ?? [],
    });
  } catch (error) {
    console.error("Error in GET /api/custom-roadmap/templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

