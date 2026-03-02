import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "stat" | "tier" | "earned" | "locked";
}

export function Badge({ children, className = "", variant = "default" }: BadgeProps) {
  const variants = {
    default: "bg-primary/20 text-primary rounded-full px-3 py-1 text-sm font-medium",
    stat: "bg-secondary/20 text-secondary rounded-lg px-3 py-1 text-sm font-medium",
    tier: "bg-accent/20 text-accent rounded-lg px-3 py-1 text-sm font-bold uppercase",
    earned: "bg-gradient-to-r from-yellow-400 to-amber-500 text-black rounded-lg px-3 py-1 text-sm font-bold shadow-lg",
    locked: "bg-gray-700 text-gray-300 rounded-lg px-3 py-1 text-sm font-medium opacity-50",
  };

  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
}
