import { createHmac, timingSafeEqual } from 'crypto';
import DodoPayments from 'dodopayments';

/**
 * Dodo Payments (merchant of record) checkout for unlocking Scout. Dodo handles
 * ₹/$ pricing, GST and invoicing; the price lives on the product in their
 * dashboard. Env:
 *   DODO_PAYMENTS_API_KEY, DODO_PAYMENTS_PRODUCT_ID,
 *   DODO_PAYMENTS_WEBHOOK_KEY, DODO_PAYMENTS_ENVIRONMENT (test_mode|live_mode)
 */
export const paymentsConfigured = Boolean(
  process.env.DODO_PAYMENTS_API_KEY && process.env.DODO_PAYMENTS_PRODUCT_ID,
);

function client(): DodoPayments {
  return new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    environment:
      process.env.DODO_PAYMENTS_ENVIRONMENT === 'live_mode' ? 'live_mode' : 'test_mode',
  });
}

/** Creates a checkout session; returns { url, sessionId }. */
export async function createCheckoutSession(params: {
  userId?: string;
  returnUrl: string;
  metadata?: Record<string, string>;
}): Promise<{ url: string; sessionId: string }> {
  const dodo = client();
  const session = await dodo.checkoutSessions.create({
    product_cart: [{ product_id: process.env.DODO_PAYMENTS_PRODUCT_ID as string, quantity: 1 }],
    return_url: params.returnUrl,
    metadata: {
      ...(params.userId ? { user_id: params.userId } : {}),
      ...(params.metadata ?? {}),
    },
  });
  if (!session.checkout_url) throw new Error('Dodo returned no checkout URL');
  return { url: session.checkout_url, sessionId: session.session_id };
}

/** Returns true when the checkout session's payment has succeeded. */
export async function isCheckoutPaid(sessionId: string): Promise<boolean> {
  const dodo = client();
  try {
    const status = await dodo.checkoutSessions.retrieve(sessionId);
    return status.payment_status === 'succeeded';
  } catch {
    return false;
  }
}

export interface WebhookHeaders {
  id: string;
  timestamp: string;
  signature: string;
}

interface DodoWebhookEvent {
  type: string;
  data?: {
    payment_id?: string;
    checkout_session_id?: string | null;
    metadata?: Record<string, string>;
  };
}

const TIMESTAMP_TOLERANCE_SECONDS = 5 * 60;

/**
 * Verifies a Dodo webhook (Standard Webhooks: HMAC-SHA256 over
 * "id.timestamp.body" with the base64 secret) and, for a succeeded payment,
 * returns the identifiers we can use to activate the right user.
 */
export function verifyWebhook(
  rawBody: string,
  headers: WebhookHeaders,
): { type: string; userId?: string; waContactId?: string; sessionId?: string } {
  if (!headers.id || !headers.timestamp || !headers.signature) {
    throw new Error('missing webhook signature headers');
  }
  const ageSeconds = Math.abs(Date.now() / 1000 - Number(headers.timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > TIMESTAMP_TOLERANCE_SECONDS) {
    throw new Error('webhook timestamp outside tolerance');
  }

  const key = process.env.DODO_PAYMENTS_WEBHOOK_KEY ?? '';
  const secret = Buffer.from(key.startsWith('whsec_') ? key.slice(6) : key, 'base64');
  const expected = createHmac('sha256', secret)
    .update(`${headers.id}.${headers.timestamp}.${rawBody}`)
    .digest('base64');
  const expectedBuf = Buffer.from(expected);

  const valid = headers.signature.split(' ').some((part) => {
    const [version, sig] = part.split(',');
    if (version !== 'v1' || !sig) return false;
    const sigBuf = Buffer.from(sig);
    return sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf);
  });
  if (!valid) throw new Error('invalid webhook signature');

  const event = JSON.parse(rawBody) as DodoWebhookEvent;
  return {
    type: event.type,
    userId: event.data?.metadata?.user_id,
    waContactId: event.data?.metadata?.wa_contact_id,
    sessionId: event.data?.checkout_session_id ?? undefined,
  };
}
