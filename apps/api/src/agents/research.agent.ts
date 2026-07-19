import { Injectable, Logger } from '@nestjs/common';
import { z } from 'zod';
import { OpenAiService } from '../lib/openai.service';
import { SearchService, SearchResult } from '../lib/search.service';
import { StartupProfile } from '../conversation/profile';

const ResearchOutputSchema = z.object({
  startup_summary: z.string(),
  industry_summary: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  ideal_investor_profile: z.string(),
  funding_stage: z.string(),
});
export type ResearchOutput = z.infer<typeof ResearchOutputSchema> & {
  sources: SearchResult[];
};

/**
 * Research agent: scrapes the startup's website and searches the web for
 * market, competitor and news context, then synthesizes a structured brief.
 */
@Injectable()
export class ResearchAgent {
  private readonly logger = new Logger(ResearchAgent.name);

  constructor(
    private readonly openai: OpenAiService,
    private readonly search: SearchService,
  ) {}

  async run(profile: StartupProfile): Promise<ResearchOutput> {
    const name = profile.name ?? 'the startup';
    const queries = [
      `${name} startup ${profile.industry ?? ''}`.trim(),
      `${profile.industry ?? name} market size trends 2026`,
      `${name} competitors ${(profile.competitors ?? []).join(' ')}`.trim(),
      `${name} funding news`,
    ];

    const [siteContent, ...searchBatches] = await Promise.all([
      profile.website ? this.search.scrape(profile.website) : Promise.resolve(''),
      ...queries.map((q) => this.search.search(q, 4)),
    ]);

    const sources = dedupeByUrl(searchBatches.flat());
    const sourceDigest = sources
      .map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.snippet}`)
      .join('\n\n')
      .slice(0, 12000);

    const output = await this.openai.json({
      system: `You are a venture research analyst. Using the founder-provided profile, the startup's website content, and web search results, produce a concise, investor-grade research brief. Be specific and honest — weaknesses matter as much as strengths. funding_stage must be one of: pre-seed, seed, series-a, series-b+.

Return JSON with keys: startup_summary (120-180 words), industry_summary (100-150 words), strengths (3-5 bullets), weaknesses (3-5 bullets), ideal_investor_profile (who should invest and why, 80-120 words), funding_stage.`,
      turns: [
        {
          role: 'user',
          content: `FOUNDER PROFILE:\n${JSON.stringify(profile, null, 2)}\n\nWEBSITE CONTENT:\n${siteContent.slice(0, 8000) || '(unavailable)'}\n\nWEB SOURCES:\n${sourceDigest || '(unavailable)'}`,
        },
      ],
      schema: ResearchOutputSchema,
    });

    this.logger.log(`research complete for ${name}`);
    return { ...output, sources };
  }
}

function dedupeByUrl(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    if (seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}
