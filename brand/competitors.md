# Competitor Intel — The Valley Clean Team

_Started 2026-08-22. Only competitors we have actually read are in here._

> **Rule for this file.** Every claim below is quoted or paraphrased from the competitor's own
> live pages, with the capture date recorded. A competitor can rewrite a page overnight, so
> **re-verify before publishing any comparison content** — a comparison post that misquotes a
> competitor is a liability, not an asset. Nothing in here is a licence to price-match:
> `POLICIES.priceMatching = false`.

---

## Bear Brothers Cleaning

**Captured 2026-08-22** from `bearbroscleaning.com`. Their one-time booking page reported
`article:modified_time` of **2026-08-05**, so this is current, not archived.

- **Markets:** Huntsville (256-633-6332), Birmingham (205-608-6333), Montgomery, 30A.
  Overlaps TVCT in **Huntsville and Birmingham**.
- **Positioning:** "Beary Clean, Guaranteed" — re-clean for free.
- **Model:** cleaners are **independent contractors**, paid **50% of the clean**.

### What they genuinely do well — do not pretend otherwise

- **Phone quotes without an estimator visit.** Their own words: *"Get a free estimate over the
  phone! Don't worry about scheduling an estimator."* Speed-to-quote is **partially claimed
  territory**. Do not lead Huntsville or Birmingham copy on being *fast* to quote.
- **$2,000,000 insurance**, stated publicly. Matches TVCT's coverage — not a differentiator.
- **Background-checked cleaners**, stated publicly. Also not a differentiator.
- **Online booking with instant quote**, Stripe checkout, and a 24-hour re-clean guarantee.
- Strong recent Google review flow (multiple 5-star reviews per month through 2026).

### The four real openings

**1. They price on bedroom count. We price on square footage.** ← *the strongest one*

Their published formula: **$125 minimum** for 1 bed / 1 bath, then **+$75 per bedroom** and
**+$25 per bathroom**. Their own worked example: a 3-bed / 3-bath is **$425 before tax**.

This is a structural weakness, not a competitive one. A 1,200 sq ft starter home and a 3,400 sq ft
home with the same bed/bath count pay Bear Brothers the **identical $425** — so they overcharge
small homes and badly undercharge large ones. TVCT's 25-bracket rate card in `pricing.ts` prices
the thing actually being cleaned.

> Angle: **"Bedrooms don't get dirty. Square footage does."**

**2. Their quote is a booking, and the card is charged immediately.**

Their FAQ: *"Your card will be charged once the booking is completed."* Combined with a
bed/bath formula that ignores home size, the customer pays up front on a number derived from the
wrong variable. TVCT's `QUOTE_ON_CALL.priceHeld = true` is the direct counter — our quoted number
is the number billed, and it moves only for customer-added scope or a misstated home.

**3. Independent contractors carrying their own insurance; a burden-of-proof damage policy.**

Their words: *"Our cleaners are independent contractors who carry their own insurance."* Their
damage policy requires the **customer** to supply before-and-after images **plus proof the damage
occurred during the clean**, within 24 hours. And *"we do not give refunds"* appears **three times**
across their site.

TVCT counter (all canonical in `claims.ts` `TRUST`): $2M liability, **workers comp**, damage claims
covered by insurance, background checks, satisfaction guarantee, free re-clean within 24 hours.

**4. 33-step checklist vs. our 44.**

⚠️ **Market-gated.** The MaidPro collision rule bans leading with a numbered checklist in
**Huntsville and the Shoals**. Bear Brothers operates in Huntsville *and* Birmingham — so
**44 vs 33 is usable in Birmingham / Mountain Brook only.**

### Head-to-head, from published sources

| | Bear Brothers | TVCT |
|---|---|---|
| Pricing basis | Bed/bath count | **Square footage (25 brackets)** |
| Entry price | $125 (1bd/1ba) | $200 regular / $276 deep |
| 3bd/3ba example | **$425** | Priced by sq ft |
| Price final? | Card charged at booking; no stated finality | **`priceHeld: true`** |
| Recurring discounts | 20 / 15 / 10 | **30 / 25 / 15** |
| Cancellation fee | $50 | $100 (24h notice) |
| Checklist | 33 steps | 44 items |
| Labor | Independent contractors, 50% of clean | W-2 team, same team every visit |
| Insurance | $2M (contractors carry their own) | $2M + workers comp |
| Refunds | **"We do not give refunds"** ×3 | Satisfaction guarantee + free re-clean |
| Won't clean | >7,000 sq ft or >8 bd/ba | Rate card runs to 10,000 sq ft |

**We beat their recurring discounts at every frequency** (30/25/15 vs 20/15/10). That is a
straight, checkable factual advantage.

### How to use this

- **Lead on finality, not speed.** They own "fast quote." Nothing on their site commits to the
  quoted number being final. That is the white space.
- **Let the mechanism do the work.** "Every home size already has a set price" explains *why* we can
  hold a number and they structurally cannot.
- **Their large-home gap is real.** A 4,000+ sq ft home is underpriced by a bed/bath formula, which
  means either they lose money on it or they revise on the day. Either way it argues for us.
- **Never name them in a claim we cannot re-verify.** Quote published terms, date the capture.

### Open questions

- Do they revise the charged price after arrival? Their site does not say. If a customer reports
  it, that is a strong, specific, honest data point.
- Their Huntsville vs Birmingham pricing appears identical despite different markets — worth
  re-checking if we build Birmingham comparison content.

**Re-verify by:** 2026-11-22 (quarterly).

---

## MaidPro (Huntsville / The Shoals)

Not re-verified in this pass — carried forward from brand memory.

- Owned by Ashlee J. Smith since 2006. **Also veteran-owned, also women-owned, also markets a
  numbered checklist (49-point).**
- **This is the MaidPro collision.** In Huntsville and the Shoals, veteran-owned, woman-owned, and
  a numbered checklist are **not differentiators** — leading with them makes TVCT read as the
  second-best version of an established competitor.
- Visual identity: bright teal + white + photographed cleaner. The creative kit lists this as an
  anti-pattern.

**Needs a proper capture pass before any comparison content.**

---

## Others named but not yet verified

Molly Maid · Merry Maids · The Maids · The Cleaning Authority — chains requiring a multi-day
estimate process; Molly Maid reportedly sends a human estimator before quoting.
Homeaglow / Handy / Care.com — gig marketplaces; fast but no quality control, different stranger
each visit.

**None of these have been read directly. Do not quote them until they have.**
