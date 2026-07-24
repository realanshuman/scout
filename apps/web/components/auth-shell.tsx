import Link from 'next/link';
import { Logo, ScoutMark } from '@/components/logo';
import { AuthForm } from '@/components/auth-form';

/**
 * Split-screen sign-in layout. On large screens: a dark green brand panel
 * beside the form. On tablet and phone it collapses to a single centered
 * column with the logo up top. Public sign-up is disabled, so this is
 * sign-in only.
 */
export function AuthShell() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden bg-[#071310] p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/3 opacity-70 [background:radial-gradient(ellipse_at_30%_-10%,rgb(34_197_94/0.28),transparent_60%)]" />
        <div className="relative">
          <Link href="/">
            <Logo invert />
          </Link>
        </div>
        <div className="relative mt-auto max-w-md">
          <h2 className="font-display text-4xl leading-tight tracking-tight xl:text-5xl">
            Your fundraising, all in one place.
          </h2>
          <p className="mt-4 text-white/60">
            Sign in to see your matched investors, manage the profile Scout built for you,
            and pick up the conversation any time.
          </p>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10">
                  <ScoutMark className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Northbeam Ventures</p>
                  <p className="text-xs text-white/50">Sarah Lindqvist · Partner</p>
                </div>
              </div>
              <span className="rounded-full bg-signal/20 px-2.5 py-1 text-xs font-bold text-signal">
                94% fit
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex flex-col bg-paper px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <h1 className="font-display text-3xl tracking-tight sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-mist">Sign in to your Scout dashboard.</p>
          <div className="mt-8">
            <AuthForm />
          </div>
        </div>
        <p className="mx-auto w-full max-w-sm text-center text-xs text-mist sm:text-left">
          By continuing you agree to Scout&apos;s{' '}
          <Link href="/terms" className="underline hover:text-ink">Terms</Link> and{' '}
          <Link href="/privacy" className="underline hover:text-ink">Privacy</Link>.
        </p>
      </main>
    </div>
  );
}
