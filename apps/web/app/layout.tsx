import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scout — Your AI fundraising associate on WhatsApp',
  description:
    'Chat with Scout for 15 minutes on WhatsApp and get a curated list of the investors most likely to fund your startup, with personalized outreach for each.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-ink text-white antialiased">{children}</body>
    </html>
  );
}
