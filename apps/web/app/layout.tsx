import type { Metadata } from 'next';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://scout.genflix.io';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Scout — Your AI fundraising associate on WhatsApp',
  description:
    'Chat with Scout on WhatsApp for 15 minutes. Get back the 50 investors most likely to fund your startup — who they are, why they fit you, and a personal email for each.',
  keywords: [
    'fundraising',
    'investors',
    'startup funding',
    'VC matching',
    'cold outreach',
    'WhatsApp',
  ],
  openGraph: {
    title: 'Scout — Your AI fundraising associate on WhatsApp',
    description:
      'Fifteen minutes of chat. Fifty hand-matched investors, each with a reason they fit and an email ready to send.',
    url: siteUrl,
    siteName: 'Scout',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scout — Your AI fundraising associate on WhatsApp',
    description:
      'Fifteen minutes of chat. Fifty hand-matched investors, each with a reason they fit and an email ready to send.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolage.variable}`}>
      <body className="grain bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
