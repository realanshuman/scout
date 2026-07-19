import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { OpenAiService } from '../lib/openai.service';
import { MemoryService, InvestorRow } from '../memory/memory.service';
import { StartupProfile } from '../conversation/profile';
import { ResearchOutput } from './research.agent';

export interface RankedMatch {
  investor: InvestorRow;
  rank: number;
  confidence: number; // 0..1
  why_matched: string;
}

const RankBatchSchema = z.object({
  rankings: z.array(
    z.object({
      investor_id: z.string(),
      confidence: z.number().min(0).max(1),
      why_matched: z.string(),
    }),
  ),
});

/**
 * Investor matching agent — the core of the product.
 *
 * 1. Hard filters (stage, geography) + semantic retrieval over the curated
 *    investor knowledge base via pgvector.
 * 2. An LLM re-ranking pass that scores each candidate against the full
 *    startup picture and writes the "why matched" explanation.
 * 3. Returns the top N (default 50) by blended score.
 */
@Injectable()
export class MatchingAgent {
  private readonly logger = new Logger(MatchingAgent.name);

  constructor(
    private readonly openai: OpenAiService,
    private readonly memory: MemoryService,
  ) {}

  async run(profile: StartupProfile, research: ResearchOutput, topN = 50): Promise<RankedMatch[]> {
    const queryText = [
      `Startup: ${profile.name}`,
      `Industry: ${profile.industry}`,
      `Stage: ${research.funding_stage}`,
      `Country: ${profile.country}`,
      `Raising: $${profile.raise_amount_usd ?? '?'}`,
      `Business model: ${profile.business_model ?? ''}`,
      research.startup_summary,
      `Ideal investor: ${research.ideal_investor_profile}`,
    ].join('\n');

    const embedding = await this.openai.embed(queryText);
    const candidates = await this.memory.matchInvestors(embedding, {
      stage: normalizeStage(research.funding_stage ?? profile.stage),
      country: profile.country ?? null,
      count: 100,
    });
    this.logger.log(`retrieved ${candidates.length} candidates from investor base`);
    if (candidates.length === 0) return [];

    // Re-rank in batches to keep prompts small and scores calibrated.
    const scored: { investor: InvestorRow; confidence: number; why_matched: string }[] = [];
    for (const batch of chunk(candidates, 20)) {
      const digest = batch
        .map(
          (inv) =>
            `id: ${inv.id}\nfirm: ${inv.firm}${inv.partner ? ` — partner: ${inv.partner}` : ''}\nstages: ${inv.stages.join(', ')} | sectors: ${inv.sectors.join(', ')} | geo: ${inv.countries.join(', ')}\ncheck: $${fmt(inv.check_min_usd)}–$${fmt(inv.check_max_usd)}\nthesis: ${inv.thesis ?? 'n/a'}\nrecent: ${JSON.stringify(inv.recent_investments ?? [])}\nportfolio: ${JSON.stringify(inv.portfolio ?? [])}`,
        )
        .join('\n---\n');

      const result = await this.openai.json({
        system: `You are an investor-matching analyst. Score how well EACH investor below fits this specific startup, 0.0–1.0. Consider stage fit, sector/thesis fit, geography, check size vs raise amount, portfolio adjacency (similar-but-not-competing companies are a strong positive; direct competitors in portfolio are a negative), and partner interests.

why_matched: 1–2 concrete sentences a founder would find credible — cite the actual thesis, portfolio company, or partner interest that drives the fit. Never generic.

Return JSON: { "rankings": [{ "investor_id", "confidence", "why_matched" }] } — one entry per investor, ids copied exactly.`,
        turns: [
          {
            role: 'user',
            content: `STARTUP:\n${queryText}\n\nSTRENGTHS: ${research.strengths.join('; ')}\n\nINVESTORS:\n${digest}`,
          },
        ],
        schema: RankBatchSchema,
      });

      const byId = new Map(batch.map((inv) => [inv.id, inv]));
      for (const r of result.rankings) {
        const investor = byId.get(r.investor_id);
        if (investor) {
          scored.push({ investor, confidence: r.confidence, why_matched: r.why_matched });
        }
      }
    }

    // Blend LLM confidence with retrieval similarity (mostly LLM-driven).
    scored.sort((a, b) => blended(b) - blended(a));
    return scored.slice(0, topN).map((s, i) => ({ ...s, rank: i + 1 }));
  }
}

function blended(s: { investor: InvestorRow; confidence: number }): number {
  return s.confidence * 0.8 + (s.investor.similarity ?? 0.5) * 0.2;
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

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function fmt(n: number | null): string {
  if (n == null) return '?';
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}K`;
}
