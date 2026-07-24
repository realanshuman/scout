import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth-shell';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Sign in · Scout',
  description: 'Sign in to your Scout dashboard.',
};

export default async function SignInPage() {
  // Already signed in? Skip the form.
  const user = await getSessionUser();
  if (user) redirect('/dashboard');
  return <AuthShell />;
}
