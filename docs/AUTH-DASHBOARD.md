# Auth & Dashboard setup

The web app now has sign-in / sign-up (Better Auth) and a dashboard for paying
customers at `/dashboard`.

## What's included

- **Auth**: `/signin` and `/signup`, a branded split-screen layout, powered by
  Better Auth (email + password). Server config in `apps/web/lib/auth.ts`,
  client in `apps/web/lib/auth-client.ts`, API route at
  `apps/web/app/api/auth/[...all]/route.ts`.
- **Dashboard** (`apps/web/app/dashboard/*`):
  - **Overview** — stats, top investors, agent status, profile snapshot.
  - **Investors** — the full matched-investor list with fit scores, why-matched,
    contacts, and per-investor outreach drafts.
  - **Profile** — the structured startup profile Scout built from the chat.
  - **Agent** — WhatsApp connection, example prompts, notification toggles.
  - **Settings** — account, plan, sign out, delete.

## Turn it on

1. **Set env vars** (Vercel → project → Environment Variables), see `.env.example`:
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — your web app URL (e.g. `https://scout.realanshuman.com`)
   - `DATABASE_URL` — your Supabase Postgres connection string (use the poo:er
     connection string for serverless)
2. **Create the auth tables** — from `apps/web`, run once:
   ```
   npx @better-auth/cli migrate
   ```
   (or `generate` to get SQL you can paste into the Supabase SQL editor).
3. Deploy. Visitors can now sign up / sign in, and `/dashboard` is protected.

> Auth enforcement is gated on `DATABASE_URL`. Without it (local preview) the
> dashboard renders with sample data so it's viewable; with it set, the
> dashboard redirects to `/signin` when there's no session.

## Wiring real customer data (the one thing left)

The dashboard currently shows realistic **sample data** from
`apps/web/lib/dashboard-data.ts`. To show a customer their real profile and
investors, replace the body of `getDashboardData()` with a lookup that:

1. Gets the signed-in user's email from the Better Auth session.
2. Finds their `startup` + `investor_matches` in Supabase (the founder gives
   their email during the chat, or on signup — match on that).
3. Maps those rows to the `DashboardData` shape.

That single function is the only place that needs to change; every page reads
from it. Until the email↔startup link is decided, the sample data keeps the UI
fully demoable.
