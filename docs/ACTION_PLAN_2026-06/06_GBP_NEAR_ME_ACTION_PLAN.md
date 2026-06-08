# GBP "Near Me" Action Plan — capturing the local-pack opportunity

_Generated 2026-06-07 from Google Search Console query data + a repo audit of
existing local-SEO signals. **This is a Google Business Profile (GBP) workstream —
almost none of it is website code.** "Near me" results are won in the map 3-pack,
which Google builds from your GBP, not your site's HTML._

## The opportunity (verified from GSC)

**86 "near me" queries · 9,896 impressions · 25 clicks · 0.25% CTR.**

That CTR is *terrible* — worse than your site-wide ~0.62% — and the reason is
structural: "near me" searches are answered by the **local map pack** (the 3
businesses on the map), not the blue links below it. You appear in the organic
results under the pack, so you rack up impressions but almost no clicks. **You are
present-but-not-in-the-pack.** Fixing that is a GBP job.

### Where you stand, by cluster (your targeting priorities)

| Cluster | Queries | Impressions | Avg position | Read |
|---|---|---|---|---|
| **Move-out near-me** | 6 | 933 | **9.9** | **Closest to the pack — start here.** "move out cleaning services near me" pos 8.1 |
| Generic "cleaning near me" | 20 | 3,225 | 15.3 | Highest volume; hovering below page 1 |
| House/home/residential near-me | 18 | 2,960 | 17.8 | Big volume, page-2 |
| Commercial/office near-me | 8 | 1,112 | 27.6 | Far down — needs category + dedicated work |
| Deep cleaning near-me | 7 | 312 | 33.1 | Far down |

28 of the 86 are already on page 1 organically (pos ≤10) yet get ~0 clicks —
proof the pack is eating the clicks. The win is getting INTO the pack for these.

## What you already have (don't rebuild — extend)

