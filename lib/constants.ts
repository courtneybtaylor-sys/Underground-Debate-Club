export const DEBATE_TOPICS = [
  "Should AI replace human decision-making in healthcare?",
  "Is social media more harmful than beneficial?",
  "Should university be free for all?",
  "Is capitalism sustainable long-term?",
  "Should we prioritize climate action over economic growth?",
  "Is remote work the future of employment?",
  "Should privacy be sacrificed for security?",
  "Is traditional education obsolete?",
  "Should artificial aging limits be placed on politicians?",
  "Is algorithmic fairness achievable?",
];

export const ARCHETYPE_PROMPTS = {
  prosecutor: {
    name: "The Prosecutor",
    description: "Sharp, evidence-focused, attacks weaknesses",
    style: "Seeks contradictions and demands proof",
  },
  philosopher: {
    name: "The Philosopher",
    description: "Contemplative, theory-driven, explores nuance",
    style: "Questions assumptions and probes deeper meaning",
  },
  troll: {
    name: "The Troll",
    description: "Provocative, contrarian, seeks to disrupt",
    style: "Deliberately misinterprets and exaggerates",
  },
  politician: {
    name: "The Politician",
    description: "Persuasive, charismatic, appeals to emotion",
    style: "Uses rhetoric and narrative to build support",
  },
};

export const RHETORIC_CLASSES = {
  analyst: {
    name: "Analyst",
    description: "Master of data and logic",
    bonuses: { logic: 15, fact: 10, rhetoric: -5 },
  },
  firebrand: {
    name: "Firebrand",
    description: "Master of passion and persuasion",
    bonuses: { rhetoric: 20, logic: -5, fact: 0 },
  },
  trickster: {
    name: "Trickster",
    description: "Master of wit and strategy",
    bonuses: { rhetoric: 15, logic: 5, fact: -5 },
  },
  diplomat: {
    name: "Diplomat",
    description: "Master of balance and nuance",
    bonuses: { logic: 8, rhetoric: 8, fact: 4 },
  },
};

export const VOTER_TYPES = [
  {
    name: "Skeptic",
    keywords: ["study", "research", "data", "evidence", "statistic", "percent", "proof"],
    description: "Responds to logic and evidence",
  },
  {
    name: "Academic",
    keywords: ["theory", "historical", "precedent", "framework", "model", "system"],
    description: "Responds to intellectual rigor",
  },
  {
    name: "Populist",
    keywords: ["people", "family", "community", "feel", "heart", "everyday", "real"],
    description: "Responds to human impact",
  },
  {
    name: "Ethicist",
    keywords: ["right", "wrong", "moral", "fair", "just", "ethical", "principle"],
    description: "Responds to values",
  },
  {
    name: "Pragmatist",
    keywords: ["work", "practical", "cost", "benefit", "result", "effective", "outcome"],
    description: "Responds to feasibility",
  },
];

export const BADGES = [
  { id: "iron_logic", name: "Iron Logic", icon: "Brain", color: "from-blue-400 to-blue-600" },
  { id: "silver_tongue", name: "Silver Tongue", icon: "Mic", color: "from-purple-400 to-purple-600" },
  { id: "contrarian_king", name: "Contrarian King", icon: "Zap", color: "from-yellow-400 to-yellow-600" },
  { id: "clean_sweep", name: "Clean Sweep", icon: "Trophy", color: "from-green-400 to-green-600" },
  { id: "comeback_kid", name: "Comeback Kid", icon: "TrendingUp", color: "from-red-400 to-red-600" },
  { id: "oracle_seeker", name: "Oracle Seeker", icon: "Eye", color: "from-indigo-400 to-indigo-600" },
  { id: "polymath", name: "Polymath", icon: "BookOpen", color: "from-cyan-400 to-cyan-600" },
  { id: "power_player", name: "Power Player", icon: "Zap", color: "from-orange-400 to-orange-600" },
  { id: "streak_3", name: "On Fire (3x)", icon: "Flame", color: "from-pink-400 to-pink-600" },
  { id: "streak_5", name: "Unstoppable (5x)", icon: "Flame", color: "from-red-400 to-orange-600" },
  { id: "underground_10", name: "Deep Diver", icon: "Layers", color: "from-purple-400 to-black" },
];
