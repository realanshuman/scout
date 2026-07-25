-- Scout WhatsApp conversation state (Neon). Run AFTER auth-schema.sql and
-- app-schema.sql. Idempotent: safe to run more than once.
--
-- One contact per WhatsApp number that ever messages Scout, plus the message
-- history that gives the agent memory. `profile` is the structured startup
-- profile built up during the interview.

CREATE TABLE IF NOT EXISTS "wa_contact" (
  "id"        text PRIMARY KEY,
  "phone"     text NOT NULL UNIQUE,              -- E.164, e.g. +919876543210
  "name"      text,
  "stage"     text NOT NULL DEFAULT 'interview', -- interview | complete
  "profile"   jsonb NOT NULL DEFAULT '{}'::jsonb,
  "userId"    text REFERENCES "user" ("id") ON DELETE SET NULL,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "wa_message" (
  "id"          text PRIMARY KEY,
  "contactId"   text NOT NULL REFERENCES "wa_contact" ("id") ON DELETE CASCADE,
  "role"        text NOT NULL,                   -- user | assistant
  "content"     text NOT NULL,
  "providerRef" text,                            -- Twilio MessageSid, for dedupe
  "createdAt"   timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "wa_message_contact_idx"
  ON "wa_message" ("contactId", "createdAt");

-- Ignore Twilio webhook retries: the same MessageSid must not be processed twice.
CREATE UNIQUE INDEX IF NOT EXISTS "wa_message_provider_ref_idx"
  ON "wa_message" ("providerRef") WHERE "providerRef" IS NOT NULL;
