'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal/40 focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-55 active:scale-[0.98] whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary: 'bg-signal text-[#0c1512] shadow-sm hover:brightness-105 hover:shadow-md',
  secondary: 'border border-ink/12 bg-card text-ink hover:border-ink/25 hover:bg-ink/[0.03]',
  ghost: 'text-mist hover:bg-ink/[0.05] hover:text-ink',
  danger: 'border border-red-500/30 text-red-600 hover:bg-red-500/8 dark:text-red-400',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-12 px-6 text-base',
};

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7V2Z" />
    </svg>
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, fullWidth = false, className = '', children, disabled, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
});

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  external = false,
  className = '',
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  external?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
