"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface DebateEntry {
  id: string;
  topic: string;
  result: "WIN" | "LOSS";
  voterScore: string;
  timeAgo: string;
  player: string;
}

const MOCK_DEBATES: DebateEntry[] = [
  {
    id: "1",
    topic: "Should AI be regulated by government?",
    result: "WIN",
    voterScore: "Won 4/5 voters",
    timeAgo: "2 min ago",
    player: "Alex",
  },
  {
    id: "2",
    topic: "Is remote work better than office work?",
    result: "LOSS",
    voterScore: "Lost 2/5 voters",
    timeAgo: "5 min ago",
    player: "Jordan",
  },
  {
    id: "3",
    topic: "Should college be free for everyone?",
    result: "WIN",
    voterScore: "Won 5/5 voters",
    timeAgo: "8 min ago",
    player: "Casey",
  },
  {
    id: "4",
    topic: "Is climate change humanity's biggest threat?",
    result: "WIN",
    voterScore: "Won 3/5 voters",
    timeAgo: "11 min ago",
    player: "Morgan",
  },
  {
    id: "5",
    topic: "Should social media be regulated?",
    result: "LOSS",
    voterScore: "Lost 1/5 voters",
    timeAgo: "15 min ago",
    player: "Riley",
  },
  {
    id: "6",
    topic: "Is capitalism sustainable long-term?",
    result: "WIN",
    voterScore: "Won 4/5 voters",
    timeAgo: "18 min ago",
    player: "Sam",
  },
  {
    id: "7",
    topic: "Should universities focus on practical skills?",
    result: "LOSS",
    voterScore: "Lost 3/5 voters",
    timeAgo: "22 min ago",
    player: "Taylor",
  },
  {
    id: "8",
    topic: "Is space exploration worth the investment?",
    result: "WIN",
    voterScore: "Won 4/5 voters",
    timeAgo: "25 min ago",
    player: "Devon",
  },
];

export default function LiveDebatesTicker() {
  const [debates, setDebates] = useState<DebateEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Shuffle and pick 5 random debates on mount
    const shuffled = [...MOCK_DEBATES].sort(() => Math.random() - 0.5);
    setDebates(shuffled.slice(0, 5));
  }, []);

  useEffect(() => {
    if (debates.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % debates.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [debates.length]);

  if (debates.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-sm text-foreground/70 uppercase tracking-wider">Live Debates</h3>
      
      {/* Main Display Card */}
      <Card className="p-4 bg-gradient-to-r from-primary/10 to-transparent border border-primary/20">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-medium text-accent">LIVE</span>
            </div>
            <h4 className="font-semibold text-foreground mb-3 line-clamp-2">
              {debates[activeIndex].topic}
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-foreground/70">
                <span className="font-medium text-foreground">{debates[activeIndex].player}</span>
                {" "}
                {debates[activeIndex].voterScore}
              </p>
              <p className="text-xs text-foreground/50">{debates[activeIndex].timeAgo}</p>
            </div>
          </div>
          <Badge 
            variant={debates[activeIndex].result === "WIN" ? "success" : "destructive"}
            className="whitespace-nowrap"
          >
            {debates[activeIndex].result}
          </Badge>
        </div>
      </Card>

      {/* Scrolling Feed */}
      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
        {debates.map((debate, idx) => (
          <button
            key={debate.id}
            onClick={() => setActiveIndex(idx)}
            className={`w-full text-left transition-all ${
              idx === activeIndex
                ? "opacity-100"
                : "opacity-60 hover:opacity-80"
            }`}
          >
            <Card className="p-3 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {debate.topic.length > 40
                      ? `${debate.topic.substring(0, 40)}...`
                      : debate.topic}
                  </p>
                  <p className="text-xs text-foreground/60 mt-1">
                    {debate.player} • {debate.timeAgo}
                  </p>
                </div>
                <Badge 
                  variant={debate.result === "WIN" ? "success" : "destructive"}
                  className="whitespace-nowrap text-xs"
                >
                  {debate.result}
                </Badge>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Indicator Dots */}
      <div className="flex justify-center gap-2">
        {debates.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === activeIndex
                ? "bg-primary w-6"
                : "bg-primary/30 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
