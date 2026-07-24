'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';

/**
 * Sign-in form. Public sign-up is disabled — accounts are provisioned through
 * Scout's onboarding, so the website only signs existing customers in.
 */
export function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await signIn.email({ email, password, callbackURL: '/dashboard' });
      if (res.error) {
        setError(
          res.error.code === 'INVALID_EMAIL_OR_PASSWORD' || res.error.status === 401
            ? 'That email or password doesn’t match. Please try again.'
            : res.error.message ?? 'Something went wrong. Please try again.',
        );
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
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@startup.com"
          invalid={Boolean(error)}
        />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          invalid={Boolean(error)}
        />
      </Field>

      {error && (
        <p className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-2.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" loading={loading} fullWidth size="lg" className="mt-2">
        {loading ? 'Signing you in…' : 'Sign in'}
      </Button>

      <p className="pt-2 text-center text-sm text-mist">
        New to Scout?{' '}
        <a
          href="https://wa.me/15551234567?text=Hi%20Scout!"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-moss hover:underline"
        >
          Start on WhatsApp
        </a>
      </p>
    </form>
  );
}
