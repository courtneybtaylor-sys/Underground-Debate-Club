import React from "react";

interface TensionRopeProps {
  playerMomentum: number;
  aiMomentum: number;
  className?: string;
}

export function TensionRope({ playerMomentum, aiMomentum, className = "" }: TensionRopeProps) {
  const total = playerMomentum + aiMomentum || 1;
  const playerPercent = (playerMomentum / total) * 100;

  return (
    <div className={`w-full space-y-2 ${className}`}>
      <div className="text-sm font-mono text-foreground/60">
        <span>You {playerMomentum}</span>
        <span className="float-right">Opponent {aiMomentum}</span>
      </div>
      <div className="h-8 bg-border rounded-full overflow-hidden shadow-lg border border-primary/30">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
          style={{ width: `${playerPercent}%` }}
        />
      </div>
    </div>
  );
}
