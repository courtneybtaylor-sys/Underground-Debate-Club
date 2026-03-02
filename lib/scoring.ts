interface ScoringCalculation {
  logic: number;
  rhetoric: number;
  fact: number;
}

export function calculateScore(
  baseScores: ScoringCalculation,
  classBonus: Record<string, number>,
  keywords: string[],
  round: number,
  length: number
): ScoringCalculation {
  let logic = baseScores.logic;
  let rhetoric = baseScores.rhetoric;
  let fact = baseScores.fact;

  // Apply class bonuses
  logic += classBonus.logic || 0;
  rhetoric += classBonus.rhetoric || 0;
  fact += classBonus.fact || 0;

  // Keyword bonuses
  const logicKeywords = ["because", "therefore", "thus", "hence", "consequently"];
  const factKeywords = ["study", "research", "data", "evidence", "statistic", "percent"];
  const rhetoricKeywords = ["imagine", "feel", "heart", "people", "family", "children", "community"];

  logicKeywords.forEach(kw => {
    if (keywords.some(k => k.includes(kw))) logic += 10;
  });
  factKeywords.forEach(kw => {
    if (keywords.some(k => k.includes(kw))) fact += 15;
  });
  rhetoricKeywords.forEach(kw => {
    if (keywords.some(k => k.includes(kw))) rhetoric += 12;
  });

  // Length penalties/bonuses
  if (length < 10) {
    logic -= 15;
    rhetoric -= 10;
  } else if (length > 80) {
    logic += 10;
    rhetoric += 5;
  }

  // Round bonuses
  logic += round * 3;
  rhetoric += round * 2;

  // Randomization for drama
  logic += Math.floor(Math.random() * 16) - 8;
  rhetoric += Math.floor(Math.random() * 16) - 8;
  fact += Math.floor(Math.random() * 16) - 8;

  // Clamp to range 20-100
  logic = Math.max(20, Math.min(100, Math.round(logic)));
  rhetoric = Math.max(20, Math.min(100, Math.round(rhetoric)));
  fact = Math.max(20, Math.min(100, Math.round(fact)));

  return { logic, rhetoric, fact };
}

export function calculateTotal(scores: ScoringCalculation): number {
  return Math.round(scores.logic * 0.4 + scores.rhetoric * 0.3 + scores.fact * 0.3);
}

export function getVoterVotes(
  playerScores: ScoringCalculation,
  aiScores: ScoringCalculation,
  playerKeywords: string[]
): number {
  // Simplified: player wins a voter if they have higher score in that voter's dimension
  let playerVotes = 0;

  // Skeptic votes for logic
  if (playerScores.logic > aiScores.logic) playerVotes++;

  // Academic votes for logic (same as skeptic for simplicity)
  if (playerScores.logic + 10 > aiScores.logic) playerVotes++;

  // Populist votes for rhetoric
  if (playerScores.rhetoric > aiScores.rhetoric) playerVotes++;

  // Ethicist votes for rhetoric + moral keywords
  if (playerScores.rhetoric > aiScores.rhetoric || playerKeywords.some(k => 
    ["moral", "fair", "just", "ethical"].some(kw => k.includes(kw))
  )) playerVotes++;

  // Pragmatist votes for fact
  if (playerScores.fact > aiScores.fact) playerVotes++;

  return playerVotes;
}

export function checkBadgeEarned(
  won: boolean,
  playerScores: ScoringCalculation,
  playerVotes: number,
  roundsWon: number,
  classUsageCount: Record<string, number>,
  powerCardsUsed: number,
  streak: number
): string[] {
  const earned: string[] = [];

  if (playerScores.logic > 80) earned.push("iron_logic");
  if (playerScores.rhetoric > 80) earned.push("silver_tongue");
  if (won && Math.round(calculateTotal(playerScores)) - 50 > 15) earned.push("contrarian_king");
  if (won && roundsWon === 3) earned.push("clean_sweep");
  if (won && roundsWon < 2) earned.push("comeback_kid");
  if (powerCardsUsed === 6) earned.push("power_player");
  if (streak >= 3) earned.push("streak_3");
  if (streak >= 5) earned.push("streak_5");

  return earned;
}
