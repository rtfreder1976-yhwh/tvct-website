# Keyword Plan — The Valley Clean Team

## Last Updated
2026-08-23 by /keyword-research (full research mode; no prior plan existed after the 2026-08-22 reset)

## Method and data sources
- Method: 6 Circles expansion from brand context → live SERP validation → cluster by intent → prioritize by CTR leverage, not by "new content volume." The measured problem is CTR (~43K impr/mo, pos 4-10, 0.07% local CTR vs 21.6% brand CTR), so Priority 1 is title/meta rewrites on pages that already have impressions.
- Brand context loaded: positioning.md (⭐ The Experts Who Happen to Be Likable; angle ② The Exact Price owns the SERP), audience.md (language bank, channel behavior), competitors.md (market map).
- Inventory: 19 cost/money blog pages, 5 best-cleaning-company pages, /pricing, 12 /services pages, ~150 location pages. Titles/descriptions captured from source frontmatter on 2026-08-23. `BaseLayout.astro` appends " | Valley Clean Team" to any title that lacks the brand string, so a 55-char title renders as ~75 chars and Google truncates the brand, not the price. Acceptable; the price sits at the front on purpose.
- VERIFIED (live SERP, 23 queries via WebSearch, 2026-08-23): who ranks, what their titles promise, which TVCT URL Google surfaces per query.
- ESTIMATED / NOT AVAILABLE: search volumes, per-page GSC impressions (no GSC access in this session; the ranking order in Priority 1 is inferred from "3 of the top 6 landing pages are cost guides; /pricing is 4th" plus SERP presence). Todd pulls GSC to confirm before/after (section 7).
- Constraints applied: no retired prices ($99/$119/$129/$135/$149/$175/$176/$225/$275/$400) in any suggestion; no oversell words (best only inside existing best-cleaning-company targeting); titles ≤60 chars; metas ≤155; AL pages (256) 826-1100, TN pages (615) 510-1427; no same-day/emergency, clinical, or luxury claims.

## 1. SERP shape observed today (what the searcher actually sees)
Every "[service] cost [city]" SERP in AL/TN is the same page: Care.com ("Cleaners Starting at $18.53/hr"), Homeyou ("Costs 07 / 2026"), Manta ("2026 Cost Calculator"), Thumbtack/Angi ("10 Best"), janitorialservicebids.com, plus one or two operators. Their titles promise an hourly teaser or a calculator. Nobody in the top 10 puts a real flat starting price in the title. TVCT is the only operator on these pages that can, which is the whole CTR lever.

