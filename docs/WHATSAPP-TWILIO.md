# WhatsApp via Twilio — setup

Scout talks to founders on WhatsApp through **Twilio**. The webhook lives in the
deployed web app (Vercel) and stores the conversation in Neon, so there's no
separate service to run.

**Endpoint:** `https://scout.realanshuman.com/api/webhooks/twilio`

---

## Step 1 — Get your Twilio credentials

In the [Twilio Console](https://console.twilio.com) home page, copy:

- **Account SID** (starts with `AC…`)
- **Auth Token** (click to reveal)

Treat the Auth Token like a password.

## Step 2 — Turn on the WhatsApp Sandbox

A trial phone number does **not** do WhatsApp on its own. WhatsApp needs either
the sandbox (instant, for testing) or an approved WhatsApp sender (for
production).

To use the sandbox:

1. Twilio Console → **Messaging → Try it out → Send a WhatsApp message**.
2. You'll see a sandbox number (usually **+1 415 523 8886**) and a join code
   like `join <two-words>`.
3. From your own WhatsApp, send that join code to the sandbox number.
4. You're now connected and can message Scout.

Anyone who wants to talk to Scout in sandbox mode must send that join code
first. That limit disappears once you have a production sender (Step 5).

## Step 3 — Add the environment variables

In **Vercel → your project → Settings → Environment Variables** (Production):

| Variable | Value |
|---|---|
| `TWILIO_ACCOUNT_SID` | your `AC…` SID |
| `TWILIO_AUTH_TOKEN` | your auth token |
| `TWILIO_WHATSAPP_FROM` | `+14155238886` (sandbox), later your own number |
| `OPENAI_API_KEY` | required — the agent runs on it |
| `DATABASE_URL` | your Neon connection string (already set) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `14155238886` — the number every "Message Scout" button opens |
| `NEXT_PUBLIC_WHATSAPP_JOIN_CODE` | your sandbox join phrase, e.g. `join happy-tiger` |

The two `NEXT_PUBLIC_*` values are what the site's buttons use. While you're on
the sandbox, setting the join code means a visitor taps "Message Scout", sends
the pre-filled join phrase, and is connected immediately, instead of messaging
into the void. Clear it once you have a production sender. Both are baked in at
build time, so changing them requires a redeploy.

Then **redeploy** (untick "Use existing Build Cache").

## Step 4 — Create the conversation tables

In the **Neon SQL Editor**, run `apps/web/lib/whatsapp-schema.sql`. It creates
`wa_contact` and `wa_message` and is safe to re-run.

## Step 5 — Point Twilio at the webhook

**Sandbox:** Console → Messaging → Try it out → Send a WhatsApp message →
**Sandbox settings** tab. Set:

- **When a message comes in:** `https://scout.realanshuman.com/api/webhooks/twilio`
- Method: **HTTP POST**

Save.

**Production sender** (after WhatsApp approval): Messaging → Senders → WhatsApp
senders → your number → set the same URL as the inbound webhook.

## Step 6 — Test it

Send anything ("hi") to the sandbox number from WhatsApp. Scout should greet you
and start the interview. Answer a few questions and it will build your startup
profile.

To confirm it's wired up, open the endpoint in a browser:

```
https://scout.realanshuman.com/api/webhooks/twilio
```

It returns a small JSON status showing whether Twilio and the database are
configured. (Twilio itself always uses POST.)

---

## How it behaves

- **First message** → greeting, interview starts.
- **During the interview** → one question at a time; it never re-asks something
  you've already answered, and it builds a structured profile as you talk.
- **When the profile is complete** → a wrap-up message, and the contact flips to
  assistant mode.
- **After that** → it answers fundraising questions with your context.

Everything is stored in Neon (`wa_contact.profile` holds the structured
profile, `wa_message` the history).

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| No reply at all | Webhook URL not saved in Twilio, or set to GET. Must be **HTTP POST**. |
| Twilio error 11200 | The webhook errored or took too long. Check Vercel function logs. |
| "Sorry, I hit a snag" reply | The agent threw — usually a missing/invalid `OPENAI_API_KEY`, or the tables from Step 4 don't exist. |
| 403 in Twilio logs | Signature check failed. Confirm `TWILIO_AUTH_TOKEN` is correct and the webhook URL in Twilio exactly matches your domain (no trailing slash, https). |
| Nothing after joining sandbox | Sandbox sessions expire after 72 hours. Send the `join …` code again. |

Signature validation is on by default: Scout verifies every request really came
from Twilio. `TWILIO_SKIP_SIGNATURE_CHECK=true` disables it for local testing
only — never set it in production.
