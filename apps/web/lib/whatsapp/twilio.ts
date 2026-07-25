import { createHmac, timingSafeEqual } from 'crypto';

export const twilioConfigured = Boolean(
  process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN,
);

/** The WhatsApp sender, e.g. "whatsapp:+14155238886" (Twilio sandbox). */
export function twilioFrom(): string {
  const raw = process.env.TWILIO_WHATSAPP_FROM ?? '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('whatsapp:') ? trimmed : `whatsapp:${trimmed}`;
}

/**
 * Validates Twilio's X-Twilio-Signature.
 *
 * Twilio signs: the full request URL + every POST param appended as key+value
 * in alphabetical order, HMAC-SHA1 with the auth token, base64 encoded.
 * https://www.twilio.com/docs/usage/security#validating-requests
 */
export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string | null,
): boolean {
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!token || !signature) return false;

  const data = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url);

  const expected = createHmac('sha1', token).update(Buffer.from(data, 'utf8')).digest('base64');
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Escapes text for inclusion in a TwiML XML body.
 * Replying with TwiML avoids a second API round-trip, so the founder gets an
 * answer inside Twilio's webhook window.
 */
export function twiml(message: string): string {
  const safe = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  return `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${safe}</Message></Response>`;
}

/** An empty TwiML response: acknowledge without replying. */
export function twimlEmpty(): string {
  return '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';
}

/**
 * Sends a WhatsApp message via Twilio's REST API. Used for proactive messages
 * (e.g. "your report is ready"), where there's no inbound webhook to reply to.
 * Returns true on success; never throws.
 */
export async function sendWhatsApp(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = twilioFrom();
  if (!sid || !token || !from) return false;

  const dest = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
      },
      body: new URLSearchParams({ To: dest, From: from, Body: body }),
      signal: AbortSignal.timeout(15_000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
