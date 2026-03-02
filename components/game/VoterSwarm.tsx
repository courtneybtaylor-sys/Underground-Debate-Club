import React from "react";
import { Card } from "../ui/Card";

interface VoterSwarmProps {
  voters: Array<{
    name: string;
    score: number;
    votedFor?: "player" | "ai" | null;
  }>;
}

export function VoterSwarm({ voters }: VoterSwarmProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      {voters.map((voter) => (
        <Card
          key={voter.name}
          className={`text-center p-3 transition-all ${
            voter.votedFor === "player"
              ? "bg-primary/20 border-primary"
              : voter.votedFor === "ai"
              ? "bg-secondary/20 border-secondary"
              : ""
          }`}
        >
          <div className="text-xs font-bold text-foreground/70 mb-1">{voter.name}</div>
          <div className="text-2xl font-bold text-primary">{voter.score}%</div>
        </Card>
      ))}
    </div>
  );
}
