/**
 * Underground Debate Club - Frontend UI
 * This builds the static frontend for the application
 */

export function initializeApp(): void {
  console.log('Underground Debate Club initialized');
}

export interface DebateRequest {
  topic: string;
  position: string;
}

export interface DebateResponse {
  argument: string;
}

export interface DebriefRequest {
  topic: string;
  arguments: string[];
}

export interface DebriefResponse {
  debrief: string;
}

// API Helper functions
export async function fetchDebateArgument(
  request: DebateRequest
): Promise<DebateResponse> {
  const response = await fetch('/api/debate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchDebrief(
  request: DebriefRequest
): Promise<DebriefResponse> {
  const response = await fetch('/api/debrief', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

initializeApp();
