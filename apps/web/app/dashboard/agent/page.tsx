import type { Metadata } from 'next';
import { getDashboardData } from '@/lib/dashboard-data';
import { PageHeader, Card, WhatsAppButton } from '@/components/dashboard/ui';
import { Toggle } from '@/components/dashboard/toggle';

export const metadata: Metadata = { title: 'Agent · Scout' };

export default async function AgentPage() {
  const { agent, startup } = await getDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your agent"
        subtitle="Scout keeps working after the report. Manage how and where it reaches you."
      />

      {/* Connection */}
      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-signal/12">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-moss" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Z" />
              </svg>
            </span>
            <div>
              <p className="font-semibold">WhatsApp connected</p>
              <p className="text-sm text-mist">
                {agent.whatsappNumber} · active {agent.lastActive}
              </p>
            </div>
          </div>
          <WhatsAppButton label="Open chat" />
        </div>
      </Card>

      {/* What you can ask */}
      <Card>
        <h2 className="font-display text-lg tracking-tight">What you can ask Scout</h2>
        <p className="mt-1 text-sm text-mist">
          It has full context on {startup.name}. Just message it on WhatsApp.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            'Rewrite the email for Northbeam',
            'Who should I email first?',
            'Explain this SAFE clause',
            'Draft a follow-up for Latitude Labs',
            'Add 10 more investors like Kite String',
            'Prep me for my call with Sarah',
          ].map((q) => (
            <div
              key={q}
              className="rounded-xl border border-ink/[0.08] bg-paper/60 px-3.5 py-2.5 text-sm text-ink/80"
            >
              “{q}”
            </div>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h2 className="font-display text-lg tracking-tight">Notifications</h2>
        <div className="mt-1 divide-y divide-ink/[0.08]">
          <Toggle
            label="Email me my report"
            hint="A copy of your investor report and outreach, sent to your inbox."
            defaultOn={agent.emailReport}
          />
          <Toggle
            label="Notify me about new matches"
            hint="When Scout finds new investors that fit, it messages you on WhatsApp."
            defaultOn={agent.notifyNewMatches}
          />
          <Toggle label="Weekly fundraising nudge" hint="A gentle check-in on your raise progress." />
        </div>
      </Card>
    </div>
  );
}
