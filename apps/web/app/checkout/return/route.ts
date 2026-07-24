import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';
import { getSubscription } from '@/lib/subscription';
import { isCheckoutPaid } from '@/lib/dodo';
import { activateForUser } from '@/lib/activate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Where Dodo returns the customer after checkout. We don't trust the redirect
 * alone: we look up the user's pending checkout session and verify its payment
 * status with Dodo before activating. This makes the flow work even if the
 * webhook hasn't landed yet (or isn't configured).
 */
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const user = await getSessionUser();
  if (!user) return NextResponse.redirect(`${origin}/signin`);

  const sub = await getSubscription(user.id);
  if (sub?.status === 'active') {
    return NextResponse.redirect(`${origin}/dashboard?welcome=1`);
  }

  const sessionId = sub?.providerRef;
  if (sessionId && (await isCheckoutPaid(sessionId))) {
    await activateForUser(user.id, user.name, { provider: 'dodo', providerRef: sessionId });
    return NextResponse.redirect(`${origin}/dashboard?welcome=1`);
  }

  // Not confirmed yet — send back to the paywall with a gentle notice.
  return NextResponse.redirect(`${origin}/paywall?status=pending`);
}
