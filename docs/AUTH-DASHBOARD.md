# Auth, paywall & dashboard

The web app is login-only with a subscription paywall in front of a
production dashboard for paying customers.

## The flow

1. **Sign in** at `/signin` (Better Auth, email + password). Public sign-up is
   **disabled** — accounts are provisioned through Scout's onboarding (WhatsApp
   / after payment) and the demo seed, never self-serve on the website.
2. After sign-in, the dashboard checks for an **active subscription**:
   - No active subscription → redirected to `/paywall`.
   - Active subscription → straight to `/dashboard`.
3. On the **paywall**, "Continue to checkout" starts a Dodo Payments checkout.
4. On a **successful payment**, the subscription is activated and a workspace is
   ensured, then the user lands on `/dashboard?welcome=1`. This happens two ways
   (both idempotent): the Dodo **webhook** (`/api/webhooks/dodo`) and a
   **return-url check** (`/checkout/return`) that verifies the payment with Dodo
   even if the webhook hasn't landed yet.
5. Every `/dashboard/*` route is gated on **auth + active subscription** in the
   layout, so there's no way in without both.

## What's in the dashboard

- **Overview** — real stats, top investors, agent status, profile snapshot, with
  empty states when a profile/matches aren't in yet.
- **Investors** — the full matched list with working filters, search, save,
  status (not contacted / contacted / passed), and a per-investor outreach draft
  modal (copy / open in email).
- **Profile** — the structured startup profile, editable via a validated modal
  form (or by chatting with Scout on WhatsApp).
- **Agent** — WhatsApp connection, example prompts (deep-link into WhatsApp), and
  notification toggles that persist.
- **Settings** — account, change password, plan (from the real subscription),
  sign out, delete account (all functional).

## Turn it on (Neon)

1. **Set env vars** (Vercel → Environment Variables), see `.env.example`:
   - `BETTER_AUTH_SECRET` — `openssl rand -base64 32`
   - `BETTER_AUTH_URL` — your web app URL, e.g. `https://scout.realanshuman.com`
   - `DATABASE_URL` — your Neon connection string (the pooled one)
   - Dodo: `DODO_PAYMENTS_API_KEY`, `DODO_PAYMENTS_PRODUCT_ID`,
     `DODO_PAYMENTS_WEBHOOK_KEY`, `DODO_PAYMENTS_ENVIRONMENT`
2. **Create the tables** — in the Neon SQL editor, run, in order:
   - `apps/web/lib/auth-schema.sql` (Better Auth: user, session, account, verification)
   - `apps/web/lib/app-schema.sql` (subscription, workspace, investor_match)
   Both are idempotent (safe to re-run). You can confirm at any time by visiting
   `/api/health/db`.
3. **Point the Dodo webhook** at `https://<your-domain>/api/webhooks/dodo`.
4. Deploy.

## Create a demo / test account

Set `SEED_TOKEN` (any random value) in your env, then visit once:

```
https://<your-domain>/api/seed-demo?token=YOUR_SEED_TOKEN
```

It provisions a fully-working demo account (active subscription + realistic
profile + 6 investor matches) and returns the credentials. You can then sign in
and use every feature. Re-running it re-seeds the same account. Unset
`SEED_TOKEN` afterwards to disable the endpoint.

## Live investor discovery (Tavily + OpenAI)

The Investors page has a **Find investors / Refresh matches** button that does
real work: it searches the web with **Tavily**, then uses **OpenAI** to extract,
rank and draft personalized outreach for investors that fit the founder's
profile, and stores the results in Neon (replacing the previous list).

To enable it, set these in Vercel (both are required):

- `TAVILY_API_KEY` — from tavily.com
- `OPENAI_API_KEY` — from platform.openai.com
- `SCOUT_DISCOVERY_MODEL` — optional, defaults to `gpt-4o-mini`

Without them the button shows a clear "not configured" message rather than
failing. Discovery needs the workspace to have at least a **company name and
industry**, so it knows what to search for. It takes roughly a minute; the UI
shows progress and reports how many investors were found.

Note: discovery never invents contact details. An email or LinkedIn is included
only when it actually appears in a source.

## Wiring real customer data

`getDashboardData()` in `lib/dashboard-data.ts` reads each signed-in user's real
`workspace` + `investor_match` rows from Neon. Those rows are created:

- by the **demo seed** (for testing), and
- by **`provisionWorkspace()`** (`lib/workspace.ts`) after payment / from the
  Scout WhatsApp pipeline once a founder's profile and matches are ready.

Until a founder's matches are computed, the dashboard renders clean empty states
that point them back to WhatsApp to finish setup.

## Optional: Better Auth hosted add-on (Dash + Sentinel)

Set `BETTER_AUTH_API_KEY` to enable the hosted admin dashboard + bot protection.
Leave it unset to run core email + password auth only. Treat the key as a secret
(env vars only, never commit it).
