import Link from 'next/link';
import { Logo, ScoutMark } from '@/components/logo';

export default function Thanks() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md rounded-4xl border border-ink/[0.06] bg-card px-6 py-12 text-center shadow-lift sm:px-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-signal/12">
          <ScoutMark className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-4xl tracking-tight sm:text-5xl">
          Payment received 🎉
        </h1>
        <p className="mt-4 text-base leading-relaxed text-mist">
          Scout is generating your full investor report with personalized outreach
          right now. Head back to WhatsApp, it&apos;ll land in the next few minutes.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
      <div className="mt-8">
        <Logo wordClassName="text-base" markClassName="h-6 w-6" />
      </div>
    </main>
  );
}