- `docs/citation-audit-checklist.md` — your canonical NAP + a tiered directory list. **Use this NAP everywhere.**
- `docs/gbp-post-content-4weeks.md` — 4 weeks of GBP posts already written.
- LocalBusiness schema with `areaServed`, `priceRange "$$"`, correct phone (+1-256-826-1100).
- Embedded Google Maps on 8 location hubs.
- The just-merged NAP phone fix (PR #60) — your site NAP is now internally consistent.

---

## THE PLAN — ranked by impact on "near me" ranking

The 3 levers Google weights most for the local pack are **Relevance, Distance, Prominence.**
You can't change a searcher's distance, so the work is Relevance (categories/services)
and Prominence (reviews/citations/activity).

### TIER 1 — GBP profile completeness (do this week, highest leverage)

**1. Categories — the single biggest "near me" relevance lever. [GBP dashboard]**
Your commercial/office and deep-cleaning near-me clusters rank pos 27–33 largely
because the right *categories* likely aren't set. In GBP → Edit profile → Categories:
- **Primary:** `House Cleaning Service`
- **Additional (add all that apply):** `Commercial Cleaning Service`, `Cleaners`,
  `Maid Service`, `Janitorial Service`, `Deep Cleaning Service` (if offered),
  `Move-in/out` is covered under House Cleaning.
- Why: Google only shows you in the pack for "office cleaning near me" if
  `Commercial Cleaning Service` is an active category. Missing categories = invisible
  in that pack regardless of relevance.

**2. Services list — name each near-me service explicitly. [GBP dashboard]**
GBP → Edit services. Add a service entry for every cluster, using the searcher's
words (from your query data): "Move-Out Cleaning", "House Cleaning", "Deep Cleaning",
"Office/Commercial Cleaning", "Apartment Cleaning", "Maid Service", "Airbnb Turnover".
Add a 1-2 sentence description to each. This directly feeds "[service] near me" relevance.

**3. Service-area setup (you're a Service-Area Business). [GBP dashboard]**
- **Hide the address**, show **service areas** (you clean at the customer's home).
- List the service-area cities from `citation-audit-checklist.md`: Huntsville, Madison,
  Athens, Decatur, Florence, Muscle Shoals, Tuscumbia, Sheffield, Mountain Brook,
  Birmingham + the TN cities on the second profile.
- Note: GBP service-area radius does NOT extend pack ranking far beyond your pin's
  city — distance still dominates. Which is why #6 (multiple profiles) matters.

### TIER 2 — Prominence (ongoing, compounding)

**4. Review velocity — the strongest Prominence signal. [Process, not code]**
You have 146 reviews — great — but pack ranking rewards *recent, steady* review flow
and keyword-rich review text. **This is where the post-purchase sequence
(`02_REVIEW_SEQUENCE_DEPLOY_CARD.md`) directly feeds local SEO:** email 3 asks happy
customers for a Google review. Deploy it. Bonus: when you reply to reviews, naturally
use service + city words ("Thanks for letting us handle your *move-out cleaning in
Madison*") — review + reply text is a relevance signal for those exact near-me terms.

**5. GBP Posts — weekly activity signal. [GBP dashboard — content ready]**
Post 1-2×/week using `docs/gbp-post-content-4weeks.md` (already written). Active
profiles rank better in the pack. Rotate service spotlights so each near-me service
(move-out, deep, commercial) gets a post tied to its keyword.

**6. Citations / NAP consistency — Prominence + trust. [Use existing checklist]**
Work `docs/citation-audit-checklist.md` top-down (Tier 1 data aggregators first —
they feed hundreds of sites). Every wrong phone number out there dilutes pack trust;
you just fixed the site, now fix the directories. Bing Places + Apple Business Connect
are quick wins (Tier 2).

### TIER 3 — Structural (bigger plays)

**7. ONE GBP profile — do NOT create additional listings. [Decided 2026-06-08]**
Decision confirmed with Todd: TVCT keeps a **single Google Business Profile** (the
existing Alabama one). Reasoning:
- TVCT's model is **dispersed home-based cleaners who drive to each market** (staff
  live in TN/AL and drive up to Nashville, Huntsville, Madison, Athens, Birmingham).
  There is **no staffed operational base** in Nashville or Birmingham.
- Google's policy: a service-area business gets ONE profile per **genuine, staffed
  location.** A listing at a market you only *drive into* (no real base, no storefront,
  PO box / virtual office / a cleaner's home address) is the **#1 cause of GBP
  suspension** — and a suspension can take down the existing good profile too. Not
  worth the risk.
- Distance reality: the map pack is gated by distance from your pin to the searcher.
  Your AL pin **can** pack-rank for near-me searches in Huntsville/Madison/Decatur/
  Athens/Florence-Shoals (all close, and your top markets by revenue). It **cannot**
  pack-rank for Nashville/Birmingham from a distance — and no second listing should be
  created to force it.
- **Compete in Nashville/Birmingham via ORGANIC/website SEO instead** (location pages,
  the hire-intent H1 fixes already shipped). Organic ranking has no distance limit —
  you don't need the map pack to rank organically there.

**8. Build the Birmingham money page (organic play — NOT a GBP play).** "office cleaning
near me" / "cleaning services birmingham" demand exists; right now `/locations/birmingham`
308-redirects to Mountain Brook. A real hub can win **organic** Birmingham rankings (no
local base needed for that). Do NOT pair it with a Birmingham GBP — same suspension risk
as #7. This is purely a website/content move.

---

## What I (the website) already verified
- ✅ Site NAP phone now consistent (PR #60).
- ✅ LocalBusiness schema present with areaServed + priceRange.
- ✅ Maps embedded on 8 hubs. **Gap:** confirm Decatur & Madison hubs have an embedded
  map (they're newer hand-built hubs) — a map embed is a minor local relevance signal
  and a UX win. (Quick code fix if missing — say the word.)

## How to measure
Re-pull GSC ~July 1 and watch the "near me" cluster: the goal is the page-1-but-0-click
queries (cleaning services near me pos 9.1, move out near me pos 8.1, etc.) starting to
earn clicks — that means you've entered the pack. Also watch GBP Insights → "Searches"
and "Calls" for lift.

## The one thing to do first
**Set your GBP categories** (Tier 1, #1). Without `Commercial Cleaning Service` and the
other categories active, you literally cannot appear in those near-me packs no matter
what else you do. It's a 10-minute dashboard change with the highest ceiling.
