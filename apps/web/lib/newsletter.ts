import { randomUUID } from 'crypto';
import { hasDatabase, query, queryOne } from './db';

export interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  status: 'active' | 'unsubscribed';
  unsubscribeKey: string;
}

/**
 * Adds (or reactivates) a subscriber. Idempotent: signing up twice with the
 * same email is a no-op that still reports success, which is the friendly
 * behaviour and avoids leaking who is already on the list.
 */
export async function subscribe(params: {
  email: string;
  name?: string | null;
  stage?: string | null;
  source?: string;
}): Promise<{ alreadySubscribed: boolean }> {
  const email = params.email.trim().toLowerCase();

  const existing = await queryOne<{ id: string; status: string }>(
    `SELECT "id","status" FROM "subscriber" WHERE "email" = $1`,
    [email],
  );

  if (existing) {
    if (existing.status !== 'active') {
      await query(
        `UPDATE "subscriber" SET "status" = 'active', "updatedAt" = now() WHERE "id" = $1`,
        [existing.id],
      );
      return { alreadySubscribed: false };
    }
    return { alreadySubscribed: true };
  }

  await query(
    `INSERT INTO "subscriber" ("id","email","name","stage","source","unsubscribeKey")
     VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT ("email") DO NOTHING`,
    [
      randomUUID(),
      email,
      params.name?.trim() || null,
      params.stage?.trim() || null,
      params.source ?? 'newsletter-page',
      randomUUID().replace(/-/g, ''),
    ],
  );
  return { alreadySubscribed: false };
}

/** One-click unsubscribe by token. Returns true when a row was updated. */
export async function unsubscribeByKey(key: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `UPDATE "subscriber" SET "status" = 'unsubscribed', "updatedAt" = now()
      WHERE "unsubscribeKey" = $1 AND "status" = 'active'
      RETURNING "id"`,
    [key],
  );
  return rows.length > 0;
}

/** Active subscriber count, for social proof. Returns null when unavailable. */
export async function activeCount(): Promise<number | null> {
  if (!hasDatabase) return null;
  try {
    const row = await queryOne<{ n: string }>(
      `SELECT count(*)::text AS n FROM "subscriber" WHERE "status" = 'active'`,
    );
    return Number(row?.n ?? 0);
  } catch {
    return null;
  }
}
