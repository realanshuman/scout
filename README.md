# 🔭 Scout

**Your AI fundraising associate on WhatsApp.**

A founder chats with Scout for ~15 minutes → Scout researches the startup → matches it against a curated investor knowledge base → the founder gets a curated investor list with personalized outreach for each match, plus an ongoing AI fundraising assistant that never forgets their context.

## How it works

```
Dashboard  →  WhatsApp  →  AI founder interview  →  startup research
     →  investor matching  →  paywall (top-3 preview)  →  full report
     →  personalized outreach  →  ongoing fundraising assistant
```

1. **Interview** — a dynamic WhatsApp conversation (not a form). Every answer is extracted into a structured startup profile; nothing is ever asked twice.
2. **Research** — Scout scrapes the startup's website (Firecrawl) and searches the web (Tavily), then synthesizes an investor-grade brief: summary, market, strengths, weaknesses, ideal investor profile.
3. **Discovery + Matching** — the core of the product. First a **live discovery** pass researches the web and public investor platforms (OpenVC, VC firm sites, YC, tech press, thesis posts) using the startup's filters — stage, sector, geography, check size, who funded similar companies — extracts structured investor records, and folds them into the base (so it fills itself; no manual seeding required). Then hard filters + pgvector semantic retrieval + an LLM re-ranking pass score each candidate and write a founder-credible "why matched" explanation. Contact emails are only kept when they actually appear in a source — never fabricated.
4. **Paywall** — the founder gets a free preview of their top 3 matches; ₹999/$29 (Dodo Payments) unlocks the full report.
5. **Outreach** — a distinct cold email + LinkedIn DM per investor, each anchored on that investor's actual thesis, portfolio, or recent investment.
6. **Assistant** — after the report, the same chat becomes a fundraising assistant with full context (profile, research, matched investors).

## Repo layout

```
apps/
  api/        NestJS backend — WhatsApp webhook, agents, pipeline, payments
    src/
      whatsapp/       Meta Cloud API webhook + outbound messaging
      conversation/   interview + assistant agents, profile schema, prompts
      memory/         all Supabase persistence (users, messages, profiles…)
      agents/         research, matching, outreach, report agents
      pipeline/       orchestration (BullMQ when Redis is set, inline otherwise)
      payments/       Dodo Payments checkout + webhook
    scripts/          investor-base seeding (computes embeddings)
    data/             sample investor dataset (FICTIONAL — replace before launch)
  web/        Next.js dashboard — single landing page + /thanks
supabase/
  migrations/ Postgres schema (pgvector, match_investors RPC)
```

## Getting started

Prereqs: Node ≥20, pnpm, a Supabase project, and API keys for OpenAI, Meta WhatsApp Cloud API, Dodo Payments, Tavily, Firecrawl (the last two are optional — the pipeline degrades gracefully without them).

```bash
pnpm install
cp .env.example .env        # fill in your keys

# 1. Apply the schema to your Supabase project
#    (Supabase CLI: supabase db push — or paste supabase/migrations/0001_init.sql
#     into the SQL editor)

# 2. Seed the investor knowledge base (computes embeddings via OpenAI)
pnpm seed:investors

# 3. Run everything
pnpm dev                    # web on :3000, api on :4000
```

### Wiring the webhooks

- **WhatsApp**: in the Meta developer console, point the webhook to `https://<api-host>/webhooks/whatsapp` with the verify token from `WHATSAPP_VERIFY_TOKEN`, and subscribe to `messages`.
- **Dodo Payments**: create a one-time product for the report (₹999 / $29 — Dodo is merchant of record, so localized pricing and tax are handled for you) and set `DODO_PAYMENTS_PRODUCT_ID`. In Dashboard → Webhooks, add `https://<api-host>/webhooks/dodo` subscribed to `payment.succeeded` and put the signing key in `DODO_PAYMENTS_WEBHOOK_KEY`. Keep `DODO_PAYMENTS_ENVIRONMENT=test_mode` until launch, then flip to `live_mode` with your live API key.
- For local dev use any HTTPS tunnel (e.g. `cloudflared`) so both the WhatsApp and Dodo webhooks can reach your machine.

### Redis (optional)

Set `REDIS_URL` to run the research/delivery pipeline on BullMQ with retries. Without it, jobs run in-process — fine for development.

## The investor knowledge base

Scout builds this itself. With a `TAVILY_API_KEY` set, the **discovery agent** researches investors live for each startup and upserts them into the `investors` table, so the base grows and sharpens over time without manual curation. Seeding is now **optional**: `apps/api/data/investors.seed.json` ships with fictional samples, and if you have a curated dataset you can pre-load it for extra quality by replacing that file and running `pnpm seed:investors` (upserts by firm+partner, computes embeddings). Without a Tavily key, Scout can only rank whatever is already stored, so add one for the live-discovery experience.

## Deployment

The two apps deploy to different platforms on purpose: the dashboard is static and fits Vercel perfectly, while the API is a long-lived process (5–10 minute research jobs, BullMQ worker, webhooks) that needs a persistent server.

### Dashboard → Vercel

1. Import the GitHub repo in Vercel and set **Root Directory** to `apps/web` (Vercel auto-detects Next.js + pnpm; `apps/web/vercel.json` also skips builds when nothing under `apps/web` changed).
2. Set env var `NEXT_PUBLIC_WHATSAPP_NUMBER` to your WhatsApp business number (E.164, no `+`).
3. Attach your domain and set it as `WEB_PUBLIC_URL` on the API.

### API → Railway / Render / anything that runs Docker

`apps/api/Dockerfile` is a multi-stage build (build → prod-deps → slim runtime) with the **repo root as build context**:

```bash
docker build -f apps/api/Dockerfile -t scout-api .
```

- **Railway**: `railway.json` in the repo root points at the Dockerfile and wires the `/health` healthcheck — just create a project from the repo and add env vars.
- **Render**: `render.yaml` is a ready Blueprint — "New → Blueprint", pick the repo, fill in env vars.
- The server listens on `PORT` (injected by the platform) or `API_PORT`.

Set every variable from `.env.example`, add a Redis instance and set `REDIS_URL` (recommended in production so an interrupted research job retries instead of dropping a founder), then wire the two webhooks (see above) to the deployed API URL and run the investor seed against your production Supabase.

## Deliberately out of scope (MVP)

CRM, automated sending, follow-up sequences, meeting scheduling, analytics, deck parsing, multi-startup support per founder. The MVP validates one thing: founders will pay for a trustworthy, personalized investor list delivered through a conversation.
