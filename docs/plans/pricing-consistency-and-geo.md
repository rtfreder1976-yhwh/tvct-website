# Pricing Consistency + AI-Answer-Engine (GEO) Plan

**Status:** DRAFT — awaiting Todd's approval. No code changed yet.
**Date:** 2026-08-20
**Author:** Claude (audit + plan), Todd (decisions)

---

## Why this exists

Two problems, one root cause.

1. **Revenue leak.** A five-week break in lead routing (`/get-quote` → BookingKoala) left
   55 leads unworked in BK. Separately, ~89% of bookings are entered by staff, so lead
   capture feeds a manual process that closes extremely well (web-form leads: 22-for-22,
   100%, ~$630 avg).
2. **Pricing drift.** The site publishes ~1,425 dollar figures across ~314 files with **no
   central price constant**. Seven "sources of truth" disagree. Some published prices are
   **44% below** the real rate.

The GEO opportunity (getting cited by AI answer engines for "how much does house cleaning
cost in Huntsville") depends on #2 being fixed first. Publishing more pricing on top of
contradictory data would train answer engines on wrong numbers — and AI citations get
cached and repeated.

**Sequence is the whole point: consolidate → correct → then publish.**

---

## Authoritative pricing (source of truth)

From Todd's "New TVCT Cleaning Biz Pricing" Google Sheet + BookingKoala extras, verified
2026-07-09. See memory `real-pricing-model`.

**Per-sqft bands:** 750, 1000, 1250, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600,
4000, 4400, 4700, 5200, 5600, 6000

| Service | Formula | 750 | 1500 | 2700 | 4000 |
|---|---|---|---|---|---|
| Standard Clean | grid | $176 | $281 | $436 | $656 |
| Deep Clean | grid | $276 | $381 | $561 | $781 |
| Move In/Out | Deep + $75 | $351 | $456 | $636 | $856 |
| Post-Construction | (Move In/Out) × 1.5 | $526 | $684 | $954 | $1,284 |

**Recurring discounts off Standard:** Weekly 30% · Bi-Weekly 25% · Monthly 15%
**Floors:** Deep $200 · Standard $200 · Weekly Standard $150 · Move In/Out $350 · Construction $450
**Travel fee:** Huntsville/Madison $5 · The Shoals $5 · all other markets $15
**Commercial (confirmed by Todd 2026-08-20):** **$0.11 / sq ft** base.
Internal-only: $0.15 / sq ft with exterior/interior glass — **do not publish**.
Supersedes the unsourced `$0.10 / sq ft` at `commercial-cleaning.astro:299`.
**Pet fee (CONFIRMED REAL by Todd 2026-08-20):** 1 pet $25 · 2 $50 · 3 $55 · 4 $60 · 5 $65
(tiered — look up by count, do not multiply)

**No city-by-city base price variance exists.** Only the flat $5/$15 travel fee.

---

## Phase 0 — Decisions still needed from Todd

| # | Decision | Options | Status |
|---|---|---|---|
| 0.1 | Pet fee copy | Page says "no extra charge"; reality is tiered $25+ | ✅ **RESOLVED** — fee is real, copy must change |
| 0.2 | How much of the ladder to publish | (a) full 17 bands (b) condensed 4-5 rows (c) ranges only | ⬜ **OPEN** — recommend (b) |
| 0.3 | White-glove tier | `$350/$475/$650` has no authoritative equivalent | ⬜ **OPEN** — real service or delete? |
| 0.4 | Commercial rates | per-sqft vs office tiers | ✅ **RESOLVED 2026-08-20** — Todd confirms **$0.11/sq ft** is his real rate. Glass rate ($0.15) stays **internal, not published**. Publish **per-sq-ft only** — retire the `$150+/$300+` office tier cards. |
| 0.5 | Publish travel fee? | $5/$15 currently unpublished | ⬜ **OPEN** — recommend yes, builds trust |
| 0.6 | Publish minimums? | $200/$150/$350/$450 floors unpublished | ⬜ **OPEN** |

**Phases 1–3 can proceed on 0.1 alone.** Phase 4 (GEO publishing) needs 0.2.

---

## Phase 1 — Centralize (foundation)

**Goal:** one file to edit. Nothing centralizes prices today, which is *why* it drifted.

**Create `src/constants/pricing.ts`:**
- `SQFT_BANDS` — the 17 bands
- `STANDARD_CLEAN`, `DEEP_CLEAN` — band → price maps
- `moveInOut(sqft)` = deep + 75 · `postConstruction(sqft)` = moveInOut × 1.5
- `RECURRING_DISCOUNTS` = `{ weekly: 0.30, biweekly: 0.25, monthly: 0.15 }`
- `MINIMUMS`, `TRAVEL_FEES`, `PET_FEES`
- Helper: `priceFor(service, sqft, frequency?)` applying grid → discount → floor
- `STARTING_PRICES` = `{ standard: 176, deep: 276, moveInOut: 351, postConstruction: 526 }`

**Precedent:** `src/constants/schemaData.ts` already centralizes REVIEWS + BUSINESS_HOURS
after the 2026-07 data-consistency fix. Same pattern, same rationale.

**Risk:** none — additive only, nothing imports it yet.

---

## Phase 2 — Fix the fan-out sources (highest leverage)

Four files drive the large majority of wrong pages.

### 2.1 `src/data/services.json` — ~130 neighborhood pages
Feeds visible price **and** `PriceSpecification.price` in JSON-LD via
`ServiceLocationLayout.astro:511-535`.

| Line | Service | Current | → Correct |
|---|---|---|---|
| 95 | Deep Cleaning | `"$275"` | `"$276"` |
| 173 | Recurring Maid | `"$125"` | `"$176"` |
| 251 | Weekly | `"$119/week"` | `"$150/week"` (floor) |
| 325 | Bi-Weekly | `"$135/visit"` | `"$132/visit"` |
| 408 | Move In/Out | `"$350"` | `"$351"` |
| 487 | Move Out | `"$225"` | `"$351"` |
| 667 | Post-Construction | `"$400"` | `"$526"` |
| 704 | Green Cleaning | `"$135"` | `"$176"` |

Also **line 239**: "from $119 per visit — that's 20% off" → both numbers wrong (30%, $150).

### 2.2 `src/layouts/LocationLayout.astro` — every city hub
- **L122** FAQ: "$99 recurring, $175 deep, $225 move-in/out" → **$176 / $276 / $351**
- **L344, 353, 363, 370** price cards: `$99+`, `$175+`, `$225+`, `$125+` → corrected

`$99 → $176` is the 44% understatement, and it's the headline price on city hubs.

### 2.3 `src/constants/schemaData.ts` — JSON-LD Offers
L211 `129.00`→176 · L227 `199.00`→276 · L243 `99.00`→150 · L259 `199.00`→351 · L296 `300.00`→526
L321 FAQ "$99 / $149" → $176 / $276 · L337 "starts at $129" → $176

### 2.4 `src/components/SchemaMarkup.astro` — JSON-LD Offers
L273-275 `99.00` + "Starting at $99" · L532 `149` · L606 `99` · L667 `199` → $351

**Preserve** the existing guards at `SchemaMarkup.astro:312-315` and
`ServiceLocationLayout.astro:508-511` — they correctly refuse to fabricate prices.

---

## Phase 3 — Correct the remaining contradictions

### 3.1 Pet fee (Decision 0.1 — RESOLVED)
`src/pages/pricing.astro:692` currently: *"Standard pet households have no extra charge"*
→ Rewrite to state the real tiered fee. Suggested:
> "We love pets. A pet fee applies based on how many pets are in the home — $25 for one
> pet, $50 for two, then $5 for each additional. Heavy shedding may call for our Shedder
> treatment; we'll quote that upfront, never as a surprise."

Then grep sitewide for other "no pet fee / pets free" claims and align.

### 3.2 Meta description — highest-visibility single error
`src/pages/services/move-in-out-cleaning.astro:12` — "From $199" → **$351**. This is the
Google snippet. Same file also says $225 (L310) and $351 (L65, L372) — normalize all.

### 3.3 The `$$` rendering bug
`services.json:79` template `${price_start}` where value already contains `$` → renders
**"base rate from $$275"** on every deep-cleaning neighborhood page.
Fix: drop `$` from the template *or* from the data (prefer: store numeric, format at render).
**Verify on a live URL first** — `dist/` had no built HTML to confirm.

### 3.4 Discount claim: 20% → 30% (36 files)
`pricing.astro:754` and `recurring.astro:34-50` are correct. 36 other files say "20%".
You are under-selling your own best offer nearly everywhere.

### 3.5 Invented city price variance
Nashville $89/wk, Huntsville $99, Athens $99, Decatur $109, Florence $119,
Muscle Shoals $119, Mountain Brook $129 — all invented, several below the $150 floor.
→ Single national starting price + flat $5/$15 travel fee.

### 3.6 One-off conflicts
- `airbnb-cleaning.astro` — "From $150" (L246/373) vs "around $99" (L319)
- `house-cleaning.astro:78`, `maid-service.astro:76` — "starts at $125" → $176
- `blog/why-19-dollar-cleaning-costs-more-shoals.astro:243-245` — $325/$395/$145 → $351/$526/—
- `best-cleaning-company-huntsville-al.astro:332` — Airbnb "$145"
- `white-glove-cleaning.astro:59,309-330` — pending Decision 0.3
- `commercial-cleaning.astro:299` — "$0.10 per sqft" → **$0.11 / sq ft** (Decision 0.4 resolved)
- `pricing.astro:429-441` — retire the `$150+` / `$300+` office tier cards in favour of the
  per-sq-ft rate (Decision 0.4)
- Service-page tier **labels**: a "2,500–4,000 sq ft" card shows the price for the *bottom*
  of the band. Defensible as "From", but relabel to avoid under-quoting large homes by ~40%.

---

## Phase 4 — GEO / AI answer-engine publishing

**Only after Phases 1–3.** This is the strategy Todd asked about.

### What's already strong
258 "How much" occurrences in `{question, answer}` FAQ objects rendering as visible H3s.
`blog/house-cleaning-cost-huntsville-al.astro:12-13` is the model — competitor ranges,
then the specific TVCT number. **The format is right; only the numbers were wrong.**

### 4.1 `PricingTable.astro` — publish the sqft ladder as real HTML

**The single biggest win.** The complete authoritative ladder already exists at
`pricing.astro:841-851` — but **inside JavaScript**, invisible to crawlers and AI engines.
Your best pricing data is the only pricing data machines can't read.

#### Origin of this spec + the correction applied

A Google-AI-generated suggestion proposed this component. **Its architecture was right; its
pricing data was wrong** and would have published prices **24–50% below actual**. Recorded
here so the error is not reintroduced.

It proposed a flat per-sqft rate (Standard "$117.19 per 1,000 sq ft"). TVCT pricing is a
**lookup grid with variable step sizes** (+$35/band low, +$55/band high), not linear:

| Sq ft | AI formula | Actual Standard | Error |
|---|---|---|---|
| 750 | $88 | **$176** | −50% |
| 1,000 | $117 | **$211** | −44% |
| 1,500 | $176 | **$281** | −37% |
| 4,000 | $469 | **$656** | −29% |
| 6,000 | $703 | **$931** | −24% |

Minimums do not rescue it: at 1,000 sqft the formula yields $117 → floored to $200 → actual
is $211. It also mis-modeled **Move In/Out** as its own per-sqft rate (actually **Deep + $75
flat**) and **Post-Construction** likewise (actually **Move In/Out × 1.5**).

**Rule: this component reads from `src/constants/pricing.ts` (Phase 1). It must never carry
hardcoded prices or a derived per-sqft rate.**

#### Kept from the suggestion (good advice)
- Standalone reusable Astro component
- Strict semantic `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<th>` / `<td>` — exactly what
  AI engines extract
- Responsive: horizontal scroll wrapper on mobile
- Discount badges — **its 30/25/15 was correct** (site currently mis-states "20%" in 36 files)
- Its disclaimer wording — maps well onto real variables; adopt nearly as-is, extended to
  name the pet fee and travel fee

#### Component spec

**File:** `src/components/PricingTable.astro`
**Props:** `rows?: 'condensed' | 'full'` (default `condensed`), `showCommercial?: boolean`
**Data:** imports from `src/constants/pricing.ts` — no literals in the component.

**Residential table** — condensed = 5 bands (Decision 0.2 pending; `full` renders all 17):

| Home size | Standard | Deep | Move In/Out | Post-Construction |
|---|---|---|---|---|
| ~750 sq ft | $176 | $276 | $351 | $526 |
| ~1,500 sq ft | $281 | $381 | $456 | $684 |
| ~2,700 sq ft | $436 | $561 | $636 | $954 |
| ~4,000 sq ft | $656 | $781 | $856 | $1,284 |
| ~6,000 sq ft | $931 | $1,056 | $1,131 | $1,696 |

- `<caption>` and scoped `<th scope="col">` / `<th scope="row">` for a11y + crawlability
- Sizes labeled "~" — they are band starting points, not exact matches
- Wrapper: `overflow-x-auto` with `min-w-` on the table; **never** a mobile layout that
  replaces the table with non-table markup (destroys the extractable structure)

**Commercial** (Decision 0.4 resolved): single line, **$0.11 / sq ft**.
Do **not** publish the $0.15 glass rate. Retire the `$150+/$300+` office tier cards
(`pricing.astro:429-441`) — per-sq-ft only, so the two can't contradict.

**Discount badges:** Weekly **30%** · Bi-Weekly **25%** · Monthly **15%** off Standard.

**Disclaimer** (adapted from the suggestion, extended):
> "These are starting baselines. Final pricing depends on your home's layout, current
> condition, pet hair volume, and travel distance. Pet fees start at $25. A travel fee of
> $5–$15 applies depending on your service area. We quote every home exactly before we start
> — never a surprise."

**Placement:** `/pricing` under an H2 — **"How much does house cleaning cost by home size?"**
Optionally reusable on service pages later.

**Styling:** match existing theme — peach `#FFA985` accent, charcoal `#333333` text
(see memory `brand-palette-authoritative`; do **not** guess navy/cream/brass).

#### Why this beats the AI's version for extraction
Four services × five sizes = 20 quotable data points, all true — versus one derived rate an
engine would have to compute (incorrectly). Specificity is what earns citations, and only
correct specificity is worth earning.

### 4.2 Cost-question headings — but non-commodity

Answer-engine extraction rewards a question heading followed immediately by a direct,
self-contained answer. Current `/pricing` FAQ "How is pricing determined?" contains **zero
numbers** — nothing to cite.

**Caveat added 2026-08-20** after reviewing *"SEO Rankings Are Dead"* (Phlash Consulting,
2026-07-21). Per Google's own documentation, AI search rewards **non-commodity** content:

> "If all your content could belong to an HVAC company in America, it's commodity content.
> AI has already seen it."

A bare *"How much does house cleaning cost in {city}?"* page is close to commodity — any
cleaner could publish it. Ground each in something only TVCT has:
- The **real sqft ladder** (4.1) — no competitor has this
- **Real objections** from customer calls, the 55 abandoned BK leads, and sales conversations
- **Review-mined language** — 150 GBP reviews, described in the video as a content goldmine
- The genuine variables that move a quote: condition, the $100 Home Love package, pet fees,
  travel fee

Note the video also says service-area and city pages are **not** dead — they remain useful
for area/service association. This complements, not replaces, the on-page work in memory
`ranking-bottleneck-diagnosis`.

*Source caveat: vendor content (sells this service), 742 views. The cited Google
documentation is real; the urgency is partly marketing. Weigh against `geo-fundamentals`.*

### 4.3 Wire price schema into `/pricing`
`/pricing` is the **#2 most-visited page (400 views / 21 days)** and currently emits only
`<SchemaMarkup type="organization" />` — no `Offer`, no `priceRange`, no `Service`.
Add `Service` + `Offer`/`AggregateOffer` with `lowPrice`/`highPrice` (site has **none**
today) sourced from `pricing.ts`.

### 4.4 Publish what's currently missing
- Recurring discounts (30/25/15) — 68% of revenue is recurring; the discount is a selling point
- Post-construction range (from $526)
- Travel fee (Decision 0.5) and minimums (Decision 0.6)
- Add-on menu with real figures

### Important scope note
FAQ **rich results** died 2026-05-07 (see memory `schema-changes-are-not-the-lever`) — do
not build this expecting SERP rich snippets. The play is **LLM extraction**, which reads
page content, not just structured data. Content is the lever; schema is supporting.

---

## Phase 5 — Measurement (do not skip)

Right now this is unmeasurable:
- **"How did you hear about us?" is blank on 181 of 185 bookings** — make it required in BK
- `quote sent` tag has been dark since ~April 2026 (separate regression, own investigation)
- Vercel preview URLs pollute prod PostHog (memory `posthog-preview-url-pollution`) — gate
  `posthog.init` to the prod hostname

Without these, there is no way to tell in three months whether any of this worked.

---

## Out of scope (tracked separately)

- **Redirect revert** — `/get-quote`, `/booking` 301 off-domain to the known-broken generic
  `/booknow` (PR #109, commit `0ee98d2`). Real revenue leak, independent of pricing. **Fix first.**
- **Funnel redesign** — capture-first + demoted self-service. Depends on Todd's direction.
- **Working the 55 BK leads** — immediate revenue, Todd-side, today.

---

## Risk / rollback

- Phases 1–3 are content/data edits, no runtime logic. Reversible per-commit.
- Prices move **up** in most cases — worth a heads-up to anyone quoting from the site.
- **Do not deploy Phase 4 before Phases 1–3 verify**, or answer engines cache wrong numbers.
- Suggest one branch, phase-per-commit, single PR for reviewable diff.

---

## Suggested order

1. Redirect revert (out of scope here, but **do it first** — active leak)
2. Phase 1 — `pricing.ts`
3. Phase 2 — four fan-out files (biggest correctness win)
4. Phase 3 — remaining contradictions incl. pet fee
5. Verify build + spot-check live URLs (esp. `$$` bug)
6. Phase 5 — measurement fixes
7. Phase 4 — GEO publishing

---

## Open questions

- Decisions 0.2–0.6 above
- Are the ~755 blog price lines in scope, or fix-on-touch?
- Should `/pricing`'s interactive calculator stay, given self-service is ~1 booking/week?
  (Relates to the broader funnel decision — it may be better as a static table.)
