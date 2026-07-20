import { ScoutMark } from '@/components/logo';
import { SiteNav, SiteFooter, WhatsAppGlyph, WA_LINK } from '@/components/site';
import {
  BrandCrunchbase,
  BrandGitHub,
  BrandGlobe,
  BrandLinkedIn,
  BrandNews,
  BrandProductHunt,
  BrandX,
  BrandYC,
} from '@/components/brands';

// ── CTA ───────────────────────────────────────────────────────────────

function MessageCTA({
  label = 'Message Scout',
  caption = 'WhatsApp · free to start',
  light = false,
  className = '',
}: {
  label?: string;
  caption?: string | null;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-lg font-semibold shadow-lift ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.99] sm:w-auto ${
          light ? 'bg-white text-[#111614] ring-black/5' : 'bg-ink text-paper ring-white/15'
        }`}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-gradient-to-b from-[#35de74] to-[#1fae54]">
          <WhatsAppGlyph className="h-5 w-5 text-white" />
        </span>
        <span className="relative">{label}</span>
      </a>
      {caption ? <p className="mt-3 text-sm text-mist">{caption}</p> : null}
    </div>
  );
}

// ── step mockups ──────────────────────────────────────────────────────

function StepChat() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-ink/[0.06] bg-card p-3 text-left shadow-lift">
      <div className="flex items-center gap-2 border-b border-ink/[0.06] pb-2">
        <ScoutMark className="h-6 w-6" />
        <p className="text-xs font-semibold">Scout</p>
        <p className="ml-auto text-[10px] text-mist">online</p>
      </div>
      <div className="mt-2.5 space-y-1.5 text-[12px] leading-relaxed">
        <p className="w-fit max-w-[92%] rounded-xl rounded-tl-sm bg-paper px-2.5 py-1.5">
          Hey 👋 What are you building?
        </p>
        <p className="ml-auto w-fit max-w-[92%] rounded-xl rounded-tr-sm bg-bubble px-2.5 py-1.5 text-[#111614]">
          Loop, an AI copilot for warehouse ops. $18k MRR.
        </p>
        <p className="w-fit max-w-[92%] rounded-xl rounded-tl-sm bg-paper px-2.5 py-1.5">
          Solid traction. Who&apos;s the buyer, ops manager or floor lead?
        </p>
        <p className="ml-auto w-fit max-w-[92%] rounded-xl rounded-tr-sm bg-bubble px-2.5 py-1.5 text-[#111614]">
          Ops managers at mid-size 3PLs.
        </p>
      </div>
    </div>
  );
}

function StepMatches() {
  const rows = [
    { firm: 'Northbeam Ventures', note: 'led two logistics-AI seeds this year', fit: 94 },
    { firm: 'Latitude Labs', note: 'thesis: AI owning a full workflow', fit: 91 },
    { firm: 'Kite String Capital', note: 'backs revenue tooling at seed', fit: 88 },
  ];
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-ink/[0.06] bg-card p-3 text-left shadow-lift">
      <p className="border-b border-ink/[0.06] pb-2 text-xs font-semibold">
        58 investors found · top 3
      </p>
      <div className="mt-1 divide-y divide-ink/[0.06]">
        {rows.map((r, i) => (
          <div key={r.firm} className="flex items-center gap-2.5 py-2">
            <span className="text-[11px] font-semibold text-mist">{i + 1}</span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold">{r.firm}</p>
              <p className="truncate text-[11px] text-mist">{r.note}</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-signal/15 px-1.5 py-0.5 text-[10px] font-bold text-moss">
              {r.fit}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepEmail() {
  return (
    <div className="w-full max-w-[300px] rounded-2xl border border-ink/[0.06] bg-card p-3.5 text-left shadow-lift">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-mist">
        Draft · Sarah Lindqvist
      </p>
      <p className="mt-1.5 text-[12px] font-semibold">Subject: Cursor for warehouse ops</p>
      <div className="my-2 h-px bg-ink/[0.06]" />
      <p className="text-[12px] leading-relaxed text-ink/70">
        Hi Sarah, saw your seed into CodeLoom and your piece on agentic ops. We&apos;re
        building Loop: $18k MRR, growing 22% MoM. Worth 20 minutes?
      </p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-moss">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-signal/15">✓</span>
        LinkedIn DM included
      </div>
    </div>
  );
}

// ── content ───────────────────────────────────────────────────────────

const steps = [
  {
    n: '1',
    title: 'One honest conversation',
    body: 'Fifteen minutes on WhatsApp about your product, traction, and raise. Scout listens like a sharp associate and never asks the same thing twice.',
    mock: StepChat,
  },
  {
    n: '2',
    title: 'Deep research, ranked matches',
    body: 'Scout studies your company and market, then scores a curated investor base on stage, sector, geography, check size, and thesis. You see exactly why each name made the cut.',
    mock: StepMatches,
  },
  {
    n: '3',
    title: 'Outreach in your voice',
    body: 'Every investor gets a personal email and LinkedIn DM built from their real portfolio and your real numbers. You review, tweak if you like, and send.',
    mock: StepEmail,
  },
];

const platforms = [
  { name: 'Your website', icon: BrandGlobe },
  { name: 'LinkedIn', icon: BrandLinkedIn },
  { name: 'Crunchbase', icon: BrandCrunchbase },
  { name: 'X / Twitter', icon: BrandX },
  { name: 'Y Combinator', icon: BrandYC },
  { name: 'Product Hunt', icon: BrandProductHunt },
  { name: 'GitHub', icon: BrandGitHub },
  { name: 'Tech press', icon: BrandNews },
];

const faqs = [
  {
    q: 'How is this different from an investor database?',
    a: 'A database hands you 5,000 names and a search box. Scout hands you the 50 that fit your specific startup, each with a concrete reason and a ready-to-send email. It does the filtering and the writing, which is the part that actually takes weeks.',
  },
  {
    q: 'How long does the whole thing take?',
    a: 'About 15 minutes of chat, then 5 to 10 minutes while Scout researches. Your top-3 preview lands in under half an hour, and the full report follows the moment you unlock it.',
  },
  {
    q: 'Do I have to repeat myself?',
    a: 'Never. Scout remembers everything you tell it. After the report it becomes your ongoing fundraising assistant, with full context on your company, so you can pick up the conversation any time.',
  },
  {
    q: 'Where does the investor data come from?',
    a: 'A curated base of funds and angels with stage, sector, geography, check size, thesis, and recent investments: the signals that decide whether an intro is worth making.',
  },
  {
    q: 'Will investors know an AI wrote my outreach?',
    a: 'Each draft is built from your real numbers and the investor’s real thesis and portfolio, then you review and send it yourself. No mass blasts, no spray-and-pray.',
  },
  {
    q: 'What does it cost?',
    a: 'The interview, the research, and a preview of your top 3 matches are free. The full report, all 50 investors with contacts and personalized outreach, is a one-time ₹999 / $29.',
  },
];

// ── page ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <SiteNav
        links={[
          { label: 'How it works', href: '#how' },
          { label: 'Investors', href: '#investors' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'FAQ', href: '#faq' },
        ]}
      />

      <main>
        {/* Hero */}
        <section className="relative mx-auto max-w-4xl px-5 pb-20 pt-14 text-center sm:pb-28 sm:pt-20">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-60 [background:radial-gradient(ellipse_at_50%_-20%,rgb(34_197_94/0.14),transparent_60%)]" />
          <ScoutMark className="mx-auto h-14 w-14 animate-fade-up" />
          <h1 className="mt-6 animate-fade-up font-display text-5xl leading-[1.05] tracking-tight text-ink [animation-delay:60ms] sm:text-7xl">
            Meet Scout, your AI <span className="italic text-moss">fundraising associate</span>.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-mist [animation-delay:120ms] sm:text-xl">
            One chat on WhatsApp. Scout learns your startup, researches your market, and
            hands you the fifty investors most likely to say yes, with a personal email
            for each.
          </p>
          <div className="mt-10 animate-fade-up [animation-delay:180ms]">
            <MessageCTA />
          </div>
        </section>

        {/* How it works: zigzag timeline */}
        <section id="how" className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:py-24">
          <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl">
            How Scout works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-mist">
            One conversation in. A ranked, explained, written-for-you investor list out.
          </p>

          <div className="relative mt-14 sm:mt-20">
            {/* center spine on large screens */}
            <div className="absolute bottom-8 left-1/2 top-2 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-ink/15 to-transparent lg:block" />
            <div className="space-y-14 sm:space-y-20">
              {steps.map((step, i) => (
                <div
                  key={step.n}
                  className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-16"
                >
                  {/* spine dot */}
                  <span className="absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal ring-4 ring-paper lg:block" />
                  <div
                    className={`text-center lg:text-left ${i % 2 === 1 ? 'lg:order-2 lg:pl-4' : 'lg:pr-4'}`}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-card font-display text-lg shadow-sm">
                      {step.n}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold tracking-[-0.01em] sm:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-mist lg:mx-0">
                      {step.body}
                    </p>
                  </div>
                  <div
                    className={`flex justify-center ${i % 2 === 1 ? 'lg:order-1 lg:justify-end lg:pr-10' : 'lg:justify-start lg:pl-10'}`}
                  >
                    <step.mock />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="mx-auto mt-14 max-w-xl text-center text-sm text-mist sm:mt-20">
            And after the report, the same chat becomes your fundraising assistant.
            Rewrite an email, prep for a call, or ask what a term sheet clause means.
          </p>
        </section>

        {/* Investors / diligence */}
        <section
          id="investors"
          className="mx-auto max-w-5xl scroll-mt-24 border-t border-ink/[0.06] px-5 py-16 sm:py-24"
        >
          <h2 className="mx-auto max-w-2xl text-center font-display text-4xl tracking-tight sm:text-5xl">
            Your next 50 investors are already out there.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-mist">
            Scout does the diligence a good analyst would: it reads everywhere your
            startup and your investors leave a trace, then matches you with the funds
            most likely to write the cheque.
          </p>
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4">
            {platforms.map((p) => (
              <div
                key={p.name}
                className="flex items-center justify-center gap-2.5 rounded-2xl border border-ink/[0.06] bg-card px-3 py-4 text-mist shadow-soft transition duration-200 hover:-translate-y-0.5 hover:text-ink hover:shadow-lift"
              >
                <p.icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{p.name}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-mist">
            + honestly, anywhere your startup leaves a trace.
          </p>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="mx-auto max-w-6xl scroll-mt-24 border-t border-ink/[0.06] px-5 py-16 sm:py-24"
        >
          <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl">
            Start free. Pay once you&apos;ve seen the matches.
          </h2>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-[1.75rem] border border-ink/[0.06] bg-card p-7 shadow-soft sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-mist">Free</h3>
              <p className="mt-3 font-display text-5xl tracking-tight">$0</p>
              <p className="mt-1.5 text-sm text-mist">No card, no login.</p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink/80">
                <li>Founder interview on WhatsApp</li>
                <li>Automatic startup research</li>
                <li>Preview of your top 3 investors</li>
              </ul>
            </div>
            <div className="relative rounded-[1.75rem] border border-ink/10 bg-card p-7 shadow-lift sm:p-8">
              <span className="absolute -top-3 right-6 rounded-full bg-signal px-3 py-1 text-xs font-bold text-[#0c1512]">
                Full report
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-moss">Pro</h3>
              <p className="mt-3 font-display text-5xl tracking-tight">
                ₹999{' '}
                <span className="font-sans text-base font-medium text-mist">/ $29 · one-time</span>
              </p>
              <p className="mt-1.5 text-sm text-mist">Pay when you unlock. No subscription.</p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink">
                <li>All 50 investors, ranked by fit</li>
                <li>Why each one fits, plus a confidence score</li>
                <li>Partner name, email &amp; LinkedIn</li>
                <li>Personal email + DM per investor</li>
                <li>Ongoing AI fundraising assistant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:py-24">
          <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl">
            Questions founders ask
          </h2>
          <div className="mt-10 border-t border-ink/10 sm:mt-14">
            {faqs.map((f) => (
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

        {/* Final CTA: deep green panel */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#0d2b1e] to-[#0a1f16] px-6 py-16 text-center ring-1 ring-white/10 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-[0.18] [background:radial-gradient(circle_at_50%_120%,#22c55e,transparent_60%)]" />
            <div className="relative">
              <ScoutMark className="mx-auto h-12 w-12" />
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl tracking-tight text-white sm:text-6xl">
                Your next investor is a chat away.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/60">
                Fifteen minutes on WhatsApp. No forms, no dashboards, no weeks lost to
                research.
              </p>
              <div className="mt-9">
                <MessageCTA light caption="WhatsApp · top-3 preview free" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
