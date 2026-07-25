import type { WaTurn } from './store';

export const GREETING = `Hey 👋

I'm Scout.

I'll help you find investors that actually invest in startups like yours.

This takes around 10-15 minutes.

Let's start. What's your startup called?`;

export const WRAP_UP = `Perfect, that's everything I need. 🙌

Give me a few minutes to research your startup and match you with investors. I'll message you the moment your shortlist is ready.`;

/** Fields the interview must cover before the profile counts as complete. */
const REQUIRED = [
  'name',
  'description',
  'industry',
  'stage',
  'country',
  'raise_amount_usd',
  'traction',
  'business_model',
];

export function missingFields(profile: Record<string, unknown>): string[] {
  return REQUIRED.filter((f) => {
    const v = profile[f];
    return v === undefined || v === null || v === '';
  });
}

function interviewSystemPrompt(profile: Record<string, unknown>): string {
  const missing = missingFields(profile);
  return `You are Scout, an AI fundraising associate talking to a startup founder on WhatsApp.

Your job: interview the founder like an experienced founder-friend would - warm, sharp, zero fluff. This is a conversation, NOT a form.

Rules:
- Ask ONE question at a time. Keep messages short (WhatsApp style, a few lines max).
- NEVER ask about anything already known in the profile below. If the founder volunteers several facts in one message, capture them all.
- Dig one level deeper when an answer is vague ("some revenue" -> ask for MRR or ARR).
- Convert amounts to USD numbers in profile_updates (note the original phrasing in raise_currency_note if converted).
- Light emoji is fine. Never sound like a survey.
- When every required field is filled and you have a feel for traction, team and the raise, set interview_complete=true and make the reply a short warm wrap-up (do NOT say you are starting research - the system sends that message).

Current profile (already known - do not re-ask):
${JSON.stringify(profile, null, 2)}

Required fields still missing: ${missing.length ? missing.join(', ') : 'none - you may finish once the picture feels complete'}

Return JSON: { "reply": string, "profile_updates": object (only NEW or corrected fields), "interview_complete": boolean }`;
}

function assistantSystemPrompt(profile: Record<string, unknown>): string {
  return `You are Scout, an AI fundraising associate on WhatsApp. The founder below has already completed their interview.

You can: rewrite outreach emails, explain terms (dilution, SAFEs, pro-rata...), review pitches, advise on sequencing and strategy, and discuss their investor list.

Style: WhatsApp-short, concrete, direct. Use their real context - never generic advice when a specific answer is possible.

Founder's startup profile:
${JSON.stringify(profile, null, 2)}

Return JSON: { "reply": string }`;
}

const MODEL = process.env.SCOUT_DISCOVERY_MODEL || 'gpt-4o-mini';

/**
 * One conversational turn. Kept on a tight timeout because Twilio drops the
 * webhook after ~15s, so a slow model call must fail fast rather than hang.
 */
async function chatJson<T>(system: string, turns: WaTurn[], timeoutMs = 11_000): Promise<T> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.6,
      max_tokens: 700,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, ...turns],
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${detail.slice(0, 160)}`);
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return JSON.parse(data.choices?.[0]?.message?.content ?? '{}') as T;
}

export interface InterviewResult {
  reply: string;
  profileUpdates: Record<string, unknown>;
  complete: boolean;
}

/** Runs one interview turn and returns the reply plus any profile updates. */
export async function interviewTurn(
  profile: Record<string, unknown>,
  turns: WaTurn[],
): Promise<InterviewResult> {
  const out = await chatJson<{
    reply?: string;
    profile_updates?: Record<string, unknown>;
    interview_complete?: boolean;
  }>(interviewSystemPrompt(profile), turns);

  return {
    reply: (out.reply ?? '').trim() || 'Got it. Tell me a bit more?',
    profileUpdates: out.profile_updates ?? {},
    complete: Boolean(out.interview_complete),
  };
}

/** Ongoing assistant turn, once the interview is done. */
export async function assistantTurn(
  profile: Record<string, unknown>,
  turns: WaTurn[],
): Promise<string> {
  const out = await chatJson<{ reply?: string }>(assistantSystemPrompt(profile), turns);
  return (out.reply ?? '').trim() || 'I am here. What do you need?';
}
