import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { OpenAiService } from '../lib/openai.service';
import { InvestorRow } from '../memory/memory.service';
import { StartupProfile } from '../conversation/profile';
import { ResearchOutput } from './research.agent';

export const OutreachSchema = z.object({
  subject: z.string(),
  email: z.string(),
  linkedin_dm: z.string(),
  personalization: z.string(),
});
export type Outreach = z.infer<typeof OutreachSchema>;

/**
 * Outreach generator: a distinct, genuinely personalized cold email +
 * LinkedIn DM per investor, anchored on the specific reason they match.
 */
@Injectable()
export class OutreachAgent {
  constructor(private readonly openai: OpenAiService) {}

  async generate(
    profile: StartupProfile,
    research: ResearchOutput,
    investor: InvestorRow,
    whyMatched: string,
  ): Promise<Outreach> {
    return this.openai.json({
      system: `You write cold outreach for founders raising money. Rules:
- Open with a SPECIFIC hook about this investor (a portfolio company, their thesis, a recent investment) — never "I hope this finds you well".
- Email: under 150 words, founder voice, one clear ask (a 20-minute call), 1–2 traction numbers if available.
- linkedin_dm: under 60 words, more casual, same hook.
- subject: under 8 words, concrete, no clickbait.
- personalization: one sentence explaining which hook you used and why.
- Address the partner by first name if known, otherwise the firm.

Return JSON: { "subject", "email", "linkedin_dm", "personalization" }`,
      turns: [
        {
          role: 'user',
          content: `STARTUP:\n${JSON.stringify(profile, null, 2)}\n\nSUMMARY: ${research.startup_summary}\n\nINVESTOR:\nfirm: ${investor.firm}\npartner: ${investor.partner ?? 'unknown'}\nthesis: ${investor.thesis ?? 'n/a'}\nrecent investments: ${JSON.stringify(investor.recent_investments ?? [])}\nportfolio: ${JSON.stringify(investor.portfolio ?? [])}\npartner interests: ${investor.partner_interests ?? 'n/a'}\n\nWHY MATCHED: ${whyMatched}`,
        },
      ],
      schema: OutreachSchema,
    });
  }
}
