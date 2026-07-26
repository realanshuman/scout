import { Logo, ScoutMark } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { WA_LINK } from '@/lib/whatsapp-link';

// ── shared bits ───────────────────────────────────────────────────────

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.28.18-.53.06a6.65 6.65 0 0 1-1.95-1.2 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.5s.24-.28.37-.42a1.65 1.65 0 0 0 .24-.41.45.45 0 0 0 0-.43c-.06-.12-.55-1.32-.75-1.8s-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69 14.1 14.1 0 0 0 1.4.51 3.35 3.35 0 0 0 1.54.1 2.52 2.52 0 0 0 1.65-1.17 2 2 0 0 0 .14-1.16c-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}

/**
 * The main CTA: a glossy pill with the WhatsApp glyph in a green squircle.
 * `dark` is a black pill (light backgrounds), `light` a white pill, and
 * `glass` a translucent pill for use over the dark hero.
 */
function MessageCTA({
  label = 'Message Scout',
  caption = 'WhatsApp · free to start',
  variant = 'dark',
  className = '',
}: {
  label?: string;
  caption?: string | null;
  variant?: 'dark' | 'light' | 'glass';
  className?: string;
}) {
  const pill =
    variant === 'glass'
      ? 'bg-white/10 text-white ring-white/20 backdrop-blur-md hover:bg-white/[0.18]'
      : variant === 'light'
        ? 'bg-white text-[#111614] ring-black/5'
        : 'bg-ink text-paper ring-white/15';
  const cap = variant === 'dark' ? 'text-mist' : 'text-white/55';
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4 text-base font-semibold shadow-lift ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.99] sm:w-auto sm:px-8 sm:text-lg ${pill}`}
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/25 to-transparent" />
        <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-gradient-to-b from-[#35de74] to-[#1fae54]">
          <WhatsAppGlyph className="h-5 w-5 text-white" />
        </span>
        <span className="relative">{label}</span>
      </a>
      {caption ? <p className={`mt-3 text-sm ${cap}`}>{caption}</p> : null}
    </div>
  );
}

/** A clean phone device showing Scout's WhatsApp digest (for the dark hero). */
function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] rounded-[2.4rem] border border-white/10 bg-[#0e1a15] p-2.5 shadow-2xl ring-1 ring-white/5">
      <div className="overflow-hidden rounded-[2rem] bg-chatbg">
        <div className="flex items-center gap-2.5 bg-[#075e54] px-4 py-3 text-white">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-white/15">
            <ScoutMark className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Scout</p>
            <p className="mt-0.5 text-[10px] text-white/70">online</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" /> encrypted
          </span>
        </div>
        <div className="space-y-2 px-3 py-4 text-[12.5px] leading-relaxed">
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614] shadow-sm">
            Your shortlist is ready 🎯 I went through 4,000+ funds and found{' '}
            <span className="font-semibold">42 investors</span> who back early fintech
            like Paylo.
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614] shadow-sm">
            Top match: <span className="font-semibold">Riverbend Capital</span>. They led
            3 fintech pre-seeds this year. 93% fit.
          </p>
          <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-bubble px-3 py-2 text-[#111614] shadow-sm">
            Whoa. Can you write the intro email?
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614] shadow-sm">
            Already drafted. It mentions your 2,100 shops and their partner Neha&apos;s
            payments thesis. Want it?
          </p>
          <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-bubble px-3 py-2 text-[#111614] shadow-sm">
            Yes, send it 🙌
          </p>
          <p className="w-fit rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[#8a938e] shadow-sm">
            • • •
          </p>
        </div>
      </div>
    </div>
  );
}

// ── floating hero side cards (tablet + desktop) ───────────────────────

/** Investor-match card that floats left of the hero phone. */
function HeroCardMatch() {
  return (
    <div className="w-56 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 lg:w-64">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a938e]">
          Top match
        </p>
        <span className="rounded-full bg-[#e8f8ee] px-2 py-0.5 text-[10px] font-bold text-[#0e7a5f]">
          93% fit
        </span>
      </div>
      <p className="mt-2 text-[15px] font-semibold text-[#111614]">Riverbend Capital</p>
      <p className="text-[12px] text-[#8a938e]">Neha Shah · Partner</p>
      <div className="mt-3 rounded-xl bg-[#f4f6f4] p-2.5">
        <p className="text-[11px] leading-relaxed text-[#3f4a45]">
          Why it fits: led 3 fintech pre-seeds this year and writes about payments infra.
          Paylo is exactly her thesis.
        </p>
      </div>
    </div>
  );
}

/** Outreach-draft card that floats right of the hero phone. */
function HeroCardDraft() {
  return (
    <div className="w-56 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 lg:w-64">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8a938e]">
        Intro email · written for you
      </p>
      <p className="mt-2 text-[13px] font-semibold text-[#111614]">
        Subject: Payroll that runs itself
      </p>
      <div className="my-2 h-px bg-black/5" />
      <p className="text-[11px] leading-relaxed text-[#3f4a45]">
        Hi Neha, your post on payment rails stuck with me. Paylo runs payroll for 2,100
        small shops, growing 18% a month…
      </p>
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-[#0e7a5f]">
        <span className="grid h-4 w-4 place-items-center rounded-full bg-[#e8f8ee]">✓</span>
        One of these for every investor
      </div>
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
        Loop&apos;s matches · 58 found, top 3
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
        Draft for Sarah at Northbeam
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
    title: 'Tell Scout about your startup',
    body: 'A 15-minute WhatsApp chat about your product, traction, and raise. No forms, no deck needed, and it never asks the same thing twice.',
    mock: StepChat,
  },
  {
    n: 2,
    title: 'Scout researches and matches',
    body: 'It studies your market, scans thousands of funds and angels, and ranks the ones that actually invest at your stage, in your space, with the reason each one fits.',
    mock: StepMatches,
  },
  {
    n: 3,
    title: 'Send outreach that lands',
    body: 'Every match comes with a personal intro email built from that investor’s portfolio and your real numbers. You review it, you send it, you take the meeting.',
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

const proPoints = [
  'All 50 investors, ranked by fit',
  'Why each one fits, plus a confidence score',
  'Partner name, email & LinkedIn',
  'Personal email + DM per investor',
  'Ongoing AI fundraising assistant',
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
      <main>
        {/* Hero: immersive dark. On phones it fills the screen — a big
            left-aligned headline flowing into the phone, with a floating glass
            CTA. On tablet/desktop it opens up into a centered composition. */}
        <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#071310] text-white sm:block sm:min-h-0">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] opacity-70 [background:radial-gradient(ellipse_at_50%_-10%,rgb(34_197_94/0.28),transparent_60%)]" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 sm:block sm:px-8">
            {/* in-hero nav */}
            <nav className="flex items-center justify-between py-4 sm:py-5">
              <Logo invert />
              <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
                <a href="#how" className="transition hover:text-white">How it works</a>
                <a href="#pricing" className="transition hover:text-white">Pricing</a>
                <a href="#faq" className="transition hover:text-white">FAQ</a>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Phones show only Sign in; tablet/desktop show Sign in + Message Scout */}
                <a
                  href="/signin"
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/[0.18] sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-white/70 sm:backdrop-blur-none sm:hover:bg-transparent sm:hover:text-white"
                >
                  Sign in
                </a>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/[0.18] sm:block"
                >
                  Message Scout
                </a>
              </div>
            </nav>

            {/* headline: left-aligned and large on phones, centered on sm+ */}
            <div className="mx-auto w-full max-w-4xl pt-6 text-left sm:pt-16 sm:text-center md:pt-20">
              <p className="animate-fade-up text-[13px] font-medium tracking-wide text-signal sm:text-sm">
                Your AI fundraising associate
              </p>
              <h1 className="mt-3 animate-fade-up font-display text-[2.95rem] leading-[0.95] tracking-tight [animation-delay:60ms] sm:mx-auto sm:mt-4 sm:max-w-3xl sm:text-6xl md:text-7xl lg:text-[5.25rem] lg:leading-[0.98]">
                Meet Scout. Raise from the right investors.
              </h1>
              {/* subhead + trust row: tablet & desktop only, keeping the phone hero clean */}
              <p className="mx-auto mt-6 hidden max-w-xl animate-fade-up text-lg leading-relaxed text-white/60 [animation-delay:100ms] sm:block">
                Chat for fifteen minutes on WhatsApp. Scout researches your startup, finds
                the investors most likely to fund you, and writes the intro email to each
                one.
              </p>
              {/* prominent CTA + social proof (tablet & desktop) — the phone
                  hero keeps its own glass CTA on phones */}
              <div className="mt-9 hidden animate-fade-up flex-col items-center [animation-delay:130ms] sm:flex">
                <MessageCTA variant="glass" />
                <div className="mt-7 flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {[
                      { i: 'A', c: 'from-emerald-400 to-teal-600' },
                      { i: 'M', c: 'from-amber-400 to-orange-600' },
                      { i: 'K', c: 'from-sky-400 to-indigo-600' },
                      { i: 'R', c: 'from-rose-400 to-pink-600' },
                    ].map((a) => (
                      <span
                        key={a.i}
                        className={`grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br ${a.c} text-xs font-bold text-white ring-2 ring-[#071310]`}
                      >
                        {a.i}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-white/50">Built for founders raising now</span>
                </div>
              </div>
            </div>

            {/* phone: flows right under the headline, its top + foot fading
                into the dark; the glass CTA floats over the foot */}
            <div className="relative mt-7 flex flex-1 items-end justify-center pb-7 sm:mt-14 sm:block sm:flex-none sm:items-stretch sm:pb-14">
              {/* soft glow behind the phone — desktop only; kept off phones for a clean dark hero */}
              <div className="pointer-events-none absolute -inset-8 top-10 -z-10 mx-auto hidden max-w-[440px] rounded-full bg-signal/20 blur-3xl sm:block lg:max-w-[680px]" />
              <div className="relative mx-auto w-full max-w-[316px] animate-fade-up [animation-delay:160ms] sm:max-w-[372px]">
                {/* floating product cards flanking the phone (tablet + desktop) */}
                <div className="absolute top-[16%] hidden animate-fade-up [animation-delay:260ms] md:-left-48 md:block lg:-left-60">
                  <div className="-rotate-6">
                    <HeroCardMatch />
                  </div>
                </div>
                <div className="absolute top-[40%] hidden animate-fade-up [animation-delay:320ms] md:-right-48 md:block lg:-right-60">
                  <div className="rotate-6">
                    <HeroCardDraft />
                  </div>
                </div>
                {/* top fade so the headline reads over the phone's shoulder */}
                <div className="pointer-events-none absolute inset-x-0 -top-3 z-10 h-20 bg-gradient-to-b from-[#071310] via-[#071310]/80 to-transparent sm:hidden" />
                {/* on phones, tilt the device so it reads as if held at an angle */}
                <div className="relative origin-bottom [transform:perspective(1500px)_rotateX(5deg)_rotateY(-11deg)_rotate(1.5deg)] drop-shadow-[0_36px_44px_rgba(0,0,0,0.55)] sm:[transform:none] sm:drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
                  <HeroPhone />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#071310] via-[#071310] to-transparent sm:h-40" />
                <div className="absolute inset-x-0 bottom-1 z-20 flex justify-center sm:hidden">
                  <MessageCTA variant="glass" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intro: value prop on light */}
        <section className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8 sm:py-28">
          <h2 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            The right ten investors beat a list of five thousand.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">
            Scout learns your startup, researches your market, and hands you the fifty
            funds most likely to say yes. Each comes with the reason they fit and a
            personal email, ready to send.
          </p>
        </section>

        {/* How it works: three branded cards with product mockups */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">How it works</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Three steps, one chat
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-mist">
              Meet Loop, a warehouse software startup raising their seed. Here is their
              whole journey with Scout, from first message to sent email.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="flex flex-col">
                <div className="flex min-h-[290px] flex-1 items-center justify-center rounded-3xl border border-ink/10 bg-gradient-to-br from-moss/[0.08] to-moss/[0.015] p-6 sm:min-h-[320px]">
                  <step.mock />
                </div>
                <div className="mt-6 flex items-center gap-2.5">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-signal/15 text-xs font-bold text-moss">
                    {step.n}
                  </span>
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                </div>
                <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{step.body}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-12 max-w-xl text-center text-sm text-mist">
            After the report, the same chat becomes your fundraising assistant. Rewrite an
            email, prep for a call, or ask what a term sheet clause means.
          </p>
        </section>

        {/* Sources */}
        <section className="border-y border-ink/[0.06] bg-card/40">
          <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-16">
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
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Pricing</p>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Start free. Pay once you&apos;ve seen the matches.
            </h2>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
            <div className="flex flex-col rounded-3xl border border-ink/[0.08] bg-card p-7 sm:p-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-mist">Free</h3>
              <p className="mt-3 font-display text-5xl tracking-tight">$0</p>
              <p className="mt-1.5 text-sm text-mist">No card, no login.</p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink/80">
                {['Founder interview on WhatsApp', 'Automatic startup research', 'Preview of your top 3 investors'].map(
                  (t) => (
                    <li key={t} className="flex gap-2.5">
                      <Check muted />
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div className="relative flex flex-col rounded-3xl border border-moss/25 bg-card p-7 shadow-lift ring-1 ring-moss/10 sm:p-8">
              <span className="absolute -top-3 right-6 rounded-full bg-signal px-3 py-1 text-xs font-bold text-[#0c1512]">
                Full report
              </span>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-moss">Pro</h3>
              <p className="mt-3 font-display text-5xl tracking-tight">
                ₹999 <span className="font-sans text-base font-medium text-mist">/ $29 · one-time</span>
              </p>
              <p className="mt-1.5 text-sm text-mist">Pay when you unlock. No subscription.</p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink">
                {proPoints.map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7 sm:mt-8">
                <MessageCTA caption={null} className="w-full [&_a]:w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ: minimal hairline rows */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:px-8 sm:py-24">
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
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:px-8 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0c1512] px-6 py-16 text-center ring-1 ring-white/10 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_50%_-10%,#22c55e,transparent_55%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-4xl tracking-tight text-white sm:text-6xl">
                Your next investor is a chat away.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/60">
                Message Scout once. It handles the research, the matching, and the first
                email. You focus on building.
              </p>
              <div className="mt-9 flex justify-center">
                <MessageCTA variant="light" caption="WhatsApp · top-3 preview free" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer: one minimal row */}
      <footer className="border-t border-ink/[0.06]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-8 text-sm text-mist sm:flex-row sm:px-8">
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

function Check({ muted = false }: { muted?: boolean }) {
  return (
    <span
      className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
        muted ? 'bg-ink/[0.06] text-mist' : 'bg-signal/15 text-moss'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
