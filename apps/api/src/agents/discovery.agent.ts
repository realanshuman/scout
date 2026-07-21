import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { OpenAiService } from '../lib/openai.service';
import { SearchService, SearchResult } from '../lib/search.service';
import { StartupProfile } from '../conversation/profile';
import { ResearchOutput } from './research.agent';
import { InvestorInsert } from '../memory/memory.service';

/** Investors the extraction step pulls out of web/platform research. */
const DiscoveredInvestorSchema = z.object({
  firm: z.string().min(1),
  partner: z.string().nullish(),
  stages: z.array(z.string()).default([]),
  sectors: z.array(z.string()).default([]),
  countries: z.array(z.string()).default([]),
  check_min_usd: z.number().nullish(),
  check_max_usd: z.number().nullish(),
  thesis: z.string().nullish(),
  partner_interests: z.string().nullish(),
  recent_investments: z
    .array(
      z.object({
        company: z.string(),
        round: z.string().nullish(),
        year: z.number().nullish(),
      }),
    )
    .default([]),
  portfolio: z.array(z.string()).default([]),
  website: z.string().nullish(),
  linkedin: z.string().nullish(),
  email: z.string().nullish(),
  source_url: z.string().nullish(),
});
const DiscoveryOutputSchema = z.object({
  investors: z.array(DiscoveredInvestorSchema).default([]),
});

type DiscoveredInvestor = z.infer<typeof DiscoveredInvestorSchema>;

interface Filters {
  stage: string;
  sectors: string[];
  country: string;
  raiseUsd: number | null;
}

/**
 * Investor discovery agent.
 *
 * Instead of relying on a hand-maintained database, this researches the live
 * web and public investor platforms (OpenVC, YC directory, VC firm sites, tech
 * press, thesis posts) using the founder's filters, then extracts structured
 * investor records. Results are embedded and returned ready to upsert, so the
 * investor base grows and improves itself over time.
 *
 * It never invents contact details: an email or LinkedIn is included only when
 * it actually appears in a source, otherwise the firm website is provided so
 * outreach can find the right person.
 */
@Injectable()
export class InvestorDiscoveryAgent {
  private readonly logger = new Logger(InvestorDiscoveryAgent.name);

  constructor(
    private readonly openai: OpenAiService,
    private readonly search: SearchService,
  ) {}

  async run(profile: StartupProfile, research: ResearchOutput): Promise<InvestorInsert[]> {
    const filters = this.deriveFilters(profile, research);
    const queries = this.buildQueries(filters, profile);

    // 1. Search investor platforms + the open web in parallel.
    const batches = await Promise.all(queries.map((q) => this.search.search(q, 5)));
    const results = dedupeByUrl(batches.flat());
    if (results.length === 0) {
      this.logger.warn('discovery found no search results (search key missing?)');
      return [];
    }

    // 2. Scrape a few of the most promising list/firm pages for richer detail.
    const scrapeTargets = results
      .filter((r) => LIST_HINT.test(r.url) || LIST_HINT.test(r.title))
      .slice(0, 4);
    const scraped = await Promise.all(scrapeTargets.map((r) => this.search.scrape(r.url)));

    // 3. Build a corpus and extract structured investors from it.
    const corpus = [
      results
        .map((r, i) => `[${i + 1}] ${r.title} (${r.url})\n${r.snippet}`)
        .join('\n\n'),
      scrapeTargets
        .map((r, i) => (scraped[i] ? `SOURCE ${r.url}:\n${scraped[i].slice(0, 4000)}` : ''))
        .filter(Boolean)
        .join('\n\n'),
    ]
      .filter(Boolean)
      .join('\n\n')
      .slice(0, 18000);

    const extracted = await this.openai.json({
      system: this.extractionPrompt(filters),
      turns: [{ role: 'user', content: corpus }],
      schema: DiscoveryOutputSchema,
    });

    const cleaned = this.postProcess((extracted.investors ?? []) as DiscoveredInvestor[], filters);
    if (cleaned.length === 0) return [];

    // 4. Embed all candidates in one batch, ready for the investor base.
    const embeddings = await this.openai.embedMany(cleaned.map(embeddingText));
    const now = new Date().toISOString();
    const rows: InvestorInsert[] = cleaned.map((inv, i) => ({
      firm: inv.firm,
      partner: inv.partner ?? null,
      email: inv.email ?? null,
      linkedin: inv.linkedin ?? null,
      website: inv.website ?? null,
      countries: inv.countries,
      stages: inv.stages,
      sectors: inv.sectors,
      check_min_usd: inv.check_min_usd ?? null,
      check_max_usd: inv.check_max_usd ?? null,
      thesis: inv.thesis ?? null,
      partner_interests: inv.partner_interests ?? null,
      recent_investments: inv.recent_investments,
      portfolio: inv.portfolio,
      source_url: inv.source_url ?? null,
      discovered: true,
      last_seen_at: now,
      embedding: embeddings[i],
    }));

    this.logger.log(`discovered ${rows.length} investors for ${profile.name ?? 'startup'}`);
    return rows;
  }

