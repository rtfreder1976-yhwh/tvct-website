# The Valley Clean Team — Repository Instructions

_Last updated: 2026-08-24. These rules describe the current architecture and override historical workflow notes in old commits or closed PRs._

## Project

Astro/TypeScript website for The Valley Clean Team, a veteran-owned and woman-owned cleaning company serving Alabama and Tennessee.

Tagline: “Life is messy. We’ve got this.”

Canonical phones:
- Alabama: (256) 826-1100
- Tennessee: (615) 510-1427

## Non-negotiable architecture rules

### 1. Claims are centralized

`src/data/claims.ts` is authoritative for repeated factual business claims. Never create a second “canonical” price/review/checklist/performance constant in another file.

Current key values:
- Regular cleaning from $200
- Deep cleaning from $276
- Move-in/out from $351
- Airbnb turnover from $125
- Post-construction from $526
- Weekly / biweekly / monthly discounts: 30% / 25% / 15%
- Reviews: 4.9 / 148
- Standard checklist: 44 items
- Customers served: 1,500+
- Quote response: 2 business hours

Generated and structured-data pricing must derive from canonical claims/pricing logic rather than stale `services.json` literals.

### 2. Lead capture and booking (transition in progress)

Decision (Todd, 2026-08-24): TVCT is **moving away from BookingKoala's
customer-facing lead and quote forms**. BookingKoala remains the internal
system of record for booking/ops until a replacement ships, but it is no
longer the design target for customer-facing capture. New site-owned
lead-capture forms and flows — feeding GoHighLevel (the ESP/CRM) through
deliberate integrations — are now permitted and expected. Design them
intentionally: explicit capture contract, abuse controls, no secrets in
client bundles. The design framework and non-negotiables live in project
memory (quote-flow-redesign).

Until the replacement flow ships:
- Residential CTAs stay phone-first (decision 2026-08-21): tel: links,
  AL 256-826-1100; TN pages dial 615-510-1427. Secondary CTAs next to a
  phone button may link to /pricing.
- Commercial CTAs keep their BookingKoala link (/booknow/office_cleaning).
- The vercel.json redirects (/get-quote, /booking, /booknow → BK) and
  SchemaMarkup's ReserveAction stay pointed at BookingKoala.

Still retired — do not resurrect the old implementations as-is:
- the old `/api/submit-form` endpoint and its ad-hoc GHL webhook wiring
- Outscraper quote dependencies
- the old GHL booking-started/abandoned/completed browser-heuristic fan-out

These are prohibitions on reviving broken legacy code, not on building the
new capture flow. Outscraper stays fully retired; GoHighLevel is current
(ESP/CRM decision 2026-08-24) and new integrations with it are fine when
deliberately designed.

### 3. Careers are separate from customer leads

The careers application is intentionally disabled until a dedicated BookingKoala 2 cleaner form URL is provided. Cleaner applicants must never be posted into customer quote/CRM infrastructure.

### 4. Newsletter is intentionally disabled

There is no configured newsletter destination. Do not revive the old generic signup POST. A future newsletter implementation needs a dedicated provider and explicit signup contract.

## Claim guardrails

- Do not advertise emergency or same-day cleaning.
- Do not claim clinical/medical compliance, OSHA credentials, bloodborne-pathogen training, clinical protocols, or named disinfectant credentials unless verified and added to `claims.ts`.
- Medical/dental/healthcare pages describe non-clinical facility cleaning.
- “Luxury” is not the general brand position; use it only where the canonical positioning explicitly allows it.
- “1,500+” means customers served, never “cleanings completed.”
- Never publish retired Offer prices: $99, $119, $129, $135, $149, $175, $176, $225, $275, or $400.
- For custom-quoted commercial/specialty services, omit numeric JSON-LD Offer pricing instead of inventing a number.

## SEO and schema

Use existing layouts/components and the canonical generated location/service route where possible instead of creating bespoke duplicates.

Every structured-data claim must be supportable by the same canonical data used in visible copy. Do not add fake city-specific review objects, synthetic testimonials, employee counts, certifications, or operational guarantees solely for schema richness.

Meta titles/descriptions should be concise and truthful. Avoid creating coverage pages for cities/neighborhoods unless service coverage is actually confirmed.

## Performance and accessibility

For UI changes:
- preserve explicit image dimensions
- lazy-load below-fold media
- avoid unnecessary client JavaScript
- maintain keyboard/focus behavior
- do not introduce layout shift
- prefer existing shared components over page-specific copies

Maps should remain keyless embeds unless there is a verified need for the Google Maps JavaScript API and its key is properly restricted/configured outside source.

## Admin/security

Admin browser auth uses an 8-hour signed session token derived from `ADMIN_SECRET`; the cookie must never contain the secret itself.

Do not weaken authentication, expose secrets in URLs/logs/client bundles, or reintroduce raw credentials into cookies. Any new public API needs explicit abuse controls appropriate to its function.

## Validation before merge

At minimum:

```bash
npm run check
npm run validate:claims
npm run build
```

For PRs, also require the repository’s Schema & Claim Validation, Lighthouse, and Vercel checks to pass where applicable.

Do not “fix” CI by weakening retired-price or claim validators. Fix the source that generated the invalid output.

## Git hygiene

Use focused branches/PRs and conventional commit prefixes (`fix:`, `feat:`, `refactor:`, `chore:`, `docs:`). Do not revive stale branches wholesale; port still-useful ideas onto current `main` so canonical pricing, auth, and routing changes are preserved.

## Current intentional follow-ups

- Design and ship the replacement lead/quote capture flow (BK customer-facing forms being retired — decision 2026-08-24; framework in project memory: quote-flow-redesign).
- Wire `/careers` to the dedicated BookingKoala 2 cleaner application when its URL is available.
- Choose a newsletter destination before re-enabling signup.
- Continue production smoke tests/security-header hardening from current `main`.
