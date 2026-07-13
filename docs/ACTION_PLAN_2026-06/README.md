# 7 Forces Reconciled Action Plan — Working Docs (June 2026)

These are the **AI-prepared, in-repo deliverables** for the reconciled action plan
that followed Todd's "Tony Robbins 7 Forces" assessment. They arm the dashboard work
that only Todd can do (Stripe, GHL, BookingKoala). Primary lever: **reduce founder
dependency.**

## Read first — the data changed the diagnosis
**[00_VERIFIED_DATA_FINDINGS.md](00_VERIFIED_DATA_FINDINGS.md)** + **[TVCT_BookingKoala_Verified_Metrics.xlsx](TVCT_BookingKoala_Verified_Metrics.xlsx)** —
verified against 3 years of BookingKoala data (2,095 jobs). The assessment's financial
claims are mostly wrong: AOV is ~$249 (not $312), ~58% of customers are one-and-done
(not "85% repeat"), and **residential revenue PEAKED in 2023–24 and is declining ~34%
in 2025** — the "revenue doubled" story is backwards. Quality is NOT the cause (~3.5%
of cancels). This is a demand + retention problem. Commercial base is separate and intact.

## The growth lever (data-verified)
- **[04_FUNNEL_DIAGNOSIS_SEARCH_GMB.md](04_FUNNEL_DIAGNOSIS_SEARCH_GMB.md)** — demand is healthy & growing (~43K impr/mo); the bottleneck is page-2 ranking (avg pos ~17, 0 days on page 1). Page-1 ≈ 5.6× clicks into a $365-AOV funnel.
- **[05_SEO_RANKED_FIX_LIST.md](05_SEO_RANKED_FIX_LIST.md)** — the "fix these first" list from query-level GSC data. Two structural fixes (blog cost-guides cannibalizing money pages; "near me" terms stuck just below the local pack) + a ranked striking-distance page list. **Sheffield is the single highest-ROI fix** (already pos 7.8; just needs its title to match "cleaners sheffield"). Money-page changes shipped Jun 4–5, so this data is the **pre-change baseline** — re-pull GSC ~July 1 to measure lift.
- **[07_GSC_JULY_REPULL_RESULTS.md](07_GSC_JULY_REPULL_RESULTS.md)** — that re-pull, done 2026-07-13 with live GSC API access (now wired into this environment via a service account). Mixed result: `/locations/nashville` genuinely jumped (pos 29.3→17.1), but Birmingham and Huntsville medical-office-cleaning fell off a cliff (pos 17.4→36.6 and 11.1→33.7), and the flagged Sheffield "10-minute fix" didn't pay off on its target query. Not a clean win — see the doc for the page-by-page breakdown and why Birmingham's drop reinforces (rather than contradicts) the build-out priority.

## Start here (execution)
1. **[01_ROGERSVILLE_BILLING_FIX.md](01_ROGERSVILLE_BILLING_FIX.md)** — _Today._ A live
   $2,500/mo contract (Rogersville COC) has a broken Stripe subscription that won't
   collect until repaired. Facts + steps. **Not** a churn — a config fix.
2. **[02_REVIEW_SEQUENCE_DEPLOY_CARD.md](02_REVIEW_SEQUENCE_DEPLOY_CARD.md)** — _This week._
   Wire the already-written 4-email post-purchase/review sequence into GHL. Includes
   two verified silent-failure traps (the `booked` vs `cleaning-booked` tag, and the
   BookingKoala postMessage that the `booked` tag depends on).
3. **[03_LEAD_OPS_SOP_DRAFT.md](03_LEAD_OPS_SOP_DRAFT.md)** — _This quarter (prep now)._
   The SOP for the one hire that actually removes Todd as the bottleneck, drafted
   from the live system. Todd fills the bracketed decisions, then it's an onboarding doc.

## What's NOT here (because it lives elsewhere / needs Todd or external tools)
- The full strategic plan with diagnosis, sequencing, and the founder-dependency
  teardown: `~/.claude/plans/…-luminous-hummingbird.md` (approved 2026-06-07).
- Commercial outreach batch (Step 4): Apollo list prep + send — do when ready.
- Lead-magnet verify (Step 5), measurement wiring (Step 6): Todd checks dashboards.

## Don't rebuild what's already live
`GHL_COPY_PASTE_ASSETS.md` and `PROJECT_CONTEXT.md` are the source of truth for the
automation already shipped (abandoned-booking recovery, quote SMS, webhook routing).
The plan's whole point: **activate and delegate what exists; don't re-build it.**
