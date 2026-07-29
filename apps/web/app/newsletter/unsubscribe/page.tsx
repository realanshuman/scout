import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/page-shell';
import { unsubscribeByKey } from '@/lib/newsletter';
import { hasDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Unsubscribe · The Sunday Ten',
  robots: { index: false },
};

/**
 * One-click unsubscribe. The link in every issue carries ?key=<token>, so this
 * page does the work on load: no confirm step, no survey, as promised.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  let done = false;
  if (key && hasDatabase) {
    done = await unsubscribeByKey(key).catch(() => false);
  }

  return (
    <PageShell crumb="Unsubscribe">
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
        {done ? 'You’re unsubscribed.' : 'Unsubscribe'}
      </h1>

      <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink/80">
        {done ? (
          <>
            <p>
              Done, no more Sunday emails. No hard feelings and no follow-up asking why.
            </p>
            <p>
              If it was a mistake, you can{' '}
              <Link href="/newsletter" className="font-medium text-moss underline">
                join again here
              </Link>{' '}
              any time.
            </p>
          </>
        ) : (
          <>
            <p>
              This link looks expired or already used, so there’s nothing left to do. If
              you’re still receiving issues, use the unsubscribe link at the bottom of the
              most recent one, or email{' '}
              <a href="mailto:hi@realanshuman.com" className="font-medium text-moss underline">
                hi@realanshuman.com
              </a>{' '}
              and it gets handled the same day.
            </p>
          </>
        )}
      </div>
    </PageShell>
  );
}
