import type { Metadata } from 'next';
import { getDashboardData, formatUsd } from '@/lib/dashboard-data';
import { PageHeader, Card, WhatsAppButton } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Profile · Scout' };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-mist">{label}</dt>
      <dd className="text-[15px] font-medium sm:text-right">{value}</dd>
    </div>
  );
}

export default async function ProfilePage() {
  const { startup } = await getDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Startup profile"
        subtitle="Scout built this from your conversation. It's what your matches and outreach are based on."
        action={<WhatsAppButton label="Update via Scout" className="hidden sm:inline-flex" />}
      />

      <Card>
        <h2 className="font-display text-lg tracking-tight">Company</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <Row label="Name" value={startup.name} />
          <Row label="One-liner" value={startup.oneLiner} />
          <Row label="Website" value={startup.website} />
          <Row label="Industry" value={startup.industry} />
          <Row label="Location" value={startup.country} />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-lg tracking-tight">The raise</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <Row label="Stage" value={startup.stage} />
          <Row label="Raising" value={formatUsd(startup.raiseUsd)} />
          <Row label="MRR" value={`${formatUsd(startup.mrrUsd)} / mo`} />
          <Row label="Business model" value={startup.businessModel} />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-lg tracking-tight">Traction &amp; market</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <Row label="Traction" value={<span className="sm:max-w-md">{startup.traction}</span>} />
          <Row
            label="Competitors"
            value={
              <span className="flex flex-wrap justify-end gap-1.5">
                {startup.competitors.map((c) => (
                  <span key={c} className="rounded-md bg-paper px-2 py-0.5 text-xs text-ink/70">
                    {c}
                  </span>
                ))}
              </span>
            }
          />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-lg tracking-tight">Team</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          {startup.founders.map((f) => (
            <Row key={f.name} label={f.role} value={f.name} />
          ))}
        </dl>
      </Card>

      <Card className="bg-paper/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mist">
            Anything changed? Tell Scout on WhatsApp and it updates your profile, matches,
            and outreach automatically.
          </p>
          <WhatsAppButton label="Update via Scout" className="shrink-0" />
        </div>
      </Card>
    </div>
  );
}
