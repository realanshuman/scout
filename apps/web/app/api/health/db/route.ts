import { NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Diagnostic endpoint for the auth database.
 *
 * Visit /api/health/db to see, in plain language, whether:
 *   - DATABASE_URL is set
 *   - the app can actually connect to Postgres (Neon)
 *   - the Better Auth tables ("user", "session", "account", "verification")
 *     exist
 *
 * It never returns the connection string or any secret, only pass/fail plus
 * the raw error message when something breaks. Safe to leave deployed; delete
 * it once auth is confirmed working if you prefer.
 */
export async function GET() {
  const hasUrl = Boolean(process.env.DATABASE_URL);
  if (!hasUrl) {
    return NextResponse.json(
      {
        ok: false,
        step: 'env',
        message: 'DATABASE_URL is not set in this environment.',
      },
      { status: 500 },
    );
  }

  const url = process.env.DATABASE_URL as string;
  // Neon (and most hosted Postgres) require TLS. If the URL doesn't already
  // ask for it, turn it on so a missing ?sslmode=require doesn't fail the
  // connection.
  const needsSsl = !/sslmode=disable/.test(url);
  const pool = new Pool({
    connectionString: url,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
    connectionTimeoutMillis: 8000,
    max: 1,
  });

  try {
    // 1) Can we connect and run a query at all?
    await pool.query('SELECT 1');

    // 2) Do the Better Auth tables exist?
    const { rows } = await pool.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'
         AND table_name IN ('user', 'session', 'account', 'verification')`,
    );
    const found = rows.map((r) => r.table_name);
    const required = ['user', 'session', 'account', 'verification'];
    const missing = required.filter((t) => !found.includes(t));

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          step: 'schema',
          connected: true,
          tablesFound: found,
          tablesMissing: missing,
          message:
            'Connected to the database, but the Better Auth tables are missing. Run the schema SQL (apps/web/lib/auth-schema.sql) in your Neon SQL editor.',
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      connected: true,
      tablesFound: found,
      message: 'Database reachable and all auth tables present. Sign-up should work.',
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        step: 'connect',
        message: 'Could not connect to the database.',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  } finally {
    await pool.end().catch(() => {});
  }
}
