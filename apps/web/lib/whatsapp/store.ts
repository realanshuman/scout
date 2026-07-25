import { randomUUID } from 'crypto';
import { query, queryOne } from '../db';

export type ResearchStatus = 'none' | 'running' | 'done' | 'failed';

export interface WaContact {
  id: string;
  phone: string;
  name: string | null;
  stage: 'interview' | 'complete';
  profile: Record<string, unknown>;
  userId: string | null;
  researchStatus: ResearchStatus;
  matches: DiscoveredMatch[];
  researchedAt: string | null;
  unlocked: boolean;
  paymentRef: string | null;
  paymentUrl: string | null;
}

/** A discovered investor as stored for the WhatsApp flow: the full record,
 * including contacts when the research actually found them. */
export interface DiscoveredMatch {
  rank: number;
  firm: string;
  partner: string | null;
  fit: number;
  why: string;
  stages?: string;
  check?: string;
  sectors?: string;
  email?: string | null;
  linkedin?: string | null;
  website?: string | null;
  outreachSubject?: string;
}

const CONTACT_COLS = `"id","phone","name","stage","profile","userId","researchStatus","matches","researchedAt","unlocked","paymentRef","paymentUrl"`;

export interface WaTurn {
  role: 'user' | 'assistant';
  content: string;
}

/** Finds (or creates) the contact for a WhatsApp number. */
export async function getOrCreateContact(phone: string, name?: string | null): Promise<WaContact> {
  const existing = await queryOne<WaContact>(
    `SELECT ${CONTACT_COLS} FROM "wa_contact" WHERE "phone" = $1`,
    [phone],
  );
  if (existing) return existing;

  const id = randomUUID();
  await query(
    `INSERT INTO "wa_contact" ("id","phone","name") VALUES ($1,$2,$3)
     ON CONFLICT ("phone") DO NOTHING`,
    [id, phone, name ?? null],
  );
  const created = await queryOne<WaContact>(
    `SELECT ${CONTACT_COLS} FROM "wa_contact" WHERE "phone" = $1`,
    [phone],
  );
  // The SELECT can't be null here (we just inserted or someone raced us).
  return created as WaContact;
}

/**
 * Records an inbound message. Returns false when this Twilio MessageSid was
 * already stored, which means the webhook is a retry and must be ignored.
 */
export async function recordInbound(
  contactId: string,
  content: string,
  providerRef?: string | null,
): Promise<boolean> {
  // The dedupe index is partial ("providerRef" IS NOT NULL), so ON CONFLICT
  // must repeat that predicate for Postgres to match it.
  const rows = await query<{ id: string }>(
    `INSERT INTO "wa_message" ("id","contactId","role","content","providerRef")
     VALUES ($1,$2,'user',$3,$4)
     ON CONFLICT ("providerRef") WHERE "providerRef" IS NOT NULL DO NOTHING
     RETURNING "id"`,
    [randomUUID(), contactId, content, providerRef ?? null],
  );
  return rows.length > 0;
}

export async function recordOutbound(contactId: string, content: string): Promise<void> {
  await query(
    `INSERT INTO "wa_message" ("id","contactId","role","content") VALUES ($1,$2,'assistant',$3)`,
    [randomUUID(), contactId, content],
  );
}

/** Recent conversation history, oldest first, for model context. */
export async function recentTurns(contactId: string, limit = 20): Promise<WaTurn[]> {
  const rows = await query<{ role: string; content: string }>(
    `SELECT "role","content" FROM "wa_message"
      WHERE "contactId" = $1 ORDER BY "createdAt" DESC LIMIT $2`,
    [contactId, limit],
  );
  return rows
    .reverse()
    .map((r) => ({ role: r.role === 'assistant' ? 'assistant' : 'user', content: r.content }));
}

export async function updateContact(
  contactId: string,
  patch: { profile?: Record<string, unknown>; stage?: 'interview' | 'complete'; name?: string | null },
): Promise<void> {
  if (patch.profile !== undefined) {
    await query(
      `UPDATE "wa_contact" SET "profile" = $2, "updatedAt" = now() WHERE "id" = $1`,
      [contactId, JSON.stringify(patch.profile)],
    );
  }
  if (patch.stage !== undefined) {
    await query(`UPDATE "wa_contact" SET "stage" = $2, "updatedAt" = now() WHERE "id" = $1`, [
      contactId,
      patch.stage,
    ]);
  }
  if (patch.name !== undefined) {
    await query(`UPDATE "wa_contact" SET "name" = $2, "updatedAt" = now() WHERE "id" = $1`, [
      contactId,
      patch.name,
    ]);
  }
}

/** Re-reads a contact by id (used by background research). */
export async function getContactById(contactId: string): Promise<WaContact | null> {
  return queryOne<WaContact>(`SELECT ${CONTACT_COLS} FROM "wa_contact" WHERE "id" = $1`, [
    contactId,
  ]);
}

/**
 * Claims the research slot for a contact. Returns true only if this call
 * flipped the status to 'running', so two webhooks can't start research twice.
 */
export async function claimResearch(contactId: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `UPDATE "wa_contact" SET "researchStatus" = 'running', "updatedAt" = now()
      WHERE "id" = $1 AND "researchStatus" IN ('none', 'failed')
      RETURNING "id"`,
    [contactId],
  );
  return rows.length > 0;
}

export async function finishResearch(
  contactId: string,
  matches: DiscoveredMatch[],
): Promise<void> {
  await query(
    `UPDATE "wa_contact"
        SET "researchStatus" = 'done', "matches" = $2,
            "researchedAt" = now(), "updatedAt" = now()
      WHERE "id" = $1`,
    [contactId, JSON.stringify(matches)],
  );
}

export async function failResearch(contactId: string): Promise<void> {
  await query(
    `UPDATE "wa_contact" SET "researchStatus" = 'failed', "updatedAt" = now() WHERE "id" = $1`,
    [contactId],
  );
}

/** Stores the payment link + checkout reference for a contact. */
export async function setPayment(
  contactId: string,
  paymentRef: string,
  paymentUrl: string,
): Promise<void> {
  await query(
    `UPDATE "wa_contact" SET "paymentRef" = $2, "paymentUrl" = $3, "updatedAt" = now()
      WHERE "id" = $1`,
    [contactId, paymentRef, paymentUrl],
  );
}

/** Marks a contact's report unlocked (after payment, or when payments are off). */
export async function setUnlocked(contactId: string): Promise<void> {
  await query(
    `UPDATE "wa_contact" SET "unlocked" = true, "updatedAt" = now() WHERE "id" = $1`,
    [contactId],
  );
}

/** Finds the contact tied to a Dodo checkout session (for the webhook). */
export async function contactByPaymentRef(paymentRef: string): Promise<WaContact | null> {
  return queryOne<WaContact>(
    `SELECT ${CONTACT_COLS} FROM "wa_contact" WHERE "paymentRef" = $1 LIMIT 1`,
    [paymentRef],
  );
}

/** Counts how many messages this contact has sent (used for greeting logic). */
export async function messageCount(contactId: string): Promise<number> {
  const row = await queryOne<{ n: string }>(
    `SELECT count(*)::text AS n FROM "wa_message" WHERE "contactId" = $1`,
    [contactId],
  );
  return Number(row?.n ?? 0);
}