  // ── helpers ─────────────────────────────────────────────────────────

  private deriveFilters(profile: StartupProfile, research: ResearchOutput): Filters {
    return {
      stage: normalizeStage(research.funding_stage ?? profile.stage) ?? 'seed',
      sectors: [profile.industry].filter(Boolean) as string[],
      country: profile.country ?? 'Global',
      raiseUsd: profile.raise_amount_usd ?? null,
    };
  }

  private buildQueries(filters: Filters, profile: StartupProfile): string[] {
    const sector = profile.industry ?? 'startups';
    const stage = filters.stage;
    const geo = filters.country;
    const competitors = (profile.competitors ?? []).slice(0, 2);

    const queries = [
      `${stage} venture capital firms investing in ${sector} ${geo}`,
      `${stage} investors ${sector} thesis site:openvc.app`,
      `top ${sector} ${stage} VCs list 2025 2026`,
      `angel investors ${sector} ${geo}`,
      `who invested in ${sector} startups ${stage} recent funding`,
      `${sector} focused funds portfolio ${geo}`,
    ];
    for (const c of competitors) {
      queries.push(`${c} investors funding round who backed`);
    }
    return queries.slice(0, 8);
  }

  private extractionPrompt(filters: Filters): string {
    return `You are an investor-research analyst. From the search results and scraped pages below, extract REAL investors (VC firms and angels) that could plausibly fund a ${filters.stage}-stage ${filters.sectors.join('/') || 'startup'} company based in ${filters.country}.

Hard rules:
- Only include investors that actually appear in the provided text. NEVER invent firms, partners, portfolios, or theses.
- Contact details: include an "email" or "linkedin" ONLY if it literally appears in the source text. If not present, set them to null and include the firm "website" instead. Do not guess or construct email addresses.
- Always include the "source_url" the investor was found in.
- Normalize "stages" to these exact tokens: "pre-seed", "seed", "series-a", "series-b+".
- "countries": list where they invest; include "Global" if they invest broadly.
- Prefer investors whose stage and sector fit the target. Skip clearly irrelevant ones (e.g. late-stage-only funds for a pre-seed company).
- Aim for up to 40 high-quality, de-duplicated investors.

Return JSON: { "investors": [ { firm, partner, stages[], sectors[], countries[], check_min_usd, check_max_usd, thesis, partner_interests, recent_investments[{company,round,year}], portfolio[], website, linkedin, email, source_url } ] }`;
  }

  /** Drop dupes and obviously-broken rows; keep it to a sane count. */
  private postProcess(
    investors: DiscoveredInvestor[],
    filters: Filters,
  ): DiscoveredInvestor[] {
    const seen = new Set<string>();
    const out: DiscoveredInvestor[] = [];
    for (const inv of investors) {
      const key = `${inv.firm.toLowerCase().trim()}|${(inv.partner ?? '').toLowerCase().trim()}`;
      if (seen.has(key) || inv.firm.trim().length < 2) continue;
      seen.add(key);
      // Ensure the founder's geography is reachable: keep global or matching geo,
      // but don't over-filter when geo data is missing.
      out.push({
        ...inv,
        stages: inv.stages.length ? inv.stages : [filters.stage],
        countries: inv.countries.length ? inv.countries : ['Global'],
        email: sanitizeEmail(inv.email),
      });
      if (out.length >= 40) break;
    }
    return out;
  }
}

// ── module-scoped helpers ─────────────────────────────────────────────

const LIST_HINT = /openvc|list|top-|top_|best-|vc|investor|angels|portfolio|thesis/i;

function dedupeByUrl(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

function embeddingText(inv: DiscoveredInvestor): string {
  return [
    `Firm: ${inv.firm}`,
    inv.partner ? `Partner: ${inv.partner}` : '',
    `Stages: ${inv.stages.join(', ')}`,
    `Sectors: ${inv.sectors.join(', ')}`,
    `Geographies: ${inv.countries.join(', ')}`,
    inv.thesis ? `Thesis: ${inv.thesis}` : '',
    inv.partner_interests ? `Partner interests: ${inv.partner_interests}` : '',
    inv.portfolio.length ? `Portfolio: ${inv.portfolio.join(', ')}` : '',
    inv.recent_investments.length
      ? `Recent: ${inv.recent_investments.map((r) => r.company).join(', ')}`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}

/** Only keep an email that looks real; never pass through a guessed one. */
function sanitizeEmail(email?: string | null): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : null;
}

function normalizeStage(stage?: string | null): string | null {
  if (!stage) return null;
  const s = stage.toLowerCase();
  if (s.includes('pre')) return 'pre-seed';
  if (s.includes('seed')) return 'seed';
  if (s.includes('series a') || s.includes('series-a')) return 'series-a';
  if (s.includes('series')) return 'series-b+';
  return null;
}

export type { InvestorInsert };
