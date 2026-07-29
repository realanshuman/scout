'use client';

import { useState, useTransition } from 'react';
import { subscribeAction } from '@/app/newsletter/actions';

/**
 * Subscribe form for the free weekly investor list.
 * `tone="dark"` styles it for the dark hero panel; `light` for paper sections.
 */
export function NewsletterForm({
  tone = 'dark',
  compact = false,
}: {
  tone?: 'dark' | 'light';
  compact?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dark = tone === 'dark';

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await subscribeAction(form);
      if (!res.ok) {
        setError(res.error ?? 'Something went wrong.');
        return;
      }
      setDone(res.message ?? 'You’re in.');
    });
  }

  if (done) {
    return (
      <div
        className={`rounded-2xl border px-5 py-4 ${
          dark ? 'border-signal/30 bg-signal/10 text-white' : 'border-moss/25 bg-signal/[0.07] text-ink'
        }`}
      >
        <p className="flex items-center gap-2 font-semibold">
          <span className={`grid h-5 w-5 place-items-center rounded-full ${dark ? 'bg-signal text-[#06140e]' : 'bg-signal text-[#06140e]'}`}>
            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          {done}
        </p>
        <p className={`mt-1.5 text-sm ${dark ? 'text-white/55' : 'text-mist'}`}>
          Check your inbox on Sunday. If it isn’t there, peek in Promotions.
        </p>
      </div>
    );
  }

  const inputBase =
    'w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-all duration-150 focus:ring-4';
  const inputTone = dark
    ? 'border border-white/15 bg-white/[0.07] text-white placeholder:text-white/40 focus:border-signal/60 focus:ring-signal/15'
    : 'border border-ink/12 bg-card text-ink placeholder:text-mist/55 focus:border-moss focus:ring-signal/15';

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className={compact ? 'flex flex-col gap-2.5 sm:flex-row' : 'space-y-2.5'}>
        {!compact && (
          <input
            name="name"
            type="text"
            placeholder="Your first name (optional)"
            className={`${inputBase} ${inputTone}`}
          />
        )}
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourstartup.com"
          className={`${inputBase} ${inputTone}`}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-xl bg-signal px-6 py-3 text-[15px] font-semibold text-[#06140e] transition hover:brightness-105 active:scale-[0.99] disabled:opacity-60"
        >
          {pending ? 'Adding you…' : 'Get Sunday’s ten'}
        </button>
      </div>

      {error && (
        <p className={`mt-2.5 text-sm ${dark ? 'text-red-300' : 'text-red-600'}`}>{error}</p>
      )}

      <p className={`mt-3 text-xs ${dark ? 'text-white/40' : 'text-mist'}`}>
        Free forever. One email a week. Unsubscribe in one click.
      </p>
    </form>
  );
}
