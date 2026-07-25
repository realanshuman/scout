import { NextResponse } from 'next/server';
import { verifyWebhook } from '@/lib/dodo';
import { activateForUser } from '@/lib/activate';
import { userIdByProviderRef } from '@/lib/subscription';
import { queryOne } from '@/lib/db';
import {
  getContactById,
  contactByPaymentRef,
  setUnlocked,
  recordOutbound,
} from '@/lib/whatsapp/store';
import { unlockedMessage } from '@/lib/whatsapp/agent';
import { sendWhatsApp } from '@/lib/whatsapp/twilio';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Dodo Payments webhook. On a succeeded payment we activate the right user's
 * subscription and ensure their workspace exists. Idempotent: repeated
 * deliveries are safe. Always returns 200 for accepted events so Dodo doesn't
 * retry needlessly; returns 400 only when the signature is invalid.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  let result: { type: string; userId?: string; waContactId?: string; sessionId?: string };
  try {
    result = verifyWebhook(raw, {
      id: req.headers.get('webhook-id') ?? '',
      timestamp: req.headers.get('webhook-timestamp') ?? '',
      signature: req.headers.get('webhook-signature') ?? '',
    });
  } catch {
    return NextResponse.json({ error: 'invalid webhook' }, { status: 400 });
  }

  if (result.type !== 'payment.succeeded') {
    return NextResponse.json({ received: true });
  }

  // WhatsApp flow: the payment unlocks a wa_contact's full report.
  let waContact = null;
  if (result.waContactId) waContact = await getContactById(result.waContactId);
  if (!waContact && result.sessionId) waContact = await contactByPaymentRef(result.sessionId);
  if (waContact) {
    if (!waContact.unlocked) {
      await setUnlocked(waContact.id);
      const message = unlockedMessage(waContact.matches ?? []);
      await recordOutbound(waContact.id, message);
      await sendWhatsApp(waContact.phone, message);
    }
    return NextResponse.json({ received: true });
  }

  // Dashboard flow: resolve the user via metadata or the pending session ref.
  let userId = result.userId ?? null;
  if (!userId && result.sessionId) userId = await userIdByProviderRef(result.sessionId);
  if (!userId) return NextResponse.json({ received: true });

  const u = await queryOne<{ name: string }>(`SELECT "name" FROM "user" WHERE "id" = $1`, [userId]);
  await activateForUser(userId, u?.name ?? '', {
    provider: 'dodo',
    providerRef: result.sessionId,
  });

  return NextResponse.json({ received: true });
}
