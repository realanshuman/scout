/**
 * Scout's mark: a scope reticle with an off-centre "locked" dot, the moment
 * of spotting the right target. Rendered on a green-gradient tile.
 */
export function ScoutMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="url(#scout-mark-g)" />
      <circle cx="16" cy="16" r="7" stroke="white" strokeWidth="1.7" opacity="0.95" />
      <path
        d="M16 5.6v3M16 23.4v3M5.6 16h3M23.4 16h3"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.95"
      />
      <circle cx="18.5" cy="13.5" r="2.5" fill="white" />
      <defs>
        <linearGradient
          id="scout-mark-g"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2fd66d" />
          <stop offset="1" stopColor="#0e7a5f" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Logo({
  className = '',
  markClassName = 'h-8 w-8',
  wordClassName = 'text-lg',
  invert = false,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  invert?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <ScoutMark className={markClassName} />
      <span
        className={`font-display font-extrabold tracking-tight ${
          invert ? 'text-white' : 'text-ink'
        } ${wordClassName}`}
      >
        Scout
      </span>
    </span>
  );
}
