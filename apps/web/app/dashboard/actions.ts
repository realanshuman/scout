'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/session';
import {
  updateProfile,
  updateNotifications,
  setInvestorSaved,
  setInvestorStatus,
  getWorkspace,
  replaceInvestorMatches,
  setReportStatus,
  type ProfilePatch,
} from '@/lib/workspace';
import { discoverInvestors } from '@/lib/discovery/discover';
import { searchConfigured } from '@/lib/discovery/search';
import { llmConfigured } from '@/lib/discovery/llm';

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function toNumber(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? '').replace(/[, $]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Update the startup profile. Validates required fields. */
export async function saveProfileAction(form: FormData): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not signed in.' };

  const patch: ProfilePatch = {
    startupName: String(form.get('startupName') ?? '').trim(),
    website: String(form.get('website') ?? '').trim(),
    oneLiner: String(form.get('oneLiner') ?? '').trim(),
    industry: String(form.get('industry') ?? '').trim(),
    stage: String(form.get('stage') ?? '').trim(),
    country: String(form.get('country') ?? '').trim(),
    raiseUsd: toNumber(form.get('raiseUsd')),
    mrrUsd: toNumber(form.get('mrrUsd')),
    traction: String(form.get('traction') ?? '').trim(),
    businessModel: String(form.get('businessModel') ?? '').trim(),
  };

  if (!patch.startupName) return { ok: false, error: 'Company name is required.' };
  if (patch.oneLiner.length > 160) return { ok: false, error: 'Keep the one-liner under 160 characters.' };

  try {
    await updateProfile(user.id, patch);
    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not save. Please try again.' };
  }
}

export async function saveNotificationsAction(patch: {
  emailReport: boolean;
  notifyNewMatches: boolean;
  weeklyNudge: boolean;
}): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not signed in.' };
  try {
    await updateNotifications(user.id, patch);
    revalidatePath('/dashboard/agent');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not save your preferences.' };
  }
}

export async function toggleSavedAction(matchId: string, saved: boolean): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not signed in.' };
  try {
    await setInvestorSaved(user.id, matchId, saved);
    revalidatePath('/dashboard/investors');
    revalidatePath('/dashboard');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not update.' };
  }
}

export interface DiscoverResult extends ActionResult {
  count?: number;
}

/**
 * Runs live investor discovery for the signed-in user: searches the web with
 * Tavily, ranks and drafts outreach with OpenAI, and stores the results in
 * Neon, replacing the previous match list.
 */
export async function discoverInvestorsAction(): Promise<DiscoverResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not signed in.' };

  if (!searchConfigured) {
    return { ok: false, error: 'Search is not configured. Add TAVILY_API_KEY to enable discovery.' };
  }
  if (!llmConfigured) {
    return { ok: false, error: 'AI is not configured. Add OPENAI_API_KEY to enable discovery.' };
  }

  const ws = await getWorkspace(user.id);
  if (!ws) return { ok: false, error: 'No workspace yet.' };
  if (!ws.startupName || !ws.industry) {
    return {
      ok: false,
      error: 'Add your company name and industry to your profile first, so Scout knows what to look for.',
    };
  }

  const profile = {
    name: ws.startupName ?? '',
    website: ws.website ?? '',
    oneLiner: ws.oneLiner ?? '',
    industry: ws.industry ?? '',
    stage: ws.stage ?? '',
    country: ws.country ?? '',
    raiseUsd: Number(ws.raiseUsd ?? 0),
    mrrUsd: Number(ws.mrrUsd ?? 0),
    traction: ws.traction ?? '',
    businessModel: ws.businessModel ?? '',
    competitors: Array.isArray(ws.competitors) ? ws.competitors : [],
    founders: Array.isArray(ws.founders) ? ws.founders : [],
  };

  try {
    await setReportStatus(user.id, 'generating');
    const investors = await discoverInvestors(profile);
    if (investors.length === 0) {
      await setReportStatus(user.id, 'ready');
      return { ok: false, error: 'No investors found this time. Try again in a moment.' };
    }
    await replaceInvestorMatches(user.id, investors);
    await setReportStatus(user.id, 'ready');
    revalidatePath('/dashboard/investors');
    revalidatePath('/dashboard');
    return { ok: true, count: investors.length };
  } catch (err) {
    await setReportStatus(user.id, 'ready').catch(() => {});
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Discovery failed. Please try again.',
    };
  }
}

export async function setStatusAction(
  matchId: string,
  status: 'new' | 'contacted' | 'passed',
): Promise<ActionResult> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not signed in.' };
  try {
    await setInvestorStatus(user.id, matchId, status);
    revalidatePath('/dashboard/investors');
    return { ok: true };
  } catch {
    return { ok: false, error: 'Could not update.' };
  }
}
