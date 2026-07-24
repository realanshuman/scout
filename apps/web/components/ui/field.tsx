'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

const fieldBase =
  'w-full rounded-xl border bg-card px-3.5 py-2.5 text-[15px] text-ink outline-none transition-all duration-150 placeholder:text-mist/55 focus:ring-4 focus:ring-signal/15 disabled:opacity-60';

export function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink/80">
      {children}
    </label>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
}: {
  label?: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div>
      {label && <Label htmlFor={htmlFor}>{label}</Label>}
      {children}
      {error ? (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-mist">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }>(
  function Input({ className = '', invalid, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`${fieldBase} ${invalid ? 'border-red-500/50 focus:border-red-500' : 'border-ink/12 focus:border-moss'} ${className}`}
        {...props}
      />
    );
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }>(
  function Textarea({ className = '', invalid, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={`${fieldBase} resize-y leading-relaxed ${invalid ? 'border-red-500/50' : 'border-ink/12 focus:border-moss'} ${className}`}
        {...props}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = '', children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={`${fieldBase} cursor-pointer border-ink/12 focus:border-moss ${className}`}
        {...props}
      >
        {children}
      </select>
    );
  },
);
