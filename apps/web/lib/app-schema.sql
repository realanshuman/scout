-- Scout application schema (Neon) -- run AFTER auth-schema.sql.
-- Idempotent: safe to run more than once. Paste into Neon -> SQL Editor.
--
-- These tables hold each customer's subscription, the startup profile Scout
-- built for them, and their ranked investor matches. All keyed to the Better
-- Auth user id (text).

-- One subscription row per user. For Scout this is a one-time unlock, so an
-- "active" status means lifetime access; currentPeriodEnd is reserved for
-- future recurring plans.
CREATE TABLE IF NOT EXISTS "subscription" (
  "id"               text PRIMARY KEY,
  "userId"           text NOT NULL UNIQUE REFERENCES "user" ("id") ON DELETE CASCADE,
  "status"           text NOT NULL DEFAULT 'inactive',   -- inactive | active | canceled
  "plan"             text NOT NULL DEFAULT 'pro',
  "provider"         text,                                -- e.g. 'dodo'
  "providerRef"      text,                                -- checkout session / payment id
  "currentPeriodEnd" timestamp,
  "createdAt"        timestamp NOT NULL DEFAULT now(),
  "updatedAt"        timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "subscription_providerRef_idx" ON "subscription" ("providerRef");

-- The startup profile + agent settings for a user's workspace.
CREATE TABLE IF NOT EXISTS "workspace" (
  "id"                text PRIMARY KEY,
  "userId"            text NOT NULL UNIQUE REFERENCES "user" ("id") ON DELETE CASCADE,
  "startupName"       text,
  "website"           text,
  "oneLiner"          text,
  "industry"          text,
  "stage"             text,
  "country"           text,
  "raiseUsd"          numeric,
  "mrrUsd"            numeric,
  "traction"          text,
  "businessModel"     text,
  "competitors"       jsonb NOT NULL DEFAULT '[]'::jsonb,   -- string[]
  "founders"          jsonb NOT NULL DEFAULT '[]'::jsonb,   -- {name, role}[]
  "reportStatus"      text NOT NULL DEFAULT 'ready',        -- ready | generating
  "whatsappConnected" boolean NOT NULL DEFAULT false,
  "whatsappNumber"    text,
  "emailReport"       boolean NOT NULL DEFAULT true,
  "notifyNewMatches"  boolean NOT NULL DEFAULT true,
  "weeklyNudge"       boolean NOT NULL DEFAULT false,
  "createdAt"         timestamp NOT NULL DEFAULT now(),
  "updatedAt"         timestamp NOT NULL DEFAULT now()
);

-- Ranked investor matches for a user's workspace.
CREATE TABLE IF NOT EXISTS "investor_match" (
  "id"              text PRIMARY KEY,
  "userId"          text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "rank"            integer NOT NULL,
  "firm"            text NOT NULL,
  "partner"         text,
  "fit"             integer NOT NULL,
  "stages"          text,
  "checkSize"       text,
  "sectors"         text,
  "why"             text,
  "email"           text,
  "linkedin"        text,
  "outreachSubject" text,
  "outreachBody"    text,
  "saved"           boolean NOT NULL DEFAULT false,
  "status"          text NOT NULL DEFAULT 'new',           -- new | contacted | passed
  "createdAt"       timestamp NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "investor_match_userId_idx" ON "investor_match" ("userId", "rank");
