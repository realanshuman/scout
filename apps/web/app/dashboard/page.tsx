import Link from 'next/link';
import { getDashboardData, formatUsd } from '@/lib/dashboard-data';
import { PageHeader, Card, StatTile, FitBadge, WhatsAppButton } from '@/components/dashboard/ui';

export default async function OverviewPage() {
  const { founder, startup, investors, agent } = await getDashboardData();
  const top = investors.slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${founder.name.split(' ')[0]}.`}
        subtitle={`Here's where ${startup.name}'s raise stands today.`}
        action={<WhatsAppButton label="Ask Scout anything" className="hidden sm:inline-flex" />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Matched investors" value={investors.length} hint="Ranked by fit" />
        <StatTile label="Top fit" value={`${investors[0].fit}%`} hint={investors[0].firm} />
        <StatTile label="Raising" value={formatUsd(startup.raiseUsd)} hint={startup.stage} />
        <StatTile
          label="Report"
          value={<span className="text-moss">Ready</span>}
          hint="Unlocked"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Top investors */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl tracking-tight">Your top investors</h2>
            <Link href="/dashboard/investors" className="text-sm font-medium text-moss hover:underline">
              View all {investors.length} →
            </Link>
          </div>
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
        </Card>

        {/* Agent status */}
        <Card>
          <h2 className="font-display text-xl tracking-tight">Your agent</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-mist">WhatsApp</span>
              <span className="inline-flex items-center gap-1.5 font-medium text-moss">
                <span className="h-2 w-2 rounded-full bg-signal" /> Connected
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist">Number</span>
              <span className="font-medium">{agent.whatsappNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-mist">Last active</span>
              <span className="font-medium">{agent.lastActive}</span>
            </div>
          </div>
          <div className="mt-5">
            <WhatsAppButton className="w-full" />
          </div>
          <Link
            href="/dashboard/agent"
            className="mt-3 block text-center text-sm font-medium text-moss hover:underline"
          >
            Manage agent →
          </Link>
        </Card>
      </div>

      {/* Profile snapshot */}
      <Card>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl tracking-tight">{startup.name}</h2>
          <Link href="/dashboard/profile" className="text-sm font-medium text-moss hover:underline">
            Edit profile →
          </Link>
        </div>
        <p className="mt-1 text-mist">{startup.oneLiner}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[startup.industry, startup.stage, startup.country, `${formatUsd(startup.mrrUsd)} MRR`].map(
            (t) => (
              <span key={t} className="rounded-lg bg-paper px-2.5 py-1 text-xs font-medium text-ink/70">
                {t}
              </span>
            ),
          )}
        </div>
      </Card>
    </div>
  );
}
