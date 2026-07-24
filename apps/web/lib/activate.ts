import { activateSubscription } from './subscription';
import { getWorkspace, provisionWorkspace } from './workspace';

/**
 * Called after a confirmed payment. Marks the subscription active and makes
 * sure the user has a workspace. If they already have one (built from their
 * Scout WhatsApp chat or seeded), it's left untouched. Otherwise a starter
 * workspace is created so the dashboard renders with clear "finish setup"
 * empty states rather than crashing. Idempotent.
 */
export async function activateForUser(
  userId: string,
  founderName: string,
  opts: { provider?: string; providerRef?: string } = {},
): Promise<void> {
  await activateSubscription(userId, opts);

  const existing = await getWorkspace(userId);
  if (existing) return;

  await provisionWorkspace(userId, {
    reportStatus: 'generating',
    startup: {
      name: '',
      website: '',
      oneLiner: '',
      industry: '',
      stage: '',
      country: '',
      raiseUsd: 0,
      mrrUsd: 0,
      traction: '',
      businessModel: '',
      competitors: [],
      founders: founderName ? [{ name: founderName, role: 'Founder' }] : [],
    },
    agent: {
      whatsappConnected: false,
      whatsappNumber: null,
      emailReport: true,
      notifyNewMatches: true,
      weeklyNudge: false,
    },
    investors: [],
  });
}
