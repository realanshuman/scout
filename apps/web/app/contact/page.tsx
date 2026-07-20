import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
  title: 'Contact · Scout',
  description: 'Reach the person behind Scout, or just message Scout on WhatsApp.',
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

const channels = [
  {
    title: 'Talk to Scout',
    body: 'The product is the fastest way in. Say hi and the interview starts.',
    action: 'Open WhatsApp',
    href: WA_LINK,
    external: true,
  },
  {
    title: 'Email a human',
    body: 'Questions, feedback, partnerships, or press. Replies come from a person.',
    action: 'hi@realanshuman.com',
    href: 'mailto:hi@realanshuman.com',
    external: false,
  },
  {
    title: 'Fix our data',
    body: 'An investor detail wrong or out of date? Tell us and we will correct it.',
    action: 'Report a correction',
    href: 'mailto:hi@realanshuman.com?subject=Investor%20data%20correction',
    external: false,
  },
];

export default function Contact() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <Link href="/" className="inline-block">
        <Logo />
      </Link>

      <h1 className="mt-12 font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
        Say hello.
      </h1>
      <p className="mt-4 max-w-md text-mist">
        Scout is small and independent, which means messages actually get read.
      </p>

      <div className="mt-10 space-y-4">
        {channels.map((c) => (
          <a
            key={c.title}
            href={c.href}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group block rounded-3xl border border-ink/[0.06] bg-card p-6 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold tracking-[-0.01em]">
                  {c.title}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{c.body}</p>
              </div>
              <span className="hidden shrink-0 text-sm font-medium text-moss sm:block">
                {c.action} →
              </span>
            </div>
            <span className="mt-3 block text-sm font-medium text-moss sm:hidden">
              {c.action} →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-12 border-t border-ink/[0.06] pt-6 text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
