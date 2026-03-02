import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: debates, error } = await supabase
      .from("debates")
      .select("id, user_id, display_name, topic, result, voters_won, total_voters, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;

    // Format time ago
    const now = new Date();
    const formattedDebates = debates.map((debate) => {
      const createdAt = new Date(debate.created_at);
      const diffMs = now.getTime() - createdAt.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = "";
      if (diffMins < 1) timeAgo = "just now";
      else if (diffMins < 60) timeAgo = `${diffMins}m ago`;
      else if (diffHours < 24) timeAgo = `${diffHours}h ago`;
      else timeAgo = `${diffDays}d ago`;

      return {
        ...debate,
        timeAgo,
      };
    });

    return NextResponse.json(formattedDebates);
  } catch (error) {
    console.error("Error fetching recent debates:", error);
    return NextResponse.json({ error: "Failed to fetch debates" }, { status: 500 });
  }
}
