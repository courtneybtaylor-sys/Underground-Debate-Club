import React from "react";
import { Card } from "../ui/Card";

interface Argument {
  author: "player" | "ai";
  text: string;
  timestamp: number;
}

interface ArgumentFeedProps {
  arguments: Argument[];
  className?: string;
}

export function ArgumentFeed({ arguments, className = "" }: ArgumentFeedProps) {
  return (
    <div className={`space-y-3 max-h-96 overflow-y-auto ${className}`}>
      {arguments.length === 0 && (
        <div className="text-center text-foreground/50 py-4">No arguments yet.</div>
      )}
      {arguments.map((arg, idx) => (
        <Card
          key={idx}
          className={`p-3 text-sm ${
            arg.author === "player"
              ? "bg-primary/10 border-primary/30"
              : "bg-secondary/10 border-secondary/30"
          }`}
        >
          <div className="font-bold text-xs mb-1 text-foreground/60">
            {arg.author === "player" ? "Your Argument" : "Opponent's Counter"}
          </div>
          <div className="text-foreground">{arg.text}</div>
        </Card>
      ))}
    </div>
  );
}
