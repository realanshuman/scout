import { randomUUID } from 'crypto';
import { hasDatabase, query, queryOne } from './db';
import type { InvestorMatch, StartupProfile } from './dashboard-data';

export interface WorkspaceRow {
  id: string;
  userId: string;
  startupName: string | null;
  website: string | null;
  oneLiner: string | null;
  industry: string | null;
  stage: string | null;
  country: string | null;
  raiseUsd: string | number | null;
  mrrUsd: string | number | null;
  traction: string | null;
  businessModel: string | null;
  competitors: string[];
  founders: { name: string; role: string }[];
  reportStatus: 'ready' | 'generating';
  whatsappConnected: boolean;
  whatsappNumber: string | null;
  emailReport: boolean;
  notifyNewMatches: boolean;
  weeklyNudge: boolean;
}

export async function getWorkspace(userId: string): Promise<WorkspaceRow | null> {
  if (!hasDatabase) return null;
  return queryOne<WorkspaceRow>(
    `SELECT "id","userId","startupName","website","oneLiner","industry","stage","country",
            "raiseUsd","mrrUsd","traction","businessModel","competitors","founders",
            "reportStatus","whatsappConnected","whatsappNumber","emailReport",
            "notifyNewMatches","weeklyNudge"
       FROM "workspace" WHERE "userId" = $1`,
    [userId],
  );
}

export async function getInvestorMatches(userId: string): Promise<InvestorMatch[]> {
  if (!hasDatabase) return [];
  const rows = await query<{
    id: string;
    rank: number;
    firm: string;
    partner: string | null;
    fit: number;
    stages: string | null;
    checkSize: string | null;
    sectors: string | null;
    why: string | null;
    email: string | null;
    linkedin: string | null;
    outreachSubject: string | null;
    outreachBody: string | null;
    saved: boolean;
    status: string;
  }>(
    `SELECT "id","rank","firm","partner","fit","stages","checkSize","sectors","why",
            "email","linkedin","outreachSubject","outreachBody","saved","status"
       FROM "investor_match" WHERE "userId" = $1 ORDER BY "rank" ASC`,
    [userId],
  );
  return rows.map((r) => ({
    id: r.id,
    rank: r.rank,
    firm: r.firm,
    partner: r.partner,
    fit: r.fit,
    stages: r.stages ?? '',
    check: r.checkSize ?? '',
    sectors: r.sectors ?? '',
    why: r.why ?? '',
    email: r.email,
    linkedin: r.linkedin,
    outreachSubject: r.outreachSubject ?? '',
    outreachBody: r.outreachBody ?? '',
    saved: r.saved,
    status: (r.status as InvestorMatch['status']) ?? 'new',
  }));
}

export interface ProvisionInput {
  startup: StartupProfile;
  agent: {
    whatsappConnected: boolean;
    whatsappNumber: string | null;
    emailReport: boolean;
    notifyNewMatches: boolean;
    weeklyNudge?: boolean;
  };
  investors: InvestorMatch[];
  reportStatus?: 'ready' | 'generating';
}

/**
 * Creates (or refreshes) a user's workspace + investor matches. Used after a
 * successful payment and by the demo seed. Safe to call more than once for the
 * same user.
 */
