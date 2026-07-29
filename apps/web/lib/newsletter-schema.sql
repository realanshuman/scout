-- Scout newsletter subscribers (Neon). Idempotent: safe to re-run.
--
-- The free weekly list: 10 fresh investors every Sunday. One row per email.

CREATE TABLE IF NOT EXISTS "subscriber" (
  "id"             text PRIMARY KEY,
  "email"          text NOT NULL UNIQUE,
  "name"           text,
  "stage"          text,               -- optional: what they're raising
  "status"         text NOT NULL DEFAULT 'active',  -- active | unsubscribed
  "source"         text,               -- where they signed up from
  "unsubscribeKey" text NOT NULL,      -- token for one-click unsubscribe
  "createdAt"      timestamp NOT NULL DEFAULT now(),
  "updatedAt"      timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "subscriber_status_idx" ON "subscriber" ("status");
CREATE UNIQUE INDEX IF NOT EXISTS "subscriber_unsub_idx" ON "subscriber" ("unsubscribeKey");
