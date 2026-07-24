import { createAuthClient } from 'better-auth/react';
import { sentinelClient } from '@better-auth/infra/client';

/**
 * Browser-side auth client. Talks to /api/auth on the same origin.
 *
 * sentinelClient() is Better Auth's optional bot/fraud protection. It stays
 * dormant until the server has the hosted add-on enabled (BETTER_AUTH_API_KEY),
 * so it is safe to always include.
 */
export const authClient = createAuthClient({
  plugins: [sentinelClient()],
});

export const { signIn, signOut, useSession, changePassword, deleteUser, updateUser } = authClient;
