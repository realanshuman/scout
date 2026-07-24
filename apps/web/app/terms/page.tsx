import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Terms · Scout',
  description: 'The terms for using Scout, in plain language.',
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms"
      updated="July 2026"
      summary={[
        'The interview, research, and top-3 preview are free. The full report is a one-time payment.',
        'Scout gives you research and drafts. You decide what to send, and funding is never guaranteed.',
        'Use Scout for your own raise. No reselling reports, no scraping, no spam.',
        'If something goes wrong with your purchase, email us and we will make it right.',
      ]}
    >
      <p>
        These are the terms for using Scout. By chatting with Scout or using the
        dashboard, you agree to them. They are deliberately short and readable. If you
        have questions, email{' '}
        <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a>.
      </p>

      <LegalSection n={1} title="What Scout is">
        <p>
          Scout is an AI fundraising associate. It interviews you about your startup,
          researches your company and market, matches you against an investor base, and
          drafts outreach for you. After the report, it stays available as your
          fundraising assistant on WhatsApp and in the dashboard.
        </p>
      </LegalSection>

      <LegalSection n={2} title="What Scout is not">
        <p>
          Scout is a research and drafting tool, not a broker, investment advisor, or
          introduction service. The matches, fit scores, and drafts are recommendations
          for you to review and act on. We do not guarantee funding, replies, meetings,
          or that every investor detail is current. Always use your own judgment before
          you hit send.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Pricing and payments">
        <p>
          The founder interview, the research, and a preview of your top three matches
          are free, with no card required. The full report, all matched investors with
          contacts and personalized outreach plus the ongoing assistant, is a one-time
          purchase of ₹999 / $29. Payments are processed by Dodo Payments, who act as
          merchant of record and handle taxes and invoicing.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Refunds">
        <p>
          Because the report is delivered digitally and immediately on payment,
          purchases are generally non-refundable. That said, if something genuinely went
          wrong, the report failed to deliver, you were charged twice, or the output is
          broken, email{' '}
          <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a> within 14 days
          and we will fix it or refund you.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Fair use">
        <p>
          Use Scout for your own fundraising. Do not resell or republish the reports,
          scrape or reverse-engineer the service, or use investor contacts to send bulk
          or automated spam. The contact details Scout gives you exist so you can reach
          out thoughtfully, one founder to one investor. If we see abuse, we can suspend
          access.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Your account">
        <p>
          Keep your sign-in credentials to yourself, and tell us if you think someone
          else has accessed your account. You can delete your account at any time from
          dashboard Settings, which removes your data as described in our{' '}
          <a href="/privacy">Privacy policy</a>.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Liability">
        <p>
          Scout is provided as-is. To the extent the law allows, our total liability for
          any claim related to the service is limited to the amount you paid us. Nothing
          in these terms limits liability that cannot legally be limited.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Changes">
        <p>
          We may update these terms as Scout evolves. We will update the date at the
          top, and for significant changes we will tell you on WhatsApp before they take
          effect. Continuing to use Scout after a change means you accept the new terms.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
