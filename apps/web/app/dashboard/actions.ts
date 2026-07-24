'use server';

import { revalidatePath } from 'next/cache';
import { getSessionUser } from '@/lib/session';
import {
  updateProfile,
  updateNotifications,
  setInvestorSaved,
  setInvestorStatus,
  type ProfilePatch,
} from '@/lib/workspace';

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
