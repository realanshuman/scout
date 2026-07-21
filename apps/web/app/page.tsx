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

function Check({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">{children}</p>
  );
}

/**
 * The main CTA: a WhatsApp-green squircle inside a pill. `dark` is a black pill
 * (light backgrounds), `light` a white pill, `glass` a translucent one for the
 * dark hero.
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
        ? 'bg-white text-[#111614] ring-black/5 hover:bg-white/90'
        : 'bg-ink text-paper ring-white/10 hover:opacity-90';
  const cap = variant === 'dark' ? 'text-mist' : 'text-white/55';
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex w-full items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-semibold ring-1 transition duration-200 active:scale-[0.99] sm:w-auto ${pill}`}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-gradient-to-b from-[#35de74] to-[#1fae54]">
          <WhatsAppGlyph className="h-5 w-5 text-white" />
        </span>
        {label}
      </a>
      {caption ? <p className={`mt-3 text-sm ${cap}`}>{caption}</p> : null}
    </div>
  );
}

// ── phone mockup (dark hero) ──────────────────────────────────────────

function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[320px] rounded-[2.4rem] border border-white/10 bg-[#0e1a15] p-2.5">
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
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614]">
            Research done 🔍 Found <span className="font-semibold">58 investors</span> that
            back startups like yours. Your top 3:
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614]">
            1. <span className="font-semibold">Northbeam Ventures.</span> Led 2
            logistics-AI seeds. 94% fit.
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614]">
            2. <span className="font-semibold">Latitude Labs.</span> “AI that owns a
            workflow.” 91% fit.
          </p>
          <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-bubble px-3 py-2 text-[#111614]">
            Northbeam looks perfect 👀
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614]">
            Want the outreach draft for Sarah?
          </p>
          <p className="w-fit rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[#8a938e]">
            • • •
          </p>
        </div>
      </div>
    </div>
  );
}

// ── step previews (light, flat) ───────────────────────────────────────

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-ink/[0.06] bg-[#eef1ee] p-6">
      {children}
    </div>
  );
}

function StepChat() {
  return (
    <div className="w-full max-w-[280px] rounded-2xl border border-black/5 bg-white p-3 text-left">
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
          Nice. Who&apos;s the buyer, ops manager or floor lead?
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
    { firm: 'Northbeam Ventures', note: 'led two logistics-AI seeds', fit: 94 },
    { firm: 'Latitude Labs', note: 'thesis: AI owning a workflow', fit: 91 },
    { firm: 'Kite String Capital', note: 'backs revenue tooling at seed', fit: 88 },
  ];
  return (
    <div className="w-full max-w-[280px] rounded-2xl border border-black/5 bg-white p-3 text-left">
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
    <div className="w-full max-w-[280px] rounded-2xl border border-black/5 bg-white p-3.5 text-left">
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

/** A single investor match, for the "what you get" section. */
function MatchPreview() {
  return (
    <div className="w-full rounded-2xl border border-ink/10 bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">
            Match #1 of 50
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-[-0.01em]">Northbeam Ventures</h3>
          <p className="text-sm text-mist">Sarah Lindqvist · Partner</p>
        </div>
        <span className="shrink-0 rounded-full bg-signal/15 px-3 py-1 text-sm font-bold text-moss">
          94% fit
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {['Seed to Series A', '$500K–$3M', 'Dev tools · AI infra'].map((t) => (
          <span key={t} className="rounded-lg bg-paper px-2.5 py-1 text-xs font-medium text-ink/70">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 rounded-xl border border-ink/[0.06] bg-paper/60 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-moss">Why matched</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
          Sarah led Northbeam&apos;s seed into two logistics-AI startups this year and writes
          publicly about agentic ops. Your warehouse copilot lands right in her thesis.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist">
        <span>sarah@northbeam.vc</span>
        <span className="text-ink/20">·</span>
        <span>linkedin.com/in/slindqvist</span>
      </div>
    </div>
  );
}

// ── content ───────────────────────────────────────────────────────────

const steps = [
  {
    n: 1,
    title: 'Tell Scout about your startup',
    body: 'A 15-minute chat on WhatsApp. No forms, no dashboard. It asks about your product, traction, and the round you’re raising, and remembers every answer.',
    mock: StepChat,
  },
  {
    n: 2,
    title: 'It researches and finds your investors',
    body: 'Scout reads your site and the open web, then finds and ranks the investors most likely to back a company like yours, by stage, sector, geography, and check size.',
    mock: StepMatches,
  },
  {
    n: 3,
    title: 'You get outreach, written for you',
    body: 'A personal cold email and LinkedIn DM for each investor, built from their real portfolio and your real numbers. Read it, tweak it, send it.',
    mock: StepEmail,
  },
];

const included = [
  'Up to 50 investors, ranked by how well they fit your raise',
  'The specific reason each one is a match, in plain English',
  'A confidence score, so you know who to email first',
  'Partner name, email, and LinkedIn when they’re public',
  'A personal cold email and LinkedIn DM for every investor',
];

const audience = [
  {
    title: 'Pre-seed to Series A',
    body: 'Whether it’s your first small cheque or a multi-million round, Scout tunes the list to your stage.',
  },
  {
    title: 'Raising in any market',
    body: 'India, the US, Europe, or global. Scout researches investors wherever you and your market are.',
  },
  {
    title: 'First-time or short on time',
    body: 'New to fundraising, or just too busy building to do weeks of research. Scout does the legwork for you.',
  },
];

const sources = ['Your website', 'Crunchbase', 'LinkedIn', 'X / Twitter', 'Y Combinator', 'Product Hunt', 'Tech press'];

const faqs = [
  {
    q: 'How is this different from an investor database?',
    a: 'A database hands you thousands of names and a search box. Scout hands you the ones that fit your specific startup, each with a concrete reason and a ready-to-send email. It does the filtering and the writing, which is the part that actually takes weeks.',
  },
  {
    q: 'How long does the whole thing take?',
    a: 'About 15 minutes of chat, then 5 to 10 minutes while Scout researches. Your top-3 preview lands in under half an hour, and the full report follows the moment you unlock it.',
  },
  {
    q: 'Do I have to repeat myself?',
    a: 'Never. Scout remembers everything you tell it. After the report it becomes your ongoing fundraising assistant, with full context on your company, so you can pick the conversation back up any time.',
  },
  {
    q: 'Where do the investors come from?',
    a: 'Scout researches the live web and public investor platforms for each startup, then keeps what fits: stage, sector, geography, check size, thesis, and recent investments. It only shows a contact when it is genuinely public, so you never email a made-up address.',
  },
  {
    q: 'Will investors know an AI wrote my outreach?',
    a: 'Each draft is built from your real numbers and the investor’s real thesis and portfolio, then you review and send it yourself. No mass blasts, no spray-and-pray.',
  },
  {
    q: 'What does it cost?',
    a: 'The interview, the research, and a preview of your top 3 matches are free. The full report, with every investor, contact, and personalized outreach, is a one-time ₹999 / $29.',
  },
];

// ── page ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#071310] text-white">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] opacity-70 [background:radial-gradient(ellipse_at_50%_-10%,rgb(34_197_94/0.28),transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-5">
            <nav className="flex items-center justify-between py-4">
              <Logo invert />
              <div className="hidden items-center gap-8 text-sm text-white/60 md:flex">
                <a href="#how" className="transition hover:text-white">How it works</a>
                <a href="#report" className="transition hover:text-white">The report</a>
                <a href="#pricing" className="transition hover:text-white">Pricing</a>
                <a href="#faq" className="transition hover:text-white">FAQ</a>
              </div>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/[0.18]"
              >
                Message Scout
              </a>
            </nav>

            <div className="pt-10 sm:pt-16">
              <p className="animate-fade-up text-sm font-medium tracking-wide text-signal">
                Your AI fundraising associate, on WhatsApp
              </p>
              <h1 className="mt-3 max-w-3xl animate-fade-up font-display text-[3.25rem] leading-[0.98] tracking-tight [animation-delay:60ms] sm:text-8xl">
                Meet Scout. Raise from the right investors.
              </h1>
              <p className="mt-5 max-w-xl animate-fade-up text-lg leading-relaxed text-white/60 [animation-delay:100ms]">
                Chat for 15 minutes. Scout researches your startup and hands you the
                investors most likely to fund you, each with a personal email ready to send.
              </p>
            </div>

            <div className="relative mx-auto mt-12 max-w-[340px] animate-fade-up pb-14 [animation-delay:140ms] sm:mt-16">
              <div className="pointer-events-none absolute -inset-8 top-10 -z-10 rounded-full bg-signal/15 blur-3xl" />
              <div className="relative">
                <HeroPhone />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#071310] via-[#071310] to-transparent" />
              </div>
              <div className="relative z-10 -mt-16 flex justify-center">
                <MessageCTA variant="glass" className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>The problem</Eyebrow>
            <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
              Raising is mostly research. That&apos;s the part you don&apos;t have time for.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist">
              The moment you decide to raise, the building stops and the spreadsheet starts.
              And the hard part isn&apos;t sending emails, it&apos;s knowing who deserves one.
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-2xl border border-ink/10 bg-card p-6">
              <p className="text-sm font-semibold text-ink/60">Doing it yourself</p>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink/80">
                <li>Scrape lists of thousands of funds</li>
                <li>Guess who&apos;s actually writing cheques</li>
                <li>Dig for who backs companies like yours</li>
                <li>Write a different cold email for each</li>
              </ul>
              <p className="mt-5 text-sm text-mist">Two to three weeks. Still no replies.</p>
            </div>
            <div className="rounded-2xl border border-signal/40 bg-card p-6">
              <p className="text-sm font-semibold text-moss">With Scout</p>
              <ul className="mt-4 space-y-2.5 text-[15px] text-ink">
                {['One 15-minute WhatsApp chat', 'Investors ranked by real fit', 'A reason each one is right for you', 'A personal email written per investor'].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-moss" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm font-medium text-moss">About 30 minutes. Ready to send.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 border-t border-ink/[0.06] bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                From a 15-minute chat to a ready-to-send list.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-mist">
                Three steps, all inside WhatsApp. You talk, Scout works, you send.
              </p>
            </div>
            <div className="mt-14 grid gap-8 sm:mt-16 lg:grid-cols-3 lg:gap-6">
              {steps.map((step) => (
                <div key={step.n}>
                  <Panel>
                    <step.mock />
                  </Panel>
                  <div className="mt-6 flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-signal/15 text-sm font-bold text-moss">
                      {step.n}
                    </span>
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
                  </div>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-mist">{step.body}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-14 max-w-xl text-center text-[15px] text-mist">
              And it doesn&apos;t stop there. After the report, the same chat becomes your
              fundraising assistant, ready to rewrite an email or prep you for a call.
            </p>
          </div>
        </section>

        {/* What you get */}
        <section id="report" className="scroll-mt-24 border-t border-ink/[0.06]">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 sm:py-28 lg:grid-cols-2 lg:gap-16">
            <div>
              <Eyebrow>What you get</Eyebrow>
              <h2 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                A curated investor report, not another spreadsheet.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-mist">
                Everything is specific to you. Open it and you know exactly who to contact,
                why they&apos;ll care, and what to say.
              </p>
              <ul className="mt-8 space-y-3.5">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-ink/85">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-moss" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:pl-4">
              <MatchPreview />
              <p className="mt-4 text-center text-sm text-mist">
                One of up to 50 matches in your report.
              </p>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="scroll-mt-24 border-t border-ink/[0.06] bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Who it&apos;s for</Eyebrow>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                Built for founders raising right now.
              </h2>
            </div>
            <div className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-3 sm:gap-5">
              {audience.map((a) => (
                <div key={a.title} className="rounded-2xl border border-ink/10 bg-card p-6">
                  <h3 className="text-base font-semibold tracking-[-0.01em]">{a.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist">{a.body}</p>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-center text-[15px] leading-relaxed text-mist">
              Not sure it&apos;s for you? If you already have warm intros to the exact
              investors you need, you may not need Scout. If you&apos;re staring at a blank
              list, this is exactly what it&apos;s for.
            </p>

            <div className="mt-12 border-t border-ink/[0.06] pt-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                Scout researches everywhere your startup leaves a trace
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                {sources.map((s) => (
                  <span key={s} className="text-[15px] font-medium text-mist/80">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 border-t border-ink/[0.06]">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:py-28">
            <div className="mx-auto max-w-2xl text-center">
              <Eyebrow>Pricing</Eyebrow>
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                Start free. Pay once you&apos;ve seen the matches.
              </h2>
            </div>
            <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
              <div className="rounded-2xl border border-ink/10 bg-card p-7 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-mist">Free</h3>
                <p className="mt-3 font-display text-5xl tracking-tight">$0</p>
                <p className="mt-1.5 text-sm text-mist">No card, no login.</p>
                <ul className="mt-6 space-y-3 text-[15px] text-ink/80">
                  {['Founder interview on WhatsApp', 'Automatic startup research', 'Preview of your top 3 investors'].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-mist" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-2xl border-2 border-signal bg-card p-7 sm:p-8">
                <span className="absolute -top-3 right-6 rounded-full bg-signal px-3 py-1 text-xs font-bold text-[#0c1512]">
                  Full report
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-moss">Pro</h3>
                <p className="mt-3 font-display text-5xl tracking-tight">
                  ₹999 <span className="font-sans text-base font-medium text-mist">/ $29 · one-time</span>
                </p>
                <p className="mt-1.5 text-sm text-mist">Pay when you unlock. No subscription.</p>
                <ul className="mt-6 space-y-3 text-[15px] text-ink">
                  {['Every matched investor, ranked by fit', 'Why each one fits, plus a confidence score', 'Partner name, email & LinkedIn', 'Personal email + DM per investor', 'Ongoing AI fundraising assistant'].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-moss" />
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  <MessageCTA label="Start with Scout" caption={null} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 border-t border-ink/[0.06]">
          <div className="mx-auto max-w-3xl px-5 py-20 sm:py-28">
            <h2 className="text-center font-display text-4xl tracking-tight sm:text-5xl">
              Questions founders ask
            </h2>
            <div className="mt-12 border-t border-ink/10">
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
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0c1512] px-6 py-16 text-center ring-1 ring-white/10 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_50%_-10%,#22c55e,transparent_55%)]" />
            <div className="relative">
              <ScoutMark className="mx-auto h-11 w-11" />
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-4xl tracking-tight text-white sm:text-6xl">
                Your next investor is a chat away.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-white/60">
                Message Scout once. It handles the research, the matching, and the first
                email. You focus on building.
              </p>
              <div className="mt-9">
                <MessageCTA variant="light" caption="WhatsApp · top-3 preview free" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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
