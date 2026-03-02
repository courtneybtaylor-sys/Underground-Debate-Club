interface DebateRequest {
  action: string;
  topic: string;
  context?: string;
  opponent?: string;
  rhetoric_class?: string;
  userArgument?: string;
  aiResponse?: string;
  round?: number;
}

interface DebateResponse {
  action: string;
  thinking?: string;
  response: string;
  scores?: {
    logic: number;
    reasoning_logic: string;
    rhetoric: number;
    reasoning_rhetoric: string;
    fact: number;
    reasoning_fact: string;
  };
  voterScores?: Array<{
    voter_type: string;
    score: number;
    reasoning: string;
  }>;
  debrief?: string;
  oracle_line?: string;
}

export async function callDebateAPI(
  action: string,
  data: Record<string, unknown>
): Promise<DebateResponse> {
  try {
    const response = await fetch("/api/debate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...data }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Debate API error:", error);
    throw error;
  }
}

export async function getShadowCabinet(
  topic: string,
  opponent: string,
  rhetoricClass: string
): Promise<DebateResponse> {
  return callDebateAPI("shadow_cabinet", {
    topic,
    opponent,
    rhetoric_class: rhetoricClass,
  });
}

export async function getAIArgument(
  topic: string,
  userArgument: string,
  opponent: string,
  rhetoricClass: string,
  round: number
): Promise<DebateResponse> {
  return callDebateAPI("ai_argument", {
    topic,
    userArgument,
    opponent,
    rhetoric_class: rhetoricClass,
    round,
  });
}

export async function getDebrief(
  topic: string,
  userArgument: string,
  aiResponse: string,
  round: number
): Promise<DebateResponse> {
  return callDebateAPI("debrief", {
    topic,
    userArgument,
    aiResponse,
    round,
  });
}

export async function getOracleResponse(
  topic: string,
  userMessage: string
): Promise<DebateResponse> {
  return callDebateAPI("oracle", {
    topic,
    context: userMessage,
  });
}

export async function getUndergroundResponse(
  topic: string,
  userMessage: string
): Promise<DebateResponse> {
  return callDebateAPI("underground", {
    topic,
    context: userMessage,
  });
}

export async function getOracleLine(topic: string): Promise<DebateResponse> {
  return callDebateAPI("oracle_line", { topic });
}
