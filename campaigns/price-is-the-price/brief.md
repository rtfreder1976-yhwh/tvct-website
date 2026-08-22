---
campaign: price-is-the-price
created: 2026-08-22
status: draft
angle: The Price Is the Price
source: brand/positioning.md
---

# Campaign: The Price Is the Price

## Goal

Apply the rebuilt positioning to the money pages. Per `brand/learnings.md` the
bottleneck is **CTR and conversion, not ranking** — positions 4-10 already
convert at 0.29%, local CTR is 0.07%, and `phone_click` has recorded zero real
conversions. A title tag and a CTA are the highest-leverage changes available.

## Angle

Flat-rate pricing plus a firm price on the phone call. The enemy is the estimate
runaround (chains that send an estimator before naming a number) and "starting
at" bait that climbs 30-80% by the day of service.

The mechanism: `src/data/pricing.ts` holds a deterministic 25-bracket rate card,
750 to 10,000 sq ft. Whoever answers the phone reads a number rather than
inventing one. Canonical as `QUOTE_ON_CALL` in `claims.ts`.

## Scope of this pass

- `src/pages/index.astro` — H1, subhead, mobile CTA, meta title + description
- `src/pages/pricing.astro` — H1, subhead, meta title + description

## Copy decisions

**"Today" was cut from the recommended H1.** The original hook was "Your exact
price. On the phone. Today." The word referred to the *quote*, not the cleaning,
and the same-day validator only pattern-matches "same-day" so it would have
passed. It was cut anyway: in a cleaning company's H1 a fast reader sees
"cleaning" plus "Today" and infers same-day service. Passing the validator on a
technicality is how the previous positioning ended up built on a banned claim.

"On the phone" already carries the immediacy — the contrast is against estimator
visits and callbacks, not against tomorrow.

**"Call for a Free Quote" was replaced with "Get your price."** The old phrase is
the most saturated CTA in the category; every competitor in the map pack uses it,
which is part of why local CTR is 0.07%. It promises the runaround. "Get your
price" promises the answer.

## Guardrails honoured

- No same-day or emergency claims
- Prices interpolate from `claims.ts` (regular $200 / deep $276 / move-in-out $351)
- Reviews 4.9 / 148 from `REVIEWS`
- MaidPro collision: the homepage does not lead with veteran-owned, woman-owned,
  or a numbered checklist — those are support, not the hook
- `QUOTE_ON_CALL` scope respected: the promise is about the QUOTE, and applies to
  standard residential homes during business hours

## Measurement

Baseline is clean: `phone_click` has zero real conversions to date, so any
movement is signal. Watch GSC CTR on the two URLs and `phone_click` in PostHog,
filtered to AL/TN (85% of raw traffic is datacenters) and to the production
hostname only.
