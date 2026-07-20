import type { SVGProps } from 'react';

/** Minimal line-icon set, 24px grid, inherits currentColor. */
function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const IconChat = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M21 11.5a8.4 8.4 0 0 1-12.1 7.5L4 20.5l1.6-4.6A8.4 8.4 0 1 1 21 11.5Z" />
    <path d="M8.5 11h7M8.5 14h4" />
  </Icon>
);

export const IconResearch = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
    <path d="M11 8v6M8 11h6" opacity="0.5" />
  </Icon>
);

export const IconTarget = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
  </Icon>
);

export const IconSend = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M22 2 11 13" />
    <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
  </Icon>
);

export const IconShield = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 3 5 6v5.5c0 4.4 3 7.4 7 8.9 4-1.5 7-4.5 7-8.9V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Icon>
);

export const IconList = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M9.5 7h11M9.5 12h11M9.5 17h11" />
    <path d="m3.5 7 1 1 2-2M3.5 12l1 1 2-2M3.5 17l1 1 2-2" />
  </Icon>
);

export const IconCompass = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.5 8.5-2 5.5-5 2 2-5.5 5-2Z" />
  </Icon>
);

export const IconSpark = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M12 3c.4 3.8 1.9 5.3 5.7 5.7-3.8.4-5.3 1.9-5.7 5.7-.4-3.8-1.9-5.3-5.7-5.7C10.1 8.3 11.6 6.8 12 3Z" />
    <path d="M18.5 14.5c.2 1.7.8 2.3 2.5 2.5-1.7.2-2.3.8-2.5 2.5-.2-1.7-.8-2.3-2.5-2.5 1.7-.2 2.3-.8 2.5-2.5Z" />
  </Icon>
);

export const IconArrow = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path d="m4 12 5 5L20 6" />
  </Icon>
);
