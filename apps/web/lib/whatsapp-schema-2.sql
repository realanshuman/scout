-- Scout WhatsApp: research state. Run AFTER whatsapp-schema.sql.
-- Idempotent: safe to run more than once.
--
-- Without these, Scout has no way to know whether research has actually run,
-- so it would answer "did you find investors?" from the model's imagination
-- instead of the truth.

ALTER TABLE "wa_contact"
  ADD COLUMN IF NOT EXISTS "researchStatus" text NOT NULL DEFAULT 'none';
  -- none | running | done | failed

ALTER TABLE "wa_contact"
  ADD COLUMN IF NOT EXISTS "matches" jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE "wa_contact"
  ADD COLUMN IF NOT EXISTS "researchedAt" timestamp;
