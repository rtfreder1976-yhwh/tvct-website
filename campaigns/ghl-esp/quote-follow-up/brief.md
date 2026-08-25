# Campaign: Quote Follow-Up Sequence (Residential)

_Created 2026-08-24 by /email-sequences. Status: ALL DRAFT — pending Todd/Christen review. Nothing pushed to GHL, nothing sending._

## Goal

Convert delivered-but-unbooked residential quotes into booked first cleans. This replaces the legacy GHL "Quoting Follow up" folder (5× 2024 emails BLOCKED for "$79 off" / "FREE quote" / manufactured scarcity; 3× 2025 emails broken by a literal "[Phone Number]" placeholder — see `../template-audit-2026-08-24.md`).

## Sequence Type

Conversion follow-up, post-quote. Deliberately **4 emails over 9 days**, then stop. The recipient already has their exact price — the job is to reinforce what the number buys, surface the recurring option, and close honestly. No countdowns, no discounts, no chasing.

## Who receives it

Residential leads who received a quote and have not booked:

- **Written-quote path** (after-hours/voicemail, out-of-bracket homes): Email 1 doubles as the quote-delivery follow-up ("here it is in writing").
- **Phone-quote path** (firm price given on the call, didn't book): Email 1 works as the same-day recap.
- **Excluded:** commercial inquiries (different register — measured, no wit; build separately), and anyone who books (exit the workflow immediately on booking).

## Angle

The Experts Who Happen to Be Likable. Exact price as transparency proof: "the number we quote is the number we bill," two exceptions (both the customer's), explain-don't-defend pricing.

## Arc

```
01 (Day 0)  YOUR PRICE, IN WRITING   — recap the number, held-price promise, what's included, next step
02 (Day 2)  WHAT THE NUMBER BUYS     — "not the cheapest, that's intentional": checklist / insurance / answers / re-clean
03 (Day 5)  THE RECURRING MATH       — 30/25/15 recurring discounts; the nudge toward a schedule
04 (Day 9)  HONEST CLOSE             — no fake deadline; real constraint (2-3 day booking lead); warm exit
```

Straight line. One CTA per email, phone-first.

## Hard rules applied (from brand-brief / voice-profile / claims.ts / learnings)

- Signed **Todd** (customer-facing replies are signed by Todd — Christen's Review Rules).
- Phone: **(256) 826-1100** default. Any TN-targeted send swaps **(615) 510-1427** (GHL: branch on contact state or duplicate templates).
- All numbers from `src/data/claims.ts` at write time: 44-item checklist, $2M liability, background checks, re-clean reporting window 24 hours (client tells us), 30%/25%/15% recurring discounts off the regular rate, booking lead 2-3 days, 2-business-hour written-quote SLA.
- No "free quote," no discount offers, no scarcity/countdown, no exclamation marks, no oversell words, no banned generic phrases, no hourly/time-based price framing.
- Two-exceptions language uses Christen's approved shape: exceptions are the customer's; "you'll hear from us before anything changes — not after." Never imply we measure or inspect.
- Re-clean wording is client-reported: "tell us within 24 hours and we'll get a re-clean on the schedule right away, at no charge."
- Quote validity: no claim that the quote is held forever, and no fake expiry — Email 4 names the real constraint (the schedule) instead.

## Merge fields (GHL)

- `{{contact.first_name}}` — used in every email.
- Quote amount is **not** merged — copy says "your quote / the number we sent you," so the sequence works whether or not a quote-amount custom field exists. If Todd wants the dollar figure in Email 1, add a custom field and one line can carry it.

## ESP / deployment

GoHighLevel (MCP verified). Plan: after review, push these as **new templates in a new folder** (e.g. "Quote Follow-Up 2026") — legacy folders stay untouched as archive. Workflow wiring (trigger on quote-sent tag, exit on booking) is manual in GHL UI or via n8n; the site never writes to GHL (CLAUDE.md).

## Send timing

| Email | Day | Time | Rationale |
| --- | --- | --- | --- |
| 01 | 0 | Immediately after quote delivery/tag | Recap lands while the number is fresh |
| 02 | 2 | 8:00 AM CT | Dual-income households check email during the morning routine; comparison-shopping window |
| 03 | 5 | 7:30 AM CT | Mid-consideration; recurring option reframes the decision |
| 04 | 9 | 6:30 PM CT | Evening decision time; last touch, warm exit |

## Status

draft

## Voice notes

Warmest register in the system. One dry aside maximum per email, never in the price line or CTA. Every email passes the 10-question VCT Voice Test before pushing to GHL.
