import type { Metadata } from 'next';
import { formatUsd } from '@/lib/dashboard-data';
import { loadDashboard } from '@/lib/load-dashboard';
import { PageHeader, Card, WhatsAppButton } from '@/components/dashboard/ui';
import { EditProfileButton } from '@/components/dashboard/profile-editor';

export const metadata: Metadata = { title: 'Profile · Scout' };

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <dt className="text-sm text-mist">{label}</dt>
      <dd className="text-[15px] font-medium sm:text-right">{value}</dd>
    </div>
  );
}

const dash = (v: React.ReactNode) => v || <span className="text-mist">—</span>;

export default async function ProfilePage() {
  const { data } = await loadDashboard();
  const startup = data?.startup ?? {
    name: '', website: '', oneLiner: '', industry: '', stage: '', country: '',
    raiseUsd: 0, mrrUsd: 0, traction: '', businessModel: '', competitors: [], founders: [],
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Startup profile"
        subtitle="Scout built this from your conversation. It's what your matches and outreach are based on."
        action={
          <div className="hidden items-center gap-2 sm:flex">
            <EditProfileButton
              profile={startup}
              label="Edit profile"
              className="inline-flex h-11 items-center rounded-full border border-ink/12 bg-card px-5 text-[15px] font-semibold text-ink transition hover:border-ink/25"
            />
          </div>
        }
      />

      {/* Mobile edit button */}
      <div className="sm:hidden">
        <EditProfileButton
          profile={startup}
          label="Edit profile"
          className="inline-flex h-11 w-full items-center justify-center rounded-full border border-ink/12 bg-card px-5 text-[15px] font-semibold text-ink"
        />
      </div>

      <Card>
        <h2 className="font-display text-lg tracking-tight">Company</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <Row label="Name" value={dash(startup.name)} />
          <Row label="One-liner" value={dash(startup.oneLiner)} />
          <Row label="Website" value={dash(startup.website)} />
          <Row label="Industry" value={dash(startup.industry)} />
          <Row label="Location" value={dash(startup.country)} />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-lg tracking-tight">The raise</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <Row label="Stage" value={dash(startup.stage)} />
          <Row label="Raising" value={startup.raiseUsd ? formatUsd(startup.raiseUsd) : dash('')} />
          <Row label="MRR" value={startup.mrrUsd ? `${formatUsd(startup.mrrUsd)} / mo` : dash('')} />
          <Row label="Business model" value={dash(startup.businessModel)} />
        </dl>
      </Card>

      <Card>
        <h2 className="font-display text-lg tracking-tight">Traction &amp; market</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <Row label="Traction" value={<span className="sm:max-w-md">{dash(startup.traction)}</span>} />
          <Row
            label="Competitors"
            value={
              startup.competitors.length ? (
                <span className="flex flex-wrap justify-end gap-1.5">
                  {startup.competitors.map((c) => (
                    <span key={c} className="rounded-md bg-paper px-2 py-0.5 text-xs text-ink/70">
                      {c}
                    </span>
                  ))}
                </span>
              ) : (
                dash('')
              )
            }
          />
        </dl>
      </Card>

      {startup.founders.length > 0 && (
        <Card>
          <h2 className="font-display text-lg tracking-tight">Team</h2>
          <dl className="mt-2 divide-y divide-ink/[0.08]">
            {startup.founders.map((f) => (
              <Row key={f.name} label={f.role} value={f.name} />
            ))}
          </dl>
        </Card>
      )}

      <Card className="bg-paper/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mist">
            Anything changed? Edit above, or just tell Scout on WhatsApp and it updates your profile,
            matches, and outreach automatically.
          </p>
          <WhatsAppButton label="Update via Scout" className="shrink-0" />
        </div>
      </Card>
    </div>
  );
}
