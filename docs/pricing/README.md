# Pricing workbook — canonical copy

## The one file that counts

`docs/pricing/TVCT_Pricing_Extended.xlsx` — **this is the canonical pricing
workbook.** Edit this file, in place, in Excel. Commit the change.

Reconciled to the live BookingKoala rate card on 2026-08-21 and verified
formula-clean (zero `#VALUE!` / `#DIV/0!` / `#REF!` sheet-wide).

## Source-of-truth order

1. **BookingKoala** is the system of record for what customers are actually
   charged. If BK and this workbook disagree, BK wins and the workbook is wrong.
2. **This workbook** is the margin/analysis layer on top of BK's rate card.
3. **`src/data/pricing.ts` + `src/data/claims.ts`** are what the website
   publishes. Only *starting* prices are published (decision 2026-08-21) —
   the full ladder stays unpublished, here and in BK.

## Retired copies — do not edit

These previously existed and could silently diverge. They are no longer live:

| Copy | Status |
|---|---|
| `~/Downloads/TVCT_Pricing_Extended.xlsx` | superseded by this repo copy |
| Google Sheet `docs.google.com/spreadsheets/d/15ua0sD1C58MqocM_yfczW0Uk5DGec4T9` | **archived** — a separate upload, never linked to the local file |
| `archive/TVCT_Pricing_Extended.BACKUP-2026-08-21.xlsx` | pre-reconciliation snapshot, kept for audit only |

If you find yourself editing anything in that table, stop — you are editing a
dead copy.

## Structure notes (things that will bite you)

- **Header row is NUMERIC on purpose.** The per-sqft, labor-hour, and margin
  rows divide by the header values. Replacing them with text labels
  ("up to 750") throws `#VALUE!` across the whole sheet.
- **26 sqft bands, not 25.** BK splits 6,001–6,499 and 6,500–6,999. An earlier
  version was missing this band, which shifted every value above 6,500 by one
  column.
- **Post-Construction has its own 25 bands** with different cut-points
  (4,401–4,700 / 4,701–5,200) and correctly stops one column short of the
  shared table. This is not a bug — do not "fix" it into alignment.
- Add-on values match BK: blinds $20 flat, fridge $42.50, dishwasher $35.
  The fridge cell *displays* `$43` — number formatting, stored value is 42.5.

## Open pricing decision

Weekly recurring is **margin-negative at the small end**: −10.0% at ≤750 sqft,
+0.6% at 1,000 sqft, and below the 38% target until roughly 4,400 sqft. A $150
weekly floor does not rescue it ($150 @ 750 sqft = 10.7%).

Modeled 2026-08-21 in the workbook's **FLOOR SCENARIO** block (Pricing Table
rows 63-70). Change `Assumptions!B52` to re-model a different floor; the billed
prices and margins recalculate. Two findings worth knowing:

- Breakeven is **$145**, so the current $150 weekly minimum is set essentially
  at breakeven and is *negative* in Zone 5.
- The 38% target needs **$471** at the small end and is simply unreachable
  there; the $70/job fixed cost is the real driver, not the 30% discount.

Analysis and the floor tradeoff table:
[`../plans/small-end-margin-decision.md`](../plans/small-end-margin-decision.md)
Band reconciliation detail:
[`../plans/pricing-band-reconciliation.md`](../plans/pricing-band-reconciliation.md)
