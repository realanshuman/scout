import { randomUUID } from 'crypto';
import { hasDatabase, query, queryOne } from './db';

export interface Subscription {
  id: string;
  userId: string;
  status: 'inactive' | 'active' | 'canceled';
  plan: string;
  provider: string | null;
  providerRef: string | null;
  currentPeriodEnd: string | null;
}

interface SubRow {
  id: string;
  userId: string;
  status: string;
  plan: string;
  provider: string | null;
  providerRef: string | null;
  currentPeriodEnd: string | null;
}

function map(row: SubRow): Subscription {
  return {
    id: row.id,
    userId: row.userId,
    status: (row.status as Subscription['status']) ?? 'inactive',
    plan: row.plan,
    provider: row.provider,
    providerRef: row.providerRef,
    currentPeriodEnd: row.currentPeriodEnd,
  };
}

export async function getSubscription(userId: string): Promise<Subscription | null> {
  if (!hasDatabase) return null;
  const row = await queryOne<SubRow>(
    `SELECT "id","userId","status","plan","provider","providerRef","currentPeriodEnd"
       FROM "subscription" WHERE "userId" = $1`,
    [userId],
  );
  return row ? map(row) : null;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  return sub?.status === 'active';
}

/**
 * Records a pending checkout so the webhook / return handler can map the
 * provider's checkout session back to this user. Upserts one row per user.
 */
export async function markCheckoutPending(
  userId: string,
  provider: string,
  providerRef: string,
): Promise<void> {
  await query(
    `INSERT INTO "subscription" ("id","userId","status","plan","provider","providerRef","updatedAt")
     VALUES ($1,$2,'inactive','pro',$3,$4, now())
     ON CONFLICT ("userId") DO UPDATE
       SET "provider" = EXCLUDED."provider",
           "providerRef" = EXCLUDED."providerRef",
           "updatedAt" = now()`,
    [randomUUID(), userId, provider, providerRef],
  );
}

/** Marks a user's subscription active. Idempotent. */
export async function activateSubscription(
  userId: string,
  opts: { provider?: string; providerRef?: string } = {},
): Promise<void> {
  await query(
    `INSERT INTO "subscription" ("id","userId","status","plan","provider","providerRef","updatedAt")
     VALUES ($1,$2,'active','pro',$3,$4, now())
     ON CONFLICT ("userId") DO UPDATE
       SET "status" = 'active',
           "provider" = COALESCE(EXCLUDED."provider", "subscription"."provider"),
           "providerRef" = COALESCE(EXCLUDED."providerRef", "subscription"."providerRef"),
           "updatedAt" = now()`,
    [randomUUID(), userId, opts.provider ?? null, opts.providerRef ?? null],
  );
}

/** Finds the user tied to a provider checkout/payment reference. */
export async function userIdByProviderRef(providerRef: string): Promise<string | null> {
  const row = await queryOne<{ userId: string }>(
    `SELECT "userId" FROM "subscription" WHERE "providerRef" = $1 LIMIT 1`,
    [providerRef],
  );
  return row?.userId ?? null;
}
