import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { NewsletterForm } from '@/components/newsletter-form';
import { NewsletterIssueCard } from '@/components/newsletter-issue-card';
import { WA_LINK } from '@/lib/whatsapp-link';

export const metadata: Metadata = {
  title: 'The Sunday Ten · Free investor newsletter from Scout',
  description:
    'Ten investors in your inbox every Sunday: their thesis, recent cheques, cheque size, and how to reach them. Free for founders, from the builder of Scout.',
  openGraph: {
    title: 'The Sunday Ten · Free investor newsletter from Scout',
    description:
      'Ten investors, every Sunday. Thesis, recent cheques, cheque size, and how to reach them. Free for founders.',
  },
};

// ── the sample issue ──────────────────────────────────────────────────

const SAMPLE = [
  {
    n: '01',
    firm: 'Riverbend Capital',
    partner: 'Neha Shah',
    where: 'Bengaluru · invests across India + SEA',
    stage: 'Pre-seed to Seed',
    cheque: '₹2Cr – ₹12Cr (about $250K – $1.5M)',
    thesis:
      'Payments and lending infrastructure. She likes founders who have already shipped to real merchants, not just a pilot.',
    recent: 'Led PayNest ($1.2M, Mar), followed on Kirana OS ($800K, Jan)',
    reach: 'riverbend.vc · in/nehashah',
  },
  {
    n: '02',
    firm: 'Foundry 9',
    partner: 'Tom Alvarez',
    where: 'Remote-first · US and Europe',
    stage: 'Pre-seed',
    cheque: '$150K – $1M',
    thesis:
      'First-cheque fund for vertical SaaS with early revenue. Writes fast, often the first institutional money in.',
    recent: 'Backed Loom Ops ($600K, Apr), Stacker HQ ($400K, Feb)',
    reach: 'foundry9.com · tom@foundry9.com',
  },
  {
    n: '03',
    firm: 'Meridian Angels',
    partner: 'Operator syndicate',
    where: 'Global · 40+ operator angels',
    stage: 'Pre-seed',
    cheque: '$25K – $150K',
    thesis:
      'Ex-operators who back tools they would have used in their old jobs. Useful when you want customers as well as capital.',
    recent: '6 cheques last quarter, mostly ops and fintech tooling',
    reach: 'meridianangels.com · deals@meridianangels.com',
  },
];

const INCLUDED = [
  {
    title: 'Who they actually are',
    body: 'The fund, the specific partner who writes the cheque, and where they invest. Not a generic firm page.',
  },
  {
    title: 'Their thesis, in plain words',
    body: 'What they genuinely back and what makes them pass, written the way a friend would explain it over coffee.',
  },
  {
    title: 'Recent cheques, with dates',
    body: 'Proof they are actively investing right now, not a fund that quietly stopped deploying eighteen months ago.',
  },
  {
    title: 'Stage and cheque size',
    body: 'So you know in five seconds whether you are too early, too late, or exactly right for them.',
  },
  {
    title: 'How to reach them',
    body: 'Website and LinkedIn always. A direct email whenever it is genuinely public. We never invent an address.',
  },
];

