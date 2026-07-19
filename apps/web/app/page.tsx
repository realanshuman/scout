const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

const steps = [
  {
    title: 'Chat with Scout',
    body: 'A 15-minute WhatsApp conversation — like talking to an experienced founder, not filling a form.',
  },
  {
    title: 'Scout researches your startup',
    body: 'Your website, market, competitors and traction, distilled into an investor-grade profile.',
  },
  {
    title: 'Find investors',
    body: 'Your profile is matched against a curated investor base — stage, sector, geography, check size, thesis and portfolio fit.',
  },
  {
    title: 'Generate outreach',
    body: 'A personalized cold email and LinkedIn DM for every investor, each anchored on why they specifically should care.',
  },
];

const faqs = [
  {
    q: 'How is this different from an investor database?',
    a: 'Databases give you 5,000 names. Scout gives you the top 50 for your startup — each with a concrete reason they fit and a ready-to-send personalized email.',
  },
  {
    q: 'How long does it take?',
    a: 'About 15 minutes of chat, then 5–10 minutes of research. You get your investor preview in under 30 minutes total.',
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

function WhatsAppButton({ label }: { label: string }) {
  return (
    <a
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 rounded-full bg-signal px-8 py-4 text-lg font-semibold text-ink transition hover:brightness-110"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.28.18-.53.06a6.65 6.65 0 0 1-1.95-1.2 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.5s.24-.28.37-.42a1.65 1.65 0 0 0 .24-.41.45.45 0 0 0 0-.43c-.06-.12-.55-1.32-.75-1.8s-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69 14.1 14.1 0 0 0 1.4.51 3.35 3.35 0 0 0 1.54.1 2.52 2.52 0 0 0 1.65-1.17 2 2 0 0 0 .14-1.16c-.06-.11-.22-.17-.46-.29Z" />
      </svg>
      {label}
    </a>
  );
}

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6">
      {/* Nav */}
      <nav className="flex items-center justify-between py-6">
        <span className="text-xl font-bold tracking-tight">🔭 Scout</span>
        <div className="hidden gap-8 text-sm text-mist sm:flex">
          <a href="#how" className="hover:text-white">How it works</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-24 text-center sm:py-32">
        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Meet Scout.
          <br />
          <span className="text-mist">Your AI fundraising associate.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-mist">
          Chat on WhatsApp for 15 minutes. Get the investors most likely to fund
          your startup — with a personalized email for each. No forms. No
          spreadsheets. No weeks of research.
        </p>
        <div className="mt-10">
          <WhatsAppButton label="Message Scout" />
        </div>
        <p className="mt-4 text-sm text-mist">
          Free to start · investor preview in ~30 minutes
        </p>
      </section>

      {/* How it works */}
      <section id="how" className="py-20">
        <h2 className="text-center text-3xl font-bold">How it works</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-signal/20 font-bold text-signal">
                {i + 1}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-mist">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <h2 className="text-center text-3xl font-bold">Pricing</h2>
        <div className="mx-auto mt-12 grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-lg font-semibold">Free</h3>
            <p className="mt-1 text-4xl font-bold">$0</p>
            <ul className="mt-6 space-y-3 text-mist">
              <li>✓ Founder interview on WhatsApp</li>
              <li>✓ Automatic startup research</li>
              <li>✓ Preview of your top 3 investors</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-signal/50 bg-signal/5 p-8">
            <h3 className="text-lg font-semibold text-signal">Pro</h3>
            <p className="mt-1 text-4xl font-bold">
              ₹999 <span className="text-lg font-normal text-mist">/ $29</span>
            </p>
            <ul className="mt-6 space-y-3 text-mist">
              <li>✓ Full report — your top 50 investors</li>
              <li>✓ Why each investor fits, with confidence scores</li>
              <li>✓ Contact details for every match</li>
              <li>✓ Personalized cold email + LinkedIn DM per investor</li>
              <li>✓ Ongoing AI fundraising assistant</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <h2 className="text-center text-3xl font-bold">FAQ</h2>
        <div className="mx-auto mt-12 max-w-2xl space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-xl border border-white/10 bg-white/5 p-5">
              <summary className="cursor-pointer list-none font-medium marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 text-mist">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 text-center">
        <h2 className="text-3xl font-bold">Your next investor is a chat away.</h2>
        <div className="mt-8">
          <WhatsAppButton label="Message Scout" />
        </div>
      </section>

      <footer className="border-t border-white/10 py-8 text-center text-sm text-mist">
        © {new Date().getFullYear()} Scout · team@genflix.io
      </footer>
    </main>
  );
}
