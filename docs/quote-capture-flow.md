# Quote capture flow (/request-a-quote)

_Built and verified in production 2026-08-27. This is the site-owned lead
capture that CLAUDE.md §2 (decision 2026-08-24) called for — the first piece of
the move off BookingKoala's customer-facing forms._

## What it is

The after-hours / prefer-not-to-call fallback. Phone stays the primary CTA
everywhere; this is the path for someone who can't or won't call.

## The path a lead takes

```
/request-a-quote (static page)
  → POST /quote-submit          (Astro endpoint, Vercel serverless)
  → n8n webhook                 (tvct-request-a-quote)
  → Data table                  (tvct_quote_requests — raw lead, always)
  → GHL contact upsert          (matched on EMAIL)
  → GHL phone update            (separate call, see "duplicate phones")
  → GHL auto-reply email        (to the address the prospect typed)
```

**Site → n8n → GHL.** The site holds no GHL credential — only the n8n webhook
URL in `N8N_QUOTE_WEBHOOK_URL`. n8n owns everything downstream.

| Piece | Where |
|---|---|
| Page | `src/pages/request-a-quote.astro` |
| Form | `src/components/RequestQuoteForm.astro` |
| Endpoint | `src/pages/quote-submit.ts` |
| Workflow | n8n `VCT — Website Quote Request Intake` (`00Z4VELE4rKJmEry`) |
| Raw leads | n8n Data table `tvct_quote_requests` |
| GHL credential | `GHL TVCT (PIT)` (`cmUzO69GqShiNjOl`) |

Entry points: footer, and two on `/contact` (Hours card, under the phone CTA).
Nav and per-page CTAs deliberately untouched — phone stays primary.

## Three traps, all hit for real

### 1. The endpoint must NOT live under `/api/`

As `src/pages/api/request-quote.ts` it returned **404 in production** while
building correctly and working locally.

The tell: the 404 carried the `X-Robots-Tag` from `vercel.json`'s `/api/(.*)`
header rule and a `text/plain` content-type — Vercel's own 404, not Astro's.
The function never appeared in runtime logs, so it was never invoked. A
cache-free redeploy did not fix it. `/admin/login` and `/api-docs` (also SSR)
were unaffected, so the collision was with the `/api/` path convention, not
with SSR.

**Do not move this endpoint back under `/api/`.**

### 2. n8n's `ignoreBots` rejects Vercel

With `ignoreBots: true` on the webhook node, n8n returned **403** to the Vercel
serverless function — its default Node user-agent reads as a crawler.

This is the nastiest one: **every manual test passed**, because curl/PowerShell
send a normal user-agent. Only real site traffic was blocked. A form that looks
healthy from every angle while silently dropping every lead.

Option removed. Abuse control lives in the endpoint instead: full field
validation plus a honeypot.

### 3. GHL matches contacts on phone by default — and that destroys leads

The original upsert sent both email and phone. GHL matched on **phone**, so a
second person sharing a phone number (couple, roommates, shared business line)
**overwrote the first person's record** — name, email, city, all replaced. The
first lead effectively vanished.

Match priority is a GHL sub-account setting with no per-request override. The
fix is to give GHL nothing but email to match on: the upsert sends email only,
and a separate `Add Phone To Contact` call attaches the phone afterwards.

**Known limitation:** the sub-account disallows duplicate phones, so when two
people genuinely share a number the second contact is created *without* one
(that call returns 400 and is caught by `onError: continueRegularOutput`). A
missing phone is recoverable — the raw lead has it. A destroyed lead is not.
Change the GHL duplicate setting if you'd rather allow shared phones.

## What happens once GHL has the lead

1. **Contact** upserted (matched on email — see trap 3).
2. **Opportunity** created in the **Quotes** pipeline (`ysIvzkYJy2hce7o12HDx`) at
   its first stage. Deliberately not Residential Cleaning: that pipeline is
   BookingKoala's, where opportunities appear already at "Booked" — mixing
   web leads into it would muddy both funnels.
3. **Todd is texted** the lead details.
4. **The prospect gets an email** and, when possible, **an SMS receipt**.

### Trap 4: GHL cannot text a third party

`POST /conversations/messages` **always sends to the contact**. A `toNumber`
that is not that contact's own number is rejected with
`CONVERSATIONS_MSG_PHONE_MISMATCH`. There is no "text someone else" option.

So Todd's alert cannot be addressed by number. It targets a dedicated contact
that represents him — `dH7VKSZqZG7LZI2q8B3q`, "Todd Frederickson (Internal
Alerts)", tagged `internal-alerts-recipient`. **Do not delete that contact**;
the alert stops working if it goes. This avoids needing a Twilio or SMTP
credential at all.

The bug hid for a while because an early test used Todd's own number as the
prospect phone, so contact-and-target happened to agree.

### Trap 5: the prospect SMS depends on the phone actually landing

`Add Phone To Contact` fails when that number already belongs to another GHL
contact (trap 3's duplicate rule). The contact is then phone-less and any SMS
to it returns `CONVERSATIONS_MSG_NO_PHONE`. An IF gate now checks for a phone
before attempting the receipt, so the run ends cleanly instead of erroring.

The prospect still gets the **email** either way, and Todd's alert always
carries the phone from the raw form, so he can call regardless.

## Why a failed delivery still shows the visitor "success"

Deliberate. A broken webhook is our problem, not theirs, and telling them to
call defeats the page's entire purpose.

The safety net is the log. On any delivery failure the **complete** lead is
written with the greppable prefix `LEAD NOT DELIVERED`:

```
[quote-submit] LEAD NOT DELIVERED — recover by hand { reason, name, phone,
  email, serviceType, city, sqft, message, preferredContact, submittedAt }
```

Find them in Vercel → Runtime Logs, filter `LEAD NOT DELIVERED`. Everything
needed to quote the job by hand is there.

Delivery retries **once** first — a cold start or brief n8n restart shouldn't
cost a lead. Two failures means an outage, and the log is the fallback.

## Verified in production

- Real browser submission → success screen → n8n execution 21 → GHL contact
  `PAIghZKYk8L7VK3g5YnD` created with phone attached → auto-reply queued
- Direct POST after the retry/logging change → execution 22, clean 200, no
  retry needed
- Endpoint validation: valid→200; missing email, bad service type, short
  phone, malformed JSON→400; honeypot→200 and silently dropped
- Error recovery in-browser: server rejection surfaces a visible message,
  re-enables the button, and **preserves what the visitor typed**

## Open items

- **Webhook is unauthenticated.** Removing `ignoreBots` left it open to anyone
  who learns the URL. Header auth is the clean fix — the value belongs in a
  Vercel env var and the n8n webhook's credential, changed together or leads
  break.
- **Duplicate-phone setting.** See trap 3.
- Test contacts (`ZZ`/`QQ` prefixed) and test rows in `tvct_quote_requests`
  need clearing from GHL and n8n.
