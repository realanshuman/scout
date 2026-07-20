'use client';

import { useEffect, useState } from 'react';

/**
 * Day / night switch. The current theme class is set before paint by the
 * inline script in layout.tsx; this component just reflects and updates it.
 */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
    setMounted(true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('scout-theme', next ? 'dark' : 'light');
    } catch {
      /* private browsing */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to day mode' : 'Switch to night mode'}
      className="inline-flex items-center gap-1 rounded-full border border-ink/10 bg-card p-1 shadow-sm"
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-full transition ${
          mounted && !dark ? 'bg-signal/15 text-moss' : 'text-mist'
        }`}
      >
        {/* sun */}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
        </svg>
      </span>
      <span
        className={`grid h-7 w-7 place-items-center rounded-full transition ${
          mounted && dark ? 'bg-signal/15 text-moss' : 'text-mist'
        }`}
      >
        {/* moon */}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
        </svg>
      </span>
    </button>
  );
}
