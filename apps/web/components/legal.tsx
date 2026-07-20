import Link from 'next/link';
import { Logo } from '@/components/logo';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
      <Link href="/" className="inline-block">
        <Logo />
      </Link>
      <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-mist">Last updated {updated}</p>
      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-ink/80 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-ink [&_a]:font-medium [&_a]:text-moss [&_a]:underline">
        {children}
      </div>
      <div className="mt-12 border-t border-ink/[0.06] pt-6 text-sm text-mist">
        <Link href="/" className="hover:text-ink">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
