# GoHighLevel — Abandoned-Booking Recovery Workflow

_How to turn the booking-funnel signals into automatic SMS/email/owner-call
follow-ups that recover lost bookings. Last updated: 2026-08-07._

---

> ## ⚠️ The source of these events changed — read this first
>
> This document was written when **the website** detected the booking funnel
> and posted `funnel_event` to GHL from `/booking`. **That is no longer true.**
>
> - **2026-07-10 (#94)** removed the site-side beacons. They were false-firing
>   `booking_completed` on every `/booking` visit, which poisoned this very
>   workflow — real customers were being enrolled in recovery. Removing them
>   was correct, but from that day GHL received no booking events at all.
> - **2026-07-27 (#109)** retired `/booking`, `/get-quote` and
>   `/booking-commercial` entirely; they now 301 to hosted BookingKoala.
>
> **The events now originate in BookingKoala** and reach GHL through
> `/api/bookingkoala-webhook` on this site, which normalises them and forwards
> to the same GHL webhooks with the same `funnel_event` field. So:
>
> - The **workflow designs below (A and B) are still correct** — same trigger
>   field, same values, same branching. Nothing in GHL needs rebuilding.
> - Do **not** ask for the site-side beacons back. Completion happens inside
>   BookingKoala's own pages, so the site cannot distinguish "booked" from
>   "still deciding" — that is exactly the bug #94 removed.
>
> ### ⛔ But Workflow A currently has no live trigger
>
> BookingKoala has **no native webhook** — data leaves it only via Zapier or
> Make — and its Zapier trigger list (booking created/updated, customer
> created/updated, card on hold, charge declined, booking cancelled, invoice
> paid, quote created) contains **nothing for a started or abandoned booking**.
>
> That means, of the two events this workflow depends on:
>
> | Event | Status |
> |---|---|
> | `booking_completed` | ✅ available via the BK "Booking created" Zapier trigger |
> | `booking_started` | ❌ no BK trigger exists — **Workflow A cannot fire** |
> | `booking_abandoned` | ❌ **confirmed 2026-08-07:** BK exposes fall-outs only as a report/list in its dashboard — not a trigger, not a notification |
>
> **So Workflow A is designed correctly and cannot be fed. Don't build it yet.**
> Its trigger event has no automated source and neither does its branch event.
> Building it would produce a workflow that silently never fires — which is how
> this whole area went unnoticed for three weeks in the first place.
>
> ### ✅ The fix for recovery is in BookingKoala, not GHL
>
> **BookingKoala can engage abandoners by SMS and email itself — that feature is
> just not switched on yet** (confirmed 2026-08-07). Turning it on is the whole
> answer, and it is strictly better than Workflow A ever was:
>
> - It sits where the data already is. No trigger to source, no Zap to maintain,
>   no `booking_started` event that cannot be produced.
> - Its follow-up links back into BookingKoala's own booking flow, so it
>   sidesteps the broken magic link entirely (that link points at `/booking`,
>   now a 301, and its prefill logic was deleted with the page).
> - It fires on BK's own judgement of abandonment, which is the only place that
>   judgement can be made correctly — the exact thing #94 proved the website
>   cannot do.
>
> **So: enable BK's abandoned-cart SMS/email follow-up, and do not build
> Workflow A.** The copy in this document and in `GHL_COPY_PASTE_ASSETS.md` is
> still good — paste it into BookingKoala's templates instead of GHL's.
>
> One thing this does *not* fix: `booking_abandoned` in PostHog. BK acting on an
> abandonment doesn't emit anything Zapier can see, so the event stays dark and
> abandonment stays invisible in analytics. Recovery works; reporting on it
> doesn't. Accept that, or ask BookingKoala whether their abandoned-cart
> automation can also fire a Zapier trigger.
>
> Also worth checking once the lead Zap is live: **do incomplete bookings appear
> in BK's *leads* module?** If they do, the lead Zap already picks them up and
> you get abandonment visibility for free.
>
> Setup and transport detail: see "BookingKoala webhook setup" in
> `PROJECT_CONTEXT.md`.

---

## What reaches your GHL webhook

BookingKoala posts to `/api/bookingkoala-webhook`, which forwards to your GHL
inbound webhook (the same one the quote form uses) in this shape:

| Field | Example | Use |
|---|---|---|
| `source` | `BookingKoala` | Identifies webhook-relayed events (was `Booking Page Pre-Capture` before 2026-07-10) |
| `funnel_event` | `booking_started` / `booking_abandoned` / `booking_completed` | **The trigger/branch field** |
| `name` | `Jane Doe` | Lead match + personalization |
| `phone` | `2565550100` | SMS + match |
| `email` | `jane@x.com` | Email + match |
| `service` | `Deep Cleaning` | Personalization |
| `location` | `Huntsville` | Personalization (the field is `location`, not `location_city` — the old table was wrong) |
| `seconds_in_iframe` | `''` | Always empty now. It measured time in the on-site iframe, which no longer exists. |

**Lifecycle:**
1. Lead fills the BookingKoala **lead form** → `quote_form_submitted` in
   PostHog, an ordinary lead (empty `funnel_event`) in GHL, plus a hello@ email.
2. Lead enters the BookingKoala **booking flow** → `funnel_event: booking_started`.
3. Lead **leaves without booking** → `funnel_event: booking_abandoned`. ← recover this.
4. Lead completes → `funnel_event: booking_completed`. ← stop the recovery.

Steps 2–4 depend on BookingKoala actually emitting webhooks for those moments
(its booking events and its "Abandoned Cart (HOT Leads)" funnel). Step 3 in
particular is BookingKoala's judgement of abandonment, not a timer on our side.
If a step produces nothing, check the Vercel logs for
`unrecognised event type` before assuming the workflow is at fault — the event
name may just need adding to `EVENT_MAP` in `api/bookingkoala-webhook.ts`.

---

## The recovery "magic link"

Send abandoners back with their info pre-filled (one click, no re-typing). Format:

```
https://thevalleycleanteam.com/booking?phone={{contact.phone_raw}}&f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}
```

Use GHL merge fields as shown. The page prefills the BookingKoala iframe from
those params automatically. (You can also just link to `/booking` plainly — if
they still have their session it prefills anyway, but the merge-field version is
the reliable one for an SMS sent hours later.)

---

## Workflow A — Abandoned-Booking Recovery (the main one)

**Goal:** if someone started booking and didn't finish within 30 min, follow up.

### Trigger
- **Trigger:** *Inbound Webhook* (the one already receiving form data), OR
  *Contact Tag* if you tag from the webhook first.
- **Filter:** `funnel_event` **is** `booking_started`.

### Steps
1. **(Optional) Add tag** `booking-started` to the contact.
2. **Wait** — 30 minutes.
3. **If/Else condition:** has the contact received a `booking_completed` event
   (or been tagged `booked`) in the last 30 min?
   - **Yes →** end workflow (they booked — do nothing).
   - **No →** continue to recovery steps below.
4. **Send SMS** (the highest-recovery step):
   ```
   Hi {{contact.first_name}}, it's The Valley Clean Team 👋 Looks like you
   started booking your {{custom_values.service}} but didn't finish. Get stuck
   or have a question? Reply here, or pick up right where you left off (your
   info's already filled in): https://thevalleycleanteam.com/booking?phone={{contact.phone_raw}}&f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}
   ```
5. **Wait** — 1 hour.
6. **If/Else:** booked yet? **Yes →** end. **No →** continue.
7. **Send Email** — subject *"Your {{custom_values.city}} cleaning quote is one
   click away"*; body = the price range for their home + the same magic link +
   trust line (146 5-star reviews, insured & bonded, satisfaction guarantee).
8. **Wait** — 1 day.
9. **If/Else:** booked? **Yes →** end. **No →** continue.
10. **Create Task** for Todd/Christen: *"Call {{contact.first_name}} —
    abandoned {{custom_values.service}} booking. Phone: {{contact.phone}}."*
    (Personal owner callback closes high-value jobs franchises lose.)

### Stop condition (important — don't pester people who booked)
- Add a **separate mini-workflow or a "Remove from workflow" trigger:** when an
  inbound webhook arrives with `funnel_event` = `booking_completed` (or your
  BookingKoala "booked" tag fires), **remove the contact from Workflow A.**

---

## Workflow B — Branch by where they bailed (optional, higher conversion)

Same trigger as A, but branch the message using `seconds_in_iframe` or service:
- **Left fast (`seconds_in_iframe` < 20):** probably a price/trust hesitation →
  lead with the guarantee + "real published prices" angle.
- **Left after a while (≥ 60s):** probably a scheduling/availability question →
  lead with "we have weekend slots this week, want me to hold one?"
- **Move-out service:** lead with the **deposit-back guarantee**.
- **Commercial service:** route straight to an owner task (don't SMS-drip B2B).

---

## Workflow C — Direct-to-booking visitors (no gateway form)

Some people reach the BookingKoala booking flow straight from an ad/Google
without filling the lead form. If they abandon, the event still fires but **may
have no name/phone** (nothing was captured upstream). For those:
- You can't SMS them (no number), but the **Meta `InitiateCheckout` + GA4
  `begin_checkout`** events still fire from BookingKoala's own native tags →
  they land in your **ad-retargeting audiences**. Run a "Still need that {city}
  clean?" retargeting ad at them.
- To capture them directly, use BookingKoala's own lead-capture step. The old
  suggestion here — add a mini-form on `/booking` and wire it to the "Booking
  Page Pre-Capture" path — is dead: that page was retired in #109.

---

## Quick setup checklist
- [x] `GHL_WEBHOOK_URL` is already set in Vercel (Production) ✅ — verified
      2026-06-05. `GHL_API_KEY` and `GHL_LOCATION_ID` are also configured, so a
      deeper GHL API integration is available later if wanted.
      (Optional: set `GHL_BOOKING_EVENT_WEBHOOK_URL` for a *separate* webhook if
      you want booking events on their own GHL workflow trigger instead of the
      shared form webhook.)
- [ ] Set `BK_WEBHOOK_SECRET` in Vercel (Production), min 16 chars. **Until this
      is set, `/api/bookingkoala-webhook` returns 503 to everything** — it fails
      closed rather than accepting unauthenticated writes to the CRM.
- [ ] Build the **lead Zap**: BK leads module (or "Quote created") → Webhooks by
      Zapier POST → `https://thevalleycleanteam.com/api/bookingkoala-webhook`,
      header `x-bk-webhook-secret: <BK_WEBHOOK_SECRET>`, body `event` =
      `quote_form_submitted` plus the contact fields.
- [ ] Build the **booking Zap**: BK "Booking created" → same POST, `event` =
      `booking_completed`.
- [ ] Fire one of each, then read the Vercel logs. An `unrecognised event type`
      line means the `event` value didn't match — fix the Zap's payload.
- [ ] Confirm in PostHog that `quote_form_submitted` and `booking_completed` are
      arriving again (they stopped 2026-07-17 and 2026-07-10).
- [ ] Decide what to do about `booking_started` / `booking_abandoned` — there is
      no BK trigger for either, so Workflow A below has no input until that is
      resolved (likely by driving recovery from BK's own Abandoned Cart funnel).
- [ ] Confirm a test lead produces a hello@ email (that stopped 2026-07-17 too).
- [ ] **Enable BookingKoala's abandoned-cart SMS + email follow-up.** This is the
      recovery mechanism — paste the copy from `GHL_COPY_PASTE_ASSETS.md` into
      BK's templates. It replaces Workflow A entirely.
- [ ] ~~Create Workflow A with the trigger filter `funnel_event = booking_started`~~
      — **don't build it.** No automated source for its trigger, and BK's own
      follow-up does the job better. See the warning above.
- [ ] (Optional) Check whether incomplete bookings show up in BK's leads module
      once the lead Zap is running — that would restore abandonment *visibility*
      in PostHog, which BK's follow-up alone does not.
- [ ] Fix the magic link before relying on it — it points at `/booking`, which
      is now a 301 to BookingKoala, and the prefill logic that made its query
      params work was deleted with that page. Manual follow-up from the BK
      dashboard needs a working link too.
- [ ] (Optional) Build Workflow B branches + the ad-retargeting audiences.

## Retargeting ideas menu (beyond GHL automation)
1. Speed SMS (above) — do first.
2. Magic pre-filled link (built — use in every message).
3. Owner call for move-out / commercial / deep cleans.
4. Objection-branched follow-up (Workflow B).
5. Concierge "just text your address and I'll text your price" path.
6. Meta/Google retargeting ads from the begin_checkout/InitiateCheckout audiences.
7. Win-back to a lighter offer (one-time clean instead of recurring).
8. Honest scarcity ("holding a {day} slot 24 hrs") — only if true.
9. Direct mail / handwritten card for premium markets (Mountain Brook).
