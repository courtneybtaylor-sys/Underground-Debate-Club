"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getPlayer, savePlayer } from "@/lib/storage";
import { getOracleResponse, getOracleLine } from "@/lib/api";
import type { Player } from "@/lib/types";
import { ArrowLeft, Send, Loader } from "lucide-react";

interface Message {
  role: "user" | "oracle";
  content: string;
}

export default function OraclePage() {
  const router = useRouter();
  const [player, setPlayer] = useState<Player | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "oracle",
      content:
        "Welcome, seeker. I am the Oracle. After five debates, you have earned the right to peer deeper. Ask me anything about rhetoric, debate, or the nature of argument.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("debate and rhetoric");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = getPlayer();
    if (!p) {
      router.push("/");
    } else if (p.debatesForOracle < 5) {
      router.push("/");
    } else {
      setPlayer(p);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading || !player) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await getOracleResponse(topic, userMessage);
      setMessages((prev) => [...prev, { role: "oracle", content: response.response }]);

      // Check if we should generate oracle line after multiple exchanges
      if (messages.length > 12 && !player.oracleLine) {
        const lineResponse = await getOracleLine(topic);
        const updatedPlayer = { ...player, oracleLine: lineResponse.oracle_line || "Seeker of truth." };
        setPlayer(updatedPlayer);
        savePlayer(updatedPlayer);
        
        setMessages((prev) => [
          ...prev,
          {
            role: "oracle",
            content: `Your Oracle Line: "${lineResponse.oracle_line || "Seeker of truth."}"`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error getting oracle response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "oracle", content: "The Oracle is temporarily silent. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!player) return null;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border p-4 sticky top-0 z-10 bg-background">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">The Oracle Chamber</h1>
            <p className="text-sm text-foreground/60">A space for deeper wisdom</p>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-hidden flex flex-col">
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
                    ? "bg-primary/10 border-primary"
                    : "bg-secondary/10 border-secondary"
                }`}
              >
                <p className="text-sm text-foreground">{msg.content}</p>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="bg-secondary/10 border-secondary p-4">
                <Loader className="animate-spin text-secondary" size={20} />
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Card className="p-4 border-primary">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask the Oracle..."
              className="flex-1 bg-border border border-primary/30 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              size="md"
            >
              <Send size={16} />
            </Button>
          </div>
        </Card>

        {/* Info */}
        {player.oracleLine && (
          <div className="text-center mt-4 text-sm text-foreground/60">
            Your Oracle Line: <span className="italic text-accent">{player.oracleLine}</span>
          </div>
        )}
      </div>
    </main>
  );
}
