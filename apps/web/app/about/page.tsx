import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo, ScoutMark } from '@/components/logo';

export const metadata: Metadata = {
  title: 'About · Scout',
  description:
    'Why Scout exists: fundraising research should take minutes, not weeks.',
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

export default function About() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <Link href="/" className="inline-block">
        <Logo />
      </Link>

      <div className="mt-12">
        <ScoutMark className="h-12 w-12" />
        <h1 className="mt-6 font-display text-5xl tracking-tight sm:text-6xl">
          Fundraising research should take minutes, not weeks.
        </h1>
      </div>

      <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-ink/80">
        <p>
          Every founder goes through the same ritual. Scrape a list of thousands of
          funds. Guess who is actually writing cheques. Send the same cold email to
          everyone. Hear nothing back.
        </p>
        <p>
          The problem was never effort. It was that the real work, knowing which fifty
          investors out of five thousand are genuinely right for your company and why,
          used to require an analyst you could not afford.
        </p>
        <p>
          Scout is that analyst. It interviews you on WhatsApp like a sharp associate
          would, researches your company and market, matches you against a curated
          investor base, and writes outreach that mentions the things each investor
          actually cares about. You review, you send, you take the meetings.
        </p>
        <p>
          No dashboards to learn, no logins, no seats. Just a conversation in the app
          you already use every day.
        </p>
      </div>

      <div className="mt-10 rounded-3xl border border-ink/[0.06] bg-card p-6 shadow-soft sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-mist">
          Who&apos;s behind it
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-ink/80">
          Scout is built by{' '}
          <a
            href="https://realanshuman.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-moss underline"
          >
            Anshuman
          </a>
          , an independent maker. Questions, feedback, or investor-data corrections are
          always welcome at{' '}
          <a href="mailto:hi@realanshuman.com" className="font-medium text-moss underline">
            hi@realanshuman.com
          </a>
          .
        </p>
      </div>

      <div className="mt-10">
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-signal px-6 py-3 text-sm font-semibold text-night shadow-soft transition hover:brightness-105"
        >
          Message Scout
        </a>
      </div>

      <div className="mt-12 border-t border-ink/[0.06] pt-6 text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
