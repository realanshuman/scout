'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, signUp } from '@/lib/auth-client';

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignup = mode === 'signup';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = isSignup
        ? await signUp.email({ name, email, password, callbackURL: '/dashboard' })
        : await signIn.email({ email, password, callbackURL: '/dashboard' });
      if (res.error) {
        setError(res.error.message ?? 'Something went wrong. Please try again.');
        setLoading(false);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Could not reach the server. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignup && (
        <Field label="Your name">
          <input
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jordan Rivera"
            className={inputClass}
          />
        </Field>
      )}
      <Field label="Email">
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@startup.com"
          className={inputClass}
        />
      </Field>
      <Field label="Password">
        <input
          type="password"
          required
          minLength={8}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isSignup ? 'At least 8 characters' : '••••••••'}
          className={inputClass}
        />
      </Field>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-base font-semibold text-[#0c1512] transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? 'One moment…' : isSignup ? 'Create account' : 'Sign in'}
      </button>

      <p className="pt-2 text-center text-sm text-mist">
        {isSignup ? (
          <>
            Already have an account?{' '}
            <Link href="/signin" className="font-medium text-moss hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New to Scout?{' '}
            <Link href="/signup" className="font-medium text-moss hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

const inputClass =
  'w-full rounded-xl border border-ink/15 bg-card px-3.5 py-3 text-[15px] text-ink outline-none transition placeholder:text-mist/60 focus:border-moss focus:ring-2 focus:ring-signal/25';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      {children}
    </label>
  );
}