const FAQ = [
  {
    q: 'Is it really free?',
    a: 'Yes, and it stays free. Scout makes money when founders buy a full investor report matched to their startup. The newsletter is the part we give away, because a list of active investors is useful to every founder whether or not they ever pay us.',
  },
  {
    q: 'How do you pick the ten?',
    a: 'Every week Scout researches funds and angels who have actually deployed capital recently, then we keep the ten with the clearest thesis and the strongest signal that they are writing cheques now. We rotate stages and geographies so it does not become the same ten Silicon Valley names every week.',
  },
  {
    q: 'What if I am not raising yet?',
    a: 'Read it anyway. Founders who know the landscape before they need it run much better processes. Most people who eventually raise well started paying attention months early.',
  },
  {
    q: 'Will you email me anything else?',
    a: 'No. One email, Sunday, ten investors. No drip sequences, no upsell blasts. If you want the full matched report you will come find it yourself.',
  },
  {
    q: 'How do I unsubscribe?',
    a: 'One click at the bottom of any issue. No dark patterns, no "are you sure" page, no survey.',
  },
];

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/">
            <Logo invert />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden text-sm font-medium text-white/70 transition hover:text-white sm:block"
            >
              What is Scout?
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/[0.18]"
            >
              Message Scout
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────────────────
            Two deliberately different layouts. On phones the copy stays
            centred and the email mock sits underneath, bleeding off the
            bottom edge. On desktop it becomes a split: copy left, the
            same email floating on the right with detail cards behind it. */}
        <section className="relative overflow-hidden bg-[#071310] pt-24 text-white sm:pt-32 lg:pb-28 lg:pt-40">
          {/* aurora */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[80%] opacity-70 [background:radial-gradient(ellipse_at_25%_-10%,rgb(34_197_94/0.24),transparent_60%)]" />
          {/* dot grid */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background-image:radial-gradient(rgb(255_255_255/0.5)_1px,transparent_1px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_50%_0%,black,transparent_70%)]" />

          <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
            <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:items-center lg:gap-16 xl:gap-20">
              {/* Copy */}
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/80 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  Free newsletter · every Sunday
                </span>

                <h1 className="mt-5 font-display text-[2.6rem] leading-[1.03] tracking-tight sm:mt-6 sm:text-6xl lg:text-[4.25rem]">
                  Ten investors in your inbox. Every Sunday.
                </h1>

                <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-white/65 sm:mt-6 sm:text-lg lg:mx-0">
                  Real funds and angels writing cheques right now. Their thesis, recent
                  deals, cheque size, and how to reach them. Free for founders.
                </p>

                <div className="mx-auto mt-7 max-w-xl sm:mt-9 lg:mx-0">
                  <NewsletterForm tone="dark" compact />
                </div>

                {/* Where the ten come from. Coverage, not a subscriber claim. */}
                <p className="mt-6 text-[13px] text-white/45 sm:hidden">
                  Investors across India, the US, Southeast Asia and Europe.
                </p>
                <div className="mt-7 hidden flex-wrap items-center justify-center gap-x-2.5 gap-y-2 text-[13px] text-white/45 sm:flex lg:justify-start">
                  <span className="font-medium text-white/60">Investors across</span>
                  {['India', 'United States', 'Southeast Asia', 'Europe'].map((place) => (
                    <span
                      key={place}
                      className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1"
                    >
                      {place}
                    </span>
                  ))}
                </div>
              </div>

              {/* Desktop mock: tilted, with two detail cards tucked behind
                  its edges so nothing in the email itself gets covered. */}
              <div className="relative mt-16 hidden lg:mt-0 lg:block">
                <div className="[perspective:1600px]">
                  <div className="relative [transform:rotateX(6deg)_rotateY(-13deg)_rotate(1.5deg)]">
                    {/* peeks out from the left edge */}
                    <div className="absolute -left-32 top-14 z-0 w-[186px] -rotate-6 rounded-xl border border-white/10 bg-[#0f1c18]/95 p-3.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        Cheque size
                      </p>
                      <p className="mt-1.5 font-display text-xl text-signal">₹2Cr – ₹12Cr</p>
                      <p className="mt-1 text-[11px] text-white/45">Pre-seed · Bengaluru</p>
                    </div>

                    {/* hangs off the bottom-right corner */}
                    <div className="absolute -bottom-14 right-4 z-20 w-[206px] rotate-[5deg] rounded-xl border border-white/10 bg-[#0f1c18]/95 p-3.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)] backdrop-blur">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
                        How to reach them
                      </p>
                      <p className="mt-1.5 text-[13px] font-medium text-white/90">foundry9.com</p>
                      <p className="text-[13px] text-signal">tom@foundry9.com</p>
                    </div>

                    <div className="relative z-10">
                      <NewsletterIssueCard />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone mock: sits under the copy and runs off the bottom edge */}
            <div className="mx-auto mt-10 -mb-16 max-w-sm [perspective:1200px] sm:mt-14 sm:max-w-lg lg:hidden">
              <div className="[transform:rotateX(7deg)]">
                <NewsletterIssueCard rows={2} />
              </div>
            </div>
          </div>

          {/* fades the cropped phone mock into the section edge */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 [background:linear-gradient(to_bottom,transparent,#071310_85%)] lg:hidden" />
        </section>

        {/* Sample issue */}
        <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="text-center">
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              This is what Sunday looks like
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-mist">
              No fluff, no market commentary, no “thoughts on the funding environment”.
              Just ten investors you can act on before Monday.
            </p>
          </div>

          {/* The issue mock */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-ink/10 bg-card shadow-soft">
            <div className="border-b border-ink/[0.08] bg-paper/60 px-6 py-5 sm:px-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Logo markClassName="h-7 w-7" wordClassName="text-lg" />
                  <span className="hidden text-sm text-mist sm:inline">· The Sunday Ten</span>
                </div>
                <span className="text-xs font-medium text-mist">Issue 14</span>
              </div>
              <p className="mt-3 font-display text-2xl tracking-tight">
                Ten investors backing fintech and vertical SaaS this month
              </p>
            </div>

            <div className="divide-y divide-ink/[0.07]">
              {SAMPLE.map((inv) => (
                <article key={inv.firm} className="px-6 py-6 sm:px-8">
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 font-display text-lg text-mist/70">{inv.n}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                        <h3 className="text-lg font-semibold tracking-[-0.01em]">{inv.firm}</h3>
                        <span className="text-sm text-mist">{inv.partner}</span>
                      </div>
                      <p className="mt-0.5 text-sm text-mist">{inv.where}</p>

                      <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{inv.thesis}</p>

                      <dl className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                            Stage
                          </dt>
                          <dd className="mt-0.5 text-ink/85">{inv.stage}</dd>
                        </div>
                        <div>
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                            Cheque size
                          </dt>
                          <dd className="mt-0.5 text-ink/85">{inv.cheque}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                            Recent cheques
                          </dt>
                          <dd className="mt-0.5 text-ink/85">{inv.recent}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                            How to reach them
                          </dt>
                          <dd className="mt-0.5 text-moss">{inv.reach}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="border-t border-ink/[0.08] bg-paper/60 px-6 py-5 text-center sm:px-8">
              <p className="text-sm text-mist">
                …and seven more in the full issue, every Sunday morning.
              </p>
              <p className="mt-1 text-xs text-mist/70">
                Example layout. Real issues carry real funds, researched that week.
              </p>
            </div>
          </div>
        </section>

        {/* What's in every profile */}
        <section className="border-y border-ink/[0.06] bg-card/40">
          <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">
                Every profile
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
                Enough to decide, and to act
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-mist">
                A name alone is useless. Each of the ten comes with everything you need to
                judge fit and write a real email.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {INCLUDED.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-ink/[0.08] bg-card p-6"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-signal/12 text-sm font-bold text-moss">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 font-semibold tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-mist">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* From the builder */}
        <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="rounded-3xl border border-ink/[0.08] bg-card p-7 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">
              From the builder of Scout
            </p>
            <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
              Why I give this away
            </h2>
            <div className="mt-6 space-y-5 text-[16px] leading-relaxed text-ink/80">
              <p>
                I build Scout, an AI fundraising associate that interviews founders on
                WhatsApp and hands them a matched investor list with a personal email for
                each one. That part is a paid product, and it should be.
              </p>
              <p>
                But the research engine behind it runs every week regardless. It reads
                funding announcements, fund sites, and partner posts to work out who is
                actually deploying capital right now. Keeping all of that locked behind a
                paywall felt wrong when the simple version helps any founder, including the
                ones who will never buy anything from me.
              </p>
              <p>
                So every Sunday I send out ten of them. No commentary, no growth tricks,
                no “7 lessons from my failed startup”. Just ten investors, what they back,
                and how to reach them. If it ever stops being useful, unsubscribe in one
                click and we are still friends.
              </p>
            </div>
            <div className="mt-7 flex items-center gap-3 border-t border-ink/[0.08] pt-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-signal/15 font-display text-lg text-moss">
                A
              </span>
              <div>
                <p className="font-semibold">Anshuman</p>
                <p className="text-sm text-mist">
                  Building Scout ·{' '}
                  <a
                    href="https://realanshuman.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-moss hover:underline"
                  >
                    realanshuman.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-5 pb-20 sm:px-8 sm:pb-24">
          <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl">
            Fair questions
          </h2>
          <div className="mt-10 border-t border-ink/10 sm:mt-12">
            {FAQ.map((f) => (
              <details key={f.q} className="group border-b border-ink/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] font-medium sm:text-base [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="shrink-0 text-xl font-light text-mist transition duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0c1512] px-6 py-14 text-center ring-1 ring-white/10 sm:px-12 sm:py-20">
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_50%_-10%,#22c55e,transparent_55%)]" />
            <div className="relative mx-auto max-w-xl">
              <h2 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
                Ten investors. This Sunday.
              </h2>
              <p className="mt-4 text-white/60">
                Join founders who would rather know who is writing cheques than guess.
              </p>
              <div className="mt-8">
                <NewsletterForm tone="dark" compact />
              </div>
              <p className="mt-8 text-sm text-white/45">
                Raising right now?{' '}
                <Link href="/" className="text-signal hover:underline">
                  Scout can match investors to your startup directly
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-mist sm:flex-row sm:px-8">
          <Logo markClassName="h-6 w-6" wordClassName="text-lg" />
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <Link href="/newsletter" className="transition hover:text-ink">Newsletter</Link>
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
