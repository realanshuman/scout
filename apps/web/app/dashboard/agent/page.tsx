import type { Metadata } from 'next';
import { loadDashboard } from '@/lib/load-dashboard';
import { PageHeader, Card, WhatsAppButton, Badge, waLink } from '@/components/dashboard/ui';
import { NotificationSettings } from '@/components/dashboard/notifications';

export const metadata: Metadata = { title: 'Agent · Scout' };

export default async function AgentPage() {
  const { data } = await loadDashboard();
  const agent = data?.agent ?? {
    whatsappConnected: false, whatsappNumber: '', lastActive: '', emailReport: true, notifyNewMatches: true, weeklyNudge: false,
  };
  const startupName = data?.startup.name || 'your startup';
  const topFirm = data?.investors[0]?.firm ?? 'Northbeam';
  const secondFirm = data?.investors[1]?.firm ?? 'Latitude Labs';

  const prompts = [
    `Rewrite the email for ${topFirm}`,
    'Who should I email first?',
    'Explain this SAFE clause',
    `Draft a follow-up for ${secondFirm}`,
    'Add 10 more investors like these',
    'Prep me for my investor call',
  ];

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
              <div className="flex items-center gap-2">
                <p className="font-semibold">WhatsApp</p>
                {agent.whatsappConnected ? <Badge tone="green">Connected</Badge> : <Badge tone="amber">Not connected</Badge>}
              </div>
              <p className="text-sm text-mist">
                {agent.whatsappConnected
                  ? `${agent.whatsappNumber} · active ${agent.lastActive}`
                  : 'Connect by messaging Scout from your phone.'}
              </p>
            </div>
          </div>
          <WhatsAppButton label={agent.whatsappConnected ? 'Open chat' : 'Connect WhatsApp'} />
        </div>
      </Card>

      {/* What you can ask */}
      <Card>
        <h2 className="font-display text-lg tracking-tight">What you can ask Scout</h2>
        <p className="mt-1 text-sm text-mist">
          It has full context on {startupName}. Just message it on WhatsApp.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {prompts.map((q) => (
            <a
              key={q}
              href={waLink(q)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 rounded-xl border border-ink/[0.08] bg-paper/60 px-3.5 py-2.5 text-sm text-ink/80 transition hover:border-ink/15 hover:bg-paper"
            >
              <span className="truncate">“{q}”</span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-mist transition group-hover:translate-x-0.5 group-hover:text-moss" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          ))}
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <h2 className="font-display text-lg tracking-tight">Notifications</h2>
        <p className="mt-1 text-sm text-mist">Changes save automatically.</p>
        <div className="mt-2">
          <NotificationSettings
            initial={{
              emailReport: agent.emailReport,
              notifyNewMatches: agent.notifyNewMatches,
              weeklyNudge: agent.weeklyNudge,
            }}
          />
        </div>
      </Card>
    </div>
  );
}
