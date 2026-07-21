import { Logo, ScoutMark } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  BrandCrunchbase,
  BrandGlobe,
  BrandLinkedIn,
  BrandNews,
  BrandProductHunt,
  BrandX,
  BrandYC,
} from '@/components/brands';

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
        className={`group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-full px-8 py-4 text-lg font-semibold shadow-lift ring-1 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-16px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.99] sm:w-auto ${pill}`}
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

function SectionHead({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
        {title}
      </h2>
      {sub ? <p className="mx-auto mt-4 max-w-xl text-mist">{sub}</p> : null}
    </div>
  );
}

// ── mockups ───────────────────────────────────────────────────────────

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
            Research done 🔍 Found <span className="font-semibold">58 investors</span> that
            back startups like yours. Your top 3:
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614] shadow-sm">
            1. <span className="font-semibold">Northbeam Ventures.</span> Led 2 logistics-AI
            seeds. 94% fit.
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614] shadow-sm">
            2. <span className="font-semibold">Latitude Labs.</span> “AI that owns a
            workflow.” 91% fit.
          </p>
          <p className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-tr-sm bg-bubble px-3 py-2 text-[#111614] shadow-sm">
            Northbeam looks perfect 👀
          </p>
          <p className="w-fit max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[#111614] shadow-sm">
            Want the outreach draft for Sarah?
          </p>
          <p className="w-fit rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[#8a938e] shadow-sm">
            • • •
          </p>
        </div>
      </div>
    </div>
  );
}

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
    { firm: 'Kite String Capital', note: 'backs revenue tooling at seed', fit: 88 },
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

const stats = [
  { value: '15 min', label: 'from hello to a matched shortlist' },
  { value: '50', label: 'investors, ranked by real fit' },
  { value: '1', label: 'personal email drafted per investor' },
];

const oldWay = [
  'Scrape a list of 5,000 funds',
  'Guess who is actually writing cheques',
  'Send everyone the same cold email',
  'Hear nothing back, start over',
];
const newWay = [
  'One 15-minute chat on WhatsApp',
  '50 investors ranked by why they fit',
  'The reason each one is right for you',
  'A personal email and DM per investor',
];

const steps = [
  {
    n: 1,
    title: 'A real conversation',
    body: 'Fifteen minutes on WhatsApp about your product, traction, and raise. Scout listens like a sharp associate and never asks the same thing twice.',
    gradient: 'from-[#dcc0ab] to-[#8f6f5c]',
    mock: StepChat,
  },
  {
    n: 2,
    title: 'Research and matching',
    body: 'Scout studies your company and market, then scores investors on stage, sector, geography, check size, and thesis. You see exactly why each made the list.',
    gradient: 'from-[#c7cfb2] to-[#68755a]',
    mock: StepMatches,
  },
  {
    n: 3,
    title: 'Outreach that lands',
    body: 'Every investor gets a personal email and LinkedIn DM built from their real portfolio and your real numbers. You review, tweak, and send.',
    gradient: 'from-[#d3bb96] to-[#57504a]',
    mock: StepEmail,
  },
];

const assistantChat = [
  { from: 'you', text: 'Rewrite this intro to feel warmer, less pitchy.' },
  { from: 'scout', text: 'Done. Softened the opener and led with your 40% MoM growth. Want a shorter version too?' },
  { from: 'you', text: 'Is 15% dilution too much at pre-seed?' },
  { from: 'scout', text: 'On the higher side. Here is how to think about it, and what to counter with.' },
];
const assistantPrompts = [
  'Who should I email first?',
  'Prep me for the call',
  'Explain this SAFE',
  'Is this a fair valuation?',
];

const sources = [
  { name: 'Your website', icon: BrandGlobe },
  { name: 'LinkedIn', icon: BrandLinkedIn },
  { name: 'Crunchbase', icon: BrandCrunchbase },
  { name: 'X / Twitter', icon: BrandX },
  { name: 'Y Combinator', icon: BrandYC },
  { name: 'Product Hunt', icon: BrandProductHunt },
  { name: 'Tech press', icon: BrandNews },
];

