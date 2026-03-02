"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPlayer } from "@/lib/storage";
import { DEBATE_TOPICS, ARCHETYPE_PROMPTS, RHETORIC_CLASSES } from "@/lib/constants";
import type { Player } from "@/lib/types";
import { ArrowLeft } from "lucide-react";

export default function LobbyPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedOpponent, setSelectedOpponent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getPlayer();
    if (!p) {
      router.push("/");
    } else {
      setPlayer(p);
      setSelectedClass(p.rhetoricClass);
    }
    setLoading(false);
  }, [router]);

  const handleBattle = () => {
    if (!selectedTopic || !selectedOpponent || !selectedClass) {
      alert("Please select all options");
      return;
    }

    const topic = customTopic || selectedTopic;
    const debateData = {
      topic,
      opponent: selectedOpponent,
      rhetoricClass: selectedClass,
    };

    sessionStorage.setItem("debateSetup", JSON.stringify(debateData));
    router.push("/cabinet");
  };

  if (loading || !player) return null;

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
          <h1 className="text-2xl font-bold">Select Your Debate</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-8">
        {/* Topic Selection */}
        <div>
          <h2 className="text-xl font-bold mb-4">Choose Topic</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEBATE_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  setSelectedTopic(topic);
                  setCustomTopic("");
                }}
                className={`p-3 rounded-lg border transition-all text-left text-sm ${
                  selectedTopic === topic
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Or enter custom topic..."
              value={customTopic}
              onChange={(e) => {
                setCustomTopic(e.target.value);
                setSelectedTopic("");
              }}
              className="w-full bg-border border border-primary/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Rhetoric Class Selection */}
        <div>
          <h2 className="text-xl font-bold mb-4">Choose Your Style</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(RHETORIC_CLASSES).map(([key, rhetoricClass]) => (
              <button
                key={key}
                onClick={() => setSelectedClass(key)}
                className={`relative`}
              >
                <Card
                  className={`p-4 text-center transition-all ${
                    selectedClass === key ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">{rhetoricClass.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{rhetoricClass.description}</p>
                  <div className="text-xs text-accent">
                    {Object.entries(rhetoricClass.bonuses)
                      .filter(([, v]) => v > 0)
                      .map(([k, v]) => `+${v} ${k}`)
                      .join(", ")}
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Opponent Selection */}
        <div>
          <h2 className="text-xl font-bold mb-4">Choose Opponent</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(ARCHETYPE_PROMPTS).map(([key, archetype]) => (
              <button
                key={key}
                onClick={() => setSelectedOpponent(key)}
                className={`relative`}
              >
                <Card
                  className={`p-4 text-center transition-all ${
                    selectedOpponent === key ? "border-accent bg-accent/10" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">{archetype.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{archetype.description}</p>
                  <div className="text-xs text-secondary italic">{archetype.style}</div>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button onClick={() => router.push("/")} variant="ghost" size="lg" className="flex-1">
            Back
          </Button>
          <Button
            onClick={handleBattle}
            disabled={!selectedTopic && !customTopic}
            size="lg"
            className="flex-1"
          >
            Ready for Battle
          </Button>
        </div>
      </div>
    </main>
  );
}
