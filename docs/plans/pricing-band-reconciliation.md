# Pricing Band Reconciliation — BookingKoala → Spreadsheet

**Date:** 2026-08-20
**Purpose:** Align "TVCT_Pricing_Extended.xlsx" band boundaries to BookingKoala.
**Rule:** **BookingKoala is authoritative** — it is what actually bills customers.

**Canonical workbook:** `docs/pricing/TVCT_Pricing_Extended.xlsx` (see
[`../pricing/README.md`](../pricing/README.md)). Copies in `~/Downloads` and
Google Drive are retired — do not edit them.

---

## Changes made live in BookingKoala 2026-08-20

| Band | Was | Now | Variable ID |
|---|---|---|---|
| 5201 – 5600 sqft | $821 | **$876** | 86 (edited in place) |
| 5601 – 6000 sqft | $876 | **$931** | 159 → **200** (archived + recreated) |

Both were stalled steps breaking the consistent +$55 progression.

**BK behavior note:** changes apply to **new bookings only**. Existing one-time and
recurring bookings keep the old price. Moving current recurring clients to the new rate is a
separate per-customer change in BK.

**Non-issues** (previously suspected, now disproved):
- `8000–8499` "duplicate" (IDs 165/166) = archived+active pair from an earlier edit. Only 166
  is active. Nothing to delete.
- 6,000 "overlap" — the band is `6001–6499`, not `6000–6499`. No conflict.

---

## Corrected band boundaries — paste into the spreadsheet

The **prices already agree**. Only the **band cut-points** differ. Replace the sheet's
`Sq Ft →` header row with BookingKoala's actual bands.

### Shared Sq Ft base table
Feeds **Deep Clean**, **The Fresh Start Move-In/Out Clean**, and **Standard Recurring Clean**
(one parameter, three services — service multipliers live elsewhere in the form config).

| # | BookingKoala band | Standard Clean | BK ID |
|---|---|---|---|
| 1 | Up to 750 sqft | $176 | 113 |
| 2 | 751 – 1000 | $211 | 88 |
| 3 | 1001 – 1250 | $246 | 89 |
| 4 | 1251 – 1500 | $281 | 90 |
| 5 | 1501 – 1800 | $316 | 91 |
| 6 | 1801 – 2100 | $351 | 92 |
| 7 | 2101 – 2400 | $381 | 93 |
| 8 | 2401 – 2700 | $436 | 94 |
| 9 | 2701 – 3000 | $491 | 95 |
| 10 | 3001 – 3300 | $546 | 96 |
| 11 | 3301 – 3600 | $601 | 97 |
| 12 | 3601 – 4000 | $656 | 98 |
| 13 | 4001 – 4400 | $711 | 54 |
| 14 | **4401 – 4800** | $766 | 65 |
| 15 | **4801 – 5200** | $821 | 85 |
| 16 | **5201 – 5600** | **$876** ← corrected | 86 |
| 17 | **5601 – 6000** | **$931** ← corrected | 200 |
| 18 | **6001 – 6499** | $931 | 161 |
| 19 | **6500 – 6999** | $1,045 | 162 |
| 20 | 7000 – 7499 | $1,200 | 163 |
| 21 | 7500 – 7999 | $1,375 | 164 |
| 22 | 8000 – 8499 | $1,550 | 166 |
| 23 | 8500 – 8999 | $1,725 | 167 |
| 24 | 9000 – 9499 | $1,900 | 168 |
| 25 | 9500 – 9999 | $2,075 | 169 |
| 26 | **10000+ sqft** | $2,250 | 170 |

**Boundary differences from the sheet (rows 14-19, 26):**

| Sheet had | BookingKoala uses |
|---|---|
| 4,700 | *(no such band)* — 4401–4800 |
| 5,200 | 4801–5200 |
| 5,600 | 5201–5600 |
| 6,000 | 5601–6000 |
| 6,500 | 6001–6499 **and** 6500–6999 (two bands) |
| *(none)* | 10000+ open-ended top band |

Note rows 17 and 18 are both $931 — that is BK's actual configuration, not an error, since
6001–6499 is a genuinely separate band.

### Post-Construction (separate parameter, own bands)

