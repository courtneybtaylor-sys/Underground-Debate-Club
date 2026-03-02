// Game types
export interface Player {
  id: string;
  name: string;
  tier: "FREE" | "SCHOOL" | "UNDERGROUND";
  rhetoricClass: "analyst" | "firebrand" | "trickster" | "diplomat";
  influence: number;
  wins: number;
  debates: number;
  streak: number;
  badges: string[];
  oracleLine: string;
  debatesForOracle: number;
  undergroundUnlocked: boolean;
  createdAt: number;
}

export interface Debate {
  id: string;
  playerId: string;
  topic: string;
  opponent: string;
  rhetoricClass: string;
  round: number;
  playerArgument: string;
  aiResponse: string;
  playerScores: { logic: number; rhetoric: number; fact: number };
  aiScores: { logic: number; rhetoric: number; fact: number };
  voterPreferences: VoterScore[];
  createdAt: number;
}

export interface VoterScore {
  voterType: string;
  score: number;
  reasoning: string;
}

export interface GameRound {
  roundNumber: number;
  playerArgument: string;
  playerScores: { logic: number; rhetoric: number; fact: number };
  aiResponse: string;
  aiScores: { logic: number; rhetoric: number; fact: number };
  tension: number;
  voterStances: Record<string, number>;
}

export interface DebateResult {
  debateId: string;
  playerTotal: number;
  aiTotal: number;
  won: boolean;
  logicScore: number;
  rhetoricScore: number;
  factScore: number;
  winningVoters: string[];
  debrief: string;
  duration: number;
}
