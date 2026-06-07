# GoHighLevel — Abandoned-Booking Recovery Workflow

_How to turn the new booking-funnel signals into automatic SMS/email/owner-call
follow-ups that recover lost bookings. Last updated: 2026-06-05._

---

## What the website now sends you

Every event posts to your existing GHL inbound webhook (the same one the quote
form uses). Each booking-funnel event arrives with these fields:

| Field | Example | Use |
|---|---|---|
| `source` | `Booking Page Pre-Capture` | Identifies booking-funnel events |
| `funnel_event` | `booking_started` / `booking_abandoned` / `booking_completed` | **The trigger/branch field** |
| `name` | `Jane Doe` | Lead match + personalization |
| `phone` | `2565550100` | SMS + match |
| `email` | `jane@x.com` | Email + match |
| `service` | `Deep Cleaning` | Personalization |
| `location_city` | `Huntsville` | Personalization |
| `seconds_in_iframe` | `47` | (optional) how long before they bailed |

**Lifecycle:**
1. Lead fills `/get-quote` → already in GHL as an opportunity (existing behavior).
2. Lead enters BookingKoala → `funnel_event: booking_started`.
3. Lead **leaves without booking** → `funnel_event: booking_abandoned`. ← recover this.
4. Lead completes → `funnel_event: booking_completed`. ← stop the recovery.

---

## The recovery "magic link"

Send abandoners back with their info pre-filled (one click, no re-typing). Format:

```
https://thevalleycleanteam.com/booking?phone={{contact.phone}}&f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}
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
   info's already filled in): https://thevalleycleanteam.com/booking?phone={{contact.phone}}&f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}
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

Some people land on `/booking` straight from an ad/Google without filling
`/get-quote`. If they abandon, the event still fires but **may have no
name/phone** (nothing was captured upstream). For those:
- You can't SMS them (no number), but the **Meta `InitiateCheckout` + GA4
  `begin_checkout`** events still fire → they land in your **ad-retargeting
  audiences**. Run a "Still need that {city} clean?" retargeting ad at them.
- To capture them directly, add a tiny name+phone field on `/booking` *before*
  the iframe (a future enhancement — ask the dev to wire the existing
  "Booking Page Pre-Capture" path to a visible mini-form).

---

## Quick setup checklist
- [x] `GHL_WEBHOOK_URL` is already set in Vercel (Production) ✅ — verified
      2026-06-05. `GHL_API_KEY` and `GHL_LOCATION_ID` are also configured, so a
      deeper GHL API integration is available later if wanted.
      (Optional: set `GHL_BOOKING_EVENT_WEBHOOK_URL` for a *separate* webhook if
      you want booking events on their own GHL workflow trigger instead of the
      shared form webhook.)
- [ ] In GHL, create Workflow A with the trigger filter `funnel_event = booking_started`.
- [ ] Add the 30-min wait + booked-check + SMS with the magic link.
- [ ] Add the `booking_completed` removal trigger so booked clients exit.
- [ ] Test: open `/booking`, start the form, close the tab → confirm a
      `booking_abandoned` event hits GHL and the workflow fires.
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
