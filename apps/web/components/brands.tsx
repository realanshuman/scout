import type { SVGProps } from 'react';

/** Simple monochrome source marks (currentColor) for the diligence band. */

export const BrandGlobe = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M2.5 12h19M12 2.5c2.7 2.6 4 6 4 9.5s-1.3 6.9-4 9.5c-2.7-2.6-4-6-4-9.5s1.3-6.9 4-9.5Z" />
  </svg>
);

export const BrandLinkedIn = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M4.5 3.2A2.3 2.3 0 1 1 4.5 7.8 2.3 2.3 0 0 1 4.5 3.2ZM2.6 9.4h3.8V21H2.6V9.4Zm6.2 0h3.6v1.6h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.7V21h-3.8v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H8.8V9.4Z" />
  </svg>
);

export const BrandCrunchbase = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M11 10.2a2.6 2.6 0 1 0 0 3.6M13.4 7.5v4.2m0 0a2.65 2.65 0 1 1 0 .01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const BrandX = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M18.9 2H22l-7.1 8.1L23 22h-6.6l-5.2-6.8L5.2 22H2l7.6-8.7L1.5 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.1 3.9H5.2L17.7 20Z" />
  </svg>
);

export const BrandYC = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M8.2 7 12 12.6 15.8 7M12 12.6V17.2"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BrandProductHunt = (p: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M9.5 17V7.5h3.6a3.1 3.1 0 0 1 0 6.2H9.5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const BrandNews = (p: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    {...p}
  >
    <path d="M4 5.5h13v13a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2v-13Z" />
    <path d="M17 8.5h3v10a2 2 0 0 1-2 2M7.5 9h6M7.5 12.5h6M7.5 16h4" />
  </svg>
);
