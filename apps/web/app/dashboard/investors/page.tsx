import type { Metadata } from 'next';
import { loadDashboard } from '@/lib/load-dashboard';
import { PageHeader, EmptyState, WhatsAppButton } from '@/components/dashboard/ui';
import { InvestorList } from '@/components/dashboard/investor-list';

export const metadata: Metadata = { title: 'Investors · Scout' };

export default async function InvestorsPage() {
  const { data } = await loadDashboard();
  const investors = data?.investors ?? [];
  const startupName = data?.startup.name || 'your startup';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Your investors"
        subtitle={
          investors.length > 0
            ? `${investors.length} matched for ${startupName}, ranked by fit. Each has a personalized draft ready.`
            : 'Your matched investors will appear here.'
        }
      />

      {investors.length > 0 ? (
        <InvestorList investors={investors} />
      ) : (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="12" r="8.5" />
              <circle cx="12" cy="12" r="3.5" />
            </svg>
          }
          title="No matches yet"
          description={`Finish telling Scout about ${startupName} on WhatsApp. It will research the market and build your ranked investor list, usually within a few minutes.`}
          action={<WhatsAppButton label="Continue with Scout" />}
        />
      )}
    </div>
  );
}
