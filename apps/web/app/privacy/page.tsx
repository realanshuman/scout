import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Privacy · Scout',
  description: 'What Scout collects, why, and the choices you have. In plain language.',
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy"
      updated="July 2026"
      summary={[
        'We store your chat with Scout and the startup details you share, so Scout can do its job.',
        'We never sell your data, and investors never see it unless you email them yourself.',
        'We never see your card details. Payments are handled by Dodo Payments.',
        'Email us any time and we will delete everything we have about you.',
      ]}
    >
      <p>
        This page explains what information Scout collects, why we collect it, and the
        choices you have. We have kept it short and in plain language on purpose. If
        anything is unclear, email{' '}
        <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a> and a human will
        answer.
      </p>

      <LegalSection n={1} title="What we collect">
        <p>
          <strong>When you chat with Scout on WhatsApp:</strong> your phone number, your
          name if you share it, the messages in the conversation, and the startup details
          you tell Scout (things like your product, traction, raise amount, and market).
          This is the raw material Scout uses to build your profile and your investor
          report.
        </p>
        <p>
          <strong>When you sign in to the dashboard:</strong> your email address, your
          name, and a securely hashed password. We use industry-standard authentication
          (Better Auth) and never store passwords in plain text.
        </p>
        <p>
          <strong>When you buy the full report:</strong> the payment is processed
          entirely by our payment provider, Dodo Payments. We receive a confirmation that
          you paid and a payment reference. We never see or store your card number.
        </p>
      </LegalSection>

      <LegalSection n={2} title="How we use it">
        <p>
          Your information is used for exactly one thing: running Scout for you. That
          means researching your startup, matching you with investors, drafting your
          outreach, showing your data back to you in the dashboard, and answering your
          follow-up questions with full context.
        </p>
        <p>
          We do not sell your data. We do not use your startup details to train public
          AI models. Investors never see your information unless you send it to them
          yourself.
        </p>
      </LegalSection>

      <LegalSection n={3} title="Who we share it with">
        <p>
          Only the services required to run Scout, and only the minimum they need: our
          AI provider (to power the conversation and research), our search providers (to
          research your market), our database and hosting providers (to store and serve
          your data), WhatsApp / Meta (to deliver messages), and Dodo Payments (to
          process payments). Each of these processes your data under their own privacy
          terms, on our instructions.
        </p>
      </LegalSection>

      <LegalSection n={4} title="How long we keep it">
        <p>
          We keep your conversation and profile for as long as you use Scout, so it can
          keep acting as your fundraising assistant without asking you to repeat
          yourself. If you stop using Scout, your data simply sits in your account until
          you ask us to remove it.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Your choices">
        <p>
          <strong>See your data:</strong> everything Scout knows about your startup is
          visible in your dashboard profile.
        </p>
        <p>
          <strong>Fix your data:</strong> edit your profile in the dashboard, or just
          tell Scout on WhatsApp what changed.
        </p>
        <p>
          <strong>Delete your data:</strong> use the delete option in dashboard
          Settings, or email{' '}
          <a href="mailto:hi@realanshuman.com">hi@realanshuman.com</a>. We will remove
          your conversation, profile, and report from our systems.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Changes to this policy">
        <p>
          If we change this policy in a way that matters, we will update the date at the
          top and, for significant changes, tell you on WhatsApp before they take
          effect.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
