import { betterAuth } from 'better-auth';
import { Pool } from 'pg';
import { dash } from '@better-auth/infra';

// Better Auth's hosted add-on (admin dashboard + Sentinel bot protection) is
// optional. It activates only when BETTER_AUTH_API_KEY is set, so the app
// builds and runs fine without it.
const infraPlugins = process.env.BETTER_AUTH_API_KEY ? [dash()] : [];

// Origins Better Auth will accept requests from. Better Auth rejects any
// request whose Origin doesn't match baseURL or one of these ("Invalid
// origin"). We list the production domain(s) explicitly so it works no matter
// what BETTER_AUTH_URL is set to, and allow *.vercel.app so preview deploys
// work too. Add any extra domains you serve the app from here.
const trustedOrigins = [
  'https://scout.realanshuman.com',
  'https://www.scout.realanshuman.com',
  ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
  ...(process.env.WEB_PUBLIC_URL ? [process.env.WEB_PUBLIC_URL] : []),
  'https://*.vercel.app',
];

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
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  database: new Pool({ connectionString: process.env.DATABASE_URL }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  plugins: infraPlugins,
});
