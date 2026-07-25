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
- Money: 1 crore = 10 million rupees, roughly $120K, so 3 crore is roughly $360K. Convert carefully and never mix up revenue with the raise amount.
- If they're confused, joking, annoyed, or just saying "hi" or "oh": respond like a person first, briefly and warmly, then ease back to the conversation. Never fire a canned line at them.
- Product questions: interview and research are free, they'll get a free top-3 investor preview, and the full report (all investors + contacts + intro drafts) is a one-time Rs 999 / about $29. Answer this correctly if asked; never deny the payment step exists.
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

export interface AssistantContext {
  profile: Record<string, unknown>;
  researchStatus: 'none' | 'running' | 'done' | 'failed';
  matches: {
    rank: number;
    firm: string;
    partner: string | null;
    fit: number;
    why: string;
    email?: string | null;
    linkedin?: string | null;
    website?: string | null;
    outreachSubject?: string;
  }[];
  unlocked: boolean;
  paymentUrl: string | null;
}

function assistantSystemPrompt(context: AssistantContext): string {
  const { profile, researchStatus, matches, unlocked, paymentUrl } = context;

  // Investors the founder is allowed to see right now.
  const visible = unlocked ? matches : matches.slice(0, 3);
  const matchList = visible.length
    ? visible
        .map((m) => {
          // Contact details are part of the paid report. On the free preview
          // the founder sees who matched and why, not how to reach them.
          const contact = unlocked
            ? [
                m.email ? `email: ${m.email}` : 'email: not public',
                m.linkedin ? `linkedin: ${m.linkedin}` : null,
                m.website ? `website: ${m.website}` : null,
              ]
                .filter(Boolean)
                .join(', ')
            : 'in the full report';
          return `${m.rank}. ${m.firm}${m.partner ? ` (partner: ${m.partner})` : ''} - ${m.fit}% fit. Why: ${m.why}. Contact: ${contact}`;
        })
        .join('\n')
    : '(none yet)';

  const stateLine =
    researchStatus === 'done' && matches.length > 0
      ? unlocked
        ? `Research is COMPLETE and the founder has UNLOCKED the full report: all ${matches.length} investors below, with contacts where found.`
        : `Research is COMPLETE. The founder is on the FREE PREVIEW: they can see their top 3 (below) out of ${matches.length} total. The rest unlock with the one-time payment.`
      : researchStatus === 'running'
        ? 'Research is STILL RUNNING right now. You do NOT have their investor list yet.'
        : researchStatus === 'failed'
          ? 'Research FAILED and needs to be retried. You do NOT have their investor list.'
          : 'Research has NOT started yet. You do NOT have their investor list.';

  return `You are Scout, an AI fundraising associate talking to a founder on WhatsApp. You already interviewed them.

${VOICE}

=== HOW YOUR PRODUCT WORKS (know this cold, never contradict it) ===
1. The interview and research are free.
2. After research, the founder gets a FREE PREVIEW: their top 3 matched investors.
3. The FULL REPORT is a one-time payment of Rs 999 (about $29): every matched investor, contact details where found, and a personalised intro draft for each. No subscription.
4. After unlocking, you stay available as their fundraising assistant, free.
${paymentUrl ? `Payment link (share it whenever they want to unlock, and when you pitch the full report): ${paymentUrl}` : 'The payment link is not set up yet. If they ask to unlock, say the payment system is being set up and you will message them the link here as soon as it is live.'}

=== HARD RULES ===
1. NEVER invent, guess or "recommend" investors from your own knowledge. The only investors that exist are in MATCHED INVESTORS below. If the list is empty, you have none to give, full stop. No generic suggestions to fill the gap.
2. NEVER promise to do something "in a moment" or "later". You cannot act later; you can only act in THIS reply. Asked for a draft? Write the full draft IN this reply. Asked for the list? Give it IN this reply.
3. Contact details: only what is written in MATCHED INVESTORS. If a contact says "in the full report", contacts come with the unlock; say so warmly and share the payment link. If an email says "not public", say that honestly and point to the website or LinkedIn listed. Never construct or guess an email address.
4. Locked investors (ranks beyond 3 when on the free preview): you may say how many more there are, but never name them or their details until unlocked. If asked, explain the unlock warmly and share the payment link. No pressure tactics; once is enough per conversation unless they ask again.
5. Drafts: write them personally addressed to the partner if known (never "[Investor's Name]" or any placeholder), reference WHY that investor fits from the match data, use the founder's real numbers, keep it under 120 words, and skip stiff openers like "I hope this message finds you well".
6. Money: 1 crore = 10 million rupees, roughly $120K. 3 crore is roughly $360K. Do conversions carefully and don't mix up their revenue with their raise.
7. If the founder is confused, frustrated, or just chatting ("oh", "why", "are you a bot"), respond like a person first: acknowledge, keep it light, then gently continue. Never repeat a canned script at them.

CURRENT STATE: ${stateLine}

MATCHED INVESTORS (the only ones you may name or share details from):
${matchList}
${!unlocked && matches.length > 3 ? `\n(${matches.length - 3} more investors exist but are LOCKED. Do not name them.)` : ''}

Beyond the list you can: rewrite outreach, explain terms (dilution, SAFEs, pro-rata, valuation), sharpen their pitch, plan who to contact first, prep for calls. Always with their real numbers, never generic advice.

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
 * and paywall state so Scout answers truthfully instead of inventing things.
 */
export async function assistantTurn(context: AssistantContext, turns: WaTurn[]): Promise<string> {
  const out = await chatJson<{ reply?: string }>(assistantSystemPrompt(context), turns);
  return (out.reply ?? '').trim() || 'Still here. What do you need?';
}

/**
 * Sent when research finishes: the free top-3 preview, then the unlock offer.
 * This IS the paywall moment, so it states the product plainly.
 */
export function previewMessage(
  matches: { rank: number; firm: string; partner: string | null; fit: number; why: string }[],
  total: number,
  paymentUrl: string | null,
): string {
  const top = matches.slice(0, 3);
  const lines = top
    .map(
      (m) =>
        `${m.rank}. *${m.firm}*${m.partner ? ` - ${m.partner}` : ''} (${m.fit}% fit)\n${m.why}`,
    )
    .join('\n\n');

  const rest = Math.max(total - top.length, 0);
  const unlockLine = paymentUrl
    ? `Unlock here: ${paymentUrl}`
    : `I'll send you the payment link here shortly.`;

  return `Done. I found ${total} investor${total === 1 ? '' : 's'} who genuinely back companies like yours.

Your top 3, free:

${lines}

${
  rest > 0
    ? `There are ${rest} more on your list. The full report is a one-time Rs 999 (about $29): every investor, contact details where I found them, and a personal intro draft for each. No subscription.

${unlockLine}`
    : `Want an intro draft for any of them? Just ask.`
}`;
}

