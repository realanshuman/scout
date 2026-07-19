const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

const steps = [
  {
    emoji: '💬',
    title: 'Chat with Scout',
    body: '15 minutes on WhatsApp. A real conversation — not a form.',
  },
  {
    emoji: '🔍',
    title: 'Scout researches you',
    body: 'Your website, market, competitors and traction — distilled into an investor-grade profile.',
  },
  {
    emoji: '🎯',
    title: 'Get matched investors',
    body: 'Your top 50 by stage, sector, geography, check size and thesis — each with the reason they fit.',
  },
  {
    emoji: '✉️',
    title: 'Send real outreach',
    body: 'A personalized cold email and LinkedIn DM for every investor on your list.',
  },
];

const faqs = [
  {
    q: 'How is this different from an investor database?',
    a: 'Databases give you 5,000 names. Scout gives you the top 50 for your startup — each with a concrete reason they fit and a ready-to-send personalized email.',
  },
  {
    q: 'How long does it take?',
    a: 'About 15 minutes of chat, then 5–10 minutes of research. Your investor preview lands in under 30 minutes.',
  },
  {
    q: 'Do I have to repeat myself?',
    a: 'Never. Scout remembers everything you say. After your report, it becomes your ongoing fundraising assistant with full context on your startup.',
  },
  {
    q: 'What does it cost?',
    a: 'The interview, research and a preview of your top 3 investors are free. The full report — all matches with contacts and personalized outreach — is ₹999 / $29.',
  },
  {
    q: 'Will investors know an AI wrote my outreach?',
    a: 'Every draft is written from your real traction and the investor’s real thesis and portfolio — then you review and send it yourself. No mass blasts.',
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.28.18-.53.06a6.65 6.65 0 0 1-1.95-1.2 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.5s.24-.28.37-.42a1.65 1.65 0 0 0 .24-.41.45.45 0 0 0 0-.43c-.06-.12-.55-1.32-.75-1.8s-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69 14.1 14.1 0 0 0 1.4.51 3.35 3.35 0 0 0 1.54.1 2.52 2.52 0 0 0 1.65-1.17 2 2 0 0 0 .14-1.16c-.06-.11-.22-.17-.46-.29Z" />
    </svg>
  );
}

function CTA({ label, className = '' }: { label: string; className?: string }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-signal px-7 py-4 text-base font-semibold text-ink shadow-soft transition active:scale-[0.98] sm:w-auto sm:hover:brightness-105 sm:hover:shadow-lift ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      {label}
    </a>
  );
}

function ChatIn({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[85%] self-start rounded-2xl rounded-tl-md bg-white px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
      {children}
    </div>
  );
}

