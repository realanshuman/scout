import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

export const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.28.18-.53.06a6.65 6.65 0 0 1-1.95-1.2 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.5s.24-.28.37-.42a1.65 1.65 0 0 0 .24-.41.45.45 0 0 0 0-.43c-.06-.12-.55-1.32-.75-1.8s-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69 14.1 14.1 0 0 0 1.4.51 3.35 3.35 0 0 0 1.54.1 2.52 2.52 0 0 0 1.65-1.17 2 2 0 0 0 .14-1.16c-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}

export function SiteNav({ links = [] }: { links?: { label: string; href: string }[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-paper/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="/" aria-label="Scout home">
          <Logo />
        </a>
        {links.length > 0 && (
          <div className="hidden items-center gap-8 text-sm text-mist md:flex">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="transition hover:text-ink">
                {l.label}
              </a>
            ))}
          </div>
        )}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper shadow-sm transition duration-200 hover:-translate-y-px hover:opacity-90"
        >
          Message Scout
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-mist sm:flex-row">
        <a href="/" aria-label="Scout home">
          <Logo markClassName="h-6 w-6" wordClassName="text-lg" />
        </a>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <a href="/about" className="transition hover:text-ink">About</a>
          <a href="/contact" className="transition hover:text-ink">Contact</a>
          <a href="/privacy" className="transition hover:text-ink">Privacy</a>
          <a href="/terms" className="transition hover:text-ink">Terms</a>
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
  );
}