export async function provisionWorkspace(userId: string, input: ProvisionInput): Promise<void> {
  const { startup, agent, investors } = input;
  await query(
    `INSERT INTO "workspace"
       ("id","userId","startupName","website","oneLiner","industry","stage","country",
        "raiseUsd","mrrUsd","traction","businessModel","competitors","founders",
        "reportStatus","whatsappConnected","whatsappNumber","emailReport",
        "notifyNewMatches","weeklyNudge","updatedAt")
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20, now())
     ON CONFLICT ("userId") DO UPDATE SET
        "startupName" = EXCLUDED."startupName",
        "website" = EXCLUDED."website",
        "oneLiner" = EXCLUDED."oneLiner",
        "industry" = EXCLUDED."industry",
        "stage" = EXCLUDED."stage",
        "country" = EXCLUDED."country",
        "raiseUsd" = EXCLUDED."raiseUsd",
        "mrrUsd" = EXCLUDED."mrrUsd",
        "traction" = EXCLUDED."traction",
        "businessModel" = EXCLUDED."businessModel",
        "competitors" = EXCLUDED."competitors",
        "founders" = EXCLUDED."founders",
        "reportStatus" = EXCLUDED."reportStatus",
        "whatsappConnected" = EXCLUDED."whatsappConnected",
        "whatsappNumber" = EXCLUDED."whatsappNumber",
        "updatedAt" = now()`,
    [
      randomUUID(),
      userId,
      startup.name,
      startup.website,
      startup.oneLiner,
      startup.industry,
      startup.stage,
      startup.country,
      startup.raiseUsd,
      startup.mrrUsd,
      startup.traction,
      startup.businessModel,
      JSON.stringify(startup.competitors ?? []),
      JSON.stringify(startup.founders ?? []),
      input.reportStatus ?? 'ready',
      agent.whatsappConnected,
      agent.whatsappNumber,
      agent.emailReport,
      agent.notifyNewMatches,
      agent.weeklyNudge ?? false,
    ],
  );

  // Replace investor matches wholesale so re-provisioning is deterministic.
  await query(`DELETE FROM "investor_match" WHERE "userId" = $1`, [userId]);
  for (const inv of investors) {
    await query(
      `INSERT INTO "investor_match"
         ("id","userId","rank","firm","partner","fit","stages","checkSize","sectors",
          "why","email","linkedin","outreachSubject","outreachBody","saved","status")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [
        randomUUID(),
        userId,
        inv.rank,
        inv.firm,
        inv.partner,
        inv.fit,
        inv.stages,
        inv.check,
        inv.sectors,
        inv.why,
        inv.email,
        inv.linkedin,
        inv.outreachSubject,
        inv.outreachBody ?? '',
        inv.saved ?? false,
        inv.status ?? 'new',
      ],
    );
  }
}

export interface ProfilePatch {
  startupName: string;
  website: string;
  oneLiner: string;
  industry: string;
  stage: string;
  country: string;
  raiseUsd: number;
  mrrUsd: number;
  traction: string;
  businessModel: string;
}

export async function updateProfile(userId: string, patch: ProfilePatch): Promise<void> {
  await query(
    `UPDATE "workspace" SET
        "startupName" = $2, "website" = $3, "oneLiner" = $4, "industry" = $5,
        "stage" = $6, "country" = $7, "raiseUsd" = $8, "mrrUsd" = $9,
        "traction" = $10, "businessModel" = $11, "updatedAt" = now()
      WHERE "userId" = $1`,
    [
      userId,
      patch.startupName,
      patch.website,
      patch.oneLiner,
      patch.industry,
      patch.stage,
      patch.country,
      patch.raiseUsd,
      patch.mrrUsd,
      patch.traction,
      patch.businessModel,
    ],
  );
}

export async function updateNotifications(
  userId: string,
  patch: { emailReport: boolean; notifyNewMatches: boolean; weeklyNudge: boolean },
): Promise<void> {
  await query(
    `UPDATE "workspace" SET "emailReport" = $2, "notifyNewMatches" = $3,
        "weeklyNudge" = $4, "updatedAt" = now() WHERE "userId" = $1`,
    [userId, patch.emailReport, patch.notifyNewMatches, patch.weeklyNudge],
  );
}

export async function setInvestorSaved(
  userId: string,
  matchId: string,
  saved: boolean,
): Promise<void> {
  await query(`UPDATE "investor_match" SET "saved" = $3 WHERE "userId" = $1 AND "id" = $2`, [
    userId,
    matchId,
    saved,
  ]);
}

export async function setInvestorStatus(
  userId: string,
  matchId: string,
  status: 'new' | 'contacted' | 'passed',
): Promise<void> {
  await query(`UPDATE "investor_match" SET "status" = $3 WHERE "userId" = $1 AND "id" = $2`, [
    userId,
    matchId,
    status,
  ]);
}
