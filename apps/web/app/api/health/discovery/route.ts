import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Diagnostic for live investor discovery.
 *
 * Visit /api/health/discovery?token=YOUR_SEED_TOKEN to check, in plain terms:
 *   - are TAVILY_API_KEY and OPENAI_API_KEY set in this environment
 *   - does the Tavily key actually work (runs one tiny real search)
 *   - does the OpenAI key actually work (runs one tiny real completion)
 *
 * Access: signed-in users, or anyone with the SEED_TOKEN (?token=...). Guarded
 * because it makes real (small) API calls. Never returns key values, only
 * pass/fail plus the provider's error message when it fails.
 */
export async function GET(req: Request) {
  // Access: either a signed-in user, or the right SEED_TOKEN. Tokens are
  // trimmed on both sides, since a stray space or newline pasted into the
  // hosting provider's env UI is the usual reason a token "doesn't match".
  const expected = process.env.SEED_TOKEN?.trim();
  const token = new URL(req.url).searchParams.get('token')?.trim();
  const signedIn = Boolean(await getSessionUser());

  if (!signedIn && !(expected && token === expected)) {
    return NextResponse.json(
      {
        error: 'Not authorized.',
        hint: expected
          ? 'Sign in to Scout first, or append ?token=YOUR_SEED_TOKEN matching the SEED_TOKEN value in your hosting environment exactly.'
          : 'Sign in to Scout first, or set SEED_TOKEN in your hosting environment and pass it as ?token=...',
      },
      { status: 401 },
    );
  }

  const tavilyKey = process.env.TAVILY_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const model = process.env.SCOUT_DISCOVERY_MODEL || 'gpt-4o-mini';

  // ── Tavily ────────────────────────────────────────────────────────
  const tavily: Record<string, unknown> = { configured: Boolean(tavilyKey) };
  if (tavilyKey) {
    try {
      const res = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tavilyKey}` },
        body: JSON.stringify({ query: 'seed stage venture capital', max_results: 2, search_depth: 'basic' }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!res.ok) {
        tavily.ok = false;
        tavily.status = res.status;
        tavily.error = (await res.text().catch(() => '')).slice(0, 200);
      } else {
        const data = (await res.json()) as { results?: unknown[] };
        tavily.ok = true;
        tavily.resultsReturned = data.results?.length ?? 0;
      }
    } catch (err) {
      tavily.ok = false;
      tavily.error = err instanceof Error ? err.message : String(err);
    }
  }

  // ── OpenAI ────────────────────────────────────────────────────────
  const openai: Record<string, unknown> = { configured: Boolean(openaiKey), model };
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model,
          max_tokens: 20,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'Reply with JSON only.' },
            { role: 'user', content: 'Return {"ok":true}' },
          ],
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) {
        openai.ok = false;
        openai.status = res.status;
        openai.error = (await res.text().catch(() => '')).slice(0, 300);
      } else {
        openai.ok = true;
      }
    } catch (err) {
      openai.ok = false;
      openai.error = err instanceof Error ? err.message : String(err);
    }
  }

  const ready = tavily.ok === true && openai.ok === true;
  return NextResponse.json(
    {
      ok: ready,
      message: ready
        ? 'Discovery is ready. Open the Investors page and click Find investors.'
        : 'Discovery is not ready yet. See tavily / openai below for the exact reason.',
      tavily,
      openai,
    },
    { status: ready ? 200 : 500 },
  );
}
