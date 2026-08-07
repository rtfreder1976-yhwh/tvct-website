# The Valley Clean Team — Project Context

_Portable handoff doc. Paste into Claude Projects, Cowork, ChatGPT custom
instructions, or any AI assistant that needs to work on this project. Last
updated: 2026-06-07._

---

## Who & what

**Todd Frederickson** (todd@thevalleycleanteam.com — note: NOT
`valleyservicescompany.com`, that's a sister business) owns **The Valley
Clean Team** (TVCT) — veteran-owned & women-owned cleaning company. Tagline
"Life is messy. We've got this."

**Markets:** Huntsville, Athens, Florence/Shoals, Mountain Brook (AL) +
Nashville (TN). Phones: AL (256) 826-1100, TN (615) 510-1427.

**Web:** https://thevalleycleanteam.com
**Repo:** https://github.com/rtfreder1976-yhwh/tvct-website
**Stack:** Astro v6.2.1, Tailwind, Vercel (auto-deploys on push to `main`),
GoHighLevel CRM, BookingKoala scheduler, Resend (lead-notification emails).

---

## Architecture you must know

### Live lead-capture endpoint — IMPORTANT GOTCHA

The live `/api/submit-form` endpoint is the **Vercel-native root function** at
`api/submit-form.ts` (yes, the root `api/` folder — not under `src/`). This
file does Resend email + GHL webhook routing.

There is ALSO an Astro version at `src/pages/api/submit-form.ts` that LOOKS
like it should run, but it's **shadowed by the root file and never executes
in production**. Same shadow pattern affects `leads`, `rankings`, `traffic`.
**Always edit the root `api/` file** when changing lead-capture logic.

### How leads & booking events flow

Both funnels now live in hosted BookingKoala, not on this site. `/get-quote`,
`/booking` and `/booking-commercial` are 301s to BookingKoala (#109,
2026-07-27), so **BookingKoala webhooks are the only live source** of leads and
booking events:

```
BookingKoala lead form  → POST /api/bookingkoala-webhook → PostHog quote_form_submitted
                                                        → GHL quote webhook
                                                        → Resend email to hello@
BookingKoala booking /  → POST /api/bookingkoala-webhook → PostHog booking_started |
  abandoned-cart events                                     booking_abandoned |
                                                            booking_completed
                                                        → GHL webhook (by event)
                                                        → no email (by design)

on-site forms (careers, → POST /api/submit-form        → same three destinations
  QuoteForm component,                                    (leads only; newsletter
  blog newsletter)                                         is rejected, see below)
```

Both endpoints share one fan-out implementation in `api/_lead-delivery.ts`, so
the two paths cannot drift apart.

**History worth knowing.** The site used to own both funnels and POST them to
`/api/submit-form`. That broke in two steps and nothing replaced it for three
weeks:

- **2026-07-10 (#94)** removed the site-side booking beacons — they were
  false-firing `booking_completed` on every `/booking` visit (23 in one day).
  Correct removal, but it ended all three booking events.
- **2026-07-17 (0ab7262)** replaced the `/get-quote` form with a BookingKoala
  embed and deleted the POST. That ended `quote_form_submitted` (last event
  2026-07-17), the GHL quote workflow, **and** the hello@ lead email (last one
  2026-07-17 14:54 UTC).

`/api/bookingkoala-webhook` exists to restore all three destinations. Don't
re-add site-side beacons — completion happens inside BookingKoala, so the site
genuinely cannot tell "booked" from "still deciding."

Three GHL webhooks (set as Vercel env vars):

| Event type | Webhook URL ends in | Env var | GHL workflow |
|---|---|---|---|
| Quote form lead (funnel_event empty) | `...d053e0` | hardcoded as fallback | "Website Quote Form — New Lead" + "Incoming Quote Form - Hybrid V2" |
| `booking_started` / `booking_abandoned` | `...248e1d` | `GHL_BOOKING_WEBHOOK_URL` | "Abandoned Booking Recovery" |
| `booking_completed` | `...7bb3b8` | `GHL_BOOKING_COMPLETED_WEBHOOK_URL` | "Booking Completed - Mark Booked" |

### BookingKoala webhook setup

**BookingKoala has no native "POST to any URL" webhook.** Outbound data leaves
BK only through **Zapier** or **Make**. So the transport is:

```
BookingKoala --(Zapier trigger)--> Webhooks by Zapier (POST)
                                     --> /api/bookingkoala-webhook
                                           --> PostHog + GHL + Resend
```

Build one Zap per event:

| Zap | BK trigger | POST body `event` |
|---|---|---|
| Lead | Leads module → Zapier (see BK's "Setting up Zapier in the leads module"), or the **Quote created** trigger | `quote_form_submitted` |
| Booking | **Booking created** | `booking_completed` |

Zapier action: **Webhooks by Zapier → POST**
- URL: `https://thevalleycleanteam.com/api/bookingkoala-webhook`
- Payload type: JSON
- Headers: `x-bk-webhook-secret: <BK_WEBHOOK_SECRET>`
- Data: `event` plus `name` / `email` / `phone` / `service` / `location` mapped
  from the BK trigger's fields.

Because you control the payload in Zapier, **set `event` explicitly** to the
value in the table. The endpoint's alias matching then has nothing to guess.
(BK's own trigger names happen to map correctly too — `quote_created` contains
"quote", `booking_created` matches the completion pattern — but an explicit
value is what you want to rely on.)

#### What cannot be restored this way

- **`booking_started`** — BK has no trigger for "entered the booking flow."
  There is no automated source for this event.
- **`booking_abandoned`** — **confirmed 2026-08-07: BK exposes fall-outs only as
  a report/list inside its dashboard**, not as a Zapier trigger and not as a
  notification. A screen you read is not a signal that can be piped anywhere, so
  there is no automated source for this event either.

Treat both as retired. Don't add them to dashboards or funnels expecting data,
and don't re-add site-side beacons to fake them — that was #94's bug.

Consequences:

- **Abandoned-booking recovery is currently manual**: someone reads the BK
  dashboard list and follows up. The GHL "Abandoned Booking Recovery" workflow
  triggers on `booking_started` and therefore has no live input at all — see
  GHL_ABANDONED_BOOKING_WORKFLOW.md.
- **Worth checking when you build the lead Zap:** incomplete bookings sometimes
  land in BookingKoala's *leads* module as records in their own right. If they
  do, the leads-module Zap will pick them up and you get abandonment coverage
  for free. Look at what actually arrives before concluding it doesn't.
- If recovery automation matters, the question for BookingKoala support is
  whether their Abandoned Cart feature can be made to *act* (send its own
  follow-up) rather than only report.

| Env var | Required | Purpose |
|---|---|---|
| `BK_WEBHOOK_SECRET` | **Yes**, min 16 chars | Shared secret. Without it the endpoint 503s every request — it will not accept unauthenticated writes to the CRM and lead inbox. |
| `RESEND_API_KEY` | Yes | hello@ lead notification |
| `GHL_BOOKING_WEBHOOK_URL` | Optional | Falls back to the quote webhook |
| `GHL_BOOKING_COMPLETED_WEBHOOK_URL` | Optional | Falls back to the recovery webhook |

**Event-name mapping is best-effort until verified against a live payload.**
BookingKoala's webhook field names aren't pinned by a schema we control, so
`api/bookingkoala-webhook.ts` matches a list of common aliases (`EVENT_MAP` and
the `pick()` calls). Anything it can't classify returns HTTP 200 and logs
`BookingKoala webhook: unrecognised event type. type=… keys=…` — **check the
Vercel logs after the first real delivery of each event type** and add the
actual names to `EVENT_MAP`. A 200 with `"classified": false` means nothing was
sent onward.

Note: BookingKoala retries are at-least-once and this endpoint holds no state,
so a retried delivery produces a duplicate GHL record, PostHog event and email.
If that shows up in practice, dedupe on BookingKoala's own event id.

### GHL workflows in production

1. **"Website Quote Form — New Lead"** — main quote lead processor.
   Filter: `funnel_event` is empty (excludes booking events).
2. **"Incoming Quote Form - Hybrid V2"** — sends initial quote-response SMS.
   Filter: `funnel_event` is empty.
3. **"Abandoned Booking Recovery"** — fires on `booking_started`. Steps:
   Create Contact → Tag `booking-started` → Wait 30 min → If/Else
   `Tags includes "booked"` (Yes→End, No→Send SMS with magic link → 1hr → Email
   → 1day → SMS#2 → Owner-call task).
4. **"Booking Completed - Mark Booked"** — fires on `booking_completed`.
   Steps: Create or Update Contact → Add Tag `booked` → Remove from
   "Abandoned Booking Recovery". This is what keeps real bookers from getting
   the day-2 SMS.

---

## The magic link (recovery URL)

Paste anywhere a customer needs to return to BookingKoala with pre-filled info:

```
https://thevalleycleanteam.com/booking?phone={{contact.phone_raw}}&f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}
```

### Four phone-field gotchas — these all took testing to discover

1. **Use `{{contact.phone_raw}}`, NOT `{{contact.phone}}`.** The latter
   renders the formatted `(205) 370-0194` whose `(` and space cause SMS
   carriers to truncate the URL at the area code.
2. **Put `phone=` FIRST in the URL, not last.** Same carrier-parsing reason —
   if trailing characters look like a phone number, the carrier breaks the
   URL there.
3. **The booking page automatically strips a leading `1` country code** when
   the phone is 11 digits — GHL ships US numbers as `12053700194` and
   BookingKoala would otherwise mis-parse all 11 digits as the local number.
   (This is in `src/pages/booking.astro`, line ~280.)
4. **The booking page passes phone under 4 param names** (`phone`,
   `phone_number`, `customer_phone`, `mobile`) because different BookingKoala
   installs expect different names. Don't simplify this.

---

## Recent history (chronological, for context)

### 2026-06-04 — Ahrefs SEO audit response
Site Audit #9192626. Fixed 404s/broken links, 41 long titles, removed
self-serving review markup from LocalBusiness schema, made sitemap date-aware.
The "0 organic keywords" panic was NOT a penalty — new site launched ~May 2026
just starting to index.

### 2026-06-05 — 3-wave SEO/AEO/conversion overhaul (all deployed live)
- **Wave 1**: fixed live quote→booking prefill bug (sessionStorage
  'tvct_quote'), pointed pricing CTAs to `/get-quote`, homepage FAQ mojibake,
  added org `aggregateRating 5.0/146`, added `llms.txt`, standardized
  founding year to 2022.
- **Wave 2**: resolved blog↔location cannibalization (8 posts canonicalized +
  sitemap-excluded), completed services hub (5→10 links), deleted junk
  "flexible scheduling" service, answer-first intros on 5 service pages,
  3 new best-of pages (Athens/Florence-Shoals/Mountain-Brook) with real
  researched competitors.
- **Wave 3**: relabeled 35 mismatched "Book Online" → "Get Your Free Quote"
  CTAs, answer-first intros on Huntsville/Nashville hubs.

### 2026-06-05 — Vercel firewall AI-crawler block (RESOLVED)
Site was returning HTTP 403 (`X-Vercel-Mitigated: deny`) to GPTBot, ClaudeBot,
PerplexityBot, OAI-SearchBot. Todd published the "Allow AI crawlers" bypass
rule in Vercel firewall dashboard; verified all AI bots now get HTTP 200.
Note: the Vercel firewall CLI works but Claude is NOT permitted to publish/
discard production firewall drafts — dashboard-only.

### 2026-06-07 — Abandoned-booking recovery system
Built end-to-end. Three webhook routing (above), four GHL workflows (above),
magic-link recovery URL (above). All four phone-field gotchas solved.
Verified: real bookers get tagged `booked` + no day-2 SMS; abandoners get
SMS→email→owner-call sequence with intact pre-filled link.

### 2026-06-07 — Pricing reconciled to BookingKoala
Site pricing was inconsistent across pages. Aligned everything to the official
BookingKoala rate sheet:
- Standard from **$176** · Deep from **$276** · Move-in/out from **$351** ·
  Post-construction from **$526**
- Recurring discounts: weekly 30% / bi-weekly 25% / monthly 15%
- Calculator on `/pricing` now uses real per-sq-ft lookup table
- 27 files updated to align

---

## Deferred items (not done, intentionally)

- Homepage LCP/FCP ~4.1s/3.3s — Inter font already async, Playfair self-hosted
  for LCP. Further wins need live Lighthouse measurement, didn't blind-edit.
- The 22-hour delay on the quote-form follow-up SMS — Todd shortened it to 30
  min during testing 2026-06-07. Industry sweet spot is 0-5 min; can shorten
  further later.

---

## Reference docs in the repo

| File | Purpose |
|---|---|
| `GHL_COPY_PASTE_ASSETS.md` | **Source of truth** for SMS/email copy, GHL workflow steps |
| `SEO_AEO_FOLLOWUPS.md` | SEO/AEO follow-up checklist |
| `CLAUDE.md` | Project-level rules (performance, schema, URL structure, brand voice) |
| `GHL_WORKFLOW_GUIDE.md`, `GHL_WORKFLOW_BUILD_GUIDE.md`, `GHL_ABANDONED_BOOKING_WORKFLOW.md`, `LEAD_AUTOMATION_FIX.md` | **HISTORICAL drafts** — may have stale webhook URLs (`...0ac5`). Don't trust without cross-checking. |

---

## How to verify any AI-assistant claim against reality

- **BookingKoala webhook check** (the live lead path):
  ```
  curl -X POST https://thevalleycleanteam.com/api/bookingkoala-webhook \
    -H "Content-Type: application/json" \
    -H "x-bk-webhook-secret: $BK_WEBHOOK_SECRET" \
    -d '{"event":"lead_created","name":"Test","phone":"2565550100","email":"t@x.com"}'
  ```
  should return `{"ok":true,"classified":true,"event":"quote_form_submitted","emailed":true}`.
  Without the header it must return 401 — if it returns 200, the secret is not
  set and the endpoint is open. `"classified":false` means the event name didn't
  match `EVENT_MAP` and nothing was forwarded.
- **Booking event check:** same call with `"event":"booking_completed"` should
  return `"event":"booking_completed","emailed":false`.
- **On-site form check:** `curl -X POST https://thevalleycleanteam.com/api/submit-form -H "Content-Type: application/json" -d '{"source":"Career Application","name":"Test","phone":"2565550100","email":"t@x.com"}'` should return `"Check your texts!"` + an `emailId` (Resend).
- **PostHog check:** the four events are `quote_form_submitted`,
  `booking_started`, `booking_abandoned`, `booking_completed`. Webhook-sourced
  ones carry `source: "BookingKoala"`; the pre-2026-07-17 history carries
  `source: "Get Quote Form"`. A gap between 2026-07-17 and whenever the webhook
  went live is expected and explained above — it is not a query bug.

**Known stale:** the `funnel_event` POST to `/api/submit-form` still works and
is still accepted, but no site code sends it any more. Don't treat a passing
`funnel_event` curl as evidence that the booking funnel is being tracked — the
live source is the BookingKoala webhook.

**Also broken by #109, not yet fixed:** the recovery "magic link" below points
at `/booking`, which is now a 301 to BookingKoala. The phone-normalisation and
prefill logic that made those query params work lived in the deleted
`booking.astro`, so the merge-field link no longer prefills as documented.
