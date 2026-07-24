import type { Metadata } from 'next';
import { AuthShell } from '@/components/auth-shell';

export const metadata: Metadata = {
  title: 'Create your account · Scout',
  description: 'Create your Scout account to access your investor dashboard.',
};

export default function SignUpPage() {
  return <AuthShell mode="signup" />;
}
