import { NextResponse } from 'next/server';
import { ensureUser } from '@/lib/provision';
import { activateSubscription } from '@/lib/subscription';
import { provisionWorkspace } from '@/lib/workspace';
import { DEMO_STARTUP, DEMO_INVESTORS, DEMO_AGENT } from '@/lib/dashboard-data';
import { hasDatabase } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEMO_EMAIL = 'demo@scout.app';
const DEMO_PASSWORD = 'ScoutDemo2026!';
const DEMO_NAME = 'Jordan Rivera';

/**
 * One-time seed for a fully-working demo account (user + active subscription +
 * realistic workspace + investor matches).
 *
 * Protected by SEED_TOKEN: set SEED_TOKEN to any random value in your env, then
 * visit /api/seed-demo?token=THAT_VALUE once. If SEED_TOKEN is unset the route
 * is disabled (404). Safe to run more than once — it's idempotent.
 */
async function seed(token: string | null) {
  // Trim both sides: a trailing space or newline pasted into the hosting
  // provider's env UI is the most common reason this "doesn't match".
  const expected = process.env.SEED_TOKEN?.trim();
  if (!expected) {
    return NextResponse.json({ error: 'Seeding is disabled. Set SEED_TOKEN to enable.' }, { status: 404 });
  }
  if (token?.trim() !== expected) {
    return NextResponse.json(
      {
        error: 'Invalid or missing token.',
        hint: 'Append ?token=YOUR_SEED_TOKEN to the URL, matching the SEED_TOKEN value set in your hosting environment exactly.',
      },
      { status: 401 },
    );
  }
  if (!hasDatabase) {
    return NextResponse.json({ error: 'DATABASE_URL is not set.' }, { status: 500 });
  }

  try {
    const { id } = await ensureUser({ email: DEMO_EMAIL, name: DEMO_NAME, password: DEMO_PASSWORD });
    await activateSubscription(id, { provider: 'seed', providerRef: 'demo' });
    await provisionWorkspace(id, {
      reportStatus: 'ready',
      startup: DEMO_STARTUP,
      agent: DEMO_AGENT,
      investors: DEMO_INVESTORS,
    });

    return NextResponse.json({
      ok: true,
      message: 'Demo account is ready. Sign in with the credentials below.',
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Seed failed.' },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  return seed(token);
}

export async function POST(req: Request) {
  const token =
    new URL(req.url).searchParams.get('token') ?? req.headers.get('x-seed-token');
  return seed(token);
}
