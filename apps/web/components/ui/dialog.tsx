'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

/**
 * Accessible modal dialog. Controlled via `open` / `onClose`. Closes on
 * Escape and backdrop click, locks body scroll, and traps initial focus.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === 'sm' ? 'max-w-sm' : size === 'lg' ? 'max-w-2xl' : 'max-w-lg';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="absolute inset-0 bg-night/50 backdrop-blur-sm motion-safe:animate-[fade-up_0.15s_ease]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`relative w-full ${maxW} rounded-t-3xl border border-ink/10 bg-card p-6 shadow-lift outline-none sm:rounded-3xl motion-safe:animate-fade-up`}
      >
        {(title || description) && (
          <div className="mb-4 pr-8">
            {title && <h2 className="font-display text-2xl tracking-tight">{title}</h2>}
            {description && <p className="mt-1 text-sm text-mist">{description}</p>}
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-mist transition hover:bg-ink/5 hover:text-ink"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
        {footer && <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>
  );
}
