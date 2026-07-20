import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Privacy · Scout',
  description: 'How Scout handles the information you share during a fundraising session.',
};

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="July 2026">
      <p>
        Scout is an early-stage product. This page explains, in plain terms, what we
        collect and why. If anything here is unclear, email us at{' '}
        <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a>.
      </p>

      <div>
        <h2>What we collect</h2>
        <p className="mt-2">
          When you chat with Scout on WhatsApp we store your phone number, the messages
          in the conversation, and the startup details you share so we can build your
          profile and investor report. If you buy the full report, our payment provider
          processes the transaction, and we never see or store your card details.
        </p>
      </div>

      <div>
        <h2>How we use it</h2>
        <p className="mt-2">
          Your information is used to research your startup, match you with investors,
          draft your outreach, and answer your follow-up questions. We do not sell your
          data, and we do not share your startup details with third parties beyond the
          services needed to run Scout (for example, our AI, search, and hosting
          providers).
        </p>
      </div>

      <div>
        <h2>Your choices</h2>
        <p className="mt-2">
          You can ask us to delete your data at any time by emailing{' '}
          <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a>. We&apos;ll remove your
          conversation and profile from our systems.
        </p>
      </div>
    </LegalPage>
  );
}
