import { betterAuth } from 'better-auth';
import { Pool } from 'pg';

/**
 * Better Auth server instance.
 *
 * Uses the same Postgres database as the rest of Scout (point DATABASE_URL at
 * your Supabase connection string). Run `npx @better-auth/cli migrate` once to
 * create the auth tables. Email + password is the only method for now; social
 * providers can be added here later.
 *
 * When DATABASE_URL is unset (local preview / build) the Pool is created but
 * never connects, so importing this file is always safe.
 */
export const auth = betterAuth({
  appName: 'Scout',
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
});
