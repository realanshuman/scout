import Link from 'next/link';
import { ScoutMark } from '@/components/logo';
import { SiteNav, SiteFooter } from '@/components/site';

export default function Thanks() {
  return (
    <>
      <SiteNav />
      <main className="flex min-h-[70vh] items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-[1.75rem] border border-ink/[0.06] bg-card px-6 py-12 text-center shadow-lift sm:px-10">
          <ScoutMark className="mx-auto h-14 w-14" />
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
      </main>
      <SiteFooter />
    </>
  );
}
