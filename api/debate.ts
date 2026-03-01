import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface ShadowCabinetRequest {
  topic: string;
  stance: string;
  rhetoricClass: string;
  isSchoolMode: boolean;
}

interface AIArgumentRequest {
  topic: string;
  aiStance: string;
  userArgument: string;
  archetype: string;
  round: number;
  history: { role: string; content: string }[];
  rhetoricClass: string;
  isSchoolMode: boolean;
  silenced?: boolean;
}

interface DebriefRequest {
  topic: string;
  stance: string;
  userArguments: string[];
  scores: { logic: number; rhetoric: number; fact: number }[];
  winner: boolean;
  rhetoricClass: string;
  isSchoolMode: boolean;
}

interface OracleRequest {
  message: string;
  history: { role: string; content: string }[];
}

interface UndergroundRequest {
  topic: string;
  argument: string;
  history: { role: string; content: string }[];
}

interface OracleLineRequest {
  conversationSummary: string;
}

const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const ARCHETYPE_PROMPTS: Record<string, string> = {
  prosecutor:
    "You are relentlessly logical and aggressive. You identify weaknesses and exploit them. You use structured arguments with clear premises. You never back down. Short, punchy sentences. Expose logical flaws mercilessly.",
  philosopher:
    "You are deeply abstract and reframe every argument into first principles. You challenge the premises themselves. You ask questions that destabilize certainty. Long, elegant sentences. Reframe everything into something deeper.",
  troll:
    "You are chaotic and emotionally manipulative. You use absurdist analogies, appeal to gut feelings, mock your opponent's position, and bait them into emotional responses. Unpredictable. Never stay on topic long.",
  politician:
    "You are evasive and message-disciplined. You never answer directly. You pivot to talking points. You use inclusive language. You appeal to 'common sense.' You deflect criticism brilliantly and never admit a weakness.",
};

const ORACLE_PROMPT =
  "You are The Oracle — ancient and inscrutable. You exist between argument and truth. You find the assumption underneath every argument, the belief behind the belief. You ask one question that cuts to what they actually think. Not aggressive. Inevitable. 2-3 sentences maximum.";

async function callClaude(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
  maxTokens: number
): Promise<string> {
  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: messages,
    });

    if (response.content[0].type === 'text') {
      return response.content[0].text;
    }
    return '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to generate response');
  }
}