function ChatOut({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[85%] self-end rounded-2xl rounded-tr-md bg-bubble px-3.5 py-2.5 text-sm leading-relaxed shadow-sm">
      {children}
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-ink/10 bg-chatbg shadow-lift">
      {/* chat header */}
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-signal text-base">
          🔭
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Scout</p>
          <p className="text-xs text-white/70">online</p>
        </div>
      </div>
      {/* messages */}
      <div className="flex flex-col gap-2 px-3 py-4">
        <ChatIn>
          Hey 👋 I&apos;m Scout. I&apos;ll help you find investors that actually invest in
          startups like yours. What&apos;s your startup called?
        </ChatIn>
        <ChatOut>Loop — AI copilot for warehouse teams. We&apos;re at $18k MRR.</ChatOut>
        <ChatIn>
          Nice, that&apos;s real traction 📈 Who&apos;s buying today — the ops manager or the
          floor lead?
        </ChatIn>
        <ChatOut>Ops managers. Mid-size 3PLs mostly.</ChatOut>
        <ChatIn>
          ✅ <span className="font-semibold">Research complete.</span>
          <br />
          Found <span className="font-semibold">58 highly relevant investors</span>.
          <br />
          <span className="text-mist">
            #1 Northbeam Ventures — led two logistics-AI seeds this year…
          </span>
        </ChatIn>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-ink/5 bg-paper/90 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3.5">
          <span className="text-lg font-bold tracking-tight">🔭 Scout</span>
          <div className="flex items-center gap-6">
            <div className="hidden gap-6 text-sm text-mist sm:flex">
              <a href="#how" className="transition hover:text-ink">How it works</a>
              <a href="#pricing" className="transition hover:text-ink">Pricing</a>
              <a href="#faq" className="transition hover:text-ink">FAQ</a>
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink/85"
            >
              Message Scout
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5">
        {/* Hero */}
        <section className="pb-14 pt-14 text-center sm:pb-20 sm:pt-24">
          <p className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-1.5 text-xs font-medium text-mist shadow-sm sm:text-sm">
            <span className="h-2 w-2 rounded-full bg-signal" />
            Your AI fundraising associate · on WhatsApp
          </p>
          <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-[1.1] tracking-tight sm:max-w-4xl sm:text-6xl">
            Meet the right investors, not a spreadsheet of 5,000.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-mist sm:text-lg">
            Chat with Scout for 15 minutes. It researches your startup, finds the
            investors most likely to fund it, and writes a personalized email for
            each — while you make coffee.
          </p>
          <div className="mt-8 px-2 sm:px-0">
            <CTA label="Message Scout" />
          </div>
          <p className="mt-4 text-xs text-mist sm:text-sm">
            Free to start · top-3 preview in ~30 minutes
          </p>

          <div className="mt-12 sm:mt-16">
            <PhoneMockup />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 py-14 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-5">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="flex items-start gap-4 rounded-2xl border border-ink/5 bg-white p-5 shadow-soft sm:block sm:p-7"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-signal/15 text-xl sm:mb-4">
                  {step.emoji}
                </div>
                <div>
                  <h3 className="font-semibold sm:text-lg">
                    <span className="mr-1.5 text-mist">{i + 1}.</span>
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-mist sm:mt-2 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="scroll-mt-20 py-14 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-3 text-center text-sm text-mist sm:text-base">
            Start free. Pay once when you&apos;ve seen the matches.
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5">
            <div className="rounded-2xl border border-ink/5 bg-white p-6 shadow-soft sm:p-8">
              <h3 className="font-semibold">Free</h3>
              <p className="mt-2 text-3xl font-bold sm:text-4xl">$0</p>
              <ul className="mt-5 space-y-2.5 text-sm text-mist sm:text-base">
                <li className="flex gap-2"><span className="text-moss">✓</span> Founder interview on WhatsApp</li>
                <li className="flex gap-2"><span className="text-moss">✓</span> Automatic startup research</li>
                <li className="flex gap-2"><span className="text-moss">✓</span> Preview of your top 3 investors</li>
              </ul>
            </div>
            <div className="relative rounded-2xl border-2 border-signal bg-white p-6 shadow-lift sm:p-8">
              <span className="absolute -top-3 right-5 rounded-full bg-signal px-3 py-1 text-xs font-semibold text-ink">
                Full report
              </span>
              <h3 className="font-semibold text-moss">Pro</h3>
              <p className="mt-2 text-3xl font-bold sm:text-4xl">
                ₹999 <span className="text-base font-normal text-mist">/ $29 · one-time</span>
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-mist sm:text-base">
                <li className="flex gap-2"><span className="text-moss">✓</span> Your top 50 investors, ranked</li>
                <li className="flex gap-2"><span className="text-moss">✓</span> Why each one fits, with confidence scores</li>
                <li className="flex gap-2"><span className="text-moss">✓</span> Contact details for every match</li>
                <li className="flex gap-2"><span className="text-moss">✓</span> Personalized email + LinkedIn DM per investor</li>
                <li className="flex gap-2"><span className="text-moss">✓</span> Ongoing AI fundraising assistant</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="scroll-mt-20 py-14 sm:py-20">
          <h2 className="text-center text-2xl font-bold tracking-tight sm:text-4xl">FAQ</h2>
          <div className="mx-auto mt-8 max-w-2xl space-y-3 sm:mt-12">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-ink/5 bg-white px-5 py-4 shadow-soft open:shadow-lift"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium sm:text-base [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-mist transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mist sm:text-base">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center sm:py-24">
          <div className="rounded-3xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-md text-2xl font-bold tracking-tight sm:text-4xl">
              Your next investor is a chat away.
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-white/60 sm:text-base">
              15 minutes on WhatsApp. No forms, no spreadsheets, no weeks of research.
            </p>
            <div className="mt-8 px-2 sm:px-0">
              <CTA label="Message Scout" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/5 py-8 text-center text-sm text-mist">
        © {new Date().getFullYear()} Scout · team@genflix.io
      </footer>
    </>
  );
}
