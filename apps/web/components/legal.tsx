import { SiteNav, SiteFooter } from '@/components/site';

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
    <>
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">Legal</p>
        <h1 className="mt-3 font-display text-5xl tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-3 text-sm text-mist">Last updated {updated}</p>
        <div className="mt-10 space-y-8 border-t border-ink/10 pt-8 text-[15px] leading-relaxed text-ink/80 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_a]:font-medium [&_a]:text-moss [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
