import { Logo, ScoutMark } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

// ── shared bits ───────────────────────────────────────────────────────

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.28.18-.53.06a6.65 6.65 0 0 1-1.95-1.2 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.5s.24-.28.37-.42a1.65 1.65 0 0 0 .24-.41.45.45 0 0 0 0-.43c-.06-.12-.55-1.32-.75-1.8s-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69 14.1 14.1 0 0 0 1.4.51 3.35 3.35 0 0 0 1.54.1 2.52 2.52 0 0 0 1.65-1.17 2 2 0 0 0 .14-1.16c-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}

/**
 * The main CTA, Backdoor-style: a glossy pill with the messenger icon in a
 * green squircle. `bg-ink text-paper` flips automatically per theme, so it
 * is a black pill in day mode and a white pill in night mode.
 */
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
          light
            ? 'bg-white text-[#111614] ring-black/5'
            : 'bg-ink text-paper ring-white/15'
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

// ── mini mockups for the step cards ───────────────────────────────────

function StepChat() {
  return (
    <div className="w-full max-w-[290px] rounded-2xl bg-white p-3 text-left shadow-lift">
      <div className="flex items-center gap-2 border-b border-black/5 pb-2">
        <ScoutMark className="h-6 w-6" />
        <p className="text-xs font-semibold text-[#111614]">Scout</p>
        <p className="ml-auto text-[10px] text-[#8a938e]">online</p>
      </div>
      <div className="mt-2.5 space-y-1.5 text-[12px] leading-relaxed">
        <p className="w-fit max-w-[92%] rounded-xl rounded-tl-sm bg-[#f0f2f0] px-2.5 py-1.5 text-[#111614]">
          Hey 👋 What are you building?
        </p>
        <p className="ml-auto w-fit max-w-[92%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-2.5 py-1.5 text-[#111614]">
          Loop, an AI copilot for warehouse ops. $18k MRR.
        </p>
        <p className="w-fit max-w-[92%] rounded-xl rounded-tl-sm bg-[#f0f2f0] px-2.5 py-1.5 text-[#111614]">
          Solid traction. Who&apos;s the buyer, ops manager or floor lead?
        </p>
        <p className="ml-auto w-fit max-w-[92%] rounded-xl rounded-tr-sm bg-[#d9fdd3] px-2.5 py-1.5 text-[#111614]">
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
    { firm: 'Kite String Capital', note: 'backs revenue-tooling at seed', fit: 88 },
  ];
  return (
    <div className="w-full max-w-[290px] rounded-2xl bg-white p-3 text-left shadow-lift">
      <p className="border-b border-black/5 pb-2 text-xs font-semibold text-[#111614]">
        58 investors found · top 3
      </p>
      <div className="mt-1 divide-y divide-black/5">
        {rows.map((r, i) => (
          <div key={r.firm} className="flex items-center gap-2.5 py-2">
            <span className="text-[11px] font-semibold text-[#8a938e]">{i + 1}</span>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#111614]">{r.firm}</p>
              <p className="truncate text-[11px] text-[#8a938e]">{r.note}</p>
            </div>
            <span className="ml-auto shrink-0 rounded-full bg-[#e8f8ee] px-1.5 py-0.5 text-[10px] font-bold text-[#0e7a5f]">
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
    <div className="w-full max-w-[290px] rounded-2xl bg-white p-3.5 text-left shadow-lift">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a938e]">
        Draft · Sarah Lindqvist
      </p>
      <p className="mt-1.5 text-[12px] font-semibold text-[#111614]">
        Subject: Cursor for warehouse ops
      </p>
      <div className="my-2 h-px bg-black/5" />
      <p className="text-[12px] leading-relaxed text-[#3f4a45]">
        Hi Sarah, saw your seed into CodeLoom and your piece on agentic ops. We&apos;re
        building Loop: $18k MRR, growing 22% MoM. Worth 20 minutes?
      </p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[#0e7a5f]">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-[#e8f8ee]">✓</span>
        LinkedIn DM included
      </div>
    </div>
  );
}

// ── content ───────────────────────────────────────────────────────────

const steps = [
  {
    n: 1,
    title: 'A real conversation',
    body: 'Fifteen minutes on WhatsApp about your product, traction, and raise. Scout listens like a sharp associate and never asks twice.',
    gradient: 'from-[#dcc0ab] to-[#8f6f5c]',
    mock: StepChat,
  },
  {
    n: 2,
    title: 'Research and matching',
    body: 'Scout studies your company and market, then ranks a curated investor base by stage, sector, geography, and thesis fit.',
    gradient: 'from-[#c7cfb2] to-[#68755a]',
    mock: StepMatches,
  },
  {
    n: 3,
    title: 'Outreach that lands',
    body: 'Every investor gets a personal email and LinkedIn DM built from their real portfolio and your real numbers. You review and send.',
    gradient: 'from-[#d3bb96] to-[#57504a]',
    mock: StepEmail,
  },
];

const sources = [
  'Your website',
  'Crunchbase',
  'LinkedIn',
  'X / Twitter',
  'Y Combinator',
  'Product Hunt',
  'TechCrunch',
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
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-ink/[0.06] bg-paper/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Logo />
          <div className="hidden items-center gap-8 text-sm text-mist md:flex">
            <a href="#how" className="transition hover:text-ink">How it works</a>
            <a href="#pricing" className="transition hover:text-ink">Pricing</a>
            <a href="#faq" className="transition hover:text-ink">FAQ</a>
          </div>
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

      <main>
        {/* Hero: centered, editorial, whitespace-heavy */}
        <section className="mx-auto max-w-4xl px-5 pb-20 pt-16 text-center sm:pb-28 sm:pt-24">
          <h1 className="animate-fade-up font-display text-5xl leading-[1.05] tracking-tight text-ink sm:text-7xl">
            Meet Scout, your AI fundraising associate.
          </h1>
          <p className="mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-mist [animation-delay:80ms] sm:text-xl">
            Fundraising isn&apos;t a numbers game. Focused outreach wins. Scout finds the
            investors most likely to fund you and writes outreach they&apos;ll actually
            answer, so you wake up to meetings, not templates.
          </p>
          <div className="mt-10 animate-fade-up [animation-delay:160ms]">
            <MessageCTA />
          </div>
        </section>

        {/* How it works: three gradient cards with product mockups */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:py-24">
          <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl">
            How it works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-mist">
            Fifty carefully matched investors, not five thousand. Each one researched,
            scored, and worth your email. The opposite of spray-and-pray.
          </p>
          <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n}>
                <div
                  className={`flex min-h-[300px] items-center justify-center rounded-[1.75rem] bg-gradient-to-br p-6 sm:min-h-[340px] ${step.gradient}`}
                >
                  <step.mock />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                  Step {step.n}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-mist">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-xl text-center text-sm text-mist">
            After the report, the same chat becomes your fundraising assistant. Rewrite an
            email, prep for a call, or ask what a term sheet clause means.
          </p>
        </section>

        {/* Sources */}
        <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-mist">
            Where Scout does your diligence
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {sources.map((s) => (
              <span key={s} className="text-[15px] font-medium text-mist/80">
                {s}
              </span>
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
                ₹999 <span className="font-sans text-base font-medium text-mist">/ $29 · one-time</span>
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

        {/* FAQ: minimal hairline rows */}
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

        {/* Final CTA: black panel, serif headline, white pill */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0c1512] px-6 py-16 text-center ring-1 ring-white/10 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_50%_-10%,#22c55e,transparent_55%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl tracking-tight text-white sm:text-6xl">
                Scout, your unfair advantage.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/60">
                Text once. Scout handles the research, the matching, and the first email.
                You focus on building.
              </p>
              <div className="mt-9">
                <MessageCTA light caption="WhatsApp · top-3 preview free" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer: one minimal row */}
      <footer className="border-t border-ink/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-mist sm:flex-row">
          <Logo markClassName="h-6 w-6" wordClassName="text-lg" />
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
    </>
  );
}
