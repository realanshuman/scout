import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

/**
 * Shared layout for standalone pages (About, Contact, Terms, Privacy).
 * Header with the logo and a Message Scout CTA, a breadcrumb ABOVE the
 * content, and the site footer. Keeps every secondary page consistent
 * with the landing page's brand.
 */
export function PageShell({
  crumb,
  children,
  wide = false,
}: {
  crumb: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="border-b border-ink/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="hidden text-sm font-medium text-mist transition hover:text-ink sm:block"
            >
              Sign in
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:opacity-90"
            >
              Message Scout
            </a>
          </div>
        </div>
      </header>

      {/* Breadcrumb, above the content */}
      <nav aria-label="Breadcrumb" className={`mx-auto w-full px-5 pt-6 sm:px-8 sm:pt-8 ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}>
        <ol className="flex items-center gap-2 text-sm text-mist">
          <li>
            <Link href="/" className="transition hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-ink/25">
            /
          </li>
          <li aria-current="page" className="font-medium text-ink">
            {crumb}
          </li>
        </ol>
      </nav>

      {/* Content */}
      <main className={`mx-auto w-full flex-1 px-5 pb-16 pt-6 sm:px-8 sm:pt-8 ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}>
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-mist sm:flex-row sm:px-8">
          <Logo markClassName="h-6 w-6" wordClassName="text-lg" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/about" className="transition hover:text-ink">About</Link>
            <Link href="/contact" className="transition hover:text-ink">Contact</Link>
            <Link href="/privacy" className="transition hover:text-ink">Privacy</Link>
            <Link href="/terms" className="transition hover:text-ink">Terms</Link>
            <a
              href="https://realanshuman.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-ink"
            >
              Built by Anshuman
            </a>
            <ThemeToggle />
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
