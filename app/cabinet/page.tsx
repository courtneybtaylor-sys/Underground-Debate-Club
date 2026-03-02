"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Timer } from "@/components/ui/Timer";
import { getShadowCabinet } from "@/lib/api";
import { getPlayer } from "@/lib/storage";
import type { Player } from "@/lib/types";
import { ArrowLeft, Loader } from "lucide-react";

interface DebateSetup {
  topic: string;
  opponent: string;
  rhetoricClass: string;
}

export default function CabinetPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [debateSetup, setDebateSetup] = useState<DebateSetup | null>(null);
  const [bullets, setBullets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(30);

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

    // Fetch Shadow Cabinet
    getShadowCabinet(debate.topic, debate.opponent, debate.rhetoricClass)
      .then((response) => {
        // Parse the response to extract bullets
        const text = response.response || "";
        const bulletPoints = text
          .split("\n")
          .filter((line) => line.trim().startsWith("-") || line.trim().startsWith("•"))
          .map((line) => line.replace(/^[-•]\s*/, "").trim())
          .slice(0, 6);
        setBullets(bulletPoints);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cabinet:", error);
        setBullets([
          "Prepare your strongest arguments",
          "Consider counterarguments",
          "Research key facts",
          "Plan your strategy",
          "Think about edge cases",
          "Anticipate objections",
        ]);
        setLoading(false);
      });
  }, [router]);

  const handleTimeComplete = () => {
    router.push("/battle");
  };

  if (!player || !debateSetup) return null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4 mb-8">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Shadow Cabinet</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Title */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{debateSetup.topic}</h2>
          <p className="text-foreground/70">
            Debate vs. <span className="font-bold capitalize">{debateSetup.opponent}</span> as a{" "}
            <span className="font-bold capitalize">{debateSetup.rhetoricClass}</span>
          </p>
        </div>

        {/* Timer */}
        <div className="flex justify-center">
          <Card className="px-8 py-4 text-center">
            <p className="text-sm text-foreground/70 mb-2">Time to prepare</p>
            <Timer seconds={30} onComplete={handleTimeComplete} size="lg" />
          </Card>
        </div>

        {/* Bullets */}
        <div>
          <h3 className="text-lg font-bold mb-4">Key Talking Points</h3>
          {loading ? (
            <div className="flex justify-center">
              <Loader className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {bullets.map((bullet, idx) => (
                <Card key={idx} className="p-4 border-l-2 border-l-primary">
                  <p className="text-sm text-foreground line-clamp-3">{bullet}</p>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <Card className="p-4 bg-secondary/10 border-secondary">
          <p className="text-sm text-foreground">
            Review these key points during your prep time. You'll have 90 seconds per round to craft your arguments once the debate begins.
          </p>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => router.push("/lobby")} variant="ghost" size="lg" className="flex-1">
            Back
          </Button>
          <Button onClick={handleTimeComplete} size="lg" className="flex-1">
            Ready to Battle
          </Button>
        </div>
      </div>
    </main>
  );
}
