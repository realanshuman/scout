import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { SidebarNav, MobileNav, SignOutButton } from '@/components/dashboard/nav';
import { ToastProvider } from '@/components/ui/toast';
import { getSessionUser } from '@/lib/session';
import { hasActiveSubscription } from '@/lib/subscription';
import { hasDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Gate every dashboard route: signed in + active subscription. When no
  // database is configured (local preview) the dashboard renders so it's
  // viewable, with whatever data exists.
  let founder = { name: 'Preview', email: '' };
  if (hasDatabase) {
    const user = await getSessionUser();
    if (!user) redirect('/signin');
    if (!(await hasActiveSubscription(user.id))) redirect('/paywall');
    founder = { name: user.name || 'Founder', email: user.email };
  }

  const initial = (founder.name || 'S').charAt(0).toUpperCase();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-paper">
        {/* Sidebar (tablet + desktop) */}
        <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-ink/[0.08] bg-card/40 p-4 md:flex lg:w-64">
          <Link href="/dashboard" className="px-2 py-2">
            <Logo />
          </Link>
          <div className="mt-6 flex-1">
            <SidebarNav />
          </div>
          <div className="border-t border-ink/[0.08] pt-4">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-signal/15 text-sm font-bold text-moss">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{founder.name}</p>
                <p className="truncate text-xs text-mist">{founder.email}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between px-2">
              <SignOutButton className="text-sm text-mist transition hover:text-ink" />
              <ThemeToggle />
            </div>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink/[0.08] bg-paper/90 px-5 py-3 backdrop-blur md:hidden">
          <Link href="/dashboard">
            <Logo markClassName="h-7 w-7" wordClassName="text-lg" />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <SignOutButton className="text-sm text-mist" />
          </div>
        </header>

        {/* Content */}
        <div className="md:pl-60 lg:pl-64">
          <main className="mx-auto max-w-5xl px-5 pb-24 pt-6 sm:px-8 sm:pt-10 md:pb-12">
            {children}
          </main>
        </div>

        <MobileNav />
      </div>
    </ToastProvider>
  );
}
