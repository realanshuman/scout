import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth-shell';

export const metadata: Metadata = {
  title: 'Sign in · Scout',
  description: 'Sign in to your Scout dashboard.',
};

export default function SignInPage() {
  return <AuthShell mode="signin" />;
}
