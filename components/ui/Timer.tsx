import React, { useEffect, useState } from "react";

interface TimerProps {
  seconds: number;
  onComplete: () => void;
  size?: "sm" | "md" | "lg";
}

export function Timer({ seconds, onComplete, size = "md" }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  const isWarning = remaining < 10;
  const sizes = {
    sm: "text-lg",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div className={`font-mono font-bold ${sizes[size]} ${isWarning ? "text-accent" : "text-primary"}`}>
      {remaining}s
    </div>
  );
}
