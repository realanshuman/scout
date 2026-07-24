import { Pool } from 'pg';

/**
 * Single shared Postgres pool for the whole web app (auth + application data),
 * pointed at Neon via DATABASE_URL.
 *
 * Neon (and most hosted Postgres) require TLS. If DATABASE_URL doesn't already
 * opt in via ?sslmode=require we enable it here, so a missing SSL param doesn't
 * silently fail the connection in serverless.
 *
 * The pool is cached on globalThis so Next.js hot-reload / serverless function
 * reuse doesn't open a new pool on every invocation.
 */
const connectionString = process.env.DATABASE_URL;

function createPool(): Pool {
  return new Pool({
    connectionString,
    ssl:
      connectionString && !/sslmode=disable/.test(connectionString)
        ? { rejectUnauthorized: false }
        : undefined,
    max: 3,
  });
}

const globalForDb = globalThis as unknown as { __scoutPool?: Pool };

export const pool: Pool = globalForDb.__scoutPool ?? createPool();
if (process.env.NODE_ENV !== 'production') globalForDb.__scoutPool = pool;

/** True when a database is configured. Used to gate features gracefully. */
export const hasDatabase = Boolean(connectionString);

/** Small tagged helper for parameterized queries. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const res = await pool.query(text, params as never);
  return res.rows as T[];
}

/** Returns the first row of a query, or null. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}
