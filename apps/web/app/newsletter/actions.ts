'use server';

import { hasDatabase } from '@/lib/db';
import { subscribe } from '@/lib/newsletter';

export interface SubscribeResult {
  ok: boolean;
  message?: string;
  error?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeAction(form: FormData): Promise<SubscribeResult> {
  const email = String(form.get('email') ?? '').trim();
  const name = String(form.get('name') ?? '').trim();
  const stage = String(form.get('stage') ?? '').trim();

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: 'That email doesn’t look right. Mind checking it?' };
  }
  if (!hasDatabase) {
    return { ok: false, error: 'The list isn’t connected yet. Try again shortly.' };
  }

  try {
    const { alreadySubscribed } = await subscribe({ email, name, stage });
    return {
      ok: true,
      message: alreadySubscribed
        ? 'You’re already on the list. Sunday’s ten are on the way.'
        : 'You’re in. The next ten investors land on Sunday.',
    };
  } catch {
    return { ok: false, error: 'Something went wrong on our end. Please try again.' };
  }
}