const faqs = [
  {
    q: 'How is this different from an investor database?',
    a: 'A database hands you 5,000 names and a search box. Scout hands you the 50 that fit your specific startup, each with a concrete reason and a ready-to-send email. It does the filtering and the writing, which is the part that actually takes weeks.',
  },
  {
    q: 'Are the matches and emails actually accurate?',
    a: 'Scout only recommends an investor when it can point to a real reason: a portfolio company, a thesis, a recent cheque. Every draft is built from your real numbers and that investor’s real interests. And it never invents contact details. If a partner’s email is not public, it gives you the firm and the right person to reach instead of a made-up address.',
  },
  {
    q: 'What happens to my startup’s information?',
    a: 'It is used to build your profile, research your market, and write your outreach. Nothing more. We do not sell your data, and you can ask us to delete your conversation and profile any time.',
  },
  {
    q: 'Which stages and geographies does it cover?',
    a: 'Pre-seed through Series A, worldwide. Scout matches on where investors actually deploy, so a US fund that backs Indian founders shows up for the right startup and stays out of the way for the wrong one.',
  },
  {
    q: 'How long does the whole thing take?',
    a: 'About 15 minutes of chat, then 5 to 10 minutes while Scout researches. Your top-3 preview lands in under half an hour, and the full report follows the moment you unlock it.',
  },
  {
    q: 'What does it cost?',
    a: 'The interview, the research, and a preview of your top 3 matches are free. The full report, all 50 investors with contacts and personalized outreach, is a one-time ₹999 / $29. No subscription.',
  },
];

