import Link from 'next/link';
import type { ReactNode } from 'react';
import { WA_NUMBER, WA_LINK, waLink } from '@/lib/whatsapp-link';

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-display text-[28px] leading-tight tracking-tight sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-mist">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'article';
}) {
  return (
    <Tag
      className={`rounded-2xl border border-ink/[0.09] bg-card p-5 shadow-[0_1px_2px_rgb(0_0_0/0.03)] sm:p-6 ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionTitle({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-display text-xl tracking-tight ${className}`}>{children}</h2>;
}

export function StatTile({
  label,
  value,
  hint,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-2 font-display text-[28px] leading-none tracking-tight sm:text-3xl">{value}</p>
      {hint && <p className="mt-1.5 truncate text-sm text-mist">{hint}</p>}
    </Card>
  );
}

export function Badge({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'green' | 'amber' | 'red' | 'muted';
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: 'bg-ink/[0.06] text-ink/70',
    green: 'bg-signal/15 text-moss',
    amber: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
    red: 'bg-red-500/12 text-red-600 dark:text-red-400',
    muted: 'bg-paper text-mist',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function FitBadge({ fit }: { fit: number }) {
  const tone = fit >= 90 ? 'bg-signal/15 text-moss' : fit >= 80 ? 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400' : 'bg-ink/[0.06] text-ink/70';
  return <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>{fit}% fit</span>;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center justify-center py-14 text-center">
      {icon && (
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-signal/12 text-moss">{icon}</span>
      )}
      <h3 className="font-display text-xl tracking-tight">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-mist">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-ink/[0.07] ${className}`} />;
}

export { WA_NUMBER, WA_LINK, waLink };

export function WhatsAppButton({
  label = 'Message Scout',
  className = '',
  text,
}: {
  label?: string;
  className?: string;
  text?: string;
}) {
  const href = waLink(text);
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper transition-all duration-150 hover:opacity-90 active:scale-[0.98] ${className}`}
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
