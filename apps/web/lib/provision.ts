import { auth } from './auth';

/**
 * Account + password provisioning that works even though public sign-up is
 * disabled. Mirrors exactly what Better Auth's sign-up route does internally
 * (hash password -> createUser -> link a "credential" account), using the
 * server context so no public endpoint is involved.
 *
 * Used by the demo seed and by post-payment provisioning for new customers.
 */
export async function ensureUser(params: {
  email: string;
  name: string;
  password: string;
}): Promise<{ id: string; created: boolean }> {
  const email = params.email.toLowerCase().trim();
  const ctx = await auth.$context;

  const existing = await ctx.internalAdapter.findUserByEmail(email);
  if (existing?.user) return { id: existing.user.id, created: false };

  const hash = await ctx.password.hash(params.password);
  const user = await ctx.internalAdapter.createUser({
    email,
    name: params.name,
    emailVerified: true,
  });
  await ctx.internalAdapter.linkAccount({
    userId: user.id,
    providerId: 'credential',
    accountId: user.id,
    password: hash,
  });
  return { id: user.id, created: true };
}