// ── page ──────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <>
      <main>
        {/* Hero: immersive dark, phone mockup, floating glass CTA */}
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
                Your AI fundraising associate
              </p>
              <h1 className="mt-3 max-w-3xl animate-fade-up font-display text-[3.25rem] leading-[0.98] tracking-tight [animation-delay:60ms] sm:text-8xl">
                Meet Scout. Raise from the right investors.
              </h1>
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

        {/* Intro + stat strip */}
        <section className="mx-auto max-w-4xl px-5 py-20 text-center sm:py-28">
          <h2 className="mx-auto max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            The right ten investors beat a list of five thousand.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-mist">
            Fundraising stalls on one question: who actually funds companies like yours?
            Scout answers it. A 15-minute chat, then it researches your market and returns
            the fifty investors most likely to say yes, each with the reason they fit and an
            email written to land.
          </p>
          <div className="mx-auto mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-ink/[0.06] bg-card p-5 shadow-soft"
              >
                <p className="font-display text-4xl tracking-tight text-moss">{s.value}</p>
                <p className="mt-1.5 text-sm leading-snug text-mist">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Problem / compare */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <SectionHead
            eyebrow="The problem"
            title="Raising shouldn't start with a spreadsheet."
            sub="The hard part was never sending emails. It was knowing who deserves one. Most founders lose weeks right here."
          />
          <div className="mx-auto mt-12 grid max-w-3xl gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-[1.75rem] border border-ink/[0.06] bg-card p-7 shadow-soft sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-mist">
                The usual way
              </p>
              <ul className="mt-5 space-y-3.5 text-[15px] text-ink/80">
                {oldWay.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-medium text-mist">Weeks of work.</p>
            </div>
            <div className="rounded-[1.75rem] border-2 border-signal/50 bg-card p-7 shadow-[0_24px_70px_-28px_rgba(34,197,94,0.5)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-moss">
                With Scout
              </p>
              <ul className="mt-5 space-y-3.5 text-[15px] text-ink">
                {newWay.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-signal/15 text-[11px] font-bold text-moss">
                      ✓
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-semibold text-moss">About 30 minutes.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:py-24">
          <SectionHead
            eyebrow="How it works"
            title="From hello to sent, in one chat."
            sub="Fifty carefully matched investors, not five thousand. Each one researched, scored, and worth your email."
          />
          <div className="mt-12 grid gap-6 sm:mt-16 lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.n} className="group">
                <div
                  className={`flex min-h-[300px] items-center justify-center rounded-[1.75rem] bg-gradient-to-br p-6 transition duration-300 group-hover:-translate-y-1 sm:min-h-[340px] ${step.gradient}`}
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
        </section>

        {/* The report / product peek */}
        <section
          id="report"
          className="mx-auto max-w-5xl scroll-mt-24 px-5 py-16 sm:py-24"
        >
          <SectionHead
            eyebrow="What you get"
            title="See exactly why each investor fits."
            sub="Every match comes with the evidence, the contact, and the first email. Already written, so you spend your time in conversations, not research."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:mt-16 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-[1.75rem] border border-ink/[0.06] bg-card p-6 shadow-lift sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                    Match #1 of 50
                  </p>
                  <h3 className="mt-1 font-display text-2xl tracking-tight">Northbeam Ventures</h3>
                  <p className="text-sm text-mist">Sarah Lindqvist · Partner</p>
                </div>
                <span className="shrink-0 rounded-full bg-signal/15 px-3 py-1 text-sm font-bold text-moss">
                  94% fit
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Seed to Series A', '$500K to $3M', 'Dev tools · AI infra'].map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-paper px-2.5 py-1 text-xs font-medium text-ink/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-paper/70 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-moss">
                  Why it fits you
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  Sarah led Northbeam&apos;s seed into two logistics-AI startups this year and
                  writes publicly about agentic ops software. Your warehouse copilot lands
                  squarely in her thesis.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mist">
                <span>📇 sarah@northbeam.vc</span>
                <span>in /sarah-lindqvist</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0c1512] p-6 text-white shadow-lift sm:p-7">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="flex items-center gap-2 text-white/50">
                <WhatsAppGlyph className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">
                  Drafted for you
                </p>
              </div>
              <p className="mt-4 text-xs text-white/45">Subject</p>
              <p className="text-sm font-semibold">Cursor for warehouse ops</p>
              <div className="my-4 h-px bg-white/10" />
              <p className="text-sm leading-relaxed text-white/80">
                Hi Sarah, saw your seed into CodeLoom and your piece on agentic ops. We&apos;re
                building Loop, an AI copilot for warehouse teams: $18k MRR, growing 22% MoM
                with mid-size 3PLs. Worth 20 minutes to compare notes?
              </p>
              <p className="mt-4 text-xs text-white/40">
                Plus a matching LinkedIn DM, ready to send.
              </p>
            </div>
          </div>
        </section>

        {/* The ongoing assistant */}
        <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss">
                After the report
              </p>
              <h2 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                It doesn&apos;t stop at the list.
              </h2>
              <p className="mt-4 text-mist">
                The report is the start. Scout keeps your full context and becomes the
                fundraising partner you text whenever a question comes up, at 2pm or 2am.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {assistantPrompts.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-ink/10 bg-card px-3.5 py-1.5 text-sm text-ink/70 shadow-soft"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-ink/[0.06] bg-card p-4 shadow-lift sm:p-5">
              <div className="space-y-2.5">
                {assistantChat.map((m, i) => (
                  <p
                    key={i}
                    className={
                      m.from === 'you'
                        ? 'ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-bubble px-3.5 py-2 text-[13.5px] leading-relaxed text-[#111614]'
                        : 'w-fit max-w-[85%] rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2 text-[13.5px] leading-relaxed text-ink'
                    }
                  >
                    {m.text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sources / diligence band */}
        <section className="border-y border-ink/[0.06] bg-card/40 py-14 sm:py-16">
          <div className="mx-auto max-w-5xl px-5">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-mist">
              The diligence a good analyst does, in minutes
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {sources.map((s) => (
                <span key={s.name} className="flex items-center gap-2 text-mist">
                  <s.icon className="h-5 w-5" />
                  <span className="text-[15px] font-medium">{s.name}</span>
                </span>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-mist">
              and anywhere else your startup and your investors leave a trace.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 sm:py-24"
        >
          <SectionHead
            eyebrow="Pricing"
            title="Start free. Pay once you've seen the matches."
            sub="Chat, research, and your top-3 preview cost nothing. Unlock the full report only when you like what you see."
          />
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
            <div className="relative rounded-[1.75rem] border border-signal/60 bg-card p-7 shadow-[0_24px_70px_-24px_rgba(34,197,94,0.5)] sm:p-8">
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
              <div className="mt-7">
                <MessageCTA label="Start with Scout" caption={null} className="w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 py-16 sm:py-24">
          <SectionHead eyebrow="FAQ" title="Questions founders ask" />
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

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-4 sm:pb-28">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0c1512] px-6 py-16 text-center ring-1 ring-white/10 sm:px-12 sm:py-24">
            <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background:radial-gradient(circle_at_50%_-10%,#22c55e,transparent_55%)]" />
            <div className="relative">
              <ScoutMark className="mx-auto h-12 w-12" />
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
      <footer className="border-t border-ink/[0.06] bg-card/40">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-3 text-sm leading-relaxed text-mist">
                Your AI fundraising associate. The right investors and the first email, all
                on WhatsApp.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-mist">
              <a href="#how" className="transition hover:text-ink">How it works</a>
              <a href="#pricing" className="transition hover:text-ink">Pricing</a>
              <a href="/about" className="transition hover:text-ink">About</a>
              <a href="/contact" className="transition hover:text-ink">Contact</a>
              <a href="/privacy" className="transition hover:text-ink">Privacy</a>
              <a href="/terms" className="transition hover:text-ink">Terms</a>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-ink/[0.06] pt-6 text-sm text-mist sm:flex-row">
            <p>© {new Date().getFullYear()} Scout. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <a
                href="https://realanshuman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-ink"
              >
                Built by Anshuman
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
