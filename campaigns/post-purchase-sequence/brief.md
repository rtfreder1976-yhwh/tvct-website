---
campaign: post-purchase-sequence
created: 2026-05-14
status: draft
trigger: First cleaning booked (any service type)
audience: New customers — first cleaning completed or scheduled
goal: Convert one-off bookings into recurring customers; reduce post-clean anxiety; collect Google reviews
---

# Post-Purchase Sequence Brief

## Why this sequence exists

About 60% of cleaning-industry customers churn after their first one-off booking — usually because (a) nothing prompts them to book the next clean, (b) they don't know what's normal post-clean, or (c) something minor was missed and they silently switched cleaners instead of asking for a re-clean.

This 4-email sequence handles all three problems with a soft hand, then asks for a Google review and a recurring conversion at the right moment.

## When it fires

**Trigger:** Contact gets the tag `cleaning-booked` OR enters the existing GHL workflow "1) Cleaning Booked → Remove From Nurture Workflows" (which already pulls them out of the welcome sequence).

**Send schedule:**

| # | When | Subject (recommended) | Purpose | CTA |
|---|---|---|---|---|
| 1 | Booking confirmed (within 1 hr) | "You're on the schedule — here's what happens next" | Set expectations, reduce day-of anxiety | Reply with questions |
| 2 | Day of clean — 7:00 AM CT | "We're on the way today (and a quick favor)" | Day-of arrival window confirmation, set up review ask | None — passive |
| 3 | Day after clean — 8:00 AM CT | "How did we do? (and your photo proof, attached)" | Photo follow-up, request review if happy | Leave Google review OR reply with issues |
| 4 | 14 days after clean | "Most customers book us again around now" | Soft recurring upsell with the math | Book recurring (or stay on standing newsletter) |

After email 4: drops into the standing newsletter cadence (1 email every 2 weeks).

## Voice + positioning notes

- **Christen sign-off:** emails 1 (anxiety-reduce), 3 (review ask)
- **Todd sign-off:** emails 2 (operations/arrival), 4 (math/conversion)
- **Faith/family thread:** none in this sequence — the trust is already earned by booking
- **49-point checklist / women-led / veteran-owned:** mention each exactly once across the four emails, never in the headline
- **No exclamation points anywhere**

## What's NOT in this sequence (deliberately)

- Cross-sell to other service categories (commercial, post-construction) — comes later if signals match
- Referral request (deferred to a separate referral campaign — different timing, different psychology)
- Promo codes / discounts (would undercut the recurring upsell math in email 4)

## Files

- `emails/01-booking-confirmed.md` — markdown source
- `emails/02-day-of-clean.md`
- `emails/03-post-clean-followup.md`
- `emails/04-recurring-upsell.md`
- `emails/_html/` — paste-ready HTML for GHL Import HTML
- `emails/_html/README.md` — name + subject + preview index for paste-in
