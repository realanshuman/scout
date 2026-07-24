import type { Metadata } from 'next';
import { getDashboardData } from '@/lib/dashboard-data';
import { PageHeader, Card } from '@/components/dashboard/ui';
import { SignOutButton } from '@/components/dashboard/nav';

export const metadata: Metadata = { title: 'Settings · Scout' };

export default async function SettingsPage() {
  const { founder } = await getDashboardData();

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Manage your account and plan." />

      <Card>
        <h2 className="font-display text-lg tracking-tight">Account</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-mist">Name</dt>
            <dd className="text-[15px] font-medium">{founder.name}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-mist">Email</dt>
            <dd className="text-[15px] font-medium">{founder.email}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-mist">Password</dt>
            <dd>
              <button className="text-sm font-medium text-moss hover:underline">Change</button>
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg tracking-tight">Plan</h2>
            <p className="mt-1 text-sm text-mist">Pro report · one-time · paid</p>
          </div>
          <span className="rounded-full bg-signal/15 px-3 py-1 text-xs font-bold text-moss">
            Active
          </span>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mist">
          You have lifetime access to your investor report and the fundraising assistant.
          No subscription, nothing to renew.
        </p>
      </Card>

      <Card className="border-red-500/20">
        <h2 className="font-display text-lg tracking-tight text-red-600">Danger zone</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mist">
            Sign out of this device, or permanently delete your account and data.
          </p>
          <div className="flex items-center gap-3">
            <SignOutButton className="rounded-full border border-ink/12 px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/25" />
            <button className="rounded-full border border-red-500/30 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/5">
              Delete account
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
