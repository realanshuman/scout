import type { Metadata } from 'next';
import { getDashboardData } from '@/lib/dashboard-data';
import { PageHeader, Card, FitBadge } from '@/components/dashboard/ui';

export const metadata: Metadata = { title: 'Investors · Scout' };

export default async function InvestorsPage() {
  const { investors, startup } = await getDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your investors"
        subtitle={`${investors.length} matched for ${startup.name}, ranked by fit. Each has a personalized draft ready.`}
      />

      {/* Filter row (visual) */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {['All', 'Saved', 'Has email', 'Seed', 'Series A'].map((f, i) => (
          <span
            key={f}
            className={`rounded-full border px-3 py-1.5 font-medium ${
              i === 0
                ? 'border-signal bg-signal/10 text-moss'
                : 'border-ink/12 text-mist'
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <div className="space-y-4">
        {investors.map((inv) => (
          <Card key={inv.firm}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-mist">#{inv.rank}</span>
                  <h2 className="truncate text-lg font-semibold tracking-[-0.01em]">{inv.firm}</h2>
                  {inv.saved && (
                    <span className="rounded-md bg-signal/12 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-moss">
                      Saved
                    </span>
                  )}
                </div>
                {inv.partner && <p className="text-sm text-mist">{inv.partner} · Partner</p>}
              </div>
              <FitBadge fit={inv.fit} />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {[inv.stages, inv.check, inv.sectors].map((t) => (
                <span key={t} className="rounded-lg bg-paper px-2.5 py-1 text-xs font-medium text-ink/70">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-ink/[0.06] bg-paper/60 p-3.5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-moss">Why matched</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink/80">{inv.why}</p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist">
                {inv.email ? <span>{inv.email}</span> : <span className="italic">Email not public</span>}
                {inv.linkedin && (
                  <>
                    <span className="text-ink/20">·</span>
                    <span>linkedin.com/{inv.linkedin}</span>
                  </>
                )}
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/25">
                View draft: <span className="text-mist">“{inv.outreachSubject}”</span>
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
