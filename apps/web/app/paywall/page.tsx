import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { SignOutButton } from '@/components/dashboard/nav';
import { PaywallCTA } from '@/components/paywall-cta';
import { getSessionUser } from '@/lib/session';
import { hasActiveSubscription } from '@/lib/subscription';
import { hasDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Unlock Scout',
  description: 'Unlock your full investor report and fundraising assistant.',
};

const BENEFITS = [
  {
    title: '50+ investors matched to you',
    body: 'A ranked shortlist of funds and angels that actually fit your stage, sector, geography and traction, not a generic list.',
  },
  {
    title: 'A personalized outreach draft for each',
    body: 'Every match comes with a ready-to-send intro written around your startup and that investor’s thesis.',
  },
  {
    title: 'Why each investor fits',
    body: 'Clear reasoning for every match: recent deals, focus areas and the partner most likely to care.',
  },
  {
    title: 'An assistant that keeps working',
    body: 'Message Scout on WhatsApp any time to rewrite emails, add investors, prep for calls or update your profile.',
  },
];

export default async function PaywallPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect('/signin');
  if (hasDatabase && (await hasActiveSubscription(user.id))) redirect('/dashboard');

  const { status } = await searchParams;
  const pending = status === 'pending';

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/">
          <Logo />
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <SignOutButton className="text-sm text-mist transition hover:text-ink" />
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-5 pb-20 pt-6 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:pt-14">
        {/* Left: the pitch */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-card px-3 py-1 text-xs font-semibold text-mist">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            One payment · lifetime access
          </span>
          <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Your investor shortlist is ready, {user.name?.split(' ')[0] || 'founder'}.
          </h1>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-mist">
            Scout has researched your startup and matched you with the investors most likely to
            fund you. Unlock the full report to see every match, why they fit, and how to reach them.
          </p>

          <ul className="mt-8 space-y-4">
            {BENEFITS.map((b) => (
              <li key={b.title} className="flex gap-3.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/15 text-moss">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold">{b.title}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-mist">{b.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: the price card */}
        <div className="lg:pt-2">
          <div className="sticky top-8 overflow-hidden rounded-3xl border border-ink/10 bg-card shadow-soft">
            <div className="relative overflow-hidden bg-[#071310] px-7 py-8 text-white">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70 [background:radial-gradient(ellipse_at_30%_-20%,rgb(34_197_94/0.3),transparent_60%)]" />
              <div className="relative">
                <p className="text-sm font-medium text-white/60">Full investor report</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="font-display text-5xl tracking-tight">₹999</span>
                  <span className="text-white/50">/ $29 one-time</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  No subscription. Pay once, keep access forever.
                </p>
              </div>
            </div>

            <div className="p-7">
              <ul className="space-y-2.5 text-sm">
                {[
                  'Every matched investor, ranked by fit',
                  'Personalized outreach for each',
                  'Ongoing WhatsApp assistant',
                  'Lifetime access to your dashboard',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-ink/80">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-moss" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <PaywallCTA pending={pending} />
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-mist">
                Secure checkout by Dodo Payments. GST invoice included.
                <br />
                Signed in as {user.email}.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
