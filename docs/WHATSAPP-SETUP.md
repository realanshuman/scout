# Connecting WhatsApp to Scout (Meta Cloud API)

The most fiddly part of go-live, explained click by click for a non-technical
founder. Plan ~45 minutes.

## Before you start

Your **engine must already be deployed on Railway** (see GO-LIVE.md Step 4) and
reachable. Check by opening `https://<your API address>/health` in a browser —
you should see `{"ok":true}`. Also make sure Railway has a variable
`WHATSAPP_VERIFY_TOKEN` set to any random word you make up, e.g.
`scout-verify-123`. You'll type that exact word into Meta later.

You'll also need a **phone number for Scout that is NOT currently on the normal
WhatsApp or WhatsApp Business app**. If your number is already on WhatsApp, use a
different SIM / virtual number, or delete that WhatsApp account first.

Words you'll see:
- **WABA** = WhatsApp Business Account (the "container" for your number).
- **Phone number ID** = an ID for your number (a long number). This is NOT the
  phone number itself.
- **Access token** = the password the engine uses to send messages.
- **Verify token** = the random word YOU invent; it just has to match on both
  sides.

---

## Part A — Create the app (~10 min)

1. Go to **business.facebook.com** and create a **Meta Business account** if you
   don't have one (your company name, your email).
2. Go to **developers.facebook.com**, log in, click **My Apps → Create App**.
3. Choose use case **Other** → app type **Business** → Next.
4. Name it "Scout", pick your Business account, **Create app**.
5. On the app dashboard find **WhatsApp** and click **Set up**. This creates a
   free **test number** and a test WABA automatically.

## Part B — Get your keys (~10 min)

1. In the left menu open **WhatsApp → API Setup**.
2. You'll see:
   - A **temporary access token** at the top → copy it. In Railway set
     `WHATSAPP_ACCESS_TOKEN` to this. (It expires in 24 hours — fine for testing;
     we make a permanent one in Part E.)
   - **Phone number ID** → copy it. In Railway set `WHATSAPP_PHONE_NUMBER_ID`.
3. For real use, click **Add phone number** and register Scout's business number
   (the one not already on WhatsApp). Meta verifies it by SMS or call. Once
   added, select it at the top of this page so its Phone number ID is the one
   you copied.
4. Lower on the same page there's a **"To"** box — add your own personal phone
   number as a **recipient**. In test mode Scout can only message numbers you add
   here (up to 5), so add your phone so you can test.

> After changing anything in Railway's Variables, Railway redeploys
> automatically — wait for it to finish (green) before the next part.

## Part C — Connect the webhook (~10 min)

This is what lets Scout *receive* messages.

1. In the left menu open **WhatsApp → Configuration**.
2. Under **Webhook**, click **Edit**.
3. Fill in:
   - **Callback URL**: `https://<your API address>/webhooks/whatsapp`
   - **Verify token**: the exact random word from your Railway
     `WHATSAPP_VERIFY_TOKEN` (e.g. `scout-verify-123`).
4. Click **Verify and save**. If it errors, it's almost always one of: the
   engine isn't running, the URL has a typo, or the verify token doesn't match
   exactly. Fix and retry.
5. Back on the Configuration page, next to **Webhook fields** click **Manage**,
   find **messages**, and toggle **Subscribe**. (This is the important one.)

## Part D — Test (~5 min)

1. From the phone you added as a recipient in Part B, send "Hi" to Scout's
   number.
2. Scout should reply with its greeting and start the interview.
3. If nothing happens: in Railway open your service's **Logs** and look for an
   error when you sent the message. Common causes: `messages` not subscribed,
   wrong Phone number ID, or the access token expired.

## Part E — Going public (do this once testing works)

Test mode only lets you message the handful of numbers you added. To open Scout
to any founder:

1. **Permanent token** (the temporary one dies after 24h):
   - Go to **business.facebook.com → Settings → Users → System users**.
   - Create a system user (Admin), click **Add assets**, assign your Scout app.
   - Click **Generate new token**, pick the Scout app, and tick the permissions
     **whatsapp_business_messaging** and **whatsapp_business_management**.
   - Copy the token → update `WHATSAPP_ACCESS_TOKEN` in Railway. This one doesn't
     expire.
2. **Business verification**: in **Business Settings → Security Center**, complete
   **Business Verification** (Meta checks your business is real; can take a few
   days). Until then you're limited to test recipients and low volume.
3. Once verified, your number moves to a live messaging limit and any founder can
   text Scout.

## Quick reference — what goes in Railway

```
WHATSAPP_PHONE_NUMBER_ID = (Part B, step 2)
WHATSAPP_ACCESS_TOKEN    = (Part B temporary, then Part E permanent)
WHATSAPP_VERIFY_TOKEN    = (a random word you invent, also typed into Meta)
```

And in **Vercel** (so the website's button opens your number):
```
NEXT_PUBLIC_WHATSAPP_NUMBER = your number, digits only, e.g. 919812345678
```
