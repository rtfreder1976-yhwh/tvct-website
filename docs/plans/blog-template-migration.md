# Blog Template Migration + Named-Author E-E-A-T

Status: **PLAN — pilot not yet started**
Owner: Todd
Created: 2026-07-16

## Goal

Two linked improvements to blog posts (GEO / E-E-A-T):

1. **Extract a shared `BlogPostLayout.astro`** so the ~108 standalone posts stop
   hand-rolling their own byline / schema / publish-gating (the root cause of
   recurring drift bugs).
2. **Attribute posts to a real named author** — Todd Frederickson — as a
   reusable `Person` entity (`@id: /about#todd`, `worksFor` → `#organization`)
   with a **visible byline**, not just schema.

## Decisions (locked)

| # | Decision | Chosen | Why |
|---|---|---|---|
| 1 | Blog author | **Todd Frederickson** | Real co-founder; a fake byline is worse than none. |
| 2 | Author scope | **Schema + visible byline** | E-E-A-T counts more when author is visible on-page. |
| 3 | Rollout | **Template + migrate in batches** | Avoid one unreviewable 108-file diff. |
| 4 | Rewrite scope | **Structure only; flag staleness, don't touch prose** | Prose = accuracy landmines (prices, competitor claims). |
| 5 | Pilot set | **5 highest-value posts incl. 2 hardest outliers** | If the template survives the worst shapes, the 103 are mechanical. |
| 6 | Hero handling | **Layout owns byline + schema; post keeps its custom hero** | Least-invasive per-post edit; heroes keep their visual identity. |

