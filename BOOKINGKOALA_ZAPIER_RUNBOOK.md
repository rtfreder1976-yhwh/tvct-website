# BookingKoala → Zapier → Website Runbook

_How to wire BookingKoala's leads and bookings back into PostHog, GoHighLevel
and the hello@ inbox. Last updated: 2026-08-10._

---

## Why this exists

BookingKoala captures your leads and keeps them. The website used to be the
thing that copied each lead into PostHog, GHL and your inbox — and that copying
step was deleted when `/get-quote` was replaced by the BookingKoala embed
(2026-07-17), then retired outright (#109, 2026-07-27).

The result: `quote_form_submitted` stopped in PostHog on 2026-07-17, the GHL
quote workflow stopped firing, and the last lead email arrived 14:54 UTC that
day. `/api/bookingkoala-webhook` restores all three. This runbook connects
BookingKoala to it.

**BookingKoala has no native webhook.** It cannot POST to a URL you choose.
Outbound data leaves BK only through **Zapier** or **Make**, so one of those
sits in the middle. That's not a workaround — it's the only supported path.

```
BookingKoala --(trigger)--> Zapier --(POST)--> /api/bookingkoala-webhook
                                                   |
                                     +-------------+-------------+
                                     |             |             |
                                  PostHog      GoHighLevel    hello@
```

---

## Before you start

| Requirement | Notes |
|---|---|
| `BK_WEBHOOK_SECRET` set in Vercel | Min 16 characters. Set it for **every environment you'll test against** — Production-only means preview deploys return 503. |
| PR #121 merged and deployed | The endpoint does not exist on production until then. A Zap pointed at it returns **404**. |
| A paid Zapier plan | *Webhooks by Zapier* is a premium app. See [Using Make instead](#using-make-instead) if you're on the free tier. |
| BookingKoala connected in Zapier | Settings → General → Apps & Integrations in BK. The leads module has its own Zapier setup, separate from the main one. |

---

## Zap A — Leads

This is the one that matters most. It restores the lead flow that has been dark
since 2026-07-17.

### 1. Trigger

**App:** BookingKoala
**Event:** the one that fires when someone submits your lead form — most likely
**"Quote created"**, or a leads-module trigger if your BK account exposes one.

> **Verify this rather than trusting the label.** BK's trigger names vary by
> account and version. Run Zapier's **Test trigger** step: it pulls a real
> recent record and shows you its fields. If that record looks like one of your
> actual leads, it's the right trigger. If it looks like a completed booking or
> an invoice, back up and pick a different one.
>
> The test data is also what you map from in step 3 — so do this before moving on.

### 2. Action

**App:** Webhooks by Zapier
**Event:** **POST**

### 3. Configure

| Setting | Value |
|---|---|
| **URL** | `https://thevalleycleanteam.com/api/bookingkoala-webhook` |
| **Payload Type** | `JSON` |
| **Wrap Request In Array** | No |
| **Unflatten** | No |

**Data** — left column is the field name, right column is what goes in it:

| Field | Value |
|---|---|
| `event` | `quote_form_submitted` — **type this literally, do not map it** |
| `name` | map from BK's name field |
| `email` | map from BK's email |
| `phone` | map from BK's phone |
| `service` | map if the trigger provides one |
| `location` | map city or address if available |

**Headers:**

| Key | Value |
|---|---|
| `x-bk-webhook-secret` | your `BK_WEBHOOK_SECRET` from Vercel |

Only `event` is required. Every other field is best-effort — anything missing
arrives empty rather than failing.

### 4. Test and publish

Run **Test action**. A success looks like:

```json
{"ok": true, "classified": true, "event": "quote_form_submitted", "emailed": true}
```

Then turn the Zap **on**.

---

## Zap B — Bookings

Identical to Zap A with two changes:

- **Trigger event:** BookingKoala → **"Booking created"** (or "New Booking")
- **`event` field:** `booking_completed`

Expected response:

```json
{"ok": true, "classified": true, "event": "booking_completed", "emailed": false}
```

`emailed: false` is correct and deliberate. Booking lifecycle events don't send
a hello@ notification — BookingKoala already sends its own confirmations, and
emailing every one would be the noise problem that #94 called out.

---

## Field reference

The endpoint accepts these fields. It also recognises common aliases (for
example `first_name` + `last_name` in place of `name`, or `customer_email` in
place of `email`), and will unwrap a payload nested one level under `data`,
`payload`, `lead`, `booking`, `customer` or `object`.

| Field | Goes to |
|---|---|
| `event` | **Required.** Selects the PostHog event and GHL routing. |
| `name` | GHL contact, lead email |
| `email` | GHL contact, lead email, PostHog `distinct_id` fallback |
| `phone` | GHL contact, lead email, PostHog `distinct_id` (preferred) |
| `service` | GHL, PostHog property, email subject |
| `location` | GHL, PostHog property, email |
| `square_footage`, `bedrooms`, `bathrooms` | GHL, email |
| `preferred_date` | GHL, email |
| `message` | GHL, email body |
| `page_url` | GHL, PostHog property |

Accepted `event` values:

| Value | PostHog event | GHL destination | Emails hello@ |
|---|---|---|---|
| `quote_form_submitted` | `quote_form_submitted` | Quote webhook | Yes |
| `booking_completed` | `booking_completed` | `GHL_BOOKING_COMPLETED_WEBHOOK_URL` | No |
| `booking_started` | `booking_started` | `GHL_BOOKING_WEBHOOK_URL` | No |
| `booking_abandoned` | `booking_abandoned` | `GHL_BOOKING_WEBHOOK_URL` | No |

The last two are supported by the endpoint but **have no BookingKoala trigger to
feed them** — see [What this doesn't cover](#what-this-doesnt-cover).

---

## Verifying end to end

Zapier's test only proves the plumbing. Once both Zaps are on, do a real one:

1. Submit a test lead through your actual BookingKoala lead form.
2. **PostHog** → check a `quote_form_submitted` event arrived, with
   `source = "BookingKoala"`.
3. **GoHighLevel** → check the contact was created and the "Website Quote Form —
   New Lead" workflow fired.
4. **hello@thevalleycleanteam.com** → check the notification email arrived.

If all four land, you're done. Then repeat with a real test booking for Zap B
(PostHog + GHL only — no email expected).

You can also hit the endpoint directly:

```bash
curl -X POST https://thevalleycleanteam.com/api/bookingkoala-webhook \
  -H "Content-Type: application/json" \
  -H "x-bk-webhook-secret: YOUR_SECRET" \
  -d '{"event":"quote_form_submitted","name":"Test","phone":"2565550100","email":"t@x.com"}'
```

---

## Troubleshooting

| Response | Meaning | Fix |
|---|---|---|
| **404** | The endpoint isn't deployed | Merge and deploy PR #121 |
| **401 Unauthorized** | Header missing, or secret doesn't match | Check the header key is exactly `x-bk-webhook-secret` and the value matches Vercel with no trailing whitespace |
| **503 Endpoint not configured** | `BK_WEBHOOK_SECRET` isn't set for that environment, or is under 16 chars | Set it in Vercel and redeploy. This is fail-closed by design — the endpoint won't accept unauthenticated writes to the CRM |
| **200 with `"classified": false`** | Request authenticated fine, but the `event` value wasn't recognised — **nothing was forwarded** | Check the `event` field for typos. The Vercel log line `BookingKoala webhook: unrecognised event type. type=… keys=…` shows what actually arrived |
| **200, but nothing in GHL** | The fan-out doesn't fail the request — GHL errors are logged, not returned | Check the Vercel function logs for `GHL webhook error` |
| **200, but no email** | Only leads email. `"emailed": false` on a booking event is correct | For a lead, check `RESEND_API_KEY` is set and look for `Lead notification email failed` in the logs |

**Where the logs are:** Vercel dashboard → the `tvct-website` project → Logs →
filter to `/api/bookingkoala-webhook`.

**A note on log privacy:** unclassified payloads log their *key names* only,
never the values, because these payloads carry customer PII. So the log will
tell you the shape of what arrived but not the contents.

---

## Using Make instead

If you'd rather not pay for Zapier's premium webhook action, Make (Integromat)
does the same job and BookingKoala supports it natively.

1. In BookingKoala: Settings → General → Apps & Integrations → Make → click
   through and enable it.
2. In Make, build a scenario: BookingKoala trigger → **HTTP → Make a request**.
3. Configure the HTTP module:
   - **URL:** `https://thevalleycleanteam.com/api/bookingkoala-webhook`
   - **Method:** POST
   - **Body type:** Raw / JSON (`application/json`)
   - **Headers:** `x-bk-webhook-secret` = your secret
   - **Body:** the same JSON fields as the Zapier table above

Everything else in this runbook — field names, event values, troubleshooting —
applies unchanged.

---

## What this doesn't cover

**`booking_started` and `booking_abandoned` cannot be restored.** BookingKoala
has no trigger for entering the booking flow, and fall-outs are only exposed as
a report inside the BK dashboard — a screen you read, not a signal that can be
piped anywhere. Both events are retired. Don't build dashboards or funnels
expecting them, and don't re-add site-side beacons to fake them; that was the
bug #94 removed.

**For recovering lost bookings, use BookingKoala's own SMS/email follow-up.**
BK can engage abandoners directly — the feature just isn't switched on yet.
That's a better home for recovery than GHL: it needs no trigger, no Zap and no
magic link, and it judges abandonment where the data lives. The GHL "Abandoned
Booking Recovery" workflow triggers on `booking_started` and should not be
built. Copy for those messages lives in `GHL_COPY_PASTE_ASSETS.md` — paste it
into BK's templates.

**One thing worth checking** once Zap A is live: do incomplete bookings show up
in BookingKoala's *leads* module as records of their own? They often do in BK
installs. If yours does, Zap A already picks them up and you get abandonment
visibility for free.

---

## Rotating the secret

1. Update `BK_WEBHOOK_SECRET` in Vercel and redeploy.
2. Update the `x-bk-webhook-secret` header in **both** Zaps.

Between those two steps every delivery returns 401 and Zapier will retry, so do
them close together. Zapier's retries mean a short window generally recovers on
its own, but don't leave it overnight.

---

## Known limitation: duplicate deliveries

Zapier delivery is at-least-once and this endpoint holds no state. If Zapier
retries a delivery — after a timeout, say — you get a duplicate GHL contact
update, a duplicate PostHog event and a duplicate email. It hasn't been a
problem in practice, but if you start seeing doubles, the fix is to dedupe on
BookingKoala's own event id inside the endpoint.

---

## Related docs

| File | Purpose |
|---|---|
| `PROJECT_CONTEXT.md` | Env vars, GHL webhook routing table, the full history of what broke |
| `GHL_ABANDONED_BOOKING_WORKFLOW.md` | Why GHL Workflow A is marked do-not-build; recovery copy |
| `GHL_COPY_PASTE_ASSETS.md` | Source of truth for SMS/email copy |
| `api/bookingkoala-webhook.ts` | The endpoint. `EVENT_MAP` holds the accepted event-name patterns |
| `api/_lead-delivery.ts` | The shared PostHog + GHL + Resend fan-out |
