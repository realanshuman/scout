import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Inter } from 'next/font/google';
import './globals.css';

// Geist for display (clean, cool, modern), Inter for body (best small-size
// legibility on phones). Both are self-hosted, so no runtime font fetch.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="en" className={`${GeistSans.variable} ${inter.variable}`}>
      <body className="grain bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
