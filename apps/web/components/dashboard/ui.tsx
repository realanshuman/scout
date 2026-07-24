import Link from 'next/link';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-mist">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-ink/10 bg-card p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-2 font-display text-3xl tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-sm text-mist">{hint}</p>}
    </Card>
  );
}

export function FitBadge({ fit }: { fit: number }) {
  return (
    <span className="shrink-0 rounded-full bg-signal/15 px-2.5 py-1 text-xs font-bold text-moss">
      {fit}% fit
    </span>
  );
}

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '15551234567';
export const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi Scout!')}`;

export function WhatsAppButton({
  label = 'Message Scout',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={WA_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition hover:opacity-90 ${className}`}
    >
      <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-gradient-to-b from-[#35de74] to-[#1fae54]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="currentColor" aria-hidden>
          <path d="M12 2a10 10 0 0 0-8.66 15L2 22l5.16-1.31A10 10 0 1 0 12 2Zm0 18.13a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.78.8-2.98-.2-.31A8.13 8.13 0 1 1 12 20.13Zm4.46-6.07c-.24-.12-1.44-.71-1.66-.79s-.39-.12-.55.12-.63.79-.77.95-.28.18-.53.06a6.65 6.65 0 0 1-1.95-1.2 7.33 7.33 0 0 1-1.35-1.68c-.14-.24 0-.37.1-.5s.24-.28.37-.42a1.65 1.65 0 0 0 .24-.41.45.45 0 0 0 0-.43c-.06-.12-.55-1.32-.75-1.8s-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69 14.1 14.1 0 0 0 1.4.51 3.35 3.35 0 0 0 1.54.1 2.52 2.52 0 0 0 1.65-1.17 2 2 0 0 0 .14-1.16c-.06-.11-.22-.17-.46-.29Z" />
        </svg>
      </span>
      {label}
    </Link>
  );
}
