# SEO Ranked Fix-List — "Fix These First" (from query-level GSC data)

_Generated 2026-06-07 from Google Search Console Pages + Queries exports
(window Mar 6 – Jun 5, 2026; 346 pages, 1,000 queries)._

## ⏱️ Read the timing first
The big money-page SEO/CRO/AEO work (Waves 1–3: answer-first intros, problem+options
blocks on 114 location pages, FAQ/Service schema on combo pages, best-of pages, title
tightening) shipped **June 4–5** — the **last 1–2 days** of this data window. So these
positions are essentially the **pre-change baseline.** Google takes ~2–8 weeks to
re-rank after on-page changes. **Re-pull this same export ~July 1 to measure lift.**
This list = where to focus *next*, and the baseline to measure against.

---

## 🔴 STRUCTURAL FIX #1 — Cannibalization: blog cost-guides are eating your money pages

Your single biggest organic asset is a **blog post**: `/blog/house-cleaning-cost-alabama`
pulls **33,358 impressions** (pos 17) — more than any money page. The cost-guides rank
for commercial intent while the conversion-optimized **location pages rank worse**:

| Intent | Blog page (ranks better) | Money page (ranks worse) |
|---|---|---|
| Huntsville cleaning | `/blog/house-cleaning-cost-huntsville-al` — pos **9.8**, 5,134 impr | `/locations/huntsville` — pos **25.5** |
| Nashville cleaning | `/blog/house-cleaning-cost-nashville-tn` — pos **9.9**, 18,609 impr | `/locations/nashville` — pos **29.3** |
| Alabama cleaning | `/blog/house-cleaning-cost-alabama` — pos **17**, 33,358 impr | (no single page owns this) |

**Why it matters:** the blog ranks but converts worse than a money page (it's an article,
not a quote funnel). You want the *location/service pages* — which now have the
problem+options blocks, sticky quote bars, and schema — to own these terms.

