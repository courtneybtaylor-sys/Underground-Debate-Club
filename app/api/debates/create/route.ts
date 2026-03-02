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
    const body = await request.json();
    const {
      displayName,
      topic,
      rhetoricClass,
      opponent,
      result,
      votersWon,
      totalVoters,
      round1Score,
      round2Score,
      round3Score,
      totalScore,
      aiArguments,
      userArguments,
      debrief,
    } = body;

    const { data: debate, error } = await supabase
      .from("debates")
      .insert([
        {
          user_id: user.id,
          display_name: displayName,
          topic,
          rhetoric_class: rhetoricClass,
          opponent,
          result,
          voters_won: votersWon,
          total_voters: totalVoters,
          round_1_score: round1Score,
          round_2_score: round2Score,
          round_3_score: round3Score,
          total_score: totalScore,
          ai_arguments: aiArguments,
          user_arguments: userArguments,
          debrief,
        },
      ])
      .select();

    if (error) throw error;

    // Update user stats
    const { data: userProfile } = await supabase
      .from("users")
      .select("debates, wins, streak, debates_for_oracle")
      .eq("id", user.id)
      .single();

    if (userProfile) {
      const newDebates = (userProfile.debates || 0) + 1;
      const newWins = (userProfile.wins || 0) + (result === "WIN" ? 1 : 0);
      const newStreak = result === "WIN" ? (userProfile.streak || 0) + 1 : 0;
      const newDebatesForOracle = (userProfile.debates_for_oracle || 0) + 1;

      await supabase
        .from("users")
        .update({
          debates: newDebates,
          wins: newWins,
          streak: newStreak,
          debates_for_oracle: newDebatesForOracle,
          underground_unlocked: newDebatesForOracle >= 5,
        })
        .eq("id", user.id);
    }

    return NextResponse.json(debate[0]);
  } catch (error) {
    console.error("Error creating debate:", error);
    return NextResponse.json({ error: "Failed to create debate" }, { status: 500 });
  }
}
