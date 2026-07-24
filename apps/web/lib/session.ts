import { headers } from 'next/headers';
import { hasDatabase } from './db';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

/**
 * Returns the signed-in user, or null. Safe to call when no database is
 * configured (returns null). Never throws.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (!hasDatabase) return null;
  try {
    const { auth } = await import('./auth');
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name ?? '',
      email: session.user.email ?? '',
    };
  } catch {
    return null;
  }
}
