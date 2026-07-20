import type { Metadata } from 'next';
import { ScoutMark } from '@/components/logo';
import { SiteNav, SiteFooter, WA_LINK, WhatsAppGlyph } from '@/components/site';

export const metadata: Metadata = {
  title: 'About · Scout',
  description: 'Why Scout exists: fundraising research should take minutes, not weeks.',
};

const beliefs = [
  {
    title: 'Focus beats volume',
    body: 'Fifty investors who genuinely fit will always outperform five thousand who might. The work is knowing which fifty.',
  },
  {
    title: 'Chat is the interface',
    body: 'Founders live in WhatsApp. No dashboards to learn, no logins, no seats. Just a conversation that remembers everything.',
  },
  {
    title: 'Show the why',
    body: 'Every match Scout suggests comes with the reason it fits. If we cannot explain a recommendation, we do not make it.',
  },
];

export default function About() {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">About</p>
        <h1 className="mt-3 font-display text-5xl leading-[1.08] tracking-tight sm:text-6xl">
          Fundraising research should take minutes, not weeks.
        </h1>

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
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {beliefs.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-ink/[0.06] bg-card p-5 shadow-soft"
            >
              <h2 className="text-[15px] font-semibold">{b.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{b.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start gap-6 rounded-[1.75rem] border border-ink/[0.06] bg-card p-7 shadow-soft sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-center gap-4">
            <ScoutMark className="h-11 w-11 shrink-0" />
            <div>
              <p className="font-semibold">Built by Anshuman</p>
              <p className="text-sm text-mist">
                Independent maker.{' '}
                <a href="mailto:hi@realanshuman.com" className="font-medium text-moss underline underline-offset-2">
                  hi@realanshuman.com
                </a>
              </p>
            </div>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper shadow-sm transition hover:-translate-y-px hover:opacity-90"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-gradient-to-b from-[#35de74] to-[#1fae54]">
              <WhatsAppGlyph className="h-3.5 w-3.5 text-white" />
            </span>
            Message Scout
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