### Component split (from decision 6)
- `src/components/BlogByline.astro` — standardized visible byline (drop-in where each
  post's hand-rolled byline was). Renders `By <a href={authorId}>{author}</a> · {authorTitle} · Updated {date} · {readTime}`.
- `src/layouts/BlogPostLayout.astro` — wraps `BaseLayout`, owns ALL blog schema
  (BlogPosting with Person author + optional FAQPage), normalizes `publishDate`,
  handles canonical/noindex/publish-gating. Post body is a `<slot />`. Post keeps its hero.

## Non-goals

- No creative/tone rewriting of article bodies.
- No new author bio *pages* (anchor to `/about#todd`).
- No change to pricing, booking, sitemap, or which URLs exist.
- Not touching the canonical-to-money-page pattern (8 posts) beyond preserving it.

## What the survey found (constraints the template MUST handle)

- **All 108 import `BaseLayout` directly.** No existing blog layout. 106 use `SchemaMarkup`.
- **`publishDate` in 3 incompatible formats**: plain string `"April 1, 2026"` (66),
  `new Date("October 12 2026")` (38), ISO `'2026-05-24'` (4). **Normalization hazard #1.**
- **Two schema mechanisms, often both**: `SchemaMarkup` component (104) + inline
  `<script>` FAQ (46); 4 posts are inline-`articleSchema`-only with NO component.
- **Author-as-Organization mismatch is systemic**: inline schema always says
  `{"@type":"Organization","name":"The Valley Clean Team"}` even in the 5 posts
  whose `author` const is already `"Todd Frederickson"`. Author is effectively
  broken everywhere today.
- **Publish gating**: 38 posts have `isPublished` gate + `export const prerender = false`
  + `noindex={!isPublished}` + a "Coming Soon" branch. 8 have a legacy unused `draft`.
- **Body is raw HTML** in 108/108 (→ must be a `<slot>`), except 1 data-driven
  checklist post.
- **4 byline markup variants** to consolidate.
- **Bugs to FIX not preserve**: 5 posts have `heroImage = "C:/Program Files/Git/..."`
  (broken Windows path) flowing into `ogImage` + `<img>`.

### Outliers (highest migration risk — handle individually, NOT in the batch sweep)

1. `pre-listing-cleaning-checklist-...-realtors` — data-driven `checklistItems` body.
2. `house-cleaning-cost-huntsville-al`, `why-19-dollar-cleaning-costs-more-shoals` —
   no `SchemaMarkup`, inline `articleSchema` + `faqSchema`, computed `faqs` prop.
3. `spring-cleaning-nashville-survival-guide`, `deep-cleaning-cost-shoals-guide` —
   inline `articleSchema`, no `SchemaMarkup`.
4. The 3 competitor "vs" posts — `faqs`-array + visible `faqs.map` variant.
5. 5 broken-`heroImage` posts.

## Template contract (`src/layouts/BlogPostLayout.astro`)

Props (all optional unless noted):

| Prop | Type | Behavior |
|---|---|---|
| `title` * | string | → BaseLayout title + `<h1>` |
| `description` * | string | → BaseLayout description |
| `publishDate` * | string \| Date | **Normalized internally** via `new Date(publishDate)` — accepts all 3 formats. |
| `modifiedDate` | string \| Date | Falls back to publishDate. |
| `author` | string | Default `"Todd Frederickson"`. |
| `authorId` | string | Default `https://thevalleycleanteam.com/about#todd`. |
| `authorTitle` | string | Default `"Co-Founder"`. |
| `readTime` | string | Optional; byline hides `•` if absent. |
| `ogImage` | string | Default org og-image; **reject/ignore any `C:/` path**. |
| `canonicalUrl` | string | Optional canonical override (8 posts). |
| `noindex` | boolean | Optional; drives BaseLayout noindex. |
| `category` | string | Optional badge label. |
| `faqs` | `{question,answer}[]` | Optional → renders ONE canonical visible FAQ + FAQPage schema from a single source. |

Responsibilities:
- One canonical **byline** (`By <a href={authorId}>{author}</a> · {authorTitle} · Updated {date} · {readTime}`).
- One canonical **BlogPosting schema** with `author` = the `Person` (`@id`, `worksFor` → `#organization`), NOT Organization.
- One canonical **FAQ** path (schema + visible from the same `faqs` array) — kills the 3-way FAQ divergence.
- Raw body via `<slot />`.
- Publish-gating (`isPublished` → noindex + Coming Soon) handled in ONE place.

## Execution plan (batched)

- **PR #2 (this one) — pilot:** `about.astro` fix (done) + `BlogPostLayout.astro` +
  migrate **5 pilot posts** (the money/comparison posts). Build + `validate-schema` gate.
  Produce the **staleness flag-list** (below) but change no prose.
- **PR #3..N:** migrate remaining ~103 in batches of ~20, each build-gated.
  Outliers migrated individually, reviewed one-by-one.

### 5 pilot posts
`house-cleaning-cost-huntsville-al`, `house-cleaning-cost-nashville-tn`,
`house-cleaning-cost-alabama`, `maidpro-vs-the-valley-clean-team-huntsville`,
`why-19-dollar-cleaning-costs-more-shoals`.
(Note: 2 of these are outliers #2 — deliberately included so the template is proven
against the hardest shapes first.)

## Staleness flag-list (populated during migration; prose UNTOUCHED)

- [x] broken `heroImage` Windows paths (5 posts) — **FIXED** (commit 825d480):
  repointed `C:/Program Files/Git/.../Cleaningpic2--1--307.webp` → the real
  `/images/services/Cleaningpic2--1--307.webp`. These were 404-in-prod.
- [x] hard-coded visible byline dates that didn't match the `publishDate` const —
  **FIXED** during migration: every `<BlogByline>` is now `date={publishDate}`,
  single-sourced, so the visible date can no longer drift from the const.

### ⚠️ Stale TVCT floor prices vs the live money page (`/pricing`) — DECISION PENDING

Audit (2026-07-17) against the money page's canonical floors — **standard $176 /
deep $276 / move-in-out $351** (from `src/pages/pricing.astro` PRICE_TABLE +
pricing cards). Found **~40 TVCT-branded price claims across ~30 posts that
UNDERSTATE the current floor** (all in TVCT "Our Pricing"/CTA/badge/meta blocks,
NOT market-range context, which was excluded). Prose deliberately NOT changed —
this is Todd's pricing call. Groups:

- **"pricing starts at $125"** (should be $176) — ~20 posts: back-to-school,
  getting-your-kitchen-holiday-ready, fall-deep-cleaning, end-of-summer-deep-clean,
  how-early-should-i-book, how-to-prepare-your-nashville-home-for-allergy-season,
  how-professional-cleaning-reduces-indoor-air-pollution, reclaiming-your-weekends,
  short-term-rental-cleaning-shoals, preparing-your-guest-room, setting-up-a-cleaning-schedule,
  signs-its-time-to-fire, the-military-precision-approach, why-we-value-military-precision,
  surviving-the-post-thanksgiving, year-in-review-shoals, black-friday-special,
  reliable-cleaning-company-{athens,florence,decatur}.
- **"starting at $135"** (should be $176) — reliable-cleaning-company-{madison,huntsville} (incl. meta + FAQ).
- **"starting at $150"** (should be $176) — reliable-cleaning-company-nashville-tn (incl. meta).
- **"Deep cleans from $175"** (should be $276) — hidden-cost-of-dirty-house (5 spots),
  why-youre-always-exhausted, why-your-home-never-stays-clean, why-cleaning-services-disappoint.
- **"From $120/visit"** recurring (should be $176) — is-hiring-house-cleaner-worth-it (badge + meta).
- **"Our Pricing" tier blocks** listing standard/deep/move-out ALL below floor
  ($125/$200/$250 or $135/$225/$275 or $150/$250/$300) — house-cleaning-cost-{athens,decatur,madison,florence,nashville-tn,alabama}.
- **Stale meta descriptions** advertising TVCT rates — house-cleaning-cost-nashville-tn
  ("standard $130, deep $220, move-out $280" + schemaTitle "$130–$350"),
  is-hiring-house-cleaner-worth-it ("deep from $200, recurring from $120"),
  house-cleaning-cost-{athens,decatur,madison,florence} metas.

**NEEDS-JUDGMENT (may be intentional scoped floors, not errors):**
- **$199 move-out "for standard apartments"** — losing-your-security-deposit,
  maidpro-athens-vs, move-out-cleaning-athens-al, move-out-cleaning-huntsville-guide.
- **$225 Nashville move-out** (condos/apartments) — move-out-cleaning-nashville-tn.
- **$325 move-in-out** in the two otherwise-correct posts (house-cleaning-cost-huntsville-al,
  why-19-dollar-costs-more-shoals) — $26 under the $351 floor.

**MATCH (already correct — cite $176/$276/$351):** bear-brothers-vs, maidpro-vs-huntsville,
maidpro-athens (floors), moving-to-huntsville-first-week-checklist, house-cleaning-cost-huntsville-al
(std/deep), why-19-dollar-costs-more-shoals (std/deep).

NOTE: these prices are also independently a **conversion/revenue** issue (the site
advertises below its own floor), separate from the migration. See [[content-plan-briefs-may-be-stale]].

## Verification

- `npx astro build` passes. (Note: `npm run validate-schema` referenced in CLAUDE.md
  is not a real script — the build + dev-render checks are the gate.)
- Migrated posts: byline shows "By Todd Frederickson · Co-Founder" linking `/about#todd`;
  BlogPosting JSON-LD author is the `#todd` Person; FAQ schema still emits.
- `/about#todd` and `/about#christen` anchors resolve.