/** Sent right after payment: the full list with contacts. */
export function unlockedMessage(
  matches: {
    rank: number;
    firm: string;
    partner: string | null;
    fit: number;
    email?: string | null;
    linkedin?: string | null;
    website?: string | null;
  }[],
): string {
  const lines = matches
    .map((m) => {
      const contact = m.email
        ? m.email
        : m.linkedin
          ? m.linkedin
          : m.website
            ? m.website
            : 'contact not public, I can help you find a warm path in';
      return `${m.rank}. *${m.firm}*${m.partner ? ` - ${m.partner}` : ''} (${m.fit}% fit)\n${contact}`;
    })
    .join('\n\n');

  return `Payment received, you're in. 🤝

Here's your full list:

${lines}

Ask me for an intro draft for any of them and I'll write it right here. I'd start from the top.`;
}

/** Sent when research genuinely turned up nothing. */
export const NO_MATCHES = `I've been through the research and I couldn't put together a shortlist I'd actually stand behind this time.

Let me take another run at it. If you can tell me a bit more about who your customers are, that usually sharpens the search a lot.`;

/** Sent when research errored out. */
export const RESEARCH_FAILED = `Something broke on my end while I was researching, so I don't have your shortlist yet. Sorry about that.

Send me a message when you get a moment and I'll run it again.`;
