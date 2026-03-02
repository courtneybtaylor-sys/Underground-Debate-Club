import type { Player } from "./types";

const PLAYER_KEY = "udc_player";

export function getPlayer(): Player | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(PLAYER_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function savePlayer(player: Player): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

export function createNewPlayer(name: string): Player {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    tier: "FREE",
    rhetoricClass: "analyst",
    influence: 0,
    wins: 0,
    debates: 0,
    streak: 0,
    badges: [],
    oracleLine: "",
    debatesForOracle: 0,
    undergroundUnlocked: false,
    createdAt: Date.now(),
  };
}

export function updatePlayerStats(
  player: Player,
  won: boolean,
  badges: string[] = []
): Player {
  const updated = { ...player };
  updated.debates += 1;
  updated.debatesForOracle += 1;

  if (won) {
    updated.wins += 1;
    updated.streak += 1;
  } else {
    updated.streak = 0;
  }

  updated.badges = Array.from(new Set([...updated.badges, ...badges]));

  if (updated.debatesForOracle >= 5 && !updated.oracleLine) {
    // Oracle will be unlocked in results screen
  }

  return updated;
}
