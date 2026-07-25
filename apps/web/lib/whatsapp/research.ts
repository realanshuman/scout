import { discoverInvestors } from '../discovery/discover';
import { searchConfigured } from '../discovery/search';
import { llmConfigured } from '../discovery/llm';
import { sendWhatsApp } from './twilio';
import {
  claimResearch,
  finishResearch,
  failResearch,
  getContactById,
  recordOutbound,
  type DiscoveredMatch,
} from './store';
import { matchesMessage, NO_MATCHES, RESEARCH_FAILED } from './agent';

/** Maps the WhatsApp interview profile onto the shape discovery expects. */
function toStartupProfile(p: Record<string, unknown>) {
  const str = (k: string) => (typeof p[k] === 'string' ? (p[k] as string) : '');
  const num = (k: string) => (typeof p[k] === 'number' ? (p[k] as number) : 0);
  return {
    name: str('name'),
    website: str('website'),
    oneLiner: str('description'),
    industry: str('industry'),
    stage: str('stage'),
    country: str('country'),
    raiseUsd: num('raise_amount_usd'),
    mrrUsd: num('mrr_usd'),
    traction: str('traction'),
    businessModel: str('business_model'),
    competitors: Array.isArray(p.competitors) ? (p.competitors as string[]) : [],
    founders: Array.isArray(p.founders)
      ? (p.founders as { name: string; role: string }[])
      : [],
  };
}

/**
 * Researches investors for a WhatsApp contact and messages them the result.
 *
 * Runs AFTER the webhook response (via next/server `after`), because discovery
 * takes about a minute and Twilio drops the webhook after ~15 seconds.
 *
 * Guarded by claimResearch() so overlapping webhooks can't start it twice, and
 * it always leaves the contact in a truthful state ('done' or 'failed') so the
 * assistant never has to guess whether it ran.
 */
export async function runResearchAndNotify(contactId: string, phone: string): Promise<void> {
  if (!searchConfigured || !llmConfigured) {
    await failResearch(contactId);
    return;
  }

  // Only one run at a time.
  if (!(await claimResearch(contactId))) return;

  try {
    const contact = await getContactById(contactId);
    if (!contact) return;

    const investors = await discoverInvestors(toStartupProfile(contact.profile ?? {}));

    if (investors.length === 0) {
      await finishResearch(contactId, []);
      await recordOutbound(contactId, NO_MATCHES);
      await sendWhatsApp(phone, NO_MATCHES);
      return;
    }

    const matches: DiscoveredMatch[] = investors.map((inv) => ({
      rank: inv.rank,
      firm: inv.firm,
      partner: inv.partner ?? null,
      fit: inv.fit,
      why: inv.why,
      stages: inv.stages,
      check: inv.check,
      sectors: inv.sectors,
    }));

    await finishResearch(contactId, matches);

    const message = matchesMessage(matches, matches.length);
    await recordOutbound(contactId, message);
    await sendWhatsApp(phone, message);
  } catch (err) {
    console.error('[wa research]', err);
    await failResearch(contactId);
    await recordOutbound(contactId, RESEARCH_FAILED);
    await sendWhatsApp(phone, RESEARCH_FAILED);
  }
}
