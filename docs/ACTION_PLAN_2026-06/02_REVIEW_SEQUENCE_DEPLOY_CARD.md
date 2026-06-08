# Step 2 — Deploy the Post-Purchase / Review Sequence in GHL

_Generated 2026-06-07. The 4 emails are already written and HTML-ready in
`campaigns/post-purchase-sequence/emails/_html/`. This card is the exact wiring —
including two verified traps that will make the sequence silently never fire if
you follow the campaign brief literally._

## Why this is the highest-leverage deploy
It removes Todd from the entire **happy-path** QA + review loop. Email 3 asks happy
customers for a Google review automatically and routes unhappy ones to a reply +
free re-clean. Only genuine complaints reach a human. This is the deploy that makes
the later "delegate `hello@`" hire (Step 7) possible.

---

## ⚠️ TRAP 1 — the trigger tag (verified in code)
The campaign brief (`campaigns/post-purchase-sequence/brief.md:20`) says trigger on
tag **`cleaning-booked`**. **That tag does not exist in the live system.** The tag
the system actually uses is **`booked`**, set by the GHL workflow
**"Booking Completed - Mark Booked"** (per `PROJECT_CONTEXT.md`).
→ **Trigger the sequence on tag `booked`, NOT `cleaning-booked`.**

## ⚠️ TRAP 2 — does `booked` reliably get set? (verify before trusting it)
The chain is: review sequence ← tag `booked` ← GHL "Booking Completed - Mark Booked"
workflow ← `funnel_event=booking_completed` ← a **BookingKoala `postMessage`** the
booking page listens for (`src/pages/booking.astro:387-401`).

That last hop is best-effort pattern-matching on BookingKoala's iframe messages
(`data.includes('booking_confirmed')`, `data.type==='booking_confirmed'`, etc.). If
BookingKoala's real completion message doesn't match — or it doesn't postMessage at
all — `booking_completed` never fires, `booked` never gets set, and **this sequence
never triggers even when configured perfectly.**

**Before relying on `booked`, confirm it actually lands:** complete one real test
booking end-to-end and check the contact in GHL gets the `booked` tag. 
- **If yes** → trigger on `booked`. 
- **If no** → trigger the sequence off the **real source of truth instead**: a
  completed booking in **BookingKoala** (its own GHL integration / "appointment
  booked" trigger, or a Zap/automation on BookingKoala's completed-order event).
  Don't depend on the browser postMessage for money-path automation.

---

## The wiring (GHL)

1. **Import the 4 emails.** Marketing → Emails → Templates → + New → **Import HTML**.
   Paste each file from `campaigns/post-purchase-sequence/emails/_html/`:

   | # | File | GHL template name | Subject (A) |
   |---|---|---|---|
   | 1 | `01-booking-confirmed.html` | TVCT — Post-Purchase #1 — Booking Confirmed | You're on the schedule — here's what happens next |
   | 2 | `02-day-of-clean.html` | TVCT — Post-Purchase #2 — Day Of Clean | We're on the way today (and a quick favor) |
   | 3 | `03-post-clean-followup.html` | TVCT — Post-Purchase #3 — Post Clean Followup | How did we do? (and your photo proof, attached) |
   | 4 | `04-recurring-upsell.html` | TVCT — Post-Purchase #4 — Recurring Upsell | Most customers book us again around now |

   (Preview-text strings are in that folder's `README.md`.)

2. **Build the workflow** "Post-Purchase Sequence":
   - **Trigger:** Contact Tag added = `booked` (see Trap 2 — swap to the BookingKoala
     completed-booking trigger if `booked` proves unreliable).
   - **Email 1** — send within 1 hour of trigger.
   - **Wait** until the clean day, 7:00 AM CT → **Email 2**.
   - **Wait** until day after clean, 8:00 AM CT → **Email 3**.
   - **Wait** to day 14 → **Email 4**.
   - After Email 4 → drop into the standing newsletter cadence.

3. **Email 3 branches** (the part that removes Todd): the review ask links to the
   Google review URL; the "something was off" path routes the reply to `hello@`
   for the free-re-clean promise. Make sure `{{google_review_url}}` (or the literal
   review link) is set, and that replies are visible to whoever owns `hello@`.

## Voice guardrails (already baked into the copy — don't edit them out)
No exclamation points. Christen signs emails 1 & 3; Todd signs 2 & 4. Mention
"49-point checklist", "women-led", "veteran-owned" exactly once each across the
four, never in a subject line.

## Verify done
- One real/test booking → contact gets `booked` tag → Email 1 arrives within the hour.
- Walk emails 2–4 on schedule (temporarily shorten waits to test, then restore).
- Email 3 review link works; the complaint-reply path lands somewhere a human sees.
