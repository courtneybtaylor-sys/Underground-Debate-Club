import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { mode, messages, depth, oracleLineGenerated } = await request.json();

    const { data: conversation, error } = await supabase
      .from("oracle_conversations")
      .insert([
        {
          user_id: user.id,
          mode,
          messages,
          depth,
          oracle_line_generated: oracleLineGenerated,
        },
      ])
      .select();

    if (error) throw error;

    // If oracle line generated, update user profile
    if (oracleLineGenerated) {
      await supabase
        .from("users")
        .update({
          oracle_line: oracleLineGenerated,
        })
        .eq("id", user.id);
    }

    return NextResponse.json(conversation[0]);
  } catch (error) {
    console.error("Error saving oracle conversation:", error);
    return NextResponse.json({ error: "Failed to save conversation" }, { status: 500 });
  }
}
