-- Scout WhatsApp: paywall state. Run AFTER whatsapp-schema-2.sql. Idempotent.
--
-- The product flow is: interview -> research -> top-3 preview -> payment ->
-- full report. These columns track where each contact is in that flow.

ALTER TABLE "wa_contact"
  ADD COLUMN IF NOT EXISTS "unlocked" boolean NOT NULL DEFAULT false;

ALTER TABLE "wa_contact"
  ADD COLUMN IF NOT EXISTS "paymentRef" text;

ALTER TABLE "wa_contact"
  ADD COLUMN IF NOT EXISTS "paymentUrl" text;

CREATE INDEX IF NOT EXISTS "wa_contact_payment_ref_idx"
  ON "wa_contact" ("paymentRef") WHERE "paymentRef" IS NOT NULL;
