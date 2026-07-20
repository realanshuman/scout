import type { Metadata } from 'next';
import { SiteNav, SiteFooter, WA_LINK, WhatsAppGlyph } from '@/components/site';

export const metadata: Metadata = {
  title: 'Contact · Scout',
  description: 'Reach the person behind Scout, or just message Scout on WhatsApp.',
};

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7.5 8 6 8-6" />
    </svg>
  );
}

function WrenchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 6.5a4 4 0 0 0-5.7 4.6L3 17l-.5 3.5L6 20l5.9-5.8a4 4 0 0 0 4.6-5.7l-2.6 2.6-2.5-.5-.5-2.5 2.6-2.6Z" />
    </svg>
  );
}

const channels = [
  {
    icon: WhatsAppGlyph,
    iconBg: 'bg-gradient-to-b from-[#35de74] to-[#1fae54] text-white',
    title: 'Talk to Scout',
    body: 'The product is the fastest way in. Say hi and the interview starts.',
    action: 'Open WhatsApp',
    href: WA_LINK,
    external: true,
  },
  {
    icon: MailIcon,
    iconBg: 'bg-signal/15 text-moss',
    title: 'Email a human',
    body: 'Questions, feedback, partnerships, or press. Replies come from a person.',
    action: 'hi@realanshuman.com',
    href: 'mailto:hi@realanshuman.com',
    external: false,
  },
  {
    icon: WrenchIcon,
    iconBg: 'bg-signal/15 text-moss',
    title: 'Fix our data',
    body: 'An investor detail wrong or out of date? Tell us and we will correct it.',
    action: 'Report a correction',
    href: 'mailto:hi@realanshuman.com?subject=Investor%20data%20correction',
    external: false,
  },
];

export default function Contact() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Contact</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">Say hello.</h1>
        <p className="mt-4 max-w-md text-mist">
          Scout is small and independent, which means messages actually get read.
        </p>

        <div className="mt-10 space-y-4">
          {channels.map((c) => (
            <a
              key={c.title}
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group flex items-center gap-5 rounded-[1.5rem] border border-ink/[0.06] bg-card p-6 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-7"
            >
              <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${c.iconBg}`}>
                <c.icon className="h-6 w-6" />
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold tracking-[-0.01em]">{c.title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-mist">{c.body}</span>
                <span className="mt-1.5 block text-sm font-medium text-moss">
                  {c.action} <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </span>
            </a>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