**The fix (pick ONE direction per cluster, don't do both):**
- **Option A (lower risk, recommended):** keep the blog post but make it aggressively
  link/redirect intent down to the money page — strong above-the-fold CTA + canonical
  signal that the location page is the destination for "hire" intent. The blog keeps the
  "research/cost" ranking and feeds the money page.
- **Option B (higher risk, higher reward):** consolidate — point the blog's commercial
  keyword at the location page (internal links + matching the location page's title/H1 to
  the cost query) so Google re-attributes the ranking. Only if you're confident the
  location page can hold the position.
- This is exactly the cannibalization pattern `PROJECT_CONTEXT.md` says was fixed for 8
  posts — **the data shows the biggest ones (the cost-guides) still remain.**

---

## 🟠 STRUCTURAL FIX #2 — "Near me" terms at pos 8–14 with ~0 clicks (just below the local pack)

You rank bottom-of-page-1 / top-of-page-2 for high-intent "near me" terms and harvest
almost nothing — classic "just below the 3-pack" pattern. These are **GMB/local-SEO**
wins (proximity, reviews, categories, citations), not on-page content:

| Query | Pos | Impr | Clicks |
|---|---|---|---|
| cleaning services near me | 9.1 | 928 | 2 |
| home cleaning near me | 9.1 | 447 | 0 |
| office cleaning service near me | 10.4 | 398 | 0 |
| move out cleaning services near me | 8.1 | 388 | 0 |
| residential cleaning service near me | 11.6 | 381 | 0 |
| commercial cleaning services near me | 10.3 | 307 | 0 |

**The fix:** this is the **Google Business Profile** lever, not the website — categories,
service-area accuracy, review velocity, posts, and Q&A. Cross-ref the Rogersville/America1
commercial work: "office/commercial cleaning near me" at pos 10 + 0 clicks is commercial
demand you're invisible-but-present for.

---

## 🔴🔴 ROOT-CAUSE FOUND — wrong/unverified phone numbers on location hubs (NAP inconsistency)

_Found while investigating why the fully-built Decatur hub sits at pos 19.6._

The Decatur hub (`locations/decatur/index.astro`) is NOT thin — it's ~1,800 words of
rich local content, 8 FAQs + FAQPage schema, LocalBusiness schema, 16 internal links.
So thin content isn't the problem. **The problem is a data-quality bug:** location pages
carry **four different phone numbers**, two of which are wrong/unverified:

| Number on pages | Count | Status |
|---|---|---|
| (256) 826-1100 | 58 | ✅ correct AL (CLAUDE.md) |
| (615) 510-1427 | 42 | ✅ correct TN (CLAUDE.md) |
| **(615) 961-0028** | 32 | ⚠️ **UNVERIFIED** — not in any doc. Real 2nd TN line, or error? **Todd must confirm.** |
| **(256) 856-1006** | 32 | ⚠️ **WRONG** — appears nowhere legitimate (not in CLAUDE.md, PROJECT_CONTEXT, config) |
| (256) 555-0123 | 1 | ⚠️ fake placeholder (555) |

**Why this matters (a lot):** NAP (Name-Address-Phone) consistency is a **direct local-SEO
ranking factor** — Google cross-checks the phone on your pages against your Google Business
Profile + citations. A wrong number suppresses that page's local ranking AND misroutes real
calls (lost revenue). This is a very plausible reason these specific hubs lag on page 2.

**The 15 files carrying the wrong `(256) 856-1006`** include three striking-distance money
hubs — **Athens, Madison, and Decatur** — plus their service sub-pages:
`locations/athens/index.astro`, `locations/madison/index.astro` (+ madison airbnb,
commercial, deep, event, green, move-out, post-construction, recurring),
`locations/decatur/index.astro` (+ decatur airbnb, move-out, post-construction, recurring).

**Fix status:**
1. ✅ **DONE (2026-06-07):** Todd confirmed `(256) 856-1006` is a typo for `(256) 826-1100`.
   Replaced all forms (display, `tel:+1…`, bare digits) across **15 files**. Build verified
   green. 0 instances remain in `src/`. (Not yet committed/deployed.)
2. ✅ **CONFIRMED VALID:** `(615) 961-0028` is a **real second TN line** — leave as-is, do not flag.
3. ℹ️ `(256) 555-0123` is an **input-field placeholder** in `QuoteForm.astro` / `get-quote.astro`
   (reserved 555 example range) — correct as-is, left untouched.
4. ⬜ **STILL TODO:** add the **Jun-5 problem+options block** to the hand-built location *hubs*
   (Athens/Decatur/Madison `index.astro`) — they were MISSED by that batch (it targeted the
   dynamic combo pages + 114 standalone pages). Decatur hub has 0 problem-blocks.

**This is likely the single highest-value SEO fix found** — it's a root-cause data bug on
your highest-traffic page-2 hubs, with both ranking AND call-routing impact.

---

## 🟢 RANKED PAGE FIX-LIST — striking distance (pos 8–20), by impression opportunity

These money pages are **one good push from page 1.** Ordered by demand behind them.
"Clicks" near 0 at pos <20 = sitting just under the fold; small position gains = big CTR jumps.

| # | Page | Pos | Impr/mo* | Clicks | The play |
|---|---|---|---|---|---|
| 1 | `/locations/decatur` | 19.6 | 6,520 | 3 | ⚠️ **VERIFY FIRST:** no `decatur.astro` hub file in repo; site uses a dynamic `locations/[city]/[slug].astro` route + a `vercel.json` redirect points *to* `/locations/decatur`. Confirm this hub actually renders an optimized page (not a thin/redirected one) before tuning. Could be a "page barely exists" fix, not a title tweak. |
| 2 | `/locations/nashville/brentwood` | 14.8 | 4,868 | 14 | Brentwood is a money market (many "brentwood tn" queries). Push to page 1. |
| 3 | `/locations/nashville/move-out-cleaning` | 16.9 | 4,675 | 20 | Move-out = high AOV. Already getting clicks; small gain = big lift. |
| 4 | `/locations/madison` | 15.0 | 4,295 | 6 | Core market, page-2. |
| 5 | `/locations/athens` | 14.6 | 3,847 | 10 | Priority-1 market per CLAUDE.md; ranks page-2. |
| 6 | `/locations/florence` | 16.1 | 2,862 | 13 | Shoals hub. |
| 7 | `/locations/birmingham` | 17.4 | 2,550 | 8 | Mountain Brook/B'ham money market. |
| 8 | `/locations/muscle-shoals/sheffield` | 7.8 | 2,872 | 0 | **Already pos 7.8 — highest-ROI single page.** ⭐ **Concrete fix found:** page title is `"House Cleaning Sheffield, AL"` but your #1 query is **"cleaners sheffield"** (2,587 impr, pos 6.8, 0 clicks). Change title/H1 to match "cleaners sheffield" intent — 10-min, near-zero-risk push for a page already on page-1 edge. Page already has the Jun-5 CRO blocks. |
| 9 | `/locations/huntsville/post-construction-cleaning` | 11.0 | 983 | 8 | High-AOV service+geo. |
| 10 | `/locations/huntsville/medical-office-cleaning` | 11.1 | 787 | 0 | Commercial intent, pos 11, 0 clicks — ties to your commercial push. |

\* Impressions are the 92-day window total, used as relative opportunity ranking.

**Note the home page** (`/`) sits at pos 17.9 on 16,102 impressions / 204 clicks — it's
your 2nd-biggest impression source and on page 2. Worth its own title/H1/internal-link pass.

---

## 🔵 BIGGEST MONEY PAGES THAT ARE FAR DOWN (pos 24–47) — slower, bigger projects
Not "one push" — these need real work, but the demand is large:
- `/locations/nashville` — pos 29.3, 9,992 impr (your biggest city page, deep on page 3)
- `/locations/huntsville` — pos 25.5, 9,025 impr (home market, page 3)
- `/services/airbnb-cleaning` — pos 24.6, 5,456 impr
- `/services/post-construction-cleaning` — pos 35.1, 1,997 impr
- `/locations/florence/medical-office-cleaning` — pos 47.3, 1,623 impr (commercial)
- `/services/commercial-cleaning` — pos 29.3, 1,591 impr (commercial)

These are where the cannibalization fix (#1) matters most — the blog cost-guides are
likely absorbing the authority these pages should have.

---

## Recommended order of operations
1. **Re-pull GSC ~July 1** to see if the Jun 4–5 changes moved the striking-distance pages
   (free signal; tells you if the on-page work is working before doing more).
2. **Cannibalization fix (#1)** on the 3 cost-guide clusters (Alabama / Huntsville / Nashville) —
   biggest structural lever.
3. **GMB/local fix (#2)** for the "near me" pack — separate workstream, owned in GBP.
4. **Striking-distance pages** #1–10 above, Sheffield (#8) first (already pos 7.8).
5. Then the page-24–47 money pages as larger content projects.

## Caveats
- Positions are blended over 92 days and are **pre-Jun-4-change**; treat as baseline.
- Impression counts are window totals, used for relative ranking, not monthly rates.
- "Clicks=0 at pos ~10" is partly because the local 3-pack sits above organic for
  "near me" terms — which is why #2 is a GMB play, not a content play.
