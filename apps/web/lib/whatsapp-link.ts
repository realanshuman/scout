/**
 * The single source of truth for "Message Scout" links across the site.
 *
 * NEXT_PUBLIC_WHATSAPP_NUMBER — the WhatsApp number founders message, digits
 * only or with a +; both work. Defaults to Twilio's WhatsApp sandbox number.
 *
 * NEXT_PUBLIC_WHATSAPP_JOIN_CODE — set this while you're on the Twilio
 * sandbox (e.g. "join happy-tiger"). Twilio ignores anyone who hasn't sent the
 * join code first, so we pre-fill it as the message: the founder taps the
 * button, hits send, and is connected. Leave it unset once you have an
 * approved production sender, and the pre-filled text becomes a normal hello.
 *
 * Note: NEXT_PUBLIC_* values are baked in at build time, so changing either
 * one requires a redeploy to take effect.
 */
export const WA_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '14155238886').replace(
  /[^0-9]/g,
  '',
);

export const WA_JOIN_CODE = (process.env.NEXT_PUBLIC_WHATSAPP_JOIN_CODE ?? '').trim();

/** The default message pre-filled when someone taps "Message Scout". */
export const WA_DEFAULT_TEXT = WA_JOIN_CODE || 'Hi Scout!';

/**
 * Builds a wa.me deep link. Pass `text` to pre-fill a specific message; on the
 * sandbox the join code is appended when needed so the founder still connects.
 */
export function waLink(text?: string): string {
  const body = text
    ? WA_JOIN_CODE
      ? `${WA_JOIN_CODE}\n${text}`
      : text
    : WA_DEFAULT_TEXT;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(body)}`;
}

/** The plain link, with no specific message. */
export const WA_LINK = waLink();
