# Scout — Go-Live Guide (for non-technical founders)

This is the plain-language checklist to take Scout from "the website is up" to
"founders can actually chat with Scout on WhatsApp and pay for a report."

## The big picture

Scout has two halves:

1. **The website** (`apps/web`) — the landing page. ✅ You've deployed this to Vercel.
2. **The engine** (`apps/api`) — the program that actually runs Scout: receives
   WhatsApp messages, talks to the AI, researches, matches investors, and takes
   payment. ⛔ This is not running yet. Vercel can't run it (it needs an
   always-on server), so it goes on a different host.

To go live you'll create accounts on a few services, paste some keys into a
settings screen, and connect two "webhooks" (a webhook is just a URL that a
service calls when something happens). No coding — but **one step (seeding the
investor data) needs a terminal**, so budget a short session with a developer,
or ask me to walk that part through.

## Accounts you'll need (all have free tiers to start)

| Service | What it's for | Rough cost |
|---|---|---|
| **Supabase** | The database (Scout's memory) | Free to start |
| **OpenAI** | The AI brain | Pay per use, cents per chat |
| **Railway** (or Render) | Hosts the engine (always-on server) | ~$5/month |
| **Meta WhatsApp Cloud API** | The WhatsApp number Scout uses | Free for ~1k chats/mo, then per-chat |
| **Dodo Payments** | Takes the ₹999 / $29 payment | Per-transaction fee |
| **Tavily** + **Firecrawl** | Web research (optional but recommended) | Free tiers |

---

## Step 1 — Database (Supabase) · ~15 min

1. Go to **supabase.com**, sign up, and create a new project. Pick a strong
   database password and save it.
2. In the left menu open **SQL Editor** → **New query**.
3. Open the file `supabase/migrations/0001_init.sql` from this project, copy all
   of it, paste into the editor, and click **Run**. Do the same with
   `0002_payment_ref.sql` and `0003_investor_discovery.sql` (run them in order).
4. Open **Project Settings → API** and copy two things for later:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role key** (under "Project API keys") → this is
     `SUPABASE_SERVICE_ROLE_KEY`. Keep this secret; it's like a master key.

## Step 2 — AI key (OpenAI) · ~5 min

1. Go to **platform.openai.com**, sign up, and add a payment method (usage is
   cheap, but a card is required).
2. Open **API keys → Create new secret key**, copy it. This is `OPENAI_API_KEY`.

## Step 3 — Research keys (now recommended) · ~5 min

Sign up at **tavily.com** and **firecrawl.dev**, grab an API key from each
(`TAVILY_API_KEY`, `FIRECRAWL_API_KEY`). These power Scout's **live investor
discovery** — it researches the web and investor platforms to find matches, so
you don't have to maintain a big investor database yourself. Without a Tavily
key, Scout can only rank investors already stored in your database, so add it.

## Step 4 — Deploy the engine (Railway) · ~15 min

1. Go to **railway.app**, sign up with GitHub, and click **New Project → Deploy
   from GitHub repo**, then pick your `scout` repo.
2. Railway will detect the `railway.json` / Dockerfile and build the engine.
   In the service **Settings**, set the **Root Directory** to `apps/api` if it
   asks.
3. Open the **Variables** tab and add all of these (values from the earlier
   steps; the WhatsApp and Dodo ones come in the next steps — you can add them
   now as blanks and fill in after):

   ```
   OPENAI_API_KEY=...
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   TAVILY_API_KEY=...            (optional)
   FIRECRAWL_API_KEY=...         (optional)
   WHATSAPP_PHONE_NUMBER_ID=...  (Step 5)
   WHATSAPP_ACCESS_TOKEN=...     (Step 5)
   WHATSAPP_VERIFY_TOKEN=scout-verify-123   (make up any random word)
   DODO_PAYMENTS_API_KEY=...     (Step 6)
   DODO_PAYMENTS_WEBHOOK_KEY=... (Step 6)
   DODO_PAYMENTS_PRODUCT_ID=...  (Step 6)
   DODO_PAYMENTS_ENVIRONMENT=test_mode
   WEB_PUBLIC_URL=https://your-vercel-site.vercel.app
   ```
4. Railway gives your engine a public address like
   `https://scout-api-production.up.railway.app`. Copy it — call it your
   **API URL**. Check it works by visiting `<API URL>/health` in a browser; you
   should see `{"ok":true}`.
5. (Recommended) Add a **Redis** database to the same Railway project (one click)
   and copy its connection string into a `REDIS_URL` variable. This makes the
   research step reliable.

## Step 5 — WhatsApp number (Meta Cloud API) · ~45 min, the fiddly one

This is the most involved part. Take it slowly; Meta's wording changes often.

1. Go to **developers.facebook.com**, log in, and create a **Meta Business
   account** if you don't have one.
2. Create a new **App** → type **Business** → add the **WhatsApp** product.
3. In WhatsApp → **API Setup** you'll get a **test number** for free. For real
   use, add your own business phone number (it must not already be on the normal
   WhatsApp app). Meta will verify it by SMS/call.
4. On that screen copy:
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - A **temporary access token** to test with → `WHATSAPP_ACCESS_TOKEN`
     (later, generate a **permanent** token via a System User so it doesn't
     expire — a developer can do this in a few minutes).
5. Put both into Railway's Variables (Step 4).
6. Still in WhatsApp settings, open **Configuration → Webhook → Edit**:
   - **Callback URL**: `<API URL>/webhooks/whatsapp`
   - **Verify token**: the same random word you set as `WHATSAPP_VERIFY_TOKEN`
   - Click verify. Then **Subscribe** to the **messages** field.
7. The number you connected is the one founders will text. Put it (digits only,
   with country code, e.g. `919812345678`) into Vercel later as
   `NEXT_PUBLIC_WHATSAPP_NUMBER` (Step 8).

> Note: with a test setup you can only message a handful of pre-approved phone
> numbers. To open it to the public you complete **Business Verification** in
> Meta Business Settings. Budget a few days for Meta's review.

## Step 6 — Payments (Dodo) · ~15 min

1. Sign up at **dodopayments.com**. Start in **Test mode**.
2. Create a **Product**: a one-time product priced at ₹999 / $29. Copy its
   **Product ID** → `DODO_PAYMENTS_PRODUCT_ID`.
3. **Developer → API Keys**: copy your API key → `DODO_PAYMENTS_API_KEY`.
4. **Developer → Webhooks → Add endpoint**:
   - URL: `<API URL>/webhooks/dodo`
   - Subscribe to the **payment.succeeded** event
   - Copy the **signing key** it shows → `DODO_PAYMENTS_WEBHOOK_KEY`
5. Add all three to Railway. Keep `DODO_PAYMENTS_ENVIRONMENT=test_mode` until
   you've tested, then switch to `live_mode` with your live keys.

## Step 7 — Investor data (now optional) · 0–15 min

**You no longer have to build an investor database.** With a Tavily key (Step 3),
Scout **discovers investors live**: after it researches a founder's startup, it
searches the web and public investor platforms (OpenVC, VC firm sites, YC, tech
press, thesis posts) using that startup's filters — stage, sector, geography,
check size, who funded similar companies — extracts the matching investors,
ranks them, and saves them so your database fills itself over time.

Two things worth knowing:
- Scout never invents contact emails. When a partner's email isn't public it
  leaves it blank and gives the firm website/LinkedIn instead, so you reach the
  right person without sending to a made-up address.
- If you *do* have a curated list, you can still pre-load it for extra quality:
  replace `apps/api/data/investors.seed.json` with your data and run
  `pnpm install && pnpm --filter @scout/api seed:investors` once (this is the
  one step that needs a terminal). Optional — skip it and live discovery covers
  you.

## Step 8 — Point the website at your number · ~5 min

1. In **Vercel → your project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` = your WhatsApp number, digits only
     (e.g. `919812345678`)
2. Redeploy (Vercel → Deployments → ⋯ → Redeploy). Now the "Message Scout"
   button opens a chat with *your* Scout number.

## Step 9 — Test the whole thing

1. From an allowed phone, message your Scout number "Hi".
2. Scout should greet you and start the interview. Answer a few questions.
3. It should say it's researching, then send your top-3 preview and a payment
   link.
4. Pay with a **Dodo test card** (in their docs) → you should get the full
   report back on WhatsApp.
5. When all of that works, switch WhatsApp to a verified number for the public
   and flip Dodo to `live_mode`.

---

## Honest advice

- The account sign-ups and settings screens you can absolutely do yourself.
- Three things realistically want a developer's hands for an hour total:
  running the investor **seed** (Step 7), making a **permanent** WhatsApp token
  (Step 5), and a first sanity check that the webhooks are wired.
- The two things that gate a public launch are **Meta Business Verification**
  (Step 5, can take days) and having a **real investor dataset** (Step 7).

Do it in **test mode** end-to-end first with your own phone. Once one full
conversation works start to finish, going public is just swapping test keys for
live ones.
