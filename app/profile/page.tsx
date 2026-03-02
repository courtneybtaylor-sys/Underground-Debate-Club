"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getPlayer, savePlayer } from "@/lib/storage";
import { RHETORIC_CLASSES, BADGES } from "@/lib/constants";
import type { Player } from "@/lib/types";
import { ArrowLeft, Edit2, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  useEffect(() => {
    const p = getPlayer();
    if (!p) {
      router.push("/");
    } else {
      setPlayer(p);
      setNewName(p.name);
      setSelectedClass(p.rhetoricClass);
    }
  }, [router]);

  const handleSaveName = () => {
    if (player && newName.trim()) {
      const updated = { ...player, name: newName };
      setPlayer(updated);
      savePlayer(updated);
      setEditing(false);
    }
  };

  const handleChangeClass = (newClass: string) => {
    if (player) {
      setSelectedClass(newClass);
      const updated = { ...player, rhetoricClass: newClass as any };
      setPlayer(updated);
      savePlayer(updated);
    }
  };

  if (!player) return null;

  const unlockedBadges = player.badges;
  const allBadges = BADGES;
  const lockedBadges = allBadges.filter((b) => !unlockedBadges.includes(b.id));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border p-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Player Profile</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-8">
        {/* Player Info */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              {editing ? (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-border border border-primary/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
                  />
                  <Button onClick={handleSaveName} size="sm">
                    Save
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="ghost" size="sm">
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold">{player.name}</h2>
                  <button
                    onClick={() => setEditing(true)}
                    className="text-primary hover:text-accent transition-colors"
                  >
                    <Edit2 size={20} />
                  </button>
                </div>
              )}
            </div>
            <Badge variant="tier">{player.tier}</Badge>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-3xl font-bold text-primary">{player.wins}</div>
              <div className="text-xs text-foreground/60">Wins</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-3xl font-bold text-secondary">{player.debates}</div>
              <div className="text-xs text-foreground/60">Debates</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-3xl font-bold text-accent">{player.streak}</div>
              <div className="text-xs text-foreground/60">Streak</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-3xl font-bold text-primary">{player.influence}</div>
              <div className="text-xs text-foreground/60">Influence</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-3xl font-bold text-secondary">{player.badges.length}</div>
              <div className="text-xs text-foreground/60">Badges</div>
            </div>
            <div className="text-center p-3 bg-border rounded-lg">
              <div className="text-3xl font-bold text-accent">
                {player.debatesForOracle >= 5 ? "✓" : player.debatesForOracle}
              </div>
              <div className="text-xs text-foreground/60">Oracle</div>
            </div>
          </div>
        </Card>

        {/* Rhetoric Class */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Rhetoric Class</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(RHETORIC_CLASSES).map(([key, rhetoricClass]) => (
              <button
                key={key}
                onClick={() => handleChangeClass(key)}
                className={`relative`}
              >
                <Card
                  className={`p-4 text-center transition-all cursor-pointer ${
                    selectedClass === key ? "border-primary bg-primary/10" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">{rhetoricClass.name}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{rhetoricClass.description}</p>
                  {selectedClass === key && (
                    <CheckCircle className="absolute top-2 right-2 text-primary" size={20} />
                  )}
                </Card>
              </button>
            ))}
          </div>
        </Card>

        {/* Badges */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Badges ({unlockedBadges.length}/11)</h2>

          {/* Earned Badges */}
          {unlockedBadges.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-sm mb-2 text-accent">Earned</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {allBadges
                  .filter((b) => unlockedBadges.includes(b.id))
                  .map((badge) => (
                    <div key={badge.id} className="text-center">
                      <Badge variant="earned">{badge.name}</Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h3 className="font-bold text-sm mb-2 text-foreground/60">Locked</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {lockedBadges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <Badge variant="locked">{badge.name}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Oracle Line */}
        {player.oracleLine && (
          <Card className="p-6 bg-secondary/10 border-secondary">
            <h2 className="text-xl font-bold mb-2">Oracle Line</h2>
            <p className="text-lg italic text-secondary">{player.oracleLine}</p>
          </Card>
        )}

        {/* Oracle Status */}
        {player.debatesForOracle >= 5 && !player.oracleLine && (
          <Card className="p-6 bg-accent/10 border-accent">
            <p className="text-foreground mb-4">
              You've unlocked the Oracle! Visit the Oracle chamber to receive your personalized assessment.
            </p>
            <Button onClick={() => router.push("/oracle")}>Visit the Oracle</Button>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button onClick={() => router.push("/")} variant="ghost" size="lg" className="flex-1">
            Home
          </Button>
          <Button onClick={() => router.push("/lobby")} size="lg" className="flex-1">
            Back to Debates
          </Button>
        </div>
      </div>
    </main>
  );
}
