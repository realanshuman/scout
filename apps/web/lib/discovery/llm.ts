export const llmConfigured = Boolean(process.env.OPENAI_API_KEY);

/**
 * The OpenAI model used for discovery. Defaults to a fast, cheap, widely
 * available model; override with SCOUT_DISCOVERY_MODEL if you like. We do NOT
 * read OPENAI_MODEL here on purpose — that var often holds a placeholder from
 * the example env, which would break the call.
 */
const MODEL = process.env.SCOUT_DISCOVERY_MODEL || 'gpt-4o-mini';
/** Override to point at a proxy or compatible endpoint. Defaults to OpenAI. */
const OPENAI_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

/**
 * One JSON completion from OpenAI (Chat Completions + json_object mode).
 * Returns a parsed object. Throws on missing key, HTTP error, or bad JSON.
 */
export async function openaiJson<T = unknown>(params: {
  system: string;
  user: string;
  maxTokens?: number;
}): Promise<T> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');

  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.4,
      max_tokens: params.maxTokens ?? 4000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: params.system },
        { role: 'user', content: params.user },
      ],
    }),
    signal: AbortSignal.timeout(55_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content ?? '';
  return JSON.parse(content) as T;
}
