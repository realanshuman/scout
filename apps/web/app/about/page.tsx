import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { ScoutMark } from '@/components/logo';

export const metadata: Metadata = {
  title: 'About · Scout',
  description: 'Why Scout exists: fundraising research should take minutes, not weeks.',
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

const numbers = [
  { value: '15 min', label: 'One WhatsApp conversation. That is all Scout needs.' },
  { value: '50', label: 'Investors matched to your startup, each with a reason.' },
  { value: '1', label: 'Personal email drafted per investor, ready to review and send.' },
];

export default function About() {
  return (
    <PageShell crumb="About">
      <ScoutMark className="h-12 w-12" />
      <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
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

      {/* What that means, in numbers */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {numbers.map((n) => (
          <div key={n.value} className="rounded-3xl border border-ink/[0.08] bg-card p-5 sm:p-6">
            <p className="font-display text-4xl tracking-tight text-moss">{n.value}</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">{n.label}</p>
          </div>
        ))}
      </div>

      {/* How we think about it */}
      <div className="mt-10 space-y-6 text-[16px] leading-relaxed text-ink/80">
        <h2 className="font-display text-2xl tracking-tight text-ink sm:text-3xl">
          What we believe
        </h2>
        <p>
          <strong className="text-ink">Fifty right beats five thousand maybe.</strong>{' '}
          A good raise is built on a short list of investors who already believe in
          your kind of company. Scout exists to find that list.
        </p>
        <p>
          <strong className="text-ink">No new apps to learn.</strong> Founders live on
          WhatsApp, so Scout does too. No dashboards to master, no logins to start, no
          seats to buy. Just a conversation in the app you already use every day.
        </p>
        <p>
          <strong className="text-ink">You stay in control.</strong> Scout researches
          and drafts. You review every email and send it yourself. No mass blasts sent
          in your name, ever.
        </p>
      </div>

      {/* Who's behind it */}
      <div className="mt-10 rounded-3xl border border-ink/[0.08] bg-card p-6 sm:p-7">
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
        <p className="mt-2.5 text-sm text-mist">Free to start. Top-3 preview included.</p>
      </div>
    </PageShell>
  );
}
