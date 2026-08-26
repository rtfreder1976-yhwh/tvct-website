# GSC Baseline — Exact Price title/meta experiment

_Pulled by Todd 2026-08-24 (Performance → Pages, last 28 days). This is the BEFORE snapshot for the 18-page title/meta rewrite on branch `feat/exact-price-titles-metas`. Re-pull the same report ~2026-09-21 and compare CTR per page._

## The 18 rewritten pages — before

| Page | Clicks | Impr | CTR |
| --- | ---: | ---: | ---: |
| /blog/house-cleaning-cost-nashville-tn | 43 | 6,154 | 0.70% |
| /blog/house-cleaning-cost-alabama | 31 | 9,921 | 0.31% |
| /blog/house-cleaning-cost-huntsville-al | 30 | 3,722 | 0.81% |
| /blog/house-cleaning-cost-florence-al | 3 | 1,135 | 0.26% |
| /blog/house-cleaning-cost-athens-al | 2 | 584 | 0.34% |
| /blog/deep-cleaning-cost-shoals-guide | 1 | 459 | 0.22% |
| /blog/is-hiring-house-cleaner-worth-it | 1 | 367 | 0.27% |
| /services/deep-cleaning | 2 | 528 | 0.38% |
| /services/regular-cleaning | 0 | 1,625 | 0% |
| /services/airbnb-cleaning | 0 | 912 | 0% |
| /services/move-in-out-cleaning | 0 | 408 | 0% |
| /blog/move-out-cleaning-huntsville-guide | 0 | 307 | 0% |
| /blog/move-out-cleaning-costs-in-nashville-2026-updated-guide | 0 | 124 | 0% |
| /best-cleaning-company-nashville-tn | 0 | 260 | 0% |
| /best-cleaning-company-florence-al | 0 | 86 | 0% |
| /best-cleaning-company-huntsville-al | 0 | 78 | 0% |
| /best-cleaning-company-athens-al | 0 | 50 | 0% |
| /best-cleaning-company-mountain-brook-al | 0 | 20 | 0% |
| /pricing | 0 | 33 | 0% |
| /blog/house-cleaning-cost-madison-al | — | — | not in top pages this period |
| /blog/house-cleaning-cost-decatur-al | — | — | not in top pages this period |
| **Rewrite set total** | **113** | **26,773** | **0.42%** |

Site-wide top-pages total in this export ≈ 320 clicks / ~103K impressions (~0.31%).

## What the baseline says

1. **The four big cost guides carry the experiment.** nashville-tn + alabama + huntsville-al + florence-al = 107 clicks / 20.9K impressions. If the price-in-title thesis works, it shows up here first.
2. **High-impression zero-click pages NOT in the rewrite set** (wave 2 candidates):
   - /locations/nashville — 27 / 9,803 (0.28%) and /locations/huntsville — 6 / 4,252 (0.14%)
   - /dental-office-cleaning — 0 / 3,089 · /church-cleaning — 1 / 2,634 · /medical-clinic-cleaning — 0 / 1,124 (commercial: "written quote in 2 business hours" pattern)
   - /locations/nashville/move-out-cleaning — 3 / 3,408 · /locations/nashville/brentwood — 3 / 3,389 · /locations/decatur — 0 / 1,448
3. **/pricing barely surfaces in search** (33 impressions) — its rewrite matters for the people who click through from cost guides, not for SERP CTR. Don't judge the experiment on it.
4. **Cannibalization confirmed in the wild:**
   - `/blog/huntsville-al-house-cleaning-cost-2026` (0/1) duplicates `/blog/house-cleaning-cost-huntsville-al`
   - `/blog/move-out-cleaning-huntsville-al` (1/514) duplicates `/blog/move-out-cleaning-huntsville-guide` (0/307)
   - plus the six `reliable-cleaning-company-*` posts from the keyword plan
5. **The $109-snippet page** `/locations/nashville/biweekly-cleaning` sits at 1/1,319 — reindex after the source fix merges.
6. **Birmingham demand is real:** /locations/birmingham 6/1,656 with no cost page.

## Measurement protocol
- ~2026-09-21: Todd pulls the same 28-day Pages report. Compare per-page CTR for the rewrite set; success = the four big cost guides move meaningfully above their 0.26–0.81% baselines.
- Don't change these 18 pages' titles/metas again before the re-measure. The `reliable-*` 301 decision, if taken, should be noted here with its date.
