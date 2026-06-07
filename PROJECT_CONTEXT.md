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

```
/get-quote form → POST /api/submit-form → Resend email → GHL webhook (route by event type)
/booking page  → POST /api/submit-form with funnel_event=booking_started/abandoned/completed
                                       → GHL webhook (routed by funnel_event)
```

Three GHL webhooks (set as Vercel env vars):

| Event type | Webhook URL ends in | Env var | GHL workflow |
|---|---|---|---|
| Quote form lead (funnel_event empty) | `...d053e0` | hardcoded as fallback | "Website Quote Form — New Lead" + "Incoming Quote Form - Hybrid V2" |
| `booking_started` / `booking_abandoned` | `...248e1d` | `GHL_BOOKING_WEBHOOK_URL` | "Abandoned Booking Recovery" |
| `booking_completed` | `...7bb3b8` | `GHL_BOOKING_COMPLETED_WEBHOOK_URL` | "Booking Completed - Mark Booked" |

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

- **Live API check:** `curl -X POST https://thevalleycleanteam.com/api/submit-form -H "Content-Type: application/json" -d '{"source":"Booking Page Pre-Capture","funnel_event":"booking_started","name":"Test","phone":"2565550100","email":"t@x.com"}'` should return `{"success":true,"message":"Event received","funnel_event":"booking_started"}`.
- **Quote form smoke test:** same endpoint with `source: "Get Quote Form"` should return `"Check your texts!"` + an `emailId` (Resend).
- **Magic link prefill test:** open `/booking?phone=12053700194&f_name=Todd&l_name=X&email=t@x.com` — Step 2 of BookingKoala should show name, email, and phone correctly as `(205) 370-0194` (the leading `1` stripped server-side).
