import { after } from 'next/server';
import { hasDatabase } from '@/lib/db';
import { validateTwilioSignature, twiml, twimlEmpty, twilioConfigured } from '@/lib/whatsapp/twilio';
import {
  getOrCreateContact,
  recordInbound,
  recordOutbound,
  recentTurns,
  updateContact,
  messageCount,
} from '@/lib/whatsapp/store';
import { interviewTurn, assistantTurn, missingFields, GREETING, WRAP_UP } from '@/lib/whatsapp/agent';
import { runResearchAndNotify } from '@/lib/whatsapp/research';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
// Twilio gives up after ~15s; stay well inside that.
export const maxDuration = 30;

const XML = { 'Content-Type': 'text/xml; charset=utf-8' } as const;

function reply(message: string): Response {
  return new Response(twiml(message), { status: 200, headers: XML });
}
function ack(): Response {
  return new Response(twimlEmpty(), { status: 200, headers: XML });
}

/**
 * Twilio WhatsApp webhook.
 *
 * Twilio POSTs form-encoded params here whenever a founder messages the Scout
 * number. We verify the signature, load (or create) the conversation, run one
 * agent turn, persist it, and reply with TwiML so the founder gets an answer
 * inside Twilio's webhook window.
 */
export async function POST(req: Request) {
  if (!twilioConfigured) {
    return new Response('Twilio is not configured', { status: 503 });
  }
  if (!hasDatabase) {
    return new Response('Database is not configured', { status: 503 });
  }

  // Read the form body once, as both a params object (for signing) and values.
  const raw = await req.text();
  const form = new URLSearchParams(raw);
  const params: Record<string, string> = {};
  form.forEach((v, k) => {
    params[k] = v;
  });

  // Twilio signs the exact public URL it called. Behind Vercel's proxy the
  // request URL can differ, so prefer the forwarded host when present.
  const url = new URL(req.url);
  const host = req.headers.get('x-forwarded-host') ?? url.host;
  const proto = req.headers.get('x-forwarded-proto') ?? 'https';
  const publicUrl = `${proto}://${host}${url.pathname}`;

  const signature = req.headers.get('x-twilio-signature');
  const skipVerify = process.env.TWILIO_SKIP_SIGNATURE_CHECK === 'true';
  if (!skipVerify && !validateTwilioSignature(publicUrl, params, signature)) {
    return new Response('Invalid signature', { status: 403 });
  }

  const from = (params.From ?? '').replace('whatsapp:', '').trim();
  const body = (params.Body ?? '').trim();
  const messageSid = params.MessageSid || params.SmsMessageSid || null;
  const profileName = params.ProfileName || null;
  if (!from) return ack();

  try {
    const contact = await getOrCreateContact(from, profileName);

    // Ignore Twilio retries of a message we already handled.
    const isNew = await recordInbound(contact.id, body || '(empty)', messageSid);
    if (!isNew) return ack();

    // First ever message: greet and start the interview.
    if ((await messageCount(contact.id)) <= 1) {
      await recordOutbound(contact.id, GREETING);
      return reply(GREETING);
    }

    const turns = await recentTurns(contact.id, 20);
    const profile = (contact.profile ?? {}) as Record<string, unknown>;

    // Interview until the profile is complete, then act as the assistant.
    if (contact.stage !== 'complete') {
      const result = await interviewTurn(profile, turns);
      const merged = { ...profile, ...result.profileUpdates };
      const done = result.complete && missingFields(merged).length === 0;

      await updateContact(contact.id, {
        profile: merged,
        ...(done ? { stage: 'complete' as const } : {}),
        ...(typeof merged.name === 'string' && !contact.name ? { name: merged.name } : {}),
      });

      const message = done ? `${result.reply}\n\n${WRAP_UP}` : result.reply;
      await recordOutbound(contact.id, message);

      // The interview just finished: actually go and do the research we
      // promised. It takes about a minute, so it runs after this response is
      // sent and the result arrives as a separate WhatsApp message.
      if (done) {
        after(() => runResearchAndNotify(contact.id, from));
      }
      return reply(message);
    }

    // If research somehow never started (e.g. an older conversation), kick it
    // off now rather than leaving the founder waiting forever.
    if (contact.researchStatus === 'none' || contact.researchStatus === 'failed') {
      after(() => runResearchAndNotify(contact.id, from));
    }

    const answer = await assistantTurn(
      {
        profile,
        researchStatus: contact.researchStatus ?? 'none',
        matches: contact.matches ?? [],
        unlocked: contact.unlocked ?? false,
        paymentUrl: contact.paymentUrl ?? null,
      },
      turns,
    );
    await recordOutbound(contact.id, answer);
    return reply(answer);
  } catch (err) {
    // Never leave the founder hanging: acknowledge with a human message.
    console.error('[twilio webhook]', err);
    return reply(
      "Sorry, I hit a snag on my end. Please send that again in a moment and I'll pick up where we left off.",
    );
  }
}

/** Twilio pings with GET when you paste the URL; make that visibly OK. */
export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      service: 'Scout WhatsApp webhook (Twilio)',
      configured: twilioConfigured,
      database: hasDatabase,
      hint: 'Set this URL as the "When a message comes in" webhook (HTTP POST) on your Twilio WhatsApp sender.',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  );
}
