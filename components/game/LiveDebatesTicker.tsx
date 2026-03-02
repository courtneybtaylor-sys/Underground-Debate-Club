"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface DebateEntry {
  id: string;
  display_name: string;
  topic: string;
  result: "WIN" | "LOSS" | "DRAW";
  voters_won: number;
  total_voters: number;
  created_at: string;
  timeAgo?: string;
}

const MOCK_DEBATES: DebateEntry[] = [
  {
    id: "1",
    display_name: "Alex",
    topic: "Should AI be regulated by government?",
    result: "WIN",
    voters_won: 4,
    total_voters: 5,
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: "2",
    display_name: "Jordan",
    topic: "Is remote work better than office work?",
    result: "LOSS",
    voters_won: 2,
    total_voters: 5,
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "3",
    display_name: "Casey",
    topic: "Should college be free for everyone?",
    result: "WIN",
    voters_won: 5,
    total_voters: 5,
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: "4",
    display_name: "Morgan",
    topic: "Is climate change humanity's biggest threat?",
    result: "WIN",
    voters_won: 3,
    total_voters: 5,
    created_at: new Date(Date.now() - 11 * 60000).toISOString(),
  },
  {
    id: "5",
    display_name: "Riley",
    topic: "Should social media be regulated?",
    result: "LOSS",
    voters_won: 1,
    total_voters: 5,
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "6",
    display_name: "Sam",
    topic: "Is capitalism sustainable long-term?",
    result: "WIN",
    voters_won: 4,
    total_voters: 5,
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
  },
  {
    id: "7",
    display_name: "Taylor",
    topic: "Should universities focus on practical skills?",
    result: "LOSS",
    voters_won: 2,
    total_voters: 5,
    created_at: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: "8",
    display_name: "Devon",
    topic: "Is space exploration worth the investment?",
    result: "WIN",
    voters_won: 4,
    total_voters: 5,
    created_at: new Date(Date.now() - 25 * 60000).toISOString(),
  },
];

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const createdAt = new Date(dateString);
  const diffMs = now.getTime() - createdAt.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function LiveDebatesTicker() {
  const [debates, setDebates] = useState<DebateEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentDebates = async () => {
      try {
        const response = await fetch("/api/debates/recent");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // Format the data and add timeAgo
            const formatted = data.map((d: any) => ({
              ...d,
              timeAgo: formatTimeAgo(d.created_at),
            }));
            setDebates(formatted.slice(0, 5));
          } else {
            // No debates in database, use mock data
            const mockFormatted = MOCK_DEBATES.map((d) => ({
              ...d,
              timeAgo: formatTimeAgo(d.created_at),
            }));
            const shuffled = [...mockFormatted].sort(() => Math.random() - 0.5);
            setDebates(shuffled.slice(0, 5));
          }
        } else {
          // Fallback to mock data
          const mockFormatted = MOCK_DEBATES.map((d) => ({
            ...d,
            timeAgo: formatTimeAgo(d.created_at),
          }));
          const shuffled = [...mockFormatted].sort(() => Math.random() - 0.5);
          setDebates(shuffled.slice(0, 5));
        }
      } catch (error) {
        console.log("Using mock data for debates ticker");
        // Use mock data on error
        const mockFormatted = MOCK_DEBATES.map((d) => ({
          ...d,
          timeAgo: formatTimeAgo(d.created_at),
        }));
        const shuffled = [...mockFormatted].sort(() => Math.random() - 0.5);
        setDebates(shuffled.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchRecentDebates();
  }, []);

  useEffect(() => {
    if (debates.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % debates.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [debates.length]);

  if (loading || debates.length === 0) return null;

  const active = debates[activeIndex];

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
              {active.topic}
            </h4>
            <div className="space-y-2">
              <p className="text-sm text-foreground/70">
                <span className="font-medium text-foreground">{active.display_name}</span>
                {" "}
                Won {active.voters_won}/{active.total_voters} voters
              </p>
              <p className="text-xs text-foreground/50">{active.timeAgo}</p>
            </div>
          </div>
          <Badge
            variant={active.result === "WIN" ? "success" : active.result === "LOSS" ? "destructive" : "default"}
            className="whitespace-nowrap"
          >
            {active.result}
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
              idx === activeIndex ? "opacity-100" : "opacity-60 hover:opacity-80"
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
                    {debate.display_name} • {debate.timeAgo}
                  </p>
                </div>
                <Badge
                  variant={
                    debate.result === "WIN"
                      ? "success"
                      : debate.result === "LOSS"
                        ? "destructive"
                        : "default"
                  }
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
