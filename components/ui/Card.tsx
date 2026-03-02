import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "hero" | "transparent";
}

export function Card({ children, className = "", variant = "default" }: CardProps) {
  const variants = {
    default: "bg-card border border-border rounded-lg p-4 shadow-lg",
    hero: "bg-card border-2 border-primary rounded-lg p-6 shadow-2xl",
    transparent: "bg-transparent border border-border rounded-lg p-4",
  };

  return <div className={`${variants[variant]} ${className}`}>{children}</div>;
}
