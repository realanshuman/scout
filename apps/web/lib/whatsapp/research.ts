import { discoverInvestors } from '../discovery/discover';
import { searchConfigured } from '../discovery/search';
import { llmConfigured } from '../discovery/llm';
import { createCheckoutSession, paymentsConfigured } from '../dodo';
import { sendWhatsApp } from './twilio';
import {
  claimResearch,
  finishResearch,
  failResearch,
  getContactById,
  recordOutbound,
  setPayment,
  setUnlocked,
  type DiscoveredMatch,
} from './store';
import { previewMessage, NO_MATCHES, RESEARCH_FAILED } from './agent';

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
 * Researches investors for a WhatsApp contact, sets up the paywall, and sends
 * the free top-3 preview.
 *
 * Runs AFTER the webhook response (via next/server `after`), because discovery
 * takes about a minute and Twilio drops the webhook at ~15 seconds.
 *
 * The product flow: preview (top 3, free) -> Dodo payment -> full report. When
 * payments aren't configured, the report is unlocked immediately so the flow
 * still works end to end.
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

    // Store the FULL records, contacts and all, so the assistant can answer
    // "what's their email?" truthfully after unlock.
    const matches: DiscoveredMatch[] = investors.map((inv) => ({
      rank: inv.rank,
      firm: inv.firm,
      partner: inv.partner ?? null,
      fit: inv.fit,
      why: inv.why,
      stages: inv.stages,
      check: inv.check,
      sectors: inv.sectors,
      email: inv.email ?? null,
      linkedin: inv.linkedin ?? null,
      website: null,
      outreachSubject: inv.outreachSubject,
    }));

    await finishResearch(contactId, matches);

    // Set up the paywall: a Dodo checkout tied to this contact. If payments
    // aren't configured (or checkout fails), unlock immediately so the founder
    // is never stuck behind a broken gate.
    let paymentUrl: string | null = null;
    if (paymentsConfigured) {
      try {
        const base = process.env.BETTER_AUTH_URL ?? process.env.WEB_PUBLIC_URL ?? '';
        const { url, sessionId } = await createCheckoutSession({
          returnUrl: `${base}/thanks`,
          metadata: { wa_contact_id: contactId },
        });
        paymentUrl = url;
        await setPayment(contactId, sessionId, url);
      } catch (err) {
        console.error('[wa research] checkout creation failed', err);
        await setUnlocked(contactId);
      }
    } else {
      await setUnlocked(contactId);
    }

    const message = previewMessage(matches, matches.length, paymentUrl);
    await recordOutbound(contactId, message);
    await sendWhatsApp(phone, message);
  } catch (err) {
    console.error('[wa research]', err);
    await failResearch(contactId);
    await recordOutbound(contactId, RESEARCH_FAILED);
    await sendWhatsApp(phone, RESEARCH_FAILED);
  }
}
