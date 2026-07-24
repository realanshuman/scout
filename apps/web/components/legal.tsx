import { PageShell } from '@/components/page-shell';

/**
 * Layout for legal pages. Breadcrumb up top (via PageShell), a plain-words
 * summary before the detail, and numbered sections so the whole thing is
 * scannable by a normal human, not just a lawyer.
 */
export function LegalPage({
  title,
  updated,
  summary,
  children,
}: {
  title: string;
  updated: string;
  summary?: string[];
  children: React.ReactNode;
}) {
  return (
    <PageShell crumb={title}>
      <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-2 text-sm text-mist">Last updated {updated}</p>

      {summary && summary.length > 0 && (
        <div className="mt-8 rounded-3xl border border-moss/20 bg-signal/[0.06] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-moss">
            In plain words
          </p>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/85">
            {summary.map((s) => (
              <li key={s} className="flex gap-2.5">
                <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink/80 [&_a]:font-medium [&_a]:text-moss [&_a]:underline">
        {children}
      </div>
    </PageShell>
  );
}

/** A numbered legal section with a clear heading. */
export function LegalSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="flex items-baseline gap-2.5 text-lg font-semibold text-ink">
        <span className="text-sm font-bold text-moss">{n}.</span>
        {title}
      </h2>
      <div className="mt-2.5 space-y-3">{children}</div>
    </section>
  );
}
