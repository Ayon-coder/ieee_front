const CHATBOT_URL = import.meta.env.VITE_CHATBOT_URL || 'http://localhost:5000';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type ChatSource = {
  title: string;
  link: string;
};

export type ChatMode = 'deep_dive' | 'student_branch';

export type ChatResponse = {
  choices: { message: { role: string; content: string } }[];
  sources?: ChatSource[];
  is_warning?: boolean;
  is_rejected?: boolean;
};

export async function sendChat(
  messages: ChatMessage[],
  mode: ChatMode,
  signal?: AbortSignal
): Promise<ChatResponse> {
  const response = await fetch(`${CHATBOT_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, mode }),
    signal,
  });
  if (!response.ok) {
    throw new Error(`Chat request failed with status ${response.status}`);
  }
  return response.json();
}

export async function warmupChat(): Promise<{ status: string; message?: string }> {
  const response = await fetch(`${CHATBOT_URL}/api/warmup`, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Warmup failed with status ${response.status}`);
  }
  return response.json();
}
