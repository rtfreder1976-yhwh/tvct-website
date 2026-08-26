# Blog Template Migration — Audit & Re-Plan

Date: 2026-08-25
Status: **AUDIT COMPLETE — migration is already finished. No migration work remains.**
Supersedes the counts in `docs/plans/blog-template-migration.md`.

---

## TL;DR

**The "~103 posts remaining" figure is wrong. The real number is 0.**

All **107** `.astro` files in `src/pages/blog/` already import *and render* `BlogPostLayout` +
`BlogByline`. Zero posts still hand-roll a layout, byline, or schema. The migration that
`blog-template-migration.md` describes as "pilot done, 103 to go" was in fact completed at some
point after that document was last edited; the plan doc simply was never updated.

There is no batch plan to write, because there is nothing to batch. What this audit found
instead is **two unrelated, real defects** worth a small follow-up PR (see
[Residual issues](#residual-issues-the-only-actionable-findings)).

---

## 1. What the existing plan says

`docs/plans/blog-template-migration.md` (created 2026-07-16, status line still reads
"PLAN — pilot not yet started") describes a two-part GEO/E-E-A-T effort:

1. Extract a shared `BlogPostLayout.astro` so ~108 standalone posts stop hand-rolling byline /
   JSON-LD / publish-gating / date handling — the root cause of recurring drift.
2. Attribute posts to a real named author (Todd Frederickson) as a reusable `Person` entity
   (`@id: /about#todd`, `worksFor` → `#organization`) with a **visible** byline, not just schema.

Locked decisions: named real author; schema *and* visible byline; template-then-migrate-in-batches;
structure-only (never touch prose); 5-post pilot including the 2 hardest outliers; the layout owns
byline + schema while each post **keeps its own custom hero**.

Its stated execution plan was: PR #2 = layout + 5 pilot posts, then PR #3..N = remaining ~103 in
batches of ~20, outliers handled individually.

**That execution plan has already been carried out in full.** The document's own "Staleness
flag-list" section is partly updated (two items marked `[x] FIXED` with a commit ref), which
confirms the doc was edited mid-migration and then abandoned — the `Status:` header and the
"~103 remaining" arithmetic were never refreshed.

---

## 2. The target pattern

### `src/layouts/BlogPostLayout.astro`

Wraps `BaseLayout` with `schemaType="none"` and emits article schema itself via
`SchemaMarkup type="article"`, so `BlogPosting` carries a real `Person` author.

| Prop | Type | Notes |
|---|---|---|
| `title` **(req)** | string | `BaseLayout` `<title>` / meta |
| `description` **(req)** | string | meta description |
| `schemaTitle` | string | headline for BlogPosting; usually longer/keyword-rich than `title` |
| `publishDate` **(req)** | `string \| Date` | normalized internally by `toIso()` — accepts all 3 legacy shapes |
| `modifiedDate` | `string \| Date` | falls back to `publishIso` |
| `author` | string | default `"Todd Frederickson"` |
| `authorId` | string | default `https://thevalleycleanteam.com/about#todd` |
| `authorTitle` | string | default `"Co-Founder"` |
| `ogImage` | string | default org og-image; **`C:/`-style paths are rejected** by `safeOgImage` regex |
| `canonicalUrl` | string | canonical override (used by the blog→money-page posts) |
| `noindex` | boolean | drives BaseLayout noindex; how publish-gating suppresses indexing |
| `faqs` | `{question,answer}[]` | single source → emits ONE `FAQPage` JSON-LD block |

Body is a plain `<slot />`, so each post keeps its bespoke hero and raw HTML.

Two defenses worth noting, because they are the reason bulk-editing these posts is now low-risk:

- `toIso()` returns `undefined` on an unparseable date rather than emitting `"Invalid Date"`.
- `safeOgImage` tests `/^[a-zA-Z]:[\\/]/` and falls back to the org og-image, so the old
  `C:/Program Files/Git/...` hero paths can never reach `ogImage` or schema again.

### `src/components/BlogByline.astro`

Presentation only — emits no JSON-LD. Props: `author`, `authorUrl` (default `/about#todd`),
`authorTitle`, `date` (any of the 3 shapes), `readTime`, `variant: "light" | "dark"`.
Renders `By <a rel="author">Todd Frederickson</a> · Co-Founder · Updated <time datetime=…>…</time> · {readTime}`.
`dateAttr` stays `null` for unparseable values so no bogus `<time datetime>` is ever emitted.

### Concrete "after" shape

From `src/pages/blog/house-cleaning-cost-huntsville-al.astro` (a PR #100 pilot post):

```astro
---
import { PRICING } from '../../data/claims';
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';
import BlogByline from '../../components/BlogByline.astro';

const publishDate = '2026-05-24';
const readTime = '10 min read';

// FAQ: single source of truth — BlogPostLayout emits the FAQPage schema from
// this array (no more separate hand-written faqSchema object to drift).
const faqs = [ { question: "...", answer: "..." }, /* … */ ];
---

<BlogPostLayout
  title={`House Cleaning Cost in Huntsville, AL: From ${PRICING.regular.display}, Firm`}
  schemaTitle="How Much Does House Cleaning Cost in Huntsville, AL? (2026 Pricing Guide)"
  description={`Regular from ${PRICING.regular.display}, …`}
  publishDate={publishDate}
  faqs={faqs}
>
  <!-- Hero (post-owned, unchanged) -->
  <section class="pt-32 pb-16 px-6 bg-gradient-to-br from-[#1a1a2e] …">
    …
    <BlogByline date={publishDate} readTime={readTime} variant="dark" />
    …
  </section>
  <!-- body … -->
</BlogPostLayout>
```

The corresponding "before" shape no longer exists anywhere in the repo — there is no
un-migrated file left to diff against. Reconstructed from the original plan's survey, it was:
`import BaseLayout` directly + a separate `<SchemaMarkup>` call in the body + a hand-written
byline `<span>` with a **hard-coded** date string + often a second inline
`<script type="application/ld+json">` holding a duplicate `faqSchema`, with the JSON-LD `author`
always `{"@type":"Organization","name":"The Valley Clean Team"}` even where the post's own
`author` const said `"Todd Frederickson"`.

---

## 3. Inventory — exact counts

Total `.astro` files in `src/pages/blog/`: **107** (flat directory, no subdirectories).
Note: `src/pages/blog/index.astro` is *not* in this directory — the blog index lives elsewhere,
so all 107 are actual posts.

| Category | Count | Basis |
|---|---:|---|
| **MIGRATED** | **107** | imports `BlogPostLayout` **and** renders `<BlogPostLayout` |
| **NOT MIGRATED** | **0** | — |
| **SPECIAL CASE** (migrated, but structurally distinct) | 37 | publish-gated; see below |

Verification signals, all run across the 107 files:

| Check | Result |
|---|---|
| imports `BlogPostLayout` | 107 / 107 |
| renders `<BlogPostLayout` | 107 / 107 |
| imports `BlogByline` | 107 / 107 |
| renders exactly one `<BlogByline` | 107 / 107 (no file has 0 or 2+) |
| passes `date={…}` to the byline | 107 / 107 — **no hard-coded visible dates remain** |
| still imports `BaseLayout` directly | **0** |
| still imports `SchemaMarkup` directly | **0** |
| inline `application/ld+json` `<script>` | **0** |
| inline `"@type": "Organization"` author | **0** |
| broken `C:/` or `C:\` paths | **0** |
| hand-rolled byline markup | **0** (5 files match `/By /` but all are body prose, e.g. `<h3>By Home Size</h3>`, `<p>By opting for our services…</p>` — not bylines) |

Prop adoption across the 107:

| Prop | Files using |
|---|---:|
| `schemaTitle` | 103 |
| `faqs={…}` | 51 |
| `variant="dark"` on byline | 98 |
| `modifiedDate` | 22 |
| `canonicalUrl` | 8 (matches the documented blog-canonical-to-money-page pattern) |
| `ogImage` | 7 |

### SPECIAL CASE detail — the 37 publish-gated posts

These are fully migrated but keep a scheduled-publish gate. Canonical shape:

```astro
export const prerender = false;          // SSR so the gate re-evaluates per request
const isPublished = new Date().getTime() >= publishDate.getTime();
…
  description={isPublished ? "real description" : "Coming Soon: …"}
  noindex={!isPublished}
…
  {isPublished ? ( /* article */ ) : ( /* "Article Coming Soon!" panel */ )}
```

`prerender = false` count (37) and `isPublished` count (37) match exactly — every gated post is
SSR, and no post is SSR without a gate. The gate is expressed entirely through props
`BlogPostLayout` already supports (`noindex`, plus ternaries on `title`/`description`), so nothing
here is unsupported by the shared layout.

The gated 37: back-to-school-cleaning-reset…, bi-weekly-vs-monthly…, black-friday-special…,
carpet-upholstery-care…, eco-friendly-cleaning-products…, end-of-summer-deep-clean…,
fall-deep-cleaning…, getting-your-kitchen-holiday-ready…, giving-the-gift-of-clean…,
how-early-should-i-book…, how-much-value-does-a-deep-clean-add…,
how-professional-cleaning-reduces-indoor-air-pollution, how-to-budget-for-house-cleaning-services-in-2026,
how-to-maintain-a-clean-home-with-pets…, how-to-organize-and-sanitize-mudrooms…,
how-to-prepare-your-nashville-home-for-allergy-season, is-a-first-time-deep-clean-necessary…,
keeping-your-floors-and-entryways-clean…, kitchen-appliance-deep-cleaning…,
last-minute-touches-before-your-in-laws-arrive, move-out-cleaning-costs-in-nashville-2026…,
move-out-cleaning-requirements-for-huntsville-property-managers, preparing-your-guest-room…,
reclaiming-your-weekends…, setting-up-a-cleaning-schedule-for-the-new-year,
short-term-rental-cleaning-in-the-shoals…, signs-its-time-to-fire-your-current-cleaning-service,
surviving-the-post-thanksgiving-mess-kitchen-reset, the-cost-of-commercial-cleaning-services-in-nashville-in-2026,
the-military-precision-approach…, the-ultimate-pre-party-cleaning-checklist,
top-5-hidden-areas-to-focus-on…, what-does-bonded-and-insured-mean…,
what-is-included-in-a-professional-move-in-clean, why-baseboards-and-blinds-dusting…,
why-we-value-military-precision…, year-in-review-our-commitment-to-the-shoals-community-in-2027.

### The original plan's five "outliers" — all resolved

| Outlier from the plan | Current state |
|---|---|
| `pre-listing-cleaning-checklist-…-realtors` (data-driven body) | migrated; layout + single byline |
| `house-cleaning-cost-huntsville-al`, `why-19-dollar-cleaning-costs-more-shoals` (inline article+faq schema) | migrated; `faqs` prop, no inline JSON-LD |
| `spring-cleaning-nashville-survival-guide`, `deep-cleaning-cost-shoals-guide` (inline articleSchema) | migrated; no inline JSON-LD |
| 3 competitor "vs" posts (`faqs`-array + visible `faqs.map`) | migrated |
| 5 broken-`heroImage` `C:/` posts | fixed; 0 `C:/` paths repo-wide in blog, plus `safeOgImage` guards regressions |

---

## 4. Risks

**Migration risk is zero, because there is no migration left to perform.** Every risk the
original plan enumerated (3 incompatible date formats, dual schema mechanisms, 4 byline variants,
author-as-Organization, publish-gating, broken hero paths) has been resolved, and the layout
carries permanent guards (`toIso`, `safeOgImage`, single `faqs` source) against reintroduction.

Risks that remain are about **future drift**, not this migration:

1. **New posts can bypass the template.** Nothing in CI enforces that a new
   `src/pages/blog/*.astro` uses `BlogPostLayout`. A hand-rolled post would reintroduce exactly
   the drift this work eliminated. *Mitigation: a cheap grep-based validator (below).*
2. **New posts can be orphaned.** Per the repo's known orphan-pages rule, a post must be added to
   `src/constants/blogPosts.ts` or the `/blog` index won't link it. Also unenforced — and this has
   already regressed twice (see Residual issues).
3. **`prerender = false` on 37 posts is an SSR dependency.** These are the only blog pages that
   are not static. They render per-request on Vercel. Not a bug, but worth knowing before any
   future move to a fully static output target, which would freeze the gates at build time.
4. **FAQ schema is emitted on 51 posts.** Per repo memory, Google removed FAQ rich results in
   May 2026, so this JSON-LD earns nothing in Google SERPs today. It is harmless and may still
   feed AI/GEO extraction — but do not treat it as a ranking lever, and do not expand it as one.
5. **Stale price claims are still open and are NOT a template problem.** The original plan's
   staleness flag-list — ~40 TVCT-branded price claims across ~30 posts that understate the
   current floors — remains a **pending pricing/revenue decision for Todd**, deliberately excluded
   from structural work. Note the plan's audit was written against a `$176` standard floor;
   `claims.ts` now says **regular from $200 / deep from $276 / move-in-out from $351 / Airbnb $125 /
   post-construction $526**, so that list needs re-running against current canonical values before
   anyone acts on it. Do not fold this into a template PR.

---

## 5. Recommended plan

The batch plan the original doc called for is **cancelled — there is nothing to batch.**
Replace it with a small, bounded follow-up.

### Batch 0 — Update the stale plan doc (1 file, 5 min)

Edit `docs/plans/blog-template-migration.md`: change `Status:` from "PLAN — pilot not yet started"
to `COMPLETE (verified 2026-08-25)`, correct the "~103 remaining" arithmetic to 0, and link this
audit. Leave the staleness flag-list intact — it is still live work, just not *this* work.

### Batch 1 — Fix the 2 orphaned posts (2 entries, ~15 min)

See below. Small, self-contained, real user-facing impact.

### Batch 2 — Add drift guards (optional, ~30 min)

Two grep-level checks, wired into the existing `validate:claims` step or a sibling script:

- every `src/pages/blog/*.astro` must match `<BlogPostLayout` — fails the build otherwise;
- every `src/pages/blog/*.astro` basename must appear as a `slug` in `src/constants/blogPosts.ts`.

This converts both known failure modes from "someone notices in an Ahrefs crawl months later"
into a build error. Recommended, because it is the only thing standing between the current clean
state and the next round of drift.

### Explicitly NOT in scope

Re-pricing the ~30 posts with stale floors. That is Todd's pricing call, needs re-auditing against
the current `claims.ts` values, and must not ride along in a structural PR.

---

## Residual issues (the only actionable findings)

### A. Two orphaned blog posts

107 post files vs **105** distinct slugs in `src/constants/blogPosts.ts`. Two live pages are not
listed, so the `/blog` index never links them — the exact orphan pattern documented in repo memory:

| Orphaned file | Note |
|---|---|
| `src/pages/blog/commercial-cleaning-nashville-tn.astro` | no `blogPosts.ts` entry at all |
| `src/pages/blog/move-out-cleaning-huntsville-al.astro` | near-miss: `blogPosts.ts` line 554 has `slug: "move-out-cleaning-huntsville-guide"`, which is a **different, also-existing file**. So `-guide` is listed and `-al` is orphaned. |

The `move-out-cleaning-huntsville-al` / `-guide` pair also deserves a cannibalization look — two
posts on the same query in the same city. Worth checking whether one should be canonicalized to
the other rather than simply both being listed.

No entry in `blogPosts.ts` points at a missing file, so there are **no broken links** in the
index — purely missing ones.

### B. Plan doc status header is wrong

Covered by Batch 0.

---

## Verification performed

- `npm run check` → **0 errors, 0 warnings**, 506 hints (hints are pre-existing `astro(4000)`
  inline-script notices, unrelated to blog posts).
- File-level greps across all 107 posts for every migration signal listed in §3.
- Slug diff of `src/pages/blog/*.astro` basenames against `slug:` values in
  `src/constants/blogPosts.ts`.
- No files were modified by this audit.