| BookingKoala band | Price | BK ID |
|---|---|---|
| Up to 750 sqft | $526 | 171 |
| 751 – 1000 | $579 | 174 |
| 1001 – 1250 | $631 | 175 |
| 1251 – 1500 | $684 | 176 |
| 1501 – 1800 | $736 | 177 |
| 1801 – 2100 | $789 | 178 |
| 2101 – 2400 | $871 | 179 |
| 2401 – 2700 | $954 | 180 |
| 2701 – 3000 | $1,036 | 181 |
| 3001 – 3300 | $1,119 | 182 |
| 3301 – 3600 | $1,201 | 183 |
| 3601 – 4000 | $1,284 | 184 |
| 4001 – 4400 | $1,366 | 185 |
| **4401 – 4700** | $1,449 | 186 |
| **4701 – 5200** | $1,531 | 187 |
| 5201 – 5600 | $1,614 | 188 |
| 5601 – 6000 | $1,696 | 189 |
| 6001 – 6500 | $1,820 | 190 |
| **6501 – 7000** | **$3,500** | 191 |
| 7001 – 7500 | $3,750 | 192 |
| 7501 – 8000 | $4,000 | 193 |
| 8001 – 8500 | $4,250 | 194 |
| 8501 – 9000 | $4,500 | 195 |
| 9001 – 9500 | $4,750 | 196 |
| 9501 – 10000 | $5,000 | 197 |

⚠️ Post-Construction uses **4401–4700 / 4701–5200** — different cut-points from the shared
Sq Ft table (4401–4800 / 4801–5200). This is a real inconsistency between the two parameters
in BK. Not corrected (out of scope) but worth a decision later.

The **$1,820 → $3,500** jump at 6,501 is deliberate — the sheet documents it: the old
"Move In/Out × 1.5" formula underpriced large new builds; extended range uses $0.50/sqft,
grounded in Nashville market rates ($3,200–$4,400 for 8,000 sqft).

### Vacation Rental Turnover (bath/bedroom based, not sqft)

Bedrooms: 1=$80 · 2=$100 · 3=$130 · 4=$160 · 5=$190 · 6=$220
Bathrooms: 1=$30 · 1.5=$40 · 2=$50 · 2.5=$60 · 3=$70 · 3.5=$80 · 4=$90

### Bathrooms parameter
Exists for the four residential services with **no price set** (all "-"). Bath count does not
add cost outside Vacation Rental.

---

## ✅ COMPLETED 2026-08-21 — spreadsheet reconciled

`TVCT_Pricing_Extended.xlsx` (in `~/Downloads`) now matches BookingKoala.
Original preserved as `TVCT_Pricing_Extended.BACKUP-2026-08-21.xlsx`.

What changed:
1. **Headers re-banded.** Columns now carry BK band **upper bounds** (750, 1000,
   … 6499, 6999 … 10000) instead of the old single sq-ft figures. Kept numeric
   so every existing per-sq-ft / labor-hour / margin formula still evaluates.
2. **Added the missing 26th band.** BK splits `6,001–6,499` and `6,500–6,999`;
   the sheet had one column for both, which shifted every value above 6,500 by
   one position. Added column AA and re-seated Deep / Standard / Move-In-Out
   (incl. the Monthly/Bi-Weekly/Weekly discount rows) across 26 bands.
3. **Fixed a corrupted cell.** Standard Clean at the up-to-750 band read **`2`**
   — should be **$176** (BK variable 113). It was silently poisoning the
   Standard-margin row.
4. **Add-ons corrected to BK's live values** per the ruling below: Blinds
   $10/blind → **$20 flat**, Inside Fridge $75 → **$42.50**, Inside Dishwasher
   $50 → **$35**.
5. Post-Construction left on its own **25** bands (its cut-points genuinely
   differ: 4,401–4,700 / 4,701–5,200). Verified 1:1 against BK — no shift.

Verified: Standard + Post-Construction rows match BK exactly; 78 header/price
pairs numeric and positive (no `#VALUE!`/`#DIV/0!`); no `#REF!`; all 19 merged
ranges intact.

### ⚠️ Surfaced by the fix — needs a business decision

With `B11` corrected, the true low-end margins are visible for the first time:

| Band | Weekly price | Margin |
|---|---|---|
| up to 750 | $123 | **−10.0%** |
| 751–1,000 | $147 | 0.6% |
| 1,001–1,250 | $172 | 8.5% |
| … | | below 38% target until ~4,400 sqft |

The $150 weekly minimum does **not** rescue it — $150 at 750 sqft is still only
10.7%. Weekly recurring is unprofitable at the small end. Not changed here
(pricing decision, not a data-entry fix).

## Still open

- **Add-on prices — RESOLVED 2026-08-20 (Todd): BookingKoala's live values stand.**
  Inside Fridge $42.50 · Inside Dishwasher $35 · Blinds $20. ✅ Applied 2026-08-21.
- Deep Clean and Move In/Out now **include inside oven + fridge** per the sheet's minimums
  section — currently unpublished, and a genuine selling point.
- Weekly at 750 sqft shows **−10% margin** in the sheet. The $150 weekly floor should prevent
  this; worth confirming the floor is actually enforced in BK.
