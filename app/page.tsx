"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPlayer, createNewPlayer, savePlayer } from "@/lib/storage";
import type { Player } from "@/lib/types";
import { ArrowRight, Brain, Users, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [showNameEntry, setShowNameEntry] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const existing = getPlayer();
    setPlayer(existing);
    if (!existing) {
      setShowNameEntry(true);
    }
  }, []);

  const handleCreatePlayer = () => {
    if (nameInput.trim()) {
      const newPlayer = createNewPlayer(nameInput);
      savePlayer(newPlayer);
      setPlayer(newPlayer);
      setShowNameEntry(false);
    }
  };

  const handleStartGame = () => {
    router.push("/lobby");
  };

  const handleContinue = () => {
    router.push("/lobby");
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Underground Debate Club</h1>
          {player && (
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/profile")}
                className="text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                {player.name}
              </button>
              <Badge variant="tier">{player.tier}</Badge>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-4 py-12">
        {showNameEntry && !player ? (
          // Name Entry Modal
          <div className="flex justify-center">
            <Card variant="hero" className="max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Welcome to the Arena</h2>
              <p className="text-foreground/70 mb-4">
                Enter your name to begin your debate journey.
              </p>
              <input
                type="text"
                placeholder="Your name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreatePlayer()}
                className="w-full bg-border border border-primary/30 rounded-lg px-4 py-2 text-foreground mb-4 focus:outline-none focus:border-primary"
              />
              <Button onClick={handleCreatePlayer} size="lg" className="w-full">
                Enter Arena
              </Button>
            </Card>
          </div>
        ) : player ? (
          // Game Home
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-balance">
                Challenge Your Mind
              </h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
                Master the art of debate. Outwit your opponents. Rise through the ranks. Test your rhetoric against AI.
              </p>
              <Button onClick={handleContinue} size="lg">
                <span className="flex items-center gap-2">
                  Enter Arena <ArrowRight size={20} />
                </span>
              </Button>
            </div>

            {/* How It Works */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Brain size={32} />,
                  title: "Choose Your Topic",
                  description: "Select a debate topic and your rhetorical style",
                },
                {
                  icon: <Users size={32} />,
                  title: "Battle 3 Rounds",
                  description: "Exchange arguments with an AI opponent",
                },
                {
                  icon: <Zap size={32} />,
                  title: "Win Debates",
                  description: "Impress voters and climb the leaderboard",
                },
              ].map((item, idx) => (
                <Card key={idx} className="text-center p-6">
                  <div className="text-primary mb-3 flex justify-center">{item.icon}</div>
                  <h3 className="font-bold mb-2 text-lg">{item.title}</h3>
                  <p className="text-foreground/70 text-sm">{item.description}</p>
                </Card>
              ))}
            </div>

            {/* Player Stats */}
            {player && (
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-primary">{player.wins}</div>
                    <div className="text-sm text-foreground/60">Wins</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary">{player.debates}</div>
                    <div className="text-sm text-foreground/60">Debates</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-accent">{player.streak}</div>
                    <div className="text-sm text-foreground/60">Win Streak</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary">{player.badges.length}</div>
                    <div className="text-sm text-foreground/60">Badges</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
