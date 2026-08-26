# Campaign: Commercial Quote Follow-Up

_Created 2026-08-25 by /email-sequences. Status: ALL DRAFT — pending Todd review. Nothing pushed to GHL, nothing sending._

## Goal

Convert delivered-but-unawarded **commercial** quotes into signed recurring facility contracts. This is the commercial counterpart to `campaigns/ghl-esp/quote-follow-up/` (residential) — a different buyer, a different register, and a different sales cycle.

Commercial is TVCT's **secondary** segment by the brand brief, but the revenue is real and recurring, and there is currently **no commercial email sequence at all**. The 17 Apollo-enriched Shoals medical decision-makers (batch #4) have no follow-up infrastructure behind them.

## Angle

**Angle 5 — The Two-Hour Written Quote** (`brand/positioning.md`). Office, dental, medical and church facility managers get a written quote within 2 business hours, priced from square footage, task list, and visits per week — not a walkthrough three days out.

## Who receives it

Facility decision-makers who received a written commercial quote and have not signed:

- Office managers, practice managers (dental/medical), church administrators, property/office-park managers
- North Alabama first (Shoals medical batch #4), extensible to Huntsville and Nashville
- **Excluded:** residential leads (they get the residential sequence), and anyone who signs (exit the workflow on contract)

## How this differs from the residential sequence

| | Residential | Commercial (this one) |
| --- | --- | --- |
| Register | Warm, one dry aside allowed | **Measured. No wit, no asides.** |
| Signed by | Todd, first-name | The company; Todd by full name and title |
| Decision | One person, days | Committee/owner, weeks; often a budget cycle |
| Price mechanism | Sq ft + type of cleaning, firm on the call | Sq ft + task list + visits per week, **written quote in 2 business hours** |
| Proof that matters | Checklist, re-clean, reviews | Insurance certificate, consistency, after-hours access, one accountable contact |
| Cadence | Day 0/2/5/9 | **Day 0/4/10/21** — longer, because the decision is slower |

## Arc

```
01 (Day 0)   THE QUOTE, RESTATED     — what we quoted and the three inputs behind it
02 (Day 4)   WHAT CHANGES AT MONTH 3 — the consistency problem every facility buyer has lived
03 (Day 10)  THE PAPERWORK           — COI, access/keys, one point of contact; removes procurement friction
04 (Day 21)  HONEST CLOSE            — no deadline; ask for a yes, a no, or a date to revisit
```

Straight line. One CTA per email.

## Hard rules applied

- **Non-clinical only.** No OSHA, bloodborne-pathogen, clinical protocol, infection-control or named-disinfectant claims (`CLINICAL` all false, `CERTIFICATIONS` empty). Medical and dental pages describe *facility* cleaning. This is non-negotiable and is the fastest way this sequence could get TVCT in trouble.
- **No bonded, no workers' comp, no W-2/employee framing** (TVCT uses subcontractors — see project memory `tvct-uses-subcontractors`).
- **No numeric commercial price anywhere.** Commercial is custom-quoted from three inputs; the only number is the customer's own quote. No "starting at," no per-visit figures, no ranges.
- Phone: **(256) 826-1100** default; TN-targeted sends swap **(615) 510-1427**.
- No scarcity, no countdowns, no "free quote/estimate/assessment," no exclamation marks, no oversell words.
- Canonical facts only: $2M liability, background-checked cleaners, written quote within 2 business hours, 3 quote inputs (`POLICIES.commercialQuoteFactors`), 98% on-time arrival, 85% repeat, 15-year average cleaner experience, 4.9 from 148 Google reviews, 1,500+ customers served.

## Merge fields (GHL)

- `{{contact.first_name}}` — every email
- ~~`{{contact.company_name}}`~~ **REMOVED 2026-08-25.** Verified against the GHL API: no custom `company_name` field exists in this location (all 60 contact custom fields checked). GHL's built-in *standard* Company Name field may still be available, but the API endpoint only returns custom fields so it could not be confirmed. Emails 1 and 4 now read naturally without it. Email 1 documents the optional merge upgrade if Todd confirms the standard field is populated — **test-send to yourself first**, since an unresolved tag renders as literal text to a prospect.
- Quote amount is **not** merged — copy references "the quote we sent" so the sequence works without a custom field.

## Pairs with

`campaigns/commercial-hiring-sheet/` — the 12-question buyer scorecard. Email 3 is the natural place to attach or link it, since that email is already about what to get in writing. Do not attach it to email 1; leading with a lead magnet on a quote follow-up reads as a stall.

## Send timing

| Email | Day | Time | Rationale |
| --- | --- | --- | --- |
| 01 | 0 | Within 2 business hours of the quote | The SLA is the promise; the sequence should honor it |
| 02 | 4 | Tue-Thu, 9:00 AM CT | B2B open window; avoids Monday triage and Friday drift |
| 03 | 10 | Tue-Thu, 9:00 AM CT | Procurement/paperwork stage |
| 04 | 21 | Tue-Thu, 9:00 AM CT | Three weeks respects a real budget cycle |

If a send lands on Monday or Friday, shift to the next Tuesday-Thursday slot.

## Status

draft

## Voice notes

The residential sequence's warmth is wrong here. This buyer is comparing three vendors on a spreadsheet and has to defend the choice to someone else. Give them the facts that make the defense easy. Measured, specific, zero salesmanship — and never imply clinical capability.
