"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPlayer, savePlayer, updatePlayerStats } from "@/lib/storage";
import { getDebrief } from "@/lib/api";
import { checkBadgeEarned } from "@/lib/scoring";
import { BADGES } from "@/lib/constants";
import type { Player } from "@/lib/types";
import { Trophy, TrendingUp, Medal } from "lucide-react";

interface DebateSetup {
  topic: string;
  opponent: string;
  rhetoricClass: string;
}

interface DebateResults {
  playerTotal: number;
  aiTotal: number;
  playerVotes: number;
  rounds: number;
}

export default function ResultsPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [debateSetup, setDebateSetup] = useState<DebateSetup | null>(null);
  const [results, setResults] = useState<DebateResults | null>(null);
  const [debrief, setDebrief] = useState("");
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getPlayer();
    if (!p) {
      router.push("/");
      return;
    }

    const setup = sessionStorage.getItem("debateSetup");
    const debateResults = sessionStorage.getItem("debateResults");

    if (!setup || !debateResults) {
      router.push("/lobby");
      return;
    }

    const debate = JSON.parse(setup) as DebateSetup;
    const res = JSON.parse(debateResults) as DebateResults;

    setDebateSetup(debate);
    setResults(res);

    // Check if player won
    const won = res.playerTotal > res.aiTotal;
    const badges = checkBadgeEarned(
      won,
      { logic: 70, rhetoric: 65, fact: 75 },
      res.playerVotes,
      res.rounds,
      {},
      0,
      p.streak + (won ? 1 : 0)
    );

    setEarnedBadges(badges);

    // Update player stats
    const updatedPlayer = updatePlayerStats(p, won, badges);
    setPlayer(updatedPlayer);
    savePlayer(updatedPlayer);

    // Fetch debrief
    getDebrief(debate.topic, "User argument", "AI counter", 3)
      .then((response) => {
        setDebrief(response.response);
      })
      .catch((error) => {
        console.error("Error fetching debrief:", error);
        setDebrief(
          "Great debate! You demonstrated strong argumentation skills. Consider how you could have approached the topic from a different angle."
        );
      })
      .finally(() => {
        setLoading(false);
      });

    // Clear session storage
    sessionStorage.removeItem("debateSetup");
    sessionStorage.removeItem("debateResults");
  }, [router]);

  if (!player || !debateSetup || !results) return null;

  const won = results.playerTotal > results.aiTotal;
  const margin = Math.abs(results.playerTotal - results.aiTotal);

  return (
    <main className="min-h-screen bg-background text-foreground py-8">
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Winner Announcement */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            {won ? (
              <Trophy className="text-accent" size={64} />
            ) : (
              <Medal className="text-secondary" size={64} />
            )}
          </div>
          <h1 className="text-4xl font-bold">
            {won ? "Victory!" : "Defeat"}
          </h1>
          <p className="text-xl text-foreground/70">
            {won
              ? "You've defeated your opponent and earned victory!"
              : `You fought valiantly but fell short this time.`}
          </p>
        </div>

        {/* Scores */}
        <Card className="p-6 bg-primary/10 border-primary">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {results.playerTotal}
              </div>
              <div className="text-sm text-foreground/70">Your Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">vs</div>
              <div className="text-sm text-foreground/70">Margin</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                {results.aiTotal}
              </div>
              <div className="text-sm text-foreground/70">Opponent Score</div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Debate Stats</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-2xl font-bold text-primary">{results.playerVotes}</div>
              <div className="text-xs text-foreground/60">Judges Won</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-2xl font-bold text-secondary">{results.rounds}</div>
              <div className="text-xs text-foreground/60">Rounds</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-2xl font-bold text-accent">{margin}</div>
              <div className="text-xs text-foreground/60">Point Margin</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-2xl font-bold text-primary">{player.debates}</div>
              <div className="text-xs text-foreground/60">Total Debates</div>
            </div>
          </div>
        </Card>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <Card className="p-6 bg-accent/10 border-accent">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Badges Earned
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {earnedBadges.map((badgeId) => {
                const badge = BADGES.find((b) => b.id === badgeId);
                return (
                  <div key={badgeId} className="text-center">
                    <Badge variant="earned" className="w-full">
                      {badge?.name}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Debrief */}
        <Card className="p-6 border-secondary">
          <h2 className="text-xl font-bold mb-4">AI Coach Debrief</h2>
          {loading ? (
            <p className="text-foreground/70">Loading feedback...</p>
          ) : (
            <p className="text-foreground text-base leading-relaxed">{debrief}</p>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} variant="ghost" size="lg" className="flex-1">
            Home
          </Button>
          <Button onClick={() => router.push("/lobby")} size="lg" className="flex-1">
            Next Debate
          </Button>
        </div>
      </div>
    </main>
  );
}
