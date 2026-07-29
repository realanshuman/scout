import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

// Editorial pairing: high-contrast serif for display, neutral sans for body.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const serif = Instrument_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

// Metadata fallback only. Set NEXT_PUBLIC_SITE_URL to your real deploy URL.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scout.realanshuman.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Scout · Your AI fundraising associate on WhatsApp',
  description:
    'Chat with Scout on WhatsApp for 15 minutes. Get back the 50 investors most likely to fund your startup: who they are, why they fit you, and a personal email for each.',
  keywords: [
    'fundraising',
    'investors',
    'startup funding',
    'VC matching',
    'cold outreach',
    'WhatsApp',
  ],
  openGraph: {
    title: 'Scout · Your AI fundraising associate on WhatsApp',
    description:
      'Fifteen minutes of chat. Fifty hand-matched investors, each with a reason they fit and an email ready to send.',
    url: siteUrl,
    siteName: 'Scout',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scout · Your AI fundraising associate on WhatsApp',
    description:
      'Fifteen minutes of chat. Fifty hand-matched investors, each with a reason they fit and an email ready to send.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        {/* Set the theme class before paint to avoid a flash of wrong mode. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('scout-theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
      </head>
      <body className="grain bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
