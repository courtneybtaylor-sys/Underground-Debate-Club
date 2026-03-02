import { useState, useEffect, useCallback } from "react";
import { getPlayer, savePlayer } from "./storage";
import type { Player } from "./types";

export function usePlayer() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = getPlayer();
    setPlayer(p);
    setLoading(false);
  }, []);

  const updatePlayer = useCallback((updates: Partial<Player>) => {
    setPlayer((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      savePlayer(updated);
      return updated;
    });
  }, []);

  return { player, loading, updatePlayer };
}

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "school" | "underground">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("udc_theme") as any;
    if (saved) {
      setTheme(saved);
      document.documentElement.className = saved;
    }
  }, []);

  const switchTheme = (newTheme: "dark" | "school" | "underground") => {
    setTheme(newTheme);
    localStorage.setItem("udc_theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.className = "";
    } else {
      document.documentElement.className = newTheme;
    }
  };

  return { theme, switchTheme };
}
