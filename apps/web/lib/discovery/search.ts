export interface SearchResult {
  url: string;
  title: string;
  snippet: string;
}

export const searchConfigured = Boolean(process.env.TAVILY_API_KEY);

/**
 * Tavily web search. Returns [] on any failure so the pipeline degrades
 * gracefully. Uses `basic` depth for speed (this runs inside a request).
 */
export async function tavilySearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({ query, max_results: maxResults, search_depth: 'basic' }),
      // Don't let a slow query hang the whole request.
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      results?: { url: string; title: string; content: string }[];
    };
    return (data.results ?? []).map((r) => ({ url: r.url, title: r.title, snippet: r.content }));
  } catch {
    return [];
  }
}

/** Search several queries in parallel and de-duplicate by URL. */
export async function tavilySearchMany(queries: string[], perQuery = 5): Promise<SearchResult[]> {
  const batches = await Promise.all(queries.map((q) => tavilySearch(q, perQuery)));
  const seen = new Set<string>();
  const out: SearchResult[] = [];
  for (const r of batches.flat()) {
    if (seen.has(r.url)) continue;
    seen.add(r.url);
    out.push(r);
  }
  return out;
}
