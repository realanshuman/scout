import type { Metadata } from 'next';
import { PageShell } from '@/components/page-shell';
import { WA_LINK } from '@/lib/whatsapp-link';

export const metadata: Metadata = {
  title: 'Contact · Scout',
  description: 'Reach the person behind Scout, or just message Scout on WhatsApp.',
};

const channels = [
  {
    title: 'Start with Scout',
    body: 'Want to try the product? Say hi on WhatsApp and the interview starts. Free, no login, about 15 minutes.',
    action: 'Open WhatsApp',
    href: WA_LINK,
    external: true,
  },
  {
    title: 'Email a human',
    body: 'Questions, feedback, partnerships, press, or help with a purchase. Replies come from a person, usually within a day.',
    action: 'hi@realanshuman.com',
    href: 'mailto:hi@realanshuman.com',
    external: false,
  },
  {
    title: 'Fix our data',
    body: 'Spotted an investor detail that is wrong or out of date? Tell us and we will correct it for everyone.',
    action: 'Report a correction',
    href: 'mailto:hi@realanshuman.com?subject=Investor%20data%20correction',
    external: false,
  },
];

export default function Contact() {
  return (
    <PageShell crumb="Contact">
      <h1 className="font-display text-4xl tracking-tight sm:text-6xl">Say hello.</h1>
      <p className="mt-4 max-w-md text-mist">
        Scout is small and independent, which means messages actually get read. Pick
        whichever channel fits.
      </p>

      <div className="mt-10 space-y-4">
        {channels.map((c) => (
          <a
            key={c.title}
            href={c.href}
            {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="group block rounded-3xl border border-ink/[0.08] bg-card p-6 transition duration-200 hover:-translate-y-0.5 hover:border-ink/[0.16] hover:shadow-soft sm:p-7"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold tracking-[-0.01em]">{c.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-mist">{c.body}</p>
              </div>
              <span className="hidden shrink-0 text-sm font-medium text-moss transition group-hover:translate-x-0.5 sm:block">
                {c.action} →
              </span>
            </div>
            <span className="mt-3 block text-sm font-medium text-moss sm:hidden">
              {c.action} →
            </span>
          </a>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-ink/[0.08] bg-paper/60 p-6 text-sm leading-relaxed text-mist sm:p-7">
        <p className="font-semibold text-ink">Already a customer?</p>
        <p className="mt-1.5">
          The fastest way to get help is to message Scout directly on WhatsApp. It has
          full context on your account, and for anything it cannot solve, a human steps
          in over email.
        </p>
      </div>
    </PageShell>
  );
}
