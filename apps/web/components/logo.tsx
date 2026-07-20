/**
 * Scout's mascot: a friendly green agent with big eyes looking off to the
 * right (always scouting) and a little signal antenna. Drawn inline so it
 * stays crisp at any size and needs no image assets.
 */
export function ScoutMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      {/* antenna */}
      <path d="M20.5 6.2 22.8 3.6" stroke="url(#scout-g)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="23.6" cy="2.8" r="1.9" fill="#2fd66d" />
      {/* head: soft blob with a flat-ish bottom */}
      <path
        d="M16 6C9.6 6 5.5 10.4 5.5 16.6c0 4.8 2.2 8.2 4.1 9.9.7.6 1.1 1 2.4.9 1.2-.1 2.4-.6 4-.6s2.8.5 4 .6c1.3.1 1.7-.3 2.4-.9 1.9-1.7 4.1-5.1 4.1-9.9C26.5 10.4 22.4 6 16 6Z"
        fill="url(#scout-g)"
      />
      {/* eyes: looking up-right */}
      <circle cx="13.2" cy="16.4" r="3.6" fill="white" />
      <circle cx="20.4" cy="15.6" r="3.6" fill="white" />
      <circle cx="14.4" cy="15.6" r="1.7" fill="#0c1512" />
      <circle cx="21.6" cy="14.8" r="1.7" fill="#0c1512" />
      <defs>
        <linearGradient id="scout-g" x1="5" y1="6" x2="27" y2="28" gradientUnits="userSpaceOnUse">
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
  wordClassName = 'text-2xl',
  invert = false,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  invert?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <ScoutMark className={markClassName} />
      <span
        className={`font-display leading-none ${invert ? 'text-white' : 'text-ink'} ${wordClassName}`}
      >
        Scout
      </span>
    </span>
  );
}
