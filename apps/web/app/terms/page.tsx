import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Terms — Scout',
  description: 'The terms for using Scout, your AI fundraising associate.',
};

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="July 2026">
      <p>
        These are the terms for using Scout. By chatting with Scout you agree to them.
        Questions? Email <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a>.
      </p>

      <div>
        <h2>What Scout does</h2>
        <p className="mt-2">
          Scout interviews you, researches your startup, and produces a list of matched
          investors with suggested outreach. It&apos;s a research and drafting tool — the
          matches and emails are recommendations for you to review, not guarantees of
          funding, replies, or introductions.
        </p>
      </div>

      <div>
        <h2>Payments</h2>
        <p className="mt-2">
          The interview, research, and top-3 preview are free. The full report is a
          one-time purchase. Because the report is delivered digitally and immediately on
          payment, purchases are generally non-refundable — but if something goes wrong,
          email us and we&apos;ll make it right.
        </p>
      </div>

      <div>
        <h2>Fair use</h2>
        <p className="mt-2">
          Use Scout for your own fundraising. Don&apos;t resell the reports, scrape the
          service, or use it to send spam. Investor contact details are provided so you
          can reach out thoughtfully — treat them with the same care you&apos;d want.
        </p>
      </div>
    </LegalPage>
  );
}
