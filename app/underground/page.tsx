"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getPlayer, savePlayer } from "@/lib/storage";
import { getUndergroundResponse } from "@/lib/api";
import type { Player } from "@/lib/types";
import { ArrowLeft, Send, Loader, Eye } from "lucide-react";

interface Message {
  role: "user" | "guide";
  content: string;
}

export default function UndergroundPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [ageGated, setAgeGated] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "guide",
      content:
        "Welcome to the Underground. Here, debate transcends competition. We explore the beliefs that drive us. The depth meter measures how far we venture into your convictions. Are you ready to go deeper?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [depthMeter, setDepthMeter] = useState(0);
  const [topic, setTopic] = useState("personal beliefs and values");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getPlayer();
    if (!p) {
      router.push("/");
    } else if (p.tier !== "UNDERGROUND") {
      setShowAgeGate(true);
    } else {
      setPlayer(p);
      setAgeGated(true);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAgeGateConfirm = () => {
    if (player) {
      const updated = { ...player, tier: "UNDERGROUND" as const, undergroundUnlocked: true };
      setPlayer(updated);
      savePlayer(updated);
      setAgeGated(true);
      setShowAgeGate(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !player) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    setDepthMeter((prev) => Math.min(100, prev + Math.floor(Math.random() * 15) + 5));

    try {
      const response = await getUndergroundResponse(topic, userMessage);
      setMessages((prev) => [...prev, { role: "guide", content: response.response }]);
    } catch (error) {
      console.error("Error getting underground response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "guide",
          content: "The chamber echoes with silence. Reflect and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!player) return null;

  return (
    <>
      {/* Age Gate Modal */}
      <Modal
        isOpen={showAgeGate}
        title="Entrance to the Underground"
        onClose={() => router.push("/")}
        actions={[
          {
            label: "I am 18+",
            onClick: handleAgeGateConfirm,
            variant: "primary",
          },
          {
            label: "Back",
            onClick: () => router.push("/"),
            variant: "secondary",
          },
        ]}
      >
        <p className="text-foreground mb-4">
          The Underground Chamber is for adults 18 and older. This space contains mature themes and explores deeper personal beliefs.
        </p>
        <p className="text-sm text-foreground/70">
          By entering, you confirm that you are 18 years or older and understand that this is an intimate space for philosophical exploration.
        </p>
      </Modal>

      {ageGated && (
        <main className="min-h-screen bg-underground-bg text-foreground flex flex-col" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 100%)" }}>
          <header className="border-b border-purple-600 p-4 sticky top-0 z-10 bg-gradient-to-r from-purple-900/50 to-transparent">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.back()}
                  className="text-purple-400 hover:text-pink-400 transition-colors"
                >
                  <ArrowLeft size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-purple-300">The Underground</h1>
                  <p className="text-sm text-purple-400/60">Depth of Exploration</p>
                </div>
              </div>
              <Eye className="text-purple-400" size={24} />
            </div>
          </header>

          <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-hidden flex flex-col">
            {/* Depth Meter */}
            <Card className="p-3 mb-4 bg-purple-950 border-purple-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300">Depth Meter</span>
                <span className="text-sm text-purple-400">{depthMeter}%</span>
              </div>
              <div className="h-2 bg-purple-900 rounded-full overflow-hidden border border-purple-700">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${depthMeter}%` }}
                />
              </div>
            </Card>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <Card
                    className={`max-w-sm p-4 ${
                      msg.role === "user"
                        ? "bg-purple-900/40 border-purple-500"
                        : "bg-pink-900/30 border-pink-500"
                    }`}
                  >
                    <p className="text-sm text-purple-100">{msg.content}</p>
                  </Card>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <Card className="bg-pink-900/30 border-pink-500 p-4">
                    <Loader className="animate-spin text-pink-400" size={20} />
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <Card className="p-4 border-purple-600 bg-purple-950/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Share your thoughts..."
                  className="flex-1 bg-purple-900/50 border border-purple-600 rounded-lg px-4 py-2 text-purple-100 placeholder-purple-500 focus:outline-none focus:border-purple-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || loading}
                  size="md"
                  className="bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Send size={16} />
                </Button>
              </div>
            </Card>

            {/* Depth Indicator */}
            <div className="text-center mt-4 text-xs text-purple-400/60">
              {depthMeter < 30
                ? "Beginning your descent..."
                : depthMeter < 60
                ? "Venturing into deeper waters..."
                : depthMeter < 85
                ? "Approaching profound territory..."
                : "At the depths of understanding..."}
            </div>
          </div>
        </main>
      )}
    </>
  );
}
