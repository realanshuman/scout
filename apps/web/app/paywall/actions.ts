'use server';

import { getSessionUser } from '@/lib/session';
import { createCheckoutSession, paymentsConfigured } from '@/lib/dodo';
import { markCheckoutPending } from '@/lib/subscription';

export interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/**
 * Starts a Dodo checkout for the signed-in user and returns the hosted
 * checkout URL for the client to redirect to.
 */
export async function startCheckout(): Promise<CheckoutResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Please sign in first.' };

  if (!paymentsConfigured) {
    return {
      ok: false,
      error: 'Payments are not configured yet. Add your Dodo Payments keys to enable checkout.',
    };
  }

  const base = process.env.BETTER_AUTH_URL ?? process.env.WEB_PUBLIC_URL ?? '';
  try {
    const { url, sessionId } = await createCheckoutSession({
      userId: user.id,
      returnUrl: `${base}/checkout/return`,
    });
    await markCheckoutPending(user.id, 'dodo', sessionId);
    return { ok: true, url };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Could not start checkout. Please try again.',
    };
  }
}
