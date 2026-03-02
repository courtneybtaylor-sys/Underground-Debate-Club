"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/ui/Timer";
import { TensionRope } from "@/components/game/TensionRope";
import { VoterSwarm } from "@/components/game/VoterSwarm";
import { PowerCards } from "@/components/game/PowerCards";
import { ArgumentFeed } from "@/components/game/ArgumentFeed";
import { getAIArgument } from "@/lib/api";
import { getPlayer } from "@/lib/storage";
import { calculateScore, calculateTotal, getVoterVotes, RHETORIC_CLASSES } from "@/lib/scoring";
import { VOTER_TYPES } from "@/lib/constants";
import type { Player } from "@/lib/types";
import { ArrowLeft, Loader } from "lucide-react";

interface DebateSetup {
  topic: string;
  opponent: string;
  rhetoricClass: string;
}

interface Argument {
  author: "player" | "ai";
  text: string;
  scores?: { logic: number; rhetoric: number; fact: number };
}

interface VoterState {
  name: string;
  score: number;
  votedFor: "player" | "ai" | null;
}

export default function BattlePage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [debateSetup, setDebateSetup] = useState<DebateSetup | null>(null);
  const [round, setRound] = useState(1);
  const [arguments, setArguments] = useState<Argument[]>([]);
  const [playerArgument, setPlayerArgument] = useState("");
  const [voters, setVoters] = useState<VoterState[]>(
    VOTER_TYPES.map((v) => ({ name: v.name, score: 50, votedFor: null }))
  );
  const [playerTotal, setPlayerTotal] = useState(0);
  const [aiTotal, setAiTotal] = useState(0);
  const [usedPowerCards, setUsedPowerCards] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const powerCards = [
    { id: "flip", name: "FLIP", description: "Reverse voter stance" },
    { id: "fact", name: "FACT", description: "Boost fact score" },
    { id: "mirror", name: "MIRROR", description: "Copy opponent" },
    { id: "amplify", name: "AMPLIFY", description: "Double impact" },
    { id: "recess", name: "RECESS", description: "Reset votes" },
    { id: "silence", name: "SILENCE", description: "Nullify response" },
  ];

  useEffect(() => {
    const p = getPlayer();
    if (!p) {
      router.push("/");
      return;
    }
    setPlayer(p);

    const setup = sessionStorage.getItem("debateSetup");
    if (!setup) {
      router.push("/lobby");
      return;
    }

    const debate = JSON.parse(setup) as DebateSetup;
    setDebateSetup(debate);
  }, [router]);

  const handleSubmitArgument = async () => {
    if (!playerArgument.trim() || !debateSetup || loading) return;

    setLoading(true);
    try {
      // Get AI response and scores
      const response = await getAIArgument(
        debateSetup.topic,
        playerArgument,
        debateSetup.opponent,
        debateSetup.rhetoricClass,
        round
      );

      // Parse scores from response
      const scores = response.scores || {
        logic: 60,
        rhetoric: 55,
        fact: 65,
      };

      // Calculate player scores
      const classBonus =
        RHETORIC_CLASSES[debateSetup.rhetoricClass as keyof typeof RHETORIC_CLASSES].bonuses;
      const playerScores = calculateScore(
        scores,
        classBonus,
        playerArgument.toLowerCase().split(" "),
        round,
        playerArgument.length
      );
      const playerRoundTotal = calculateTotal(playerScores);

      // Simulate AI scores
      const aiScores = {
        logic: Math.max(20, Math.min(100, 60 + Math.random() * 20 - 10)),
        rhetoric: Math.max(20, Math.min(100, 55 + Math.random() * 20 - 10)),
        fact: Math.max(20, Math.min(100, 65 + Math.random() * 20 - 10)),
      };
      const aiRoundTotal = calculateTotal(aiScores);

      // Update totals
      setPlayerTotal((prev) => prev + playerRoundTotal);
      setAiTotal((prev) => prev + aiRoundTotal);

      // Get voter votes
      const playerVotes = getVoterVotes(playerScores, aiScores, [playerArgument]);
      const newVoters = voters.map((voter, idx) => {
        const voterType = VOTER_TYPES[idx];
        let votedFor: "player" | "ai" | null = null;

        if (voterType.name === "Skeptic" && playerScores.logic > aiScores.logic)
          votedFor = "player";
        else if (voterType.name === "Skeptic") votedFor = "ai";

        if (voterType.name === "Populist" && playerScores.rhetoric > aiScores.rhetoric)
          votedFor = "player";
        else if (voterType.name === "Populist") votedFor = "ai";

        if (voterType.name === "Pragmatist" && playerScores.fact > aiScores.fact)
          votedFor = "player";
        else if (voterType.name === "Pragmatist") votedFor = "ai";

        return {
          ...voter,
          votedFor,
          score: voter.score + (votedFor === "player" ? 5 : votedFor === "ai" ? -5 : 0),
        };
      });
      setVoters(newVoters);

      // Add arguments to feed
      setArguments((prev) => [
        ...prev,
        {
          author: "player",
          text: playerArgument,
          scores: playerScores,
        },
        {
          author: "ai",
          text: response.response,
          scores: aiScores,
        },
      ]);

      setPlayerArgument("");

      // Check if game is over
      if (round === 3) {
        sessionStorage.setItem(
          "debateResults",
          JSON.stringify({
            playerTotal,
            aiTotal,
            playerVotes,
            rounds: 3,
          })
        );
        setGameOver(true);
        router.push("/results");
      } else {
        setRound((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting argument:", error);
      alert("Error processing argument. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePowerCard = (cardId: string) => {
    if (usedPowerCards.includes(cardId)) return;
    setUsedPowerCards((prev) => [...prev, cardId]);

    // Apply power card effect
    if (cardId === "flip") {
      setVoters((prev) =>
        prev.map((v) => ({
          ...v,
          votedFor: v.votedFor === "player" ? "ai" : v.votedFor === "ai" ? "player" : null,
        }))
      );
    } else if (cardId === "recess") {
      setVoters((prev) => prev.map((v) => ({ ...v, votedFor: null })));
    }
  };

  if (!player || !debateSetup || gameOver) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4 mb-4 sticky top-0 z-10 bg-background">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-primary hover:text-accent transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-lg font-bold">Round {round} of 3</h1>
              <p className="text-sm text-foreground/60">{debateSetup.topic}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              <span className="text-primary">{playerTotal}</span> vs{" "}
              <span className="text-secondary">{aiTotal}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 grid lg:grid-cols-4 gap-4 h-full">
        {/* Left Sidebar - Power Cards */}
        <div className="lg:col-span-1 order-3 lg:order-1">
          <div className="sticky top-24">
            <h3 className="font-bold mb-3 text-sm uppercase">Power Cards</h3>
            <PowerCards cards={powerCards} onCardClick={handlePowerCard} usedCards={usedPowerCards} />
          </div>
        </div>

        {/* Center - Main Battle */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-4">
          {/* Tension Rope */}
          <Card className="p-4">
            <TensionRope playerMomentum={playerTotal} aiMomentum={aiTotal} />
          </Card>

          {/* Voter Swarm */}
          <Card className="p-4">
            <h3 className="font-bold mb-3">Judges</h3>
            <VoterSwarm voters={voters} />
          </Card>

          {/* Argument Input */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-bold">Your Argument</label>
                <Timer seconds={90} onComplete={() => {}} size="sm" />
              </div>
              <textarea
                value={playerArgument}
                onChange={(e) => setPlayerArgument(e.target.value)}
                placeholder="Enter your argument (max 200 characters)..."
                maxLength={200}
                className="w-full bg-border border border-primary/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary min-h-24 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-foreground/60">
                  {playerArgument.length}/200
                </span>
                <Button
                  onClick={handleSubmitArgument}
                  disabled={!playerArgument.trim() || loading}
                  size="md"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" size={16} /> Processing
                    </>
                  ) : (
                    "Submit Argument"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar - Argument Feed */}
        <div className="lg:col-span-1 order-2 lg:order-3">
          <div className="sticky top-24">
            <h3 className="font-bold mb-3 text-sm uppercase">Debate Feed</h3>
            <ArgumentFeed
              arguments={arguments}
              className="bg-card border border-border rounded-lg p-3"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
