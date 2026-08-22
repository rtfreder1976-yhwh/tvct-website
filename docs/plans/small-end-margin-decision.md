# Small-end margin — the floor decision

**Date:** 2026-08-21
**Status:** modeled, awaiting Todd's decision
**Workbook:** `docs/pricing/TVCT_Pricing_Extended.xlsx` — "FLOOR SCENARIO" block
(Pricing Table rows 63–70). Lever cell: `Assumptions!B52`.

---

## Two findings that reframe the problem

**1. The $150 weekly minimum is set at breakeven.** Breakeven is **$145**
(Zone 3). The stated $150 floor clears it by five dollars, and in the outer
zones it does not clear it at all:

| Zone | Travel | Breakeven | Margin @ $150 |
|---|---|---|---|
| 1 | $5 | $136 | 5.0% |
| 2 | $8 | $142 | 3.0% |
| 3 | $10 | $145 | 1.7% |
| 4 | $12 | $149 | 0.3% |
| 5 | $15 | $155 | **−1.7%** |

**2. The 38% target is unreachable at the small end.** The workbook's own
floor-check computes the price needed to hit 38% at Zone 3 / 45% sub as
**$471** — above the move-in/out starting price. No small-home floor reaches
target. The realistic question is not "how do we hit 38%" but "what margin
is acceptable on the smallest jobs."

**3. It is not really a weekly problem.** Weekly is worst, but Standard at
750 sqft is 9.5% — also far below target. The driver is the **$70/job fixed
cost** (software $45 + marketing $25), which is 57% of a $123 job and 5% of a
$1,400 one. The 30% weekly discount just exposes it first.

---

## The floor tradeoff

Margin shown is Zone 3 / 45% sub. "Bands lifted" = how many of the 26 sqft
bands get repriced above BK's rate. "Max uplift" = the largest single increase
a customer would see (always at the 750 sqft band).

| Floor | Margin at the floored bands | Bands lifted | Max uplift |
|---|---|---|---|
| $150 (today) | 1.7% | 2 | $27 |
| $175 | 9.3% | 3 | $52 |
| **$200** | **15.0%** | **4** | **$77** |
| $225 | 19.4% | 5 | $102 |
| $250 | 23.0% | 6 | $127 |
| $275 | 25.9% | 7 | $152 |

Above ~1,800 sqft nothing changes at any of these floors — BK's rate already
exceeds them. This is strictly a sub-1,800 sqft decision.

---

## Recommendation: $200

- It matches the **already-advertised $200 starting price**, so nothing on the
  website changes and there is no new number to explain on a call.
- It turns the worst case from −10.0% into +15.0%, and eliminates the
  negative-margin Zone 5 case entirely.
- It only touches 4 of 26 bands; the largest increase any customer sees is $77
  on a weekly plan, and weekly customers still get a real discount off Standard
  at every band.
- $225–$250 earn more margin and are defensible, but they price above the
  public entry point and would need the site copy revisited.

**$200 is the floor that costs nothing to communicate.** Anything higher is a
positioning change, not just a pricing fix.

## If the floor is not enough

The floor caps the damage; it does not fix the cost structure. The $70/job
allocation falls as job volume rises — it is monthly spend ÷ jobs per month.
Growing volume improves every band at once and is the only lever that moves
the 38% target within reach at the small end. Worth revisiting the allocation
once the phone-first pivot's volume verdict lands (~2026-09-04).

## Implementing whichever floor is chosen

The floor has to be enforced in **BookingKoala**, not the workbook — BK is what
bills. The workbook models it; BK applies it. Note BK applies rate changes to
**new bookings only**, so existing sub-1,800 sqft recurring customers stay on
their current price until moved individually.
