import { Logo, ScoutMark } from '@/components/logo';
import {
  IconArrow,
  IconChat,
  IconCheck,
  IconCompass,
  IconList,
  IconResearch,
  IconSend,
  IconShield,
  IconTarget,
} from '@/components/icons';

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

/** Glossy green pill with a colored glow, top highlight, and arrow nudge. */
function PrimaryCTA({ label, className = '' }: { label: string; className?: string }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-signal px-7 py-3.5 text-base font-semibold text-night shadow-[0_10px_30px_-8px_rgba(34,197,94,0.55)] ring-1 ring-inset ring-white/25 transition duration-200 hover:-translate-y-0.5 hover:bg-[#2ad36e] hover:shadow-[0_16px_44px_-10px_rgba(34,197,94,0.7)] active:translate-y-0 active:scale-[0.99] ${className}`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent opacity-70" />
      <WhatsAppGlyph className="relative h-5 w-5" />
      <span className="relative">{label}</span>
      <IconArrow className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

/** Bordered glass pill for secondary actions. */
function GhostButton({
  href,
  label,
  className = '',
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-1.5 rounded-full border border-ink/12 bg-white/70 px-6 py-3.5 text-base font-medium text-ink shadow-sm backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-white ${className}`}
    >
      {label}
      <IconArrow className="h-4 w-4 text-mist transition-transform duration-200 group-hover:translate-x-0.5" />
    </a>
  );
}

function SectionLabel({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-moss">
      <span className="tabular-nums text-mist/70">{n}</span>
      <span className="h-px w-6 bg-moss/30" />
      {children}
    </div>
  );
}

// ── chat mockup ───────────────────────────────────────────────────────

function ChatIn({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[86%] self-start rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-sm">
      {children}
    </div>
  );
}
function ChatOut({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[86%] self-end rounded-2xl rounded-tr-sm bg-bubble px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-sm">
      {children}
    </div>
  );
}

function ChatMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-tr from-signal/20 via-transparent to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-[2rem] border border-ink/10 bg-chatbg shadow-lift ring-1 ring-black/5">
        <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
            <ScoutMark className="h-6 w-6" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Scout</p>
            <p className="text-[11px] text-white/70">online</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" /> encrypted
          </span>
        </div>
        <div className="flex flex-col gap-2 px-3 py-4">
          <ChatIn>
            Hey 👋 I&apos;m Scout. I&apos;ll help you find investors that actually back
            startups like yours. What are you building?
          </ChatIn>
          <ChatOut>Loop, an AI copilot for warehouse ops. We&apos;re at $18k MRR.</ChatOut>
          <ChatIn>Solid traction. Who&apos;s the buyer, ops manager or floor lead?</ChatIn>
          <ChatOut>Ops managers at mid-size 3PLs.</ChatOut>
          <div className="mt-1 self-start rounded-2xl rounded-tl-sm border border-moss/15 bg-white px-3.5 py-3 text-[13px] leading-relaxed shadow-sm">
            <p className="font-semibold text-moss">Research complete ✓</p>
            <p className="mt-1 text-ink">
              Found <span className="font-semibold">58 highly relevant investors</span>.
            </p>
            <p className="mt-1 text-mist">
              #1 Northbeam Ventures, led two logistics-AI seeds this year.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── content ───────────────────────────────────────────────────────────

const sources = [
  'Your website',
  'Crunchbase',
  'LinkedIn',
  'X / Twitter',
  'Y Combinator',
  'Product Hunt',
  'The open web',
];

const steps = [
  {
    icon: IconChat,
    title: 'Talk it through',
    body: 'A 15-minute WhatsApp chat about your product, traction, and raise. It reads like a conversation with a sharp associate, not a form.',
  },
  {
    icon: IconResearch,
    title: 'Scout does the digging',
    body: 'It reads your site, market, competitors, and press, then writes an investor-grade profile of your company in minutes.',
  },
  {
    icon: IconTarget,
    title: 'Matches ranked by fit',
    body: 'Your profile is scored against a curated investor base by stage, sector, geography, and check size. The top 50, each with a reason.',
  },
  {
    icon: IconSend,
    title: 'Outreach, written for you',
    body: 'A personal cold email and LinkedIn DM per investor, grounded in their real thesis and portfolio. You review and hit send.',
  },
];

const features = [
  {
    icon: IconTarget,
    title: '50 ranked matches',
    body: 'Not a database dump. A shortlist, ordered by how well each investor actually fits your round.',
  },
  {
    icon: IconCompass,
    title: 'A reason for every name',
    body: 'The portfolio company, thesis, or partner interest that makes each investor worth your time.',
  },
  {
    icon: IconList,
    title: 'Contacts that work',
    body: 'Partner name, email, and LinkedIn. The person to reach, not a generic info@ inbox.',
  },
  {
    icon: IconSend,
    title: 'Personal outreach',
    body: 'A distinct email and DM per investor, written from your traction and their real interests.',
  },
  {
    icon: IconShield,
    title: 'Confidence scores',
    body: 'Every match carries a fit score, so you know who to email first and who can wait.',
  },
  {
    icon: IconChat,
    title: 'An assistant that remembers',
    body: 'After the report, keep chatting: rewrite an email, prep for a call, or ask what a term sheet clause means.',
  },
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
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <div className="hidden items-center gap-8 text-sm text-mist md:flex">
            <a href="#how" className="transition hover:text-ink">How it works</a>
            <a href="#report" className="transition hover:text-ink">The report</a>
            <a href="#pricing" className="transition hover:text-ink">Pricing</a>
            <a href="#faq" className="transition hover:text-ink">FAQ</a>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-sm transition duration-200 hover:-translate-y-px hover:bg-ink/85 hover:shadow-md"
          >
            Message Scout
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        {/* Hero */}
        <section className="relative grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-24 lg:pt-20">
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[560px] w-[860px] max-w-[130%] -translate-x-1/2 dotgrid" />
          <div className="animate-fade-up text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-medium text-mist shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
              </span>
              Now on WhatsApp
            </span>
            <h1 className="mt-6 font-display text-[2.7rem] font-semibold leading-[1.03] tracking-[-0.03em] text-ink sm:text-[4.25rem]">
              Meet Scout, your AI fundraising associate.
            </h1>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-mist sm:text-lg lg:mx-0">
              Chat for 15 minutes and get the investors most likely to fund you, each with
              a personal email ready to send.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <PrimaryCTA label="Message Scout" className="w-full sm:w-auto" />
              <GhostButton href="#how" label="See how it works" className="w-full sm:w-auto" />
            </div>
            <p className="mt-5 text-sm text-mist">
              Free to start · top-3 matches in ~30 min · no login
            </p>
          </div>
          <div className="animate-fade-up [animation-delay:120ms]">
            <ChatMockup />
          </div>
        </section>

        {/* Sources strip */}
        <section className="border-y border-ink/[0.06] py-8">
          <p className="text-center text-sm text-mist">
            The research a diligent analyst would spend three weeks on, read in minutes,
            across the sources that matter:
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2.5">
            {sources.map((s) => (
              <span
                key={s}
                className="rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-sm font-medium text-ink/70 shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Problem / compare */}
        <section className="py-16 sm:py-24">
          <SectionLabel n="01">The problem</SectionLabel>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Raising shouldn&apos;t start with a spreadsheet.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-mist">
            The hard part of fundraising isn&apos;t sending emails. It&apos;s knowing who
            deserves one. Most founders lose weeks here.
          </p>
          <div className="mx-auto mt-10 grid max-w-4xl gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-4xl border border-ink/[0.06] bg-white p-7 shadow-soft sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-mist">
                The usual way
              </p>
              <ul className="mt-5 space-y-3.5 text-[15px] text-ink/80">
                {[
                  'Scrape a list of 5,000 funds',
                  'Guess who’s writing cheques this quarter',
                  'Paste the same cold email to everyone',
                  'Hear nothing back, start over',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/25" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-medium text-mist">Time: 2 to 3 weeks</p>
            </div>
            <div className="relative rounded-4xl border-2 border-signal/60 bg-white p-7 shadow-[0_20px_60px_-24px_rgba(34,197,94,0.45)] sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-moss">
                With Scout
              </p>
              <ul className="mt-5 space-y-3.5 text-[15px] text-ink">
                {[
                  'One 15-minute WhatsApp chat',
                  '50 investors ranked by real fit',
                  'A reason each one is right for you',
                  'A personal email per investor',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-semibold text-moss">Time: about 30 minutes</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 py-16 sm:py-24">
          <SectionLabel n="02">How it works</SectionLabel>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Four steps, one conversation.
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="group flex items-start gap-4 rounded-4xl border border-ink/[0.06] bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift sm:block"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-signal/12 text-moss transition group-hover:bg-signal/20 sm:mb-5">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-mist/60">
                      0{i + 1}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-[-0.01em]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Product peek */}
        <section id="report" className="scroll-mt-24 py-16 sm:py-24">
          <SectionLabel n="03">The report</SectionLabel>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            This is what a match looks like.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-mist">
            Every investor in your report comes with the why, the contact, and the first
            email, already written.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:mt-14 lg:grid-cols-[1fr_0.9fr]">
            {/* match card */}
            <div className="rounded-4xl border border-ink/[0.06] bg-white p-6 shadow-lift sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">
                    Example match · #1
                  </p>
                  <h3 className="mt-1 font-display text-xl font-bold tracking-[-0.01em]">
                    Northbeam Ventures
                  </h3>
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
                  Why matched
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/80">
                  Sarah led Northbeam&apos;s seed into two logistics-AI startups this year
                  and writes publicly about agentic ops software. Your warehouse copilot
                  lands squarely in her thesis.
                </p>
              </div>
            </div>

            {/* email card */}
            <div className="relative overflow-hidden rounded-4xl border border-ink/[0.06] bg-night p-6 text-white shadow-lift sm:p-7">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="flex items-center gap-2 text-white/50">
                <IconSend className="h-4 w-4" />
                <p className="text-[11px] font-semibold uppercase tracking-wider">
                  Drafted for you
                </p>
              </div>
              <p className="mt-4 text-xs text-white/45">Subject</p>
              <p className="text-sm font-semibold">Cursor for warehouse ops</p>
              <div className="my-4 h-px bg-white/10" />
              <p className="text-sm leading-relaxed text-white/80">
                Hi Sarah, saw your seed into CodeLoom and your piece on agentic ops.
                We&apos;re building Loop, an AI copilot for warehouse teams: $18k MRR,
                growing 22% MoM with mid-size 3PLs. Worth 20 minutes to compare notes?
              </p>
              <p className="mt-4 text-xs text-white/40">
                Plus a matching LinkedIn DM, ready to send.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 sm:py-24">
          <SectionLabel n="04">What you get</SectionLabel>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Everything you&apos;d ask an associate for.
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-4xl border border-ink/[0.06] bg-white p-6 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift sm:p-7"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal/12 text-moss">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold tracking-[-0.01em]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-24 py-16 sm:py-24">
          <SectionLabel n="05">Pricing</SectionLabel>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Start free. Pay once you&apos;ve seen the matches.
          </h2>
          <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-4xl border border-ink/[0.06] bg-white p-7 shadow-soft sm:p-8">
              <h3 className="font-display text-lg font-bold">Free</h3>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em]">$0</p>
              <p className="mt-1 text-sm text-mist">No card, no login.</p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink/80">
                {[
                  'Founder interview on WhatsApp',
                  'Automatic startup research',
                  'Preview of your top 3 investors',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-mist" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-4xl border-2 border-signal bg-white p-7 shadow-[0_24px_70px_-24px_rgba(34,197,94,0.5)] sm:p-8">
              <span className="absolute -top-3 right-6 rounded-full bg-signal px-3 py-1 text-xs font-bold text-night shadow-sm">
                Full report
              </span>
              <h3 className="font-display text-lg font-bold text-moss">Pro</h3>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em]">
                ₹999 <span className="text-base font-medium text-mist">/ $29 · one-time</span>
              </p>
              <p className="mt-1 text-sm text-mist">Pay when you unlock. No subscription.</p>
              <ul className="mt-6 space-y-3 text-[15px] text-ink">
                {[
                  'All 50 investors, ranked by fit',
                  'Why each one fits, plus a confidence score',
                  'Partner name, email & LinkedIn',
                  'Personal email + DM per investor',
                  'Ongoing AI fundraising assistant',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <IconCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <PrimaryCTA label="Start with Scout" className="w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-24 py-16 sm:py-24">
          <SectionLabel n="06">FAQ</SectionLabel>
          <h2 className="mx-auto max-w-2xl text-center font-display text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Questions founders ask.
          </h2>
          <div className="mx-auto mt-10 max-w-2xl space-y-3 sm:mt-12">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-3xl border border-ink/[0.06] bg-white px-5 py-4 shadow-soft transition open:shadow-lift sm:px-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[15px] font-semibold sm:text-base [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-paper text-mist transition duration-200 group-open:rotate-45 group-open:bg-signal/15 group-open:text-moss">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="pb-16 pt-4 sm:pb-24">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-night px-6 py-14 text-center sm:px-12 sm:py-20">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background:radial-gradient(circle_at_50%_-10%,#22c55e,transparent_55%)]" />
            <div className="relative">
              <ScoutMark className="mx-auto h-12 w-12" />
              <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                Your AI fundraising associate · on WhatsApp
              </span>
              <h2 className="mx-auto mt-5 max-w-lg font-display text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
                Your next investor is a chat away.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/60">
                Fifteen minutes on WhatsApp. No forms, no spreadsheets, no weeks lost to
                research.
              </p>
              <div className="mt-8 flex justify-center">
                <PrimaryCTA label="Message Scout" className="w-full sm:w-auto" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/[0.06] bg-white/50">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-4 text-sm leading-relaxed text-mist">
                Your AI fundraising associate. Scout finds the right investors and writes
                the first email, all on WhatsApp.
              </p>
              <div className="mt-5 flex gap-2.5">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Scout on X"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:-translate-y-0.5 hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.2 22H2l7.6-8.7L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20Z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Scout on LinkedIn"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:-translate-y-0.5 hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d="M6.5 8.3H3.7V21h2.8V8.3ZM5.1 3.5A1.7 1.7 0 1 0 5.1 7a1.7 1.7 0 0 0 0-3.4ZM21 21h-2.8v-6.7c0-1.6-.6-2.7-2-2.7-1.1 0-1.7.7-2 1.5-.1.2-.1.6-.1.9V21H9.3s0-11.5 0-12.7h2.8v1.8c.4-.6 1-1.5 2.6-1.5 1.9 0 3.4 1.2 3.4 3.9V21Z" />
                  </svg>
                </a>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Scout on WhatsApp"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white text-ink/70 transition hover:-translate-y-0.5 hover:text-moss"
                >
                  <WhatsAppGlyph className="h-4 w-4" />
                </a>
              </div>
            </div>

            <FooterCol
              title="Product"
              links={[
                { label: 'How it works', href: '#how' },
                { label: 'The report', href: '#report' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'FAQ', href: '#faq' },
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                { label: 'Message Scout', href: WA_LINK },
                { label: 'Contact', href: 'mailto:hi@realanshuman.com' },
              ]}
            />
            <FooterCol
              title="Legal"
              links={[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
              ]}
            />
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/[0.06] pt-6 text-sm text-mist sm:flex-row">
            <p>© {new Date().getFullYear()} Scout. All rights reserved.</p>
            <p>
              Built by{' '}
              <a
                href="https://realanshuman.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-ink/70 hover:text-ink"
              >
                Anshuman
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-mist/70">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-ink/70 transition hover:text-ink">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