Verified TVCT presence (URL Google chose, indexed title as of today):
- huntsville cost → /blog/house-cleaning-cost-huntsville-al ("House Cleaning Cost in Huntsville, AL | Valley Clean Team") and /huntsville-weekly-cleaning (redirects; snippet still shows "starts at $119" — stale cache of a retired price)
- florence cost → /blog/house-cleaning-cost-florence-al indexed as "...Florence AL 2025 | Valley Clean Team" (source now says 2026; Google has not recrawled)
- athens cost → both /blog/house-cleaning-cost-athens-al AND /blog/reliable-cleaning-company-athens-al (two TVCT results, both "2025" in the index)
- decatur cost → only /locations/decatur/weekly-cleaning surfaced (snippet "starts at $109 per visit"); the Decatur cost guide did not appear
- madison cost → no TVCT result in the returned set (Care.com, Angi, Thumbtack, Homeaglow, Homeyou, Manta)
- nashville cost → /blog/house-cleaning-cost-nashville-tn ("...(2026 Prices) | Valley Clean Team") — the only title in that SERP with a year and a price
- deep cleaning cost huntsville → 5 TVCT URLs (/services/deep-cleaning "From $276", cost guide, deep-vs-standard, AL guide, homepage). Strong SERP; already price-led.
- deep cleaning cost nashville → cost guide + /locations/nashville/deep-cleaning + /locations/west-nashville/deep-cleaning (three TVCT URLs, none says a price in the title)
- move out cleaning cost nashville → /blog/move-out-cleaning-nashville-tn + cost guide. Music City Maid and Maid Cleaning Nashville also rank.
- move out cleaning cost huntsville → /blog/move-out-cleaning-huntsville-al + /blog/move-out-cleaning-huntsville-guide (two TVCT results; Bear Brothers' cleaningserviceshuntsville.com and Molly Maid also there)
- muscle shoals cost → /locations/muscle-shoals/biweekly-cleaning (snippet "starts at $99 per visit" — retired price in Google's cache)
- alabama cost → /blog/house-cleaning-cost-alabama; hellocleaners.us and RenoVetted have "(2026 Price Guide)" titles
- birmingham cost → Google still lists /blog/house-cleaning-cost-birmingham-al (now a 301 to the Alabama guide); two Birmingham operators have "(2026 Guide)" cost posts
- montgomery cost → no TVCT result (Care.com, Homeyou, HomeGuide, Thumbtack); no service coverage
- is hiring a house cleaner worth it → national SERP (Care.com, SoFi, Angi, NBC, a Facebook moms group). TVCT not in returned set.
- maid service huntsville / best cleaning company huntsville → operator SERPs (The Maids, Two Maids, Rosie Cleans, Rocket Maids, Bear Brothers, MaidPro, Merry Maids, threebestrated). TVCT not in the returned set for either; /services/maid-service and /best-cleaning-company-huntsville-al are not winning these.
- maidpro vs bear brothers → /blog/bear-brothers-vs-the-valley-clean-team ranks (only comparison content in the SERP)
- airbnb cleaning huntsville → /locations/huntsville/airbnb-cleaning ranks; snippet already says "starts at $125"
- house cleaning cost calculator → national SaaS tools (Thumbtack, Jobber, Connecteam); not winnable, and the intent is mostly cleaners pricing their own jobs
- what should a cleaner do in 3 hours → 9 small cleaning companies' blogs; no franchise, no aggregator. Winnable.
- PCS move out Redstone Arsenal → hellocleaners.us programmatic pages + /blog/move-out-cleaning-huntsville-al. Thin SERP.

## 2. Seed → expanded keyword set by cluster

| Cluster | Intent stage | Representative queries | Existing page(s) | SERP shape today |
| --- | --- | --- | --- | --- |
| A. Cost / price by city (the ~43K) | Problem-aware, comparing | how much does house cleaning cost [huntsville/madison/athens/decatur/florence/muscle shoals/nashville/birmingham]; house cleaning prices [city]; cleaning service rates [city]; maid service cost [city] | 6 city cost guides, AL guide, /pricing, weekly/biweekly location pages | Aggregators with $/hr teasers and "calculator" titles; TVCT is only operator with a flat price to show |
| B. Cost by service | Solution-aware | deep cleaning cost [city]; move out cleaning cost [city]; airbnb cleaning cost; post construction cleaning cost [city]; apartment cleaning cost nashville | deep-cleaning-cost-shoals, move-out Nashville/Huntsville guides, /services/*, location service pages | Same aggregators + one or two operators; move-out SERPs have Molly Maid and Bear Brothers; Nashville has flat-rate operators (Music City Maid) |
| C. "Worth it / should I hire" | Unaware → problem-aware | is hiring a house cleaner worth it; is a maid service worth it; how often should I have my house cleaned; cleaning company vs individual cleaner; Care.com vs cleaning company | is-hiring-house-cleaner-worth-it, hidden-cost-of-dirty-house, why-19-dollar-cleaning-costs-more-shoals, bi-weekly-vs-monthly | National publishers; local operators absent. Low CTR lever, medium teach lever |
| D. Service + city commercial ("near me") | Most-aware, choosing | maid service huntsville al; house cleaning [city]; cleaning services near me; best cleaning company [city]; reliable cleaning company [city] | /services/maid-service, /locations/*, best-cleaning-company-*, reliable-cleaning-company-* | Operator sites + Yelp/Angi/threebestrated; map pack decides this (outside the Shoals TVCT is absent — see memory) |
| E. Comparison | Most-aware | maidpro vs bear brothers; bear brothers cleaning reviews; maidpro huntsville prices; two maids vs molly maid; molly maid cost | bear-brothers-vs, maidpro-vs (x2) | TVCT already owns the only comparison content; thin SERP |
| F. Airbnb host | Solution-aware | airbnb cleaning service [huntsville/nashville]; airbnb cleaning fee nashville; how much to pay airbnb cleaner; turnover cleaning checklist | /services/airbnb-cleaning, location airbnb pages, nashville-airbnb-cleaning-fees, airbnb-cleaning-nashville-host-guide | Turno/TIDY/Cleanster platforms + Bear Brothers; TVCT ranks with "$125" already in snippet |
| G. Move-out / PCS | Transactional, deadline-driven | move out cleaning [city]; move out cleaning checklist for deposit; PCS move out cleaning huntsville; redstone arsenal housing cleaning inspection | 5 move-out pages, move-out-requirements-for-property-managers, moving-to-huntsville-first-week | Thin; hellocleaners.us programmatic pages, Bear Brothers, Molly Maid |
| H. Teach-the-customer (white space) | Problem/solution-aware | what should a cleaner do in 3 hours; what is included in a deep clean; deep clean vs regular; how long does a deep clean take; do I need to be home; what do cleaners not do | deep-vs-standard-* (4), what-is-included-in-move-in-clean, eco-friendly-products | Small operators' blogs, no aggregators; winnable with checklist numbers (44/57/49/37) |

## 3. PRIORITY 1 — Rewrite first (title + meta), ranked by likely impression share

Pattern: `[Service] Cost in [City], ST: From $NNN, Firm` then a meta that lists the three public starting prices, the one-call exact-number promise, and the right phone. "Firm" is the one-word version of "the number we quote is the number we bill." Do not add "starting at" (it is the enemy's phrase) or a year in the title (three of these pages are indexed with a stale "2025").

| # | Page | Current title | Proposed title (chars) | Proposed meta (chars) | Why |
| --- | --- | --- | --- | --- | --- |
| 1 | /blog/house-cleaning-cost-huntsville-al | House Cleaning Cost in Huntsville, AL | House Cleaning Cost in Huntsville, AL: From $200, Firm (54) | Regular from $200, deep from $276, move-out from $351 in Huntsville & Madison. One call gets your exact number; that's the number we bill. (256) 826-1100 (152) | Largest market, ranks today, title has no price; current meta leads with competitor names |
| 2 | /blog/house-cleaning-cost-nashville-tn | House Cleaning Cost in Nashville, TN (2026 Prices) \| Valley Clean Team | House Cleaning Cost in Nashville, TN: From $200, Firm (53) | Regular from $200, deep from $276, move-out from $351 in Nashville & Brentwood. One call, one exact number, no surprise on the bill. (615) 510-1427 (144) | Only TVCT page already price-led; current meta says "5-star rated" (oversell, remove) |
| 3 | /blog/house-cleaning-cost-florence-al | House Cleaning Cost Florence AL 2026 | House Cleaning Cost in Florence, AL: From $200, Firm (52) | Regular from $200, deep from $276, move-out from $351 across the Shoals. Call, get your exact number, and that's the number we bill. (256) 826-1100 (145) | Home market, map pack works here; index still shows "2025" |
| 4 | /pricing | Cleaning Prices — The Price Is the Price \| Valley Clean Team | Cleaning Prices: Regular $200, Deep $276, Move-Out $351 (55) | Real starting prices for AL & TN homes, recurring 30% / 25% / 15% off, and what's on the 44-item checklist. Call for your exact number. (256) 826-1100 (147) | 4th landing page; current title has zero numbers |
| 5 | /blog/house-cleaning-cost-madison-al | House Cleaning Cost Madison AL 2025 | House Cleaning Cost in Madison, AL: From $200, Firm (51) | Regular from $200, deep from $276, move-out from $351 in Madison, AL. One call gets your exact number; that's the number we bill. (256) 826-1100 (139) | Did not surface in today's SERP; "2025" in title reads abandoned |
| 6 | /blog/house-cleaning-cost-athens-al | House Cleaning Cost Athens AL 2026 | House Cleaning Cost in Athens, AL: From $200, Firm (50) | Regular from $200, deep from $276, move-out from $351 in Athens & Limestone County. One call, one exact number, firm. (256) 826-1100 (129) | Ranks; shares the SERP with its own reliable-company twin (see §6) |
| 7 | /blog/house-cleaning-cost-decatur-al | House Cleaning Cost Decatur AL 2025 | House Cleaning Cost in Decatur, AL: From $200, Firm (51) | Regular from $200, deep from $276, move-out from $351 in Decatur & Morgan County. One call, one exact number, firm. (256) 826-1100 (127) | Absent from today's SERP; the weekly page ranked instead with a stale price |
| 8 | /blog/deep-cleaning-cost-shoals-guide | Deep Cleaning Cost Shoals AL | Deep Cleaning Cost in the Shoals, AL: From $276, Firm (53) | Deep cleaning from $276 in Florence, Muscle Shoals, Tuscumbia & Sheffield: 57 items, 13 more than a regular clean. Exact number in one call. (256) 826-1100 (149) | Current meta says "transparent quotes" and no number |
| 9 | /blog/house-cleaning-cost-alabama | House Cleaning Prices in Alabama \| Veteran-Owned \| Valley Clean Team | House Cleaning Cost in Alabama: From $200 (2026 Guide) (54) | Regular from $200, deep from $276, move-out from $351 in Huntsville, the Shoals & Mountain Brook. Your exact number takes one call. (256) 826-1100 (143) | Receives the Birmingham redirect; competitors' titles all say "(2026 Guide)"; current meta says "free quote" |
| 10 | /blog/move-out-cleaning-costs-in-nashville-2026-updated-guide | Move-Out Cleaning Costs Nashville 2026 | Move-Out Cleaning Cost in Nashville: From $351, Firm (52) | Move-out cleaning from $351 in Nashville: the 49-item list landlords check, what's not included, and one call for your exact number. (615) 510-1427 (143) | Flat-rate Nashville operators rank here; price must be in the title to compete |
| 11 | /blog/move-out-cleaning-huntsville-guide | Move-Out Cleaning Huntsville AL Guide | Move-Out Cleaning Cost in Huntsville: From $351, Firm (53) | Move-out cleaning from $351 in Huntsville & Madison County: what property managers inspect, PCS timing, and your exact number in one call. (256) 826-1100 (150) | Two TVCT move-out pages rank; make this the cost one and leave /blog/move-out-cleaning-huntsville-al as the how-to |
| 12 | /blog/is-hiring-house-cleaner-worth-it | Is Hiring a House Cleaner Worth It? | Is a House Cleaner Worth It? The Math at $200 a Visit (55) | What $200 a visit actually buys (44 items, about 3 hours of your weekend) and when it isn't worth it. Honest breakdown for AL & TN homes. (137) | National SERP; a number in the title is the only way a local operator stands out |
| 13 | /services/deep-cleaning | Deep Cleaning Services AL & TN \| Valley Clean Team | Deep Cleaning from $276 in AL & TN: 57-Item Checklist (54) | Deep cleaning from $276: the 57-item list (inside appliances, baseboards, cabinets, fans). One call for your exact number, firm. (256) 826-1100 (139) | Already ranks for "deep cleaning cost huntsville" with "From $276" in the indexed title; source title lacks it |
| 14 | /services/regular-cleaning | Regular House Cleaning in Alabama & Tennessee | Regular House Cleaning from $200: Weekly Saves 30% (50) | Regular cleaning from $200, 44-item checklist every visit. Weekly 30% off, biweekly 25%, monthly 15%. Exact number in one call. (256) 826-1100 (136) | Current meta says "Save 20%" (contradicts claims.ts 30/25/15) and "maid service" |
| 15 | /services/move-in-out-cleaning | Move-In/Out Cleaning \| Deposit Back \| Valley Clean Team | Move-In/Out Cleaning from $351: 49-Item Checklist (49) | Move-in/out cleaning from $351 in AL & TN: 49 items, inside every cabinet and appliance, before/after photos. Exact number in one call. (256) 826-1100 (143) | Current meta says "44-point checklist" (move-out is 49 in claims) and "free quote" |
| 16 | /services/airbnb-cleaning | Airbnb Turnover Cleaning \| Valley Clean Team | Airbnb Turnover Cleaning from $125 in AL & TN (45) | Turnovers from $125: linen swap, restock, photo check between guests in Huntsville, the Shoals & Nashville. Exact per-turnover number in one call. (150) | Only service page with no number; the location page already shows $125 in its snippet |
| 17 | /best-cleaning-company-huntsville-al | Best Cleaning Company in Huntsville, AL | Best Cleaning Company in Huntsville, AL (Prices Compared) (57) | 7 Huntsville cleaning companies compared on price posture, employees vs contractors, and guarantees. We publish ours: regular from $200. (256) 826-1100 (146) | "best cleaning company huntsville" SERP is operators + threebestrated; TVCT absent; the comparison angle needs a price hook |
| 18 | /best-cleaning-company-nashville-tn, -florence-al, -athens-al, -mountain-brook-al | Best Cleaning Company in [City] | Best Cleaning Company in [City], ST (Prices Compared) (≤57) | Same pattern as #17 with the city's operator count and the TN phone for Nashville | Same reasoning; Mountain Brook is the one place "luxury" is allowed but keep it out of the title |

Implementation notes for the rewrite PR: (a) titles 1-12 will render with " | Valley Clean Team" appended by BaseLayout; that is fine, Google truncates from the right. (b) Nashville pages must use (615) 510-1427. (c) Remove "5-star rated," "top-rated," "most thorough," "same team every visit" from metas as they are hit (oversell or not in claims.ts). (d) Do not add FAQ schema; it is dead (see memory).

## 4. PRIORITY 2 — Content gaps

| Gap query (intent) | Evidence | Recommendation |
| --- | --- | --- |
| house cleaning cost birmingham al / mountain brook | Google still lists the redirected Birmingham URL; two Birmingham operators have 2026 cost guides; Birmingham appears as a visitor city | CONFIRM SERVICE COVERAGE BEFORE CREATING. If Mountain Brook + Homewood/Vestavia/Hoover are truly served (locations.json lists them), build /blog/house-cleaning-cost-mountain-brook-al with the Birmingham-metro query in H1 and lift the redirect. If not, leave the redirect and stop advertising Birmingham in the AL guide meta. |
| house cleaning cost montgomery al | Visitor city with no page; SERP is aggregators only | SKIP. No service coverage; a cost guide would create calls we cannot serve. Add Montgomery to a "where we don't go" line on /pricing if the calls are real. |
| house cleaning cost decatur / madison (not surfacing) | Cost guides exist but the weekly/biweekly location pages ranked instead, with stale prices in Google's cache | FIX, don't build: rewrite per §3, then request reindex of both cost guides and the weekly/biweekly location pages. Verify the location pages' visible price copy is derived from claims (the cached snippets show $119 / $109 / $99). |
| house cleaning cost tuscumbia / muscle shoals / sheffield | Only /locations/muscle-shoals/biweekly-cleaning surfaced | SKIP a new page. Fold "Muscle Shoals, Tuscumbia & Sheffield" into the Florence cost guide H2s and meta (done in #3) and interlink from those city hubs. |
| deep cleaning cost nashville | Three TVCT URLs, none with a price in the title | SKIP a new page; rewrite /locations/nashville/deep-cleaning title to "Deep Cleaning in Nashville, TN: From $276, Firm" and canonicalize west-nashville's to it if they duplicate. |
| cleaning service cost calculator | National SaaS SERP (Jobber, Thumbtack, Connecteam) | SKIP as a page. The interactive equivalent that fits the brand is a "which starting price applies to you" block on /pricing (sq-ft band → service → starting price), not a calculator that spits out an estimate we would then have to defend. |
| PCS move out cleaning huntsville / redstone arsenal housing inspection | Thin SERP (programmatic hellocleaners.us pages); PCS season May-Aug; TVCT is veteran-owned | BUILD: one guide, "PCS Move-Out Cleaning in Huntsville: From $351 and the Housing Inspection List." Deadline-driven, high AOV, proprietary angle (veteran-owned, 49-item list). Cross-link from move-out-cleaning-huntsville-guide. |
| what should a house cleaner do in 3 hours | 9 small operators' blogs, no aggregators, no franchise | BUILD (see §5, topic 1). |
| apartment cleaning cost nashville | Essential Apartment Cleaning ranks a prices guide; renters are the move-out buyers | BUILD LATER as an H2 in the Nashville cost guide ("apartments and condos"), not a page. |
| cleaning company vs individual cleaner (Care.com $19/hr) | Angi has the national article; TVCT has the Shoals version | EXPAND why-19-dollar-cleaning-costs-more-shoals into a Huntsville edition only if GSC shows the Shoals version earning impressions; otherwise skip. |

## 5. PRIORITY 3 — Teach-the-customer content (the competitor white space)
Franchise and gig sites in these SERPs sell; none of them teach with numbers. Each topic below maps to a query with observed real demand and gives the checklist counts (44/57/49/37) or policies a reason to be cited.

1. "What a cleaner should get done in 3 hours" → what should a house cleaner do in 3 hours; how long does it take to clean a house. Angle: the 44-item checklist paced against a 2,000 sq ft home; what gets cut when a home is bigger and why the price moves with square footage.
2. "What's actually in a deep clean (and what isn't)" → what is included in a deep cleaning service; deep clean vs regular. Angle: the 13 items deep adds to the 44, and the list of things nobody's deep clean includes (carpet shampoo, exterior windows, hoarding). Consolidate the four deep-vs-standard city posts under this as the hub.
3. "The move-out inspection list landlords actually use" → move out cleaning checklist for deposit; what do landlords check. Angle: 49 items vs a typical lease addendum; before/after photo practice.
4. "Why we charge by square footage, not by the hour" → house cleaning hourly rate vs flat rate; how do cleaning companies price. Angle: explains the exact-price system without publishing the card.
5. "Employees vs contractors: who is actually in your house" → cleaning company vs independent cleaner; are house cleaners insured. Angle: background checks, $2M liability, the referral-agency model (Bear Brothers, Care.com) stated factually per competitors.md's Do Not Say list.
6. "How often should you have your house cleaned" → weekly vs biweekly vs monthly cleaning. Angle: 30/25/15 discounts, what drifts between visits at each cadence; upgrade bi-weekly-vs-monthly post.
7. "The fees we tell you about before they happen" → cleaning cancellation fee; pet fee house cleaning; travel fee. Angle: publish the POLICIES list plainly; nobody else does.
8. "Products we use on which surface" → what cleaning products do professionals use; is green cleaning as effective. Angle: surface-by-surface (quartz, marble, hardwood, stainless), green at no extra charge; refresh eco-friendly-cleaning-products post.
9. "What to do before the cleaners arrive (and what not to)" → how to prepare for house cleaners; should I tidy before the cleaner comes. Low competition, pairs with topic 1.
10. "Airbnb turnover: what $125 covers and what the host still owns" → how much to pay airbnb cleaner; airbnb turnover checklist. Angle: linen/restock split; complements nashville-airbnb-cleaning-fees.

## 6. Cannibalization risks (same city + cost intent, multiple TVCT pages)
- Athens: /blog/house-cleaning-cost-athens-al and /blog/reliable-cleaning-company-athens-al both rank for the cost query, both titled "2025" in the index. Six reliable-cleaning-company-* posts overlap the five best-cleaning-company-* pages AND the cost guides ("pricing starting at $200" in their metas). Recommend: 301 each reliable-cleaning-company-* to its best-cleaning-company-* page (Decatur and Madison have no best page; point those to the city cost guide), and drop them from allBlogPosts.
- Huntsville move-out: /blog/move-out-cleaning-huntsville-al, /blog/move-out-cleaning-huntsville-guide, /locations/huntsville/move-out-cleaning and /services/move-in-out-cleaning all target move-out cost. Keep the guide as the cost page (§3 #11), make -huntsville-al the how-to, and have the location page carry no price in its title.
- Nashville deep: cost guide + /locations/nashville/deep-cleaning + /locations/west-nashville/deep-cleaning. One price-led title (nashville), west-nashville stays neighborhood-only.
- Weekly/biweekly location pages (huntsville, decatur, muscle-shoals, nashville) outrank the cost guides for cost queries in three cities and their cached snippets carry retired prices. /locations/nashville/biweekly-cleaning line 74 literally says "$109-$250" (retired $109) in an FAQ answer — fix at source. Audit the other three for hardcoded prices.
- /blog/house-cleaning-cost-alabama vs the Huntsville guide: both claim "Huntsville" in metas. The AL guide should be the umbrella (state + Birmingham metro), not a second Huntsville page.
- /blog/how-to-budget-for-house-cleaning-services-in-2026 targets "real pricing for Huntsville, Florence, Nashville" — the same intent as /pricing. Either retitle toward the budgeting angle (topic 6 in §5) or canonical to /pricing.

## 7. Measurement plan (Todd pulls GSC manually)
Before the rewrite PR merges, export from GSC (last 28 days, Search results, filter Country = United States) and save as `docs/seo/gsc-before-YYYY-MM-DD.csv`:
1. Pages report, filtered to each Priority 1 URL (18 rows): impressions, clicks, CTR, avg position. This is the ranking that reorders §3 if it disagrees with the inferred order.
2. Queries report filtered by regex: `cost|price|prices|rates|how much` → impressions/CTR by query; note the top 20.
3. Queries for `worth`, `maid service`, `best cleaning`, `move out`, `deep clean`, `airbnb` (one filter each) to baseline clusters C, D, G, B, F.
4. Device split for the cost regex (expect ~74% mobile; the meta must read on a phone).
Then: request indexing for all 18 URLs in URL Inspection the day the PR merges, and re-pull the same four reports at +4 weeks (week of 2026-09-21). Success = cost-cluster CTR moves from ~0.07% toward the 0.29% the pos 4-10 pages already show, with position flat or better. Watch the retired-price snippets (huntsville-weekly, decatur weekly, muscle-shoals biweekly) disappear from the Pages report cache after recrawl. Pair with PostHog phone_click filtered to AL/TN and the two phone lines' call logs, since a title change that lifts clicks but not calls means the page, not the SERP, is the next problem.

## Pillar validation (4-check, on live SERP evidence)

Pillar: Cost by city (cluster A)
- Search volume: PASS — ~43K impressions/month already measured on this intent (GSC, per audience.md); six-city SERPs each carry 8-10 dedicated cost pages from aggregators
- Market-centric: PASS — "how much does house cleaning cost [city]" is the market's phrasing, not ours
- Competitive: PASS — mixed SERP (Care.com/Homeyou/Manta + small operators); TVCT already ranks 4-10 in five of six cities
- Proprietary advantage: YES — the only operator in these SERPs with published flat starting prices and a held-price promise
- VERDICT: VALID PILLAR (Priority 1; win by CTR, not by new pages)

Pillar: Cost by service (cluster B)
- Search volume: PASS — deep/move-out cost SERPs are as deep as the city ones
- Market-centric: PASS
- Competitive: PASS — Nashville has flat-rate operators in the top 10, Huntsville has Molly Maid and Bear Brothers; still mixed
- Proprietary advantage: YES — per-service checklist counts (57/49/37) plus prices
- VERDICT: VALID PILLAR (Priority 1 rows 8, 10, 11, 13-16)

Pillar: Teach-the-customer (cluster H)
- Search volume: PASS (moderate) — nine operator blogs compete on "3 hours"; "what is included in a deep clean" has seven dedicated guides
- Market-centric: PASS
- Competitive: PASS — no aggregator, no franchise, no DR-80 site in either SERP
- Proprietary advantage: YES — itemized checklists and published policies nobody else prints
- VERDICT: VALID PILLAR (Priority 3; slower, builds the ⭐ position)

Pillar: Comparison (cluster E)
- Search volume: FAIL — "maidpro vs bear brothers" returns no dedicated results beyond TVCT's own post; demand is branded and small
- Market-centric: PASS
- Competitive: PASS — TVCT already owns it
- Proprietary advantage: YES
- VERDICT: DEMOTE TO CLUSTER — keep the three existing posts current; do not add more

Pillar: Worth-it / should-I-hire (cluster C)
- Search volume: PASS (national)
- Market-centric: PASS
- Competitive: FAIL — Care.com, SoFi, Angi, NBC; a local operator will not take page 1 nationally
- Proprietary advantage: PARTIAL — the "$200 a visit, 44 items, ~3 hours" math is unique but the query is not local
- VERDICT: DEMOTE TO CLUSTER — one page (row 12), retitled with the number; no further investment

Pillar: Airbnb host (cluster F) and Move-out/PCS (cluster G)
- Search volume: PASS (F moderate, G seasonal May-Aug)
- Market-centric: PASS
- Competitive: PASS — platforms (Turno/TIDY) and programmatic pages, both thin on local detail
- Proprietary advantage: YES for G (veteran-owned, 49-item list, PCS timing); PARTIAL for F ($125 is public, host-fee content already exists)
- VERDICT: F = cluster under Cost by service (row 16 + topic 10); G = VALID small pillar (one new PCS guide + rows 10-11, 15)

## Start here
1. One PR: the 18 title/meta rewrites in §3 plus the three source fixes flagged in §6 (Nashville biweekly "$109" FAQ line, regular-cleaning "Save 20%", move-in/out "44-point"). Run `npm run validate:claims` — the retired-price validator should stay green because none of the proposed strings contain a retired price.
2. Same day: GSC "before" pull (§7) and URL Inspection reindex requests for the 18 URLs and the four weekly/biweekly location pages whose cached snippets show retired prices.
3. Week 2: the reliable-cleaning-company-* consolidation (§6) — six 301s and six removals from allBlogPosts.
4. Week 3-4: write the PCS move-out guide and "3 hours" teach piece (§4, §5 topic 1) with /seo-content; both have thin SERPs and a number to lead with.
5. Do not build Birmingham or Montgomery cost pages until Todd confirms coverage.

## Search data summary
- SERPs analyzed: 23 queries (WebSearch, 2026-08-23); competitor pages reviewed via SERP titles only (no crawl this session)
- Autocomplete / PAA: not captured (tool returns result lists, not PAA boxes); the language bank in audience.md and cluster H titles substitute
- Next refresh: after the +4 week GSC pull; re-run §1 for the six city cost queries and note whether the "2025" titles have been recrawled
