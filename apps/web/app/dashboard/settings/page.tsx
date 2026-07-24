import type { Metadata } from 'next';
import { loadDashboard } from '@/lib/load-dashboard';
import { getSubscription } from '@/lib/subscription';
import { PageHeader, Card, Badge } from '@/components/dashboard/ui';
import { SignOutButton } from '@/components/dashboard/nav';
import { ChangePasswordButton, DeleteAccountButton } from '@/components/dashboard/settings-account';

export const metadata: Metadata = { title: 'Settings · Scout' };

export default async function SettingsPage() {
  const { user } = await loadDashboard();
  const sub = user.id !== 'preview' ? await getSubscription(user.id) : null;
  const active = sub?.status === 'active';

  return (
    <div className="space-y-8">
      <PageHeader title="Settings" subtitle="Manage your account and plan." />

      <Card>
        <h2 className="font-display text-lg tracking-tight">Account</h2>
        <dl className="mt-2 divide-y divide-ink/[0.08]">
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-mist">Name</dt>
            <dd className="text-[15px] font-medium">{user.name || '—'}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-mist">Email</dt>
            <dd className="text-[15px] font-medium">{user.email || '—'}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-sm text-mist">Password</dt>
            <dd>
              <ChangePasswordButton />
            </dd>
          </div>
        </dl>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg tracking-tight">Plan</h2>
            <p className="mt-1 text-sm text-mist">
              {active ? 'Pro report · one-time · paid' : 'No active plan'}
            </p>
          </div>
          {active ? <Badge tone="green">Active</Badge> : <Badge tone="amber">Inactive</Badge>}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mist">
          {active
            ? 'You have lifetime access to your investor report and the fundraising assistant. No subscription, nothing to renew.'
            : 'Unlock your full investor report to activate your dashboard.'}
        </p>
      </Card>

      <Card className="border-red-500/20">
        <h2 className="font-display text-lg tracking-tight text-red-600 dark:text-red-400">Danger zone</h2>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-mist">
            Sign out of this device, or permanently delete your account and data.
          </p>
          <div className="flex items-center gap-3">
            <SignOutButton className="rounded-full border border-ink/12 px-4 py-2 text-sm font-medium text-ink transition hover:border-ink/25" />
            <DeleteAccountButton />
          </div>
        </div>
      </Card>
    </div>
  );
}
