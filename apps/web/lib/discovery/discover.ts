import type { StartupProfile, InvestorMatch } from '@/lib/dashboard-data';
import { tavilySearchMany } from './search';
import { openaiJson } from './llm';

/** Build a handful of focused queries from the founder's profile. */
function buildQueries(p: StartupProfile): string[] {
  const sector = p.industry || 'startups';
  const stage = p.stage || 'seed';
  const geo = p.country || 'Global';
  const queries = [
    `${stage} venture capital firms investing in ${sector} ${geo}`,
    `top ${sector} ${stage} VCs list 2025 2026`,
    `angel investors ${sector} ${geo}`,
    `who invested in ${sector} startups ${stage} recent funding`,
    `${sector} focused funds portfolio thesis`,
  ];
  for (const c of (p.competitors ?? []).slice(0, 1)) {
    queries.push(`${c} investors funding round who backed`);
  }
  return queries.slice(0, 6);
}

interface RawInvestor {
  firm: string;
  partner?: string | null;
  fit?: number;
  stages?: string;
  check?: string;
  sectors?: string;
  why?: string;
  email?: string | null;
  linkedin?: string | null;
  outreachSubject?: string;
  outreachBody?: string;
}

const SYSTEM = `You are Scout, an investor-research analyst. From the web search results provided, identify REAL investors (VC firms and angels) that could plausibly fund the founder's startup, then rank them by fit and draft outreach.

Hard rules:
- Only include investors that actually appear in the provided search results. NEVER invent firms, partners, portfolios, or theses.
- Contact details: include an "email" or "linkedin" ONLY if it literally appears in the source text. Otherwise set them to null. Never guess or construct an email address.
- "fit" is an integer 0-100 reflecting how well the investor matches this startup's stage, sector, geography and traction. Rank best first.
- "why" is ONE concrete sentence grounded in the sources (recent deals, focus areas, thesis) explaining the match. No fluff.
- "stages", "check", "sectors" are short display strings, e.g. "Seed – Series A", "$500K–$3M", "Dev tools · AI infra".
- "outreachSubject" is a crisp, specific subject line. "outreachBody" is a warm, personalized cold email (~90 words) from the founder to this investor, referencing the startup's real details and the investor's focus. Sign it from the founder.
- Return the strongest 12-18 investors, de-duplicated. Skip clearly irrelevant ones.

Respond with a single JSON object: { "investors": [ { "firm", "partner", "fit", "stages", "check", "sectors", "why", "email", "linkedin", "outreachSubject", "outreachBody" } ] }`;

/**
 * Live investor discovery: searches the web with Tavily, then uses OpenAI to
 * extract, rank and draft outreach for real investors that fit the startup.
 * Returns investor rows ready to store. Returns [] if nothing usable is found.
 */
export async function discoverInvestors(profile: StartupProfile): Promise<InvestorMatch[]> {
  const results = await tavilySearchMany(buildQueries(profile), 5);
  if (results.length === 0) return [];

  const corpus = results
    .map((r, i) => `[${i + 1}] ${r.title} (${r.url})\n${r.snippet}`)
    .join('\n\n')
    .slice(0, 14_000);

  const founder = profile.founders?.[0]?.name || 'the founder';
  const user = `FOUNDER'S STARTUP
Name: ${profile.name || 'Unknown'}
One-liner: ${profile.oneLiner || ''}
Industry: ${profile.industry || ''}
Stage: ${profile.stage || ''}
Location: ${profile.country || ''}
Raising: ${profile.raiseUsd ? `$${profile.raiseUsd.toLocaleString()}` : 'n/a'}
Traction: ${profile.traction || ''}
Business model: ${profile.businessModel || ''}
Founder (sign outreach from): ${founder}

WEB SEARCH RESULTS:
${corpus}`;

  const out = await openaiJson<{ investors?: RawInvestor[] }>({
    system: SYSTEM,
    user,
    maxTokens: 6000,
  });

  const seen = new Set<string>();
  const cleaned = (out.investors ?? [])
    .filter((inv) => {
      const firm = (inv.firm || '').trim();
      if (firm.length < 2) return false;
      const key = firm.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0))
    .slice(0, 18);

  return cleaned.map((inv, i) => ({
    rank: i + 1,
    firm: inv.firm.trim(),
    partner: inv.partner?.trim() || null,
    fit: clampFit(inv.fit),
    stages: inv.stages?.trim() || profile.stage || '',
    check: inv.check?.trim() || '',
    sectors: inv.sectors?.trim() || profile.industry || '',
    why: inv.why?.trim() || '',
    email: sanitizeEmail(inv.email),
    linkedin: inv.linkedin?.trim() || null,
    outreachSubject: inv.outreachSubject?.trim() || `Intro: ${profile.name || 'our startup'}`,
    outreachBody: inv.outreachBody?.trim() || '',
    saved: false,
    status: 'new' as const,
  }));
}

function clampFit(n?: number): number {
  const v = Math.round(Number(n));
  if (!Number.isFinite(v)) return 70;
  return Math.min(99, Math.max(40, v));
}

function sanitizeEmail(email?: string | null): string | null {
  if (!email) return null;
  const t = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? t : null;
}
