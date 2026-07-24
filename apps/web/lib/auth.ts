import { betterAuth } from 'better-auth';
import { dash } from '@better-auth/infra';
import { pool } from './db';

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
 * Uses the shared Neon pool (see lib/db.ts). Run the SQL in lib/auth-schema.sql
 * once to create the auth tables.
 *
 * Public sign-up is DISABLED: accounts are provisioned through the product
 * (WhatsApp onboarding / after payment) and the demo seed, never self-serve on
 * the website. Login is the only public auth action. Provisioning happens via
 * auth.$context (see lib/provision.ts).
 */
export const auth = betterAuth({
  appName: 'Scout',
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,
  database: pool,
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  user: {
    deleteUser: { enabled: true },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },
  plugins: infraPlugins,
});
