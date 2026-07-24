'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type ToastKind = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((message: string, kind: ToastKind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm shadow-lift backdrop-blur motion-safe:animate-fade-up ${
              t.kind === 'error'
                ? 'border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300'
                : t.kind === 'info'
                  ? 'border-ink/12 bg-card/95 text-ink'
                  : 'border-signal/25 bg-signal/12 text-moss'
            }`}
          >
            <span aria-hidden className="mt-0.5">
              {t.kind === 'error' ? '⚠' : t.kind === 'info' ? 'ℹ' : '✓'}
            </span>
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