async function shadowCabinet(req: ShadowCabinetRequest): Promise<Response> {
  try {
    const prompt = `You are a debate prep team. Generate bullet-point argument cards for a debate.
Topic: ${req.topic}
Position: ${req.stance}
Rhetorical Class: ${req.rhetoricClass}

Generate 6 total argument cards (2 per category): research, rhetoric, and factcheck.
Each card should be 1-2 sentences, punchy, and genuinely useful for arguing the ${req.stance} position.

Return ONLY valid JSON, no markdown, no explanation:
{"research":["card1","card2"],"rhetoric":["card1","card2"],"factcheck":["card1","card2"]}`;

    const response = await callClaude(
      'You are a debate prep assistant. Generate argument cards in JSON format only.',
      [{ role: 'user', content: prompt }],
      600
    );

    // Parse JSON safely
    let cards: { research: string[]; rhetoric: string[]; factcheck: string[] };
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      cards = jsonMatch ? JSON.parse(jsonMatch[0]) : { research: [], rhetoric: [], factcheck: [] };
    } catch {
      cards = { research: [], rhetoric: [], factcheck: [] };
    }

    return new Response(JSON.stringify(cards), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('Shadow Cabinet error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate argument cards' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

function scoreArgument(
  text: string,
  rhetoricClass: string,
  round: number
): { logic: number; rhetoric: number; fact: number; total: number } {
  const wordCount = text.split(/\s+/).length;

  let logic = 40 + Math.min(30, wordCount * 0.8);
  let rhetoric = 35 + Math.min(25, wordCount * 0.5);
  let fact = 30 + Math.min(20, wordCount * 0.4);

  // Class bonuses
  if (rhetoricClass === 'analyst') {
    logic += 15;
    fact += 10;
  } else if (rhetoricClass === 'firebrand') {
    rhetoric += 20;
    logic -= 5;
  } else if (rhetoricClass === 'trickster') {
    rhetoric += 15;
    logic += 5;
  } else if (rhetoricClass === 'diplomat') {
    logic += 8;
    rhetoric += 8;
    fact += 4;
  }

  // Content bonuses
  if (/because|therefore|thus|hence|consequently/.test(text)) logic += 10;
  if (/study|research|data|evidence|statistic|percent/.test(text)) fact += 15;
  if (/imagine|feel|heart|people|family|children|community/.test(text)) rhetoric += 12;
  if (/however|although|despite|while/.test(text)) logic += 8;
  if (/\?/.test(text)) rhetoric += 5;

  // Length penalties/bonuses
  if (wordCount < 10) {
    logic -= 15;
    rhetoric -= 10;
  } else if (wordCount > 80) {
    logic += 10;
    rhetoric += 5;
  }

  // Round bonus
  logic += round * 3;
  rhetoric += round * 2;

  // Randomize for drama
  const randomFactor = Math.random() * 16 - 8;
  logic = Math.max(20, Math.min(100, logic + randomFactor));
  rhetoric = Math.max(20, Math.min(100, rhetoric + randomFactor));
  fact = Math.max(20, Math.min(100, fact + randomFactor));

  const total = Math.round(logic * 0.4 + rhetoric * 0.3 + fact * 0.3);

  return { logic: Math.round(logic), rhetoric: Math.round(rhetoric), fact: Math.round(fact), total };
}

async function aiArgument(req: AIArgumentRequest): Promise<Response> {
  try {
    const archetype = req.archetype as keyof typeof ARCHETYPE_PROMPTS;
    const archetypePrompt = ARCHETYPE_PROMPTS[archetype] || ARCHETYPE_PROMPTS.prosecutor;

    let systemPrompt = `You are a debate opponent in a formal structured debate. ${archetypePrompt}
You are arguing the ${req.aiStance} position on the topic.
Topic: ${req.topic}

In round ${req.round} of 3. Keep your response to 2-3 sentences.`;

    if (req.silenced) {
      systemPrompt += '\n\nSILENCE CARD ACTIVE: Respond in maximum 1 sentence.';
    }

    if (req.isSchoolMode) {
      systemPrompt += '\n\nSCHOOL MODE: Keep language appropriate for students. Be respectful and educational.';
      if (req.round === 1) {
        systemPrompt += '\n\nSOCRATES MODE: Help them discover stronger arguments through questions, not just defeat them.';
      }
    }

    const messages = req.history.map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    }));

    messages.push({
      role: 'user',
      content: `Your opponent argues: "${req.userArgument}"\n\nRespond to this argument from your ${req.aiStance} position.`,
    });

    const aiResponse = await callClaude(systemPrompt, messages, 300);

    const userScore = scoreArgument(req.userArgument, req.rhetoricClass, req.round);
    const aiScore = scoreArgument(aiResponse, 'politician', req.round);

    return new Response(
      JSON.stringify({
        aiArgument: aiResponse,
        userScore,
        aiScore,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('AI Argument error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate argument' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

async function debrief(req: DebriefRequest): Promise<Response> {
  try {
    let systemPrompt =
      'You are a debate coach providing constructive feedback. Be specific, encouraging where earned, and actionable.';

    if (req.isSchoolMode) {
      systemPrompt +=
        ' Focus on growth and learning. Highlight what they did well before areas for improvement.';
    } else {
      systemPrompt += ' Be honest about where they were weak. Competitive feedback.';
    }

    const avgLogic = Math.round(
      req.scores.reduce((sum, s) => sum + s.logic, 0) / req.scores.length
    );
    const avgRhetoric = Math.round(
      req.scores.reduce((sum, s) => sum + s.rhetoric, 0) / req.scores.length
    );
    const avgFact = Math.round(
      req.scores.reduce((sum, s) => sum + s.fact, 0) / req.scores.length
    );

    const prompt = `Provide a debrief for a ${req.rhetoricClass} debater on the topic: "${req.topic}"
They argued: ${req.stance}
Debate result: ${req.winner ? 'WIN' : 'LOSS'}

Their average scores:
- Logic: ${avgLogic}/100
- Rhetoric: ${avgRhetoric}/100
- Fact: ${avgFact}/100

Key arguments they made: ${req.userArguments.slice(0, 2).join(' | ')}

Give 2-3 sentences of specific, actionable feedback.`;

    const response = await callClaude(systemPrompt, [{ role: 'user', content: prompt }], 250);

    return new Response(JSON.stringify({ debrief: response }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('Debrief error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate debrief' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

async function oracle(req: OracleRequest): Promise<Response> {
  try {
    const messages = req.history.map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    }));

    messages.push({
      role: 'user',
      content: req.message,
    });

    const response = await callClaude(ORACLE_PROMPT, messages, 200);

    const unlockUnderground =
      response.includes('deeper chamber') ||
      response.includes('awaits') ||
      req.history.length >= 6;

    return new Response(
      JSON.stringify({
        response,
        unlockUnderground,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Oracle error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate Oracle response' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

async function underground(req: UndergroundRequest): Promise<Response> {
  try {
    const undergroundPrompt = `${ORACLE_PROMPT}
This is an Underground session — deeper, more intimate, less about debate form and more about what they actually believe.
Respond with genuine curiosity about their inner convictions.`;

    const messages = req.history.map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    }));

    messages.push({
      role: 'user',
      content: req.argument,
    });

    const response = await callClaude(undergroundPrompt, messages, 200);

    // Calculate depth score
    const wordCount = req.argument.split(/\s+/).length;
    let depthScore =
      wordCount * 0.5 + (/(i think|i believe|perhaps|maybe|wonder)/.test(req.argument) ? 20 : 0);
    depthScore += Math.random() * 15;

    return new Response(
      JSON.stringify({
        response,
        depthScore: Math.round(depthScore),
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error('Underground error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate Underground response' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

async function oracleLine(req: OracleLineRequest): Promise<Response> {
  try {
    const prompt = `Based on this conversation summary, write one sentence — exactly one — that captures this person's relationship to truth and argument.
Be precise. Be honest. Be indelible.

Examples of good Oracle Lines:
- "Argues from fear of being wrong rather than desire to be right."
- "Has not yet decided what they actually believe."
- "Rare. Argues to find truth, not to win."
- "Strongest when uncomfortable. Weakest when safe."

Conversation summary:
${req.conversationSummary}

Your Oracle Line:`;

    const response = await callClaude(
      'You are The Oracle. Generate a precise, indelible one-sentence assessment.',
      [{ role: 'user', content: prompt }],
      100
    );

    return new Response(JSON.stringify({ line: response }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('Oracle Line error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate Oracle Line' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}

export default async function handler(req: Request): Promise<Response> {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing action' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    switch (action) {
      case 'shadow_cabinet':
        return shadowCabinet(body);
      case 'ai_argument':
        return aiArgument(body);
      case 'debrief':
        return debrief(body);
      case 'oracle':
        return oracle(body);
      case 'underground':
        return underground(body);
      case 'oracle_line':
        return oracleLine(body);
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), {
          status: 400,
          headers: CORS_HEADERS,
        });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
}
