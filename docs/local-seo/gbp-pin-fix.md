# GBP is pinned in the wrong city — the fix

**Found:** 2026-08-21
**Status:** needs a manual edit in Google Business Profile. No tool can do this.
**Impact:** zero map-pack visibility across the entire real service area.

---

## The problem in one line

The Google Business Profile is pinned at **34.1275694, -87.2360109** — near
**Cullman, Alabama**, roughly 60 miles from Muscle Shoals and 50 from
Huntsville. It is outside every market TVCT actually serves.

## Evidence

**Local Falcon** (7×7 grid, 10-mile radius, scans 2026-08-10 and 2026-08-17,
keywords "house cleaning services near me", "janitorial services",
"window cleaning", across google/gaio/grok/aimode):

| Metric | Value | Meaning |
|---|---|---|
| ARP | 21.00 | "not found" — the max value for a 7×7 grid |
| SoLV | 0.00 | zero share of local voice |
| found_in | 0 of 49 | absent from every grid point |

Every scan, every keyword, every platform. No history of visibility — this is
not a regression.

The competitors the scan surfaced confirm the geography error: Cleaning and
More **Cullman** (77.55% SoLV), Campbell's Cleaning Your Way (**Bremen**),
Tip Top Housekeeping (**Cullman**), SERVPRO of **Cullman**/Blount — plus pest
control, plumbers, and masonry companies, because there are not enough
cleaners near that pin to fill a grid.

Meanwhile the *actual* competitors sit at 0.00 SoLV, outside the grid:
MaidPro The Shoals (Muscle Shoals), The Housekeepers (Madison), Lily Cleaning
(Harvest).

**Google Search Console** (90 days, 2026-05-21 → 2026-08-19) shows the
downstream effect:

| Bucket | Impressions | Clicks | CTR |
|---|---|---|---|
| Local queries | 46,238 | 31 | **0.07%** |
| Generic / national | 97,662 | 121 | 0.12% |
| Brand | 412 | 89 | **21.6%** |

Local CTR is *worse* than national. Individual local queries are stark:

| Query | Impressions | Clicks | Position |
|---|---|---|---|
| house cleaning services brentwood tn | 667 | **0** | **6.4** |
| home cleaning brentwood | 628 | **0** | 7.4 |
| maid service brentwood tn | 381 | **0** | 6.0 |
| dental office cleaning huntsville | 286 | **0** | 7.1 |

Position 6 with 667 impressions and zero clicks is not a ranking problem. The
map pack sits above organic results; on mobile it fills the screen. Absent
from the pack, the organic listing is below the fold. The 21.6% brand CTR
proves the listing converts fine when no map pack competes.

---

## What to change (business.google.com — owner access required)

### 1. Fix the location

TVCT has no storefront, so it should be a **service-area business**: the
address is hidden and the pin marks the operating base. The current profile
already has `address: false`, so it is likely *already* configured as one —
with the wrong coordinates.

Set the base to the real operating location. **Todd must supply the actual
business address** — do not guess. Based on the site's own schema data, the
Shoals area is the AL base:

- Muscle Shoals: 34.7448, -87.6675
- Tuscumbia: 34.7312, -87.7025

### 2. Set service areas

Google caps service-area businesses at roughly **20 areas** and discourages
implausibly large coverage. Prioritise by real demand rather than listing
everything. Ranked by GSC impressions and site data:

**Alabama** — Muscle Shoals, Florence, Tuscumbia, Sheffield, Killen,
Huntsville, Madison, Athens, Decatur

**Tennessee** — see the warning below before adding.

### 3. Categories

Current: House cleaning service, Janitorial service, Window cleaning service,
Carpet cleaning service, Upholstery cleaning service, Service establishment.

Primary should be **House cleaning service** — it matches the highest-value
queries. Note that a previously verified finding still applies: "Commercial
cleaning service" is not selectable for this profile; use Janitorial service
for commercial. See [[gbp-categories-verified]].

---

## ⚠️ Read before editing

**Editing the address or pin usually triggers re-verification.** The profile
can go temporarily unlisted while Google re-verifies (postcard, phone, or
video). Current visibility is already zero, so there is little to lose — but
do not do this in a week where the phone needs to ring.

**Nashville is a genuine problem.** Muscle Shoals to Nashville is ~120 miles.
One service-area profile covering both violates Google's guidance that service
areas reflect where you actually and regularly serve. Options:

1. Keep the AL profile honest (Shoals + Huntsville metro) and accept that
   Nashville organic rankings will not gain map-pack support.
2. Create a **separate Nashville GBP** — legitimate only if there is a real
   staffed presence there. A fake address risks suspension of *both* profiles.

Nashville is the largest source of local impressions, so this decision
matters. It is a business question, not a technical one.

**Do not** create a second profile at an address TVCT does not operate from.
Google suspends for this, and recovering a suspended profile is far harder
than fixing a pin.

---

## After the edit

1. Wait for re-verification to complete.
2. Re-run the Local Falcon scan on the same keywords and grid so the numbers
   are comparable to the 2026-08-10 / 2026-08-17 baseline.
3. Expect movement in **days to weeks**, not months — map-pack position
   responds far faster than organic.
4. Watch `phone_click` in PostHog (dashboard: "Phone-first pivot") and GHL
   call volume for the downstream effect.

**Then** GHL's reputation tooling becomes worth wiring up. Review velocity and
recency are map-pack ranking factors, but only once the profile actually
appears. Reviews are not the current constraint — 4.9 stars across 152 reviews
already beats MaidPro (4.8), The Housekeepers (4.8), Two Maids (4.5), and
Maid Brigade (4.8).

## Why no tool could do this

- **Local Falcon** is rank-tracking. Every write in its API affects its own
  account (saved locations, campaigns, Falcon Guard) — none touch Google.
  `gbp_linked: true` grants read access, not write.
- **GoHighLevel** has no GBP location tools. `locations_get-location` refers
  to a GHL sub-account and is read-only.
- Google restricts business-location writes to verified owners through
  business.google.com. That gate is what stops anyone relocating a
  competitor's listing.
