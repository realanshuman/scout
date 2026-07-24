'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { SVGProps } from 'react';
import { signOut } from '@/lib/auth-client';

function I(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props} />
  );
}
const IconOverview = (p: SVGProps<SVGSVGElement>) => (
  <I {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></I>
);
const IconInvestors = (p: SVGProps<SVGSVGElement>) => (
  <I {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4" /><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" /></I>
);
const IconProfile = (p: SVGProps<SVGSVGElement>) => (
  <I {...p}><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" /></I>
);
const IconAgent = (p: SVGProps<SVGSVGElement>) => (
  <I {...p}><path d="M21 11.5a8.4 8.4 0 0 1-12.1 7.5L4 20.5l1.6-4.6A8.4 8.4 0 1 1 21 11.5Z" /><path d="M8.5 11h7M8.5 14h4" /></I>
);
const IconSettings = (p: SVGProps<SVGSVGElement>) => (
  <I {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4.5a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6V4.5a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 2.82 1.17l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 11H21a2 2 0 0 1 0 4h-.09Z" /></I>
);

export const NAV = [
  { href: '/dashboard', label: 'Overview', icon: IconOverview },
  { href: '/dashboard/investors', label: 'Investors', icon: IconInvestors },
  { href: '/dashboard/profile', label: 'Profile', icon: IconProfile },
  { href: '/dashboard/agent', label: 'Agent', icon: IconAgent },
  { href: '/dashboard/settings', label: 'Settings', icon: IconSettings },
];

function isActive(pathname: string, href: string) {
  return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
}

/** Vertical nav for the desktop / tablet sidebar. */
export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-1">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active ? 'bg-signal/12 text-moss' : 'text-mist hover:bg-ink/[0.04] hover:text-ink'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

/** Bottom tab bar for phones. */
export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/[0.08] bg-paper/95 backdrop-blur md:hidden">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
              active ? 'text-moss' : 'text-mist'
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SignOutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.push('/signin');
        router.refresh();
      }}
      className={className}
    >
      Sign out
    </button>
  );
}
