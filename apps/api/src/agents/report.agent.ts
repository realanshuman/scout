import { Injectable } from '@nestjs/common';
import { MatchRow, InvestorRow, ResearchRow, StartupRow } from '../memory/memory.service';
import { Outreach } from './outreach.agent';

export interface ReportContent {
  startup_summary: string;
  market: string;
  ideal_investor_profile: string;
  investors: {
    rank: number;
    firm: string;
    partner: string | null;
    email: string | null;
    linkedin: string | null;
    website: string | null;
    confidence: number;
    why_matched: string;
    outreach: Outreach | null;
  }[];
  suggestions: string[];
}

/**
 * Report agent: assembles the final report JSON and renders the WhatsApp
 * message variants (preview + full report). Pure formatting — no LLM calls.
 */
@Injectable()
export class ReportAgent {
  buildContent(research: ResearchRow, matches: MatchRow[]): ReportContent {
    return {
      startup_summary: research.startup_summary ?? '',
      market: research.industry_summary ?? '',
      ideal_investor_profile: research.ideal_investor_profile ?? '',
      investors: matches.map((m) => ({
        rank: m.rank,
        firm: m.investors?.firm ?? '',
        partner: m.investors?.partner ?? null,
        email: m.investors?.email ?? null,
        linkedin: m.investors?.linkedin ?? null,
        website: m.investors?.website ?? null,
        confidence: m.confidence,
        why_matched: m.why_matched,
        outreach: (m.outreach as Outreach | null) ?? null,
      })),
      suggestions: [
        'Start with your top 10 — warm intros first, cold outreach in parallel.',
        'Send 5–10 emails per week so you can iterate on what lands.',
        'Ask me to rewrite any email, prep for a call, or explain any term.',
      ],
    };
  }

  renderPreview(matches: MatchRow[], totalCount: number, checkoutUrl: string): string {
    const top3 = matches.slice(0, 3);
    const lines = top3.map((m, i) => {
      const inv = m.investors as InvestorRow;
      const partner = inv.partner ? ` (${inv.partner})` : '';
      return `${i + 1}. *${inv.firm}*${partner} — ${Math.round(m.confidence * 100)}% fit\n${m.why_matched}`;
    });
    return `✅ *Research Complete*

Found *${totalCount} highly relevant investors* for you.

Here's a preview of your top 3:

${lines.join('\n\n')}

🔓 Unlock the full report — all ${totalCount} investors with contact details + a personalized cold email and LinkedIn DM for each:

₹999 / $29 → ${checkoutUrl}`;
  }

  renderFullReport(startup: StartupRow, content: ReportContent): string {
    const header = `🎉 *Payment received — here's your full report, ${startup.name ?? 'founder'}!*

📊 *Startup Summary*
${content.startup_summary}

🌍 *Market*
${content.market}

🎯 *Ideal Investor Profile*
${content.ideal_investor_profile}`;

    const investorLines = content.investors.slice(0, 15).map((inv) => {
      const contact = [inv.email, inv.linkedin].filter(Boolean).join(' · ');
      return `*${inv.rank}. ${inv.firm}*${inv.partner ? ` — ${inv.partner}` : ''} (${Math.round(inv.confidence * 100)}% fit)\n${inv.why_matched}${contact ? `\n📇 ${contact}` : ''}`;
    });

    const sampleOutreach = content.investors
      .filter((i) => i.outreach)
      .slice(0, 3)
      .map(
        (i) =>
          `✉️ *${i.firm}*\n_Subject: ${i.outreach!.subject}_\n\n${i.outreach!.email}`,
      );

    return [
      header,
      `💼 *Your Top Investors* (${content.investors.length} total — full list with contacts below)`,
      investorLines.join('\n\n'),
      sampleOutreach.length
        ? `📨 *Sample outreach* (I've drafted personalized emails for your top investors)\n\n${sampleOutreach.join('\n\n———\n\n')}`
        : '',
      `💡 *Suggestions*\n${content.suggestions.map((s) => `• ${s}`).join('\n')}

From here on I'm your fundraising assistant — ask me for the outreach draft for any investor on your list, to rewrite an email, review your deck, or anything else. 🚀`,
    ]
      .filter(Boolean)
      .join('\n\n');
  }
}
