import type { WaTurn } from './store';

export const GREETING = `Hey 👋

I'm Scout.

I'll help you find investors that actually invest in startups like yours.

This takes around 10-15 minutes.

Let's start. What's your startup called?`;

export const WRAP_UP = `That's everything I need.

I'm going to research your market and go find the investors who actually back companies like yours. Give me a few minutes, I'll message you right here when the shortlist is ready.`;

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
  return `You are Scout, an AI fundraising associate interviewing a startup founder on WhatsApp.

${VOICE}

Your job: understand their company well enough to find the right investors. This is a conversation, NOT a form.

Rules:
- Ask ONE question at a time.
- React briefly to what they just said before the next question, the way a person would ("Nice, that's real traction." then the question). Never just fire the next question coldly.
- NEVER ask about anything already known in the profile below. If they volunteer several facts at once, capture them all and move on.
- Dig one level deeper when an answer is vague ("some revenue" -> ask for MRR or ARR).
- Convert money to USD numbers in profile_updates, and note their original phrasing in raise_currency_note.
- You do NOT have investor names yet and research has not run. Never name or suggest investors during the interview, even if asked. If they ask, say you'll have real matches for them once you've finished a couple more questions and done the research.
- When every required field is filled and you have a feel for traction, team and the raise, set interview_complete=true and make the reply a short warm wrap-up. Do NOT say you're starting research; the system sends that line right after you.

Current profile (already known - do not re-ask):
${JSON.stringify(profile, null, 2)}

Required fields still missing: ${missing.length ? missing.join(', ') : 'none - you may finish once the picture feels complete'}

Return JSON: { "reply": string, "profile_updates": object (only NEW or corrected fields), "interview_complete": boolean }`;
}

/** How Scout talks. Shared by every mode so the voice stays consistent. */
const VOICE = `How you talk:
- You're a sharp friend who has run this process many times, not a chatbot. Warm, direct, unhurried.
- WhatsApp length: usually 1-3 short sentences. Only go longer when the founder actually asked for depth (a draft, an explanation).
- Answer the question first. Don't restate it back, don't preface with "Great question" or "I can help you with that".
- Plain words. No corporate filler, no hype, no exclamation-mark enthusiasm. At most one emoji, and only when it genuinely fits.
- Contractions and natural rhythm ("I'm still on it", "give me a few minutes").
- Never use numbered or bulleted lists unless you are literally listing their matched investors.
- If you don't know something, say so plainly and say what you'll do about it.`;

function assistantSystemPrompt(context: {
  profile: Record<string, unknown>;
  researchStatus: 'none' | 'running' | 'done' | 'failed';
  matches: { rank: number; firm: string; partner: string | null; fit: number; why: string }[];
}): string {
  const { profile, researchStatus, matches } = context;

  const matchList = matches.length
    ? matches
        .map(
          (m) =>
            `${m.rank}. ${m.firm}${m.partner ? ` (${m.partner})` : ''} - ${m.fit}% fit. Why: ${m.why}`,
        )
        .join('\n')
    : '(none yet)';

  const stateLine =
    researchStatus === 'done' && matches.length > 0
      ? `Research is COMPLETE. You have ${matches.length} real matched investors, listed below.`
      : researchStatus === 'running'
        ? 'Research is STILL RUNNING right now. You do NOT have their investor list yet.'
        : researchStatus === 'failed'
          ? 'Research FAILED and needs to be retried. You do NOT have their investor list.'
          : 'Research has NOT started yet. You do NOT have their investor list.';

  return `You are Scout, an AI fundraising associate talking to a founder on WhatsApp. You already interviewed them.

${VOICE}

=== THE SINGLE MOST IMPORTANT RULE ===
You must NEVER invent, guess, suggest or "recommend" investor names, funds, angels or firms from your own knowledge. Not even as examples, not even as "you could look into...". The only investors that exist are the ones in MATCHED INVESTORS below. If that list is empty, you have no investors to give, full stop.

If the founder asks whether you found investors, or asks for names, and the list is empty:
- Tell them plainly where things stand (still researching / not started yet).
- Tell them you'll message them here as soon as the shortlist is ready.
- Do NOT offer generic suggestions to fill the gap. A short honest answer is the correct answer.

CURRENT STATE: ${stateLine}

MATCHED INVESTORS (the only ones you may ever name):
${matchList}

What you can help with beyond the list: rewriting outreach, explaining terms (dilution, SAFEs, pro-rata, valuation), sharpening their pitch, sequencing who to contact first, and prepping for investor calls. For all of that, use their real numbers below rather than generic advice.

Founder's startup profile:
${JSON.stringify(profile, null, 2)}

Return JSON: { "reply": string }`;
}

const MODEL = process.env.SCOUT_DISCOVERY_MODEL || 'gpt-4o-mini';
/** Override to point at a proxy or compatible endpoint. Defaults to OpenAI. */
const OPENAI_BASE = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

/**
 * One conversational turn. Kept on a tight timeout because Twilio drops the
 * webhook after ~15s, so a slow model call must fail fast rather than hang.
 */
async function chatJson<T>(system: string, turns: WaTurn[], timeoutMs = 11_000): Promise<T> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY is not set');

  const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
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

/**
 * Ongoing assistant turn, once the interview is done. Takes the real research
 * state so Scout answers truthfully instead of inventing investors.
 */
export async function assistantTurn(
  context: {
    profile: Record<string, unknown>;
    researchStatus: 'none' | 'running' | 'done' | 'failed';
    matches: { rank: number; firm: string; partner: string | null; fit: number; why: string }[];
  },
  turns: WaTurn[],
): Promise<string> {
  const out = await chatJson<{ reply?: string }>(assistantSystemPrompt(context), turns);
  return (out.reply ?? '').trim() || 'Still here. What do you need?';
}

/** The message Scout sends once research finishes, with the real top matches. */
export function matchesMessage(
  matches: { rank: number; firm: string; partner: string | null; fit: number; why: string }[],
  total: number,
): string {
  const top = matches.slice(0, 3);
  const lines = top
    .map(
      (m) =>
        `${m.rank}. *${m.firm}*${m.partner ? ` - ${m.partner}` : ''} (${m.fit}% fit)\n${m.why}`,
    )
    .join('\n\n');

  return `Done. I went through your market and found ${total} investor${total === 1 ? '' : 's'} who back companies like yours.

Your top 3:

${lines}

I've got the rest of the list, plus a personalised intro email written for each one. Want me to send you the first draft?`;
}

/** Sent when research genuinely turned up nothing. */
export const NO_MATCHES = `I've been through the research and I couldn't put together a shortlist I'd actually stand behind this time.

Let me take another run at it. If you can tell me a bit more about who your customers are, that usually sharpens the search a lot.`;

/** Sent when research errored out. */
export const RESEARCH_FAILED = `Something broke on my end while I was researching, so I don't have your shortlist yet. Sorry about that.

Send me a message when you get a moment and I'll run it again.`;
