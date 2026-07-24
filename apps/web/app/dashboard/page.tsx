import Link from 'next/link';
import { formatUsd } from '@/lib/dashboard-data';
import { loadDashboard } from '@/lib/load-dashboard';
import { PageHeader, Card, StatTile, FitBadge, WhatsAppButton, EmptyState, Badge } from '@/components/dashboard/ui';

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { data } = await loadDashboard();
  const { welcome } = await searchParams;

  if (!data) {
    return (
      <EmptyState
        title="Setting up your workspace"
        description="Give us a moment while we finish preparing your dashboard. Refresh in a few seconds."
        action={<WhatsAppButton label="Message Scout" />}
      />
    );
  }

  const { founder, startup, investors, agent, reportStatus } = data;
  const top = investors.slice(0, 4);
  const hasInvestors = investors.length > 0;
  const profileReady = Boolean(startup.name);

  return (
    <div className="space-y-8">
      {welcome === '1' && (
        <div className="rounded-2xl border border-signal/25 bg-signal/10 px-5 py-4">
          <p className="font-semibold text-moss">You&apos;re all set. Welcome to Scout.</p>
          <p className="mt-0.5 text-sm text-ink/70">
            Your report is unlocked. Explore your matched investors below, or message Scout on
            WhatsApp any time.
          </p>
        </div>
      )}

      <PageHeader
        title={`Welcome back, ${founder.name.split(' ')[0] || 'founder'}.`}
        subtitle={profileReady ? `Here's where ${startup.name}'s raise stands today.` : 'Let’s finish setting up your fundraise.'}
        action={<WhatsAppButton label="Ask Scout anything" className="hidden sm:inline-flex" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Matched investors" value={investors.length} hint={hasInvestors ? 'Ranked by fit' : 'None yet'} />
        <StatTile label="Top fit" value={hasInvestors ? `${investors[0].fit}%` : '—'} hint={hasInvestors ? investors[0].firm : 'Pending matches'} />
        <StatTile label="Raising" value={startup.raiseUsd ? formatUsd(startup.raiseUsd) : '—'} hint={startup.stage || 'Set your stage'} />
        <StatTile
          label="Report"
          value={<span className={reportStatus === 'ready' ? 'text-moss' : 'text-amber-600 dark:text-amber-400'}>{reportStatus === 'ready' ? 'Ready' : 'Building'}</span>}
          hint={reportStatus === 'ready' ? 'Unlocked' : 'In progress'}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top investors */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl tracking-tight">Your top investors</h2>
            {hasInvestors && (
              <Link href="/dashboard/investors" className="text-sm font-medium text-moss hover:underline">
                View all {investors.length} →
              </Link>
            )}
          </div>
          {hasInvestors ? (
            <div className="mt-4 divide-y divide-ink/[0.08]">
              {top.map((inv) => (
                <div key={inv.firm} className="flex items-center gap-3 py-3">
                  <span className="w-5 shrink-0 text-sm font-semibold text-mist">{inv.rank}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{inv.firm}</p>
                    <p className="truncate text-xs text-mist">
                      {inv.partner ? `${inv.partner} · ` : ''}
                      {inv.sectors}
                    </p>
                  </div>
                  <FitBadge fit={inv.fit} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-ink/15 bg-paper/50 px-4 py-8 text-center">
              <p className="text-sm font-medium">Your matches are on the way.</p>
              <p className="mt-1 text-sm text-mist">
                Finish your profile with Scout on WhatsApp and your ranked investor list appears here.
              </p>
              <div className="mt-4 flex justify-center">
                <WhatsAppButton label="Continue with Scout" />
              </div>
            </div>
          )}
        </Card>

        {/* Agent status */}
        <Card>
          <h2 className="font-display text-xl tracking-tight">Your agent</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mist">WhatsApp</span>
              {agent.whatsappConnected ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-moss">
                  <span className="h-2 w-2 rounded-full bg-signal" /> Connected
                </span>
              ) : (
                <Badge tone="amber">Not connected</Badge>
              )}
            </div>
            {agent.whatsappNumber && (
              <div className="flex items-center justify-between">
                <span className="text-mist">Number</span>
                <span className="font-medium">{agent.whatsappNumber}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-mist">Last active</span>
              <span className="font-medium">{agent.whatsappConnected ? agent.lastActive : '—'}</span>
            </div>
          </div>
          <div className="mt-5">
            <WhatsAppButton className="w-full" />
          </div>
          <Link href="/dashboard/agent" className="mt-3 block text-center text-sm font-medium text-moss hover:underline">
            Manage agent →
          </Link>
        </Card>
      </div>

      {/* Profile snapshot */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl tracking-tight">{startup.name || 'Your startup'}</h2>
          <Link href="/dashboard/profile" className="text-sm font-medium text-moss hover:underline">
            {profileReady ? 'Edit profile →' : 'Complete profile →'}
          </Link>
        </div>
        <p className="mt-1 text-mist">{startup.oneLiner || 'Add a one-liner so investors instantly get what you do.'}</p>
        {profileReady && (
          <div className="mt-4 flex flex-wrap gap-2">
            {[startup.industry, startup.stage, startup.country, startup.mrrUsd ? `${formatUsd(startup.mrrUsd)} MRR` : '']
              .filter(Boolean)
              .map((t) => (
                <span key={t} className="rounded-lg bg-paper px-2.5 py-1 text-xs font-medium text-ink/70">
                  {t}
                </span>
              ))}
          </div>
        )}
      </Card>
    </div>
  );
}
