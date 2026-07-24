-- Better Auth schema for Scout (email + password).
-- Run this ONCE in your Neon SQL editor (Neon dashboard -> SQL Editor) to
-- create the tables Better Auth needs. It is idempotent: "IF NOT EXISTS"
-- means running it again does nothing, so it's safe to re-run.
--
-- Column names are camelCase and quoted on purpose: Better Auth expects them
-- exactly like this. Do not rename them.

CREATE TABLE IF NOT EXISTS "user" (
  "id"            text PRIMARY KEY,
  "name"          text NOT NULL,
  "email"         text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL DEFAULT false,
  "image"         text,
  "createdAt"     timestamp NOT NULL DEFAULT now(),
  "updatedAt"     timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "session" (
  "id"        text PRIMARY KEY,
  "expiresAt" timestamp NOT NULL,
  "token"     text NOT NULL UNIQUE,
  "createdAt" timestamp NOT NULL DEFAULT now(),
  "updatedAt" timestamp NOT NULL DEFAULT now(),
  "ipAddress" text,
  "userAgent" text,
  "userId"    text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "account" (
  "id"                    text PRIMARY KEY,
  "accountId"             text NOT NULL,
  "providerId"           text NOT NULL,
  "userId"                text NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
  "accessToken"           text,
  "refreshToken"          text,
  "idToken"               text,
  "accessTokenExpiresAt"  timestamp,
  "refreshTokenExpiresAt" timestamp,
  "scope"                 text,
  "password"              text,
  "createdAt"             timestamp NOT NULL DEFAULT now(),
  "updatedAt"             timestamp NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "verification" (
  "id"         text PRIMARY KEY,
  "identifier" text NOT NULL,
  "value"      text NOT NULL,
  "expiresAt"  timestamp NOT NULL,
  "createdAt"  timestamp NOT NULL DEFAULT now(),
  "updatedAt"  timestamp NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("userId");
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("userId");
CREATE INDEX IF NOT EXISTS "verification_identifier_idx" ON "verification" ("identifier");
