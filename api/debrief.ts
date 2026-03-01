import { Anthropic } from 'anthropic';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(
  req: Request
): Promise<Response> {
  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body = await req.json();
    const { topic, arguments: debateArguments } = body;

    if (!topic || !debateArguments) {
      return new Response(
        JSON.stringify({ error: 'Missing topic or arguments' }),
        { status: 400, headers }
      );
    }

    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a debate coach. Provide a detailed debrief and analysis of the following debate:
Topic: ${topic}
Arguments: ${JSON.stringify(debateArguments)}

Provide constructive feedback, identify strengths, weaknesses, and suggestions for improvement.`,
        },
      ],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    return new Response(
      JSON.stringify({ debrief: responseText }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Debrief API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers }
    );
  }
}
