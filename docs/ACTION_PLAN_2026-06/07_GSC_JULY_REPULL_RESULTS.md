# GSC July Re-Pull — Did the Jun 4–5 Changes Move Rankings?

_Generated 2026-07-13, live-pulled via `scripts/gsc-report.js` and a targeted
page-level comparison script using the newly-connected `GSC_CLIENT_EMAIL` /
`GSC_PRIVATE_KEY` service account (read-only, verified against both
`sc-domain:thevalleycleanteam.com` and `https://thevalleycleanteam.com/`)._

**Why this doc exists:** `05_SEO_RANKED_FIX_LIST.md` explicitly called for
re-pulling GSC "~July 1" to measure whether the Jun 4–5 on-page work (answer-first
intros, problem+options blocks, FAQ/Service schema, title tightening) moved the
striking-distance pages. That re-pull hadn't happened as of this session
(2026-07-13, 5+ weeks post-change — past Google's stated 2–8 week re-ranking
window, so this data should reflect settled impact, not just noise). This is
that re-pull.

## Method & caveats
- **Baseline:** Mar 6 – Jun 5, 2026 (92-day window, pre-change), from
  `05_SEO_RANKED_FIX_LIST.md`.
- **Fresh pull:** Jun 13 – Jul 10, 2026 (30-day window, GSC's usual 3-day lag),
  pulled live this session.
- **Window lengths differ** (92 days vs. 30 days). Position (a per-query
  average) is reasonably comparable across window lengths; raw impression
  *counts* are not — a page showing fewer fresh impressions than baseline does
  not by itself mean less demand, since the fresh window is ~1/3 the length.
  Only position deltas are treated as signal below.
- Same page set as the original ranked fix-list, queried directly via
  `dimensionFilterGroups` (page-equals filter) rather than relying on "top N by
  clicks," so low-click/high-impression striking-distance pages are included.

## Overall site performance (fresh 30-day window)
| Clicks | Impressions | CTR | Avg. position |
|---|---|---|---|
| 339 | 73,887 | 0.46% | 19.8 |

Demand continues to grow (impressions annualize to well above the ~43K/mo the
June docs cited), but the CTR/position story is unchanged: most of that demand
lands on page 2+, where CTR craters.

## Page-by-page: baseline vs. fresh

| Page | Baseline pos | Fresh pos | Δ | Read |
|---|---|---|---|---|
| `/locations/nashville` | 29.3 | **17.1** | **+12.2** | ✅ Real win — page 3 to top of page 2 |
| `/services/airbnb-cleaning` | 24.6 | 21.2 | +3.4 | Modest improvement |
| `/locations/nashville/brentwood` | 14.8 | 14.4 | +0.4 | Flat |
| `/locations/florence` | 16.1 | 15.8 | +0.3 | Flat |
| `/locations/decatur` | 19.6 | 19.5 | +0.1 | Flat |
| `/locations/muscle-shoals/sheffield` | 7.8 | 8.6 | -0.8 | Slight slip, still striking distance |
| `/locations/nashville/move-out-cleaning` | 16.9 | 19.5 | -2.6 | Slipped |
| `/locations/huntsville` | 25.5 | 27.9 | -2.4 | Slipped |
| `/` (homepage) | 17.9 | 21.6 | -3.7 | Slipped |
| `/locations/athens` | 14.6 | 18.6 | -4.0 | Slipped |
| `/locations/huntsville/post-construction-cleaning` | 11.0 | 16.2 | -5.2 | Slipped out of page-1 striking distance |
| `/locations/madison` | 15.0 | 23.3 | -8.3 | Slipped |
| `/services/commercial-cleaning` | 29.3 | 40.6 | -11.3 | Slipped further |
| `/locations/birmingham` | 17.4 | **36.6** | **-19.2** | ❌ Fell off a cliff — page 2 to page 4 |
| `/locations/huntsville/medical-office-cleaning` | 11.1 | **33.7** | **-22.6** | ❌ Fell off a cliff — near page-1 edge to page 4 |

## Findings

### ✅ One confirmed win: Nashville hub
`/locations/nashville` moved from pos 29.3 to 17.1 — exactly the outcome the
Jun 4–5 "homepage + hub H1 alignment + cannibalization fix" (commit `c209154`)
was meant to produce. This is the strongest evidence in this pull that the
on-page work is capable of moving rankings; it's not a uniform effect sitewide.

### ❌ Two pages fell off a cliff — not a code regression
Checked both against git history: neither page's title/H1 has been reverted or
touched since their last legitimate edit. `/locations/birmingham` still reads
`"House Cleaning Birmingham AL | The Valley Clean Team"`;
`/locations/huntsville/medical-office-cleaning` is untouched since an unrelated
booking-form commit. So these are real ranking losses, not a broken deploy.

- **Birmingham (17.4 → 36.6)** lines up with an independent finding from the
  same-day SEO/competitive audit (see the audit artifact from this session):
  Birmingham is the most under-built market on the site — only the hub page
  exists, with no deep-cleaning, move-out, commercial, or green-cleaning pages,
  and no neighborhood pages (Vestavia Hills, Homewood, Cahaba Heights). A hub
  page with no supporting topical cluster around it is exactly what loses
  ground first in any ranking shakeup. Two independent signals (the content-gap
  audit and this ranking drop) now point at the same fix.
- **Huntsville medical-office-cleaning (11.1 → 33.7)** has no obvious
  structural explanation yet — worth a URL Inspection check (indexing status,
  any manual action) and a look at whether internal links into this page
  changed recently.
- **`/services/commercial-cleaning` (29.3 → 40.6)** also slipped hard. The same
  audit found title-tag duplication between location-level commercial-cleaning
  pages/blog posts and their money pages (Athens, Florence) — this services hub
  competing against a growing set of location-specific commercial pages for the
  same authority is a plausible contributor, though not confirmed.

### ⚠️ The flagged "10-minute quick win" didn't pay off
`05_SEO_RANKED_FIX_LIST.md` called Sheffield the single highest-ROI fix in the
whole list — already pos 7.8, just needed its title to match the query
**"cleaners sheffield"** (then at pos 6.8). The title fix shipped
(`94219ef`) and is still live: `"Sheffield AL House Cleaners | The Valley Clean
Team"`. But the query itself fell to **pos 19.7** (31 impressions, 0 clicks) in
the fresh pull. Two possible reads: (a) the live title is close to but not an
exact phrase match — it reads "Sheffield... Cleaners," not "cleaners
sheffield" — word order may matter more than expected here; or (b) unrelated
competitor/algorithm movement on this specific query. Worth a title tweak to
exact-match the phrase and re-checking in a few weeks before concluding either
way.

### Confirmed unchanged: "near me" terms are still a GMB problem, not a code problem
`cleaning company near me` (321 impr, pos 11.7, 1 click), `cleaning near me`
(105 impr, pos 10.8, 1 click), `cleaning services near me` (500 impr, pos 10.0,
1 click) — the same "just below the local pack, ~0 clicks" pattern as the June
baseline. This reconfirms `06_GBP_NEAR_ME_ACTION_PLAN.md`'s diagnosis: this is
a Google Business Profile lever, not something another on-page push will fix.

## Recommended next steps
1. **Don't read this as "the June push failed."** Nashville's jump is real
   evidence the method works; it just didn't land uniformly.
2. **Prioritize Birmingham's build-out** (already recommended in the same-day
   SEO audit) — now backed by a second, independent signal from live ranking
   data, not just a content-gap inference.
3. **URL-inspect `/locations/huntsville/medical-office-cleaning`** to rule out
   an indexing or manual-action issue before assuming it's a ranking-algorithm
   effect.
4. **Re-word the Sheffield title** to exact-match "cleaners sheffield" (e.g.
   lead with the phrase itself) and re-check in 2–4 weeks — the current title
   is close but not literal.
5. **Re-pull again in ~4 weeks** (mid-August) with the same script/page set now
   that GSC access is live in this environment — this comparison no longer
   requires a manual CSV export, so it can become a routine check rather than
   a one-off.
