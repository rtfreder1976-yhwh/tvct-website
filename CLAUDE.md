# The Valley Clean Team — Repository Instructions

_Last updated: 2026-08-10. These rules describe the current architecture and override historical workflow notes in old commits or closed PRs._

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
- Post-construction from $300
- Weekly / biweekly / monthly discounts: 30% / 25% / 15%
- Reviews: 4.9 / 148
- Standard checklist: 44 items
- Customers served: 1,500+
- Quote response: 2 business hours

Generated and structured-data pricing must derive from canonical claims/pricing logic rather than stale `services.json` literals.

### 2. BookingKoala owns booking; residential CTAs are phone-first

Decision (Todd, 2026-08-21): residential CTAs direct prospects to CALL for a
quote — tel: links (AL 256-826-1100; TN pages dial 615-510-1427). Do not point
residential CTAs back at BookingKoala. Secondary CTAs next to a phone button
may link to /pricing (price research). Commercial CTAs keep their BookingKoala
link (/booknow/office_cleaning).

BookingKoala remains the system of record for booking. The vercel.json
redirects (/get-quote, /booking, /booknow → BK) and SchemaMarkup's
ReserveAction stay pointed at BookingKoala — legacy inbound links and machine
booking actions still work there; it is just no longer the residential front
door.

Do not restore:
- GoHighLevel / LeadConnector webhooks or contact writes
- Outscraper quote dependencies
- `/api/submit-form`
- GHL booking-started/abandoned/completed fan-out
- generic website lead forms that bypass BookingKoala

GoHighLevel and Outscraper are retired systems for this website.

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

- Wire `/careers` to the dedicated BookingKoala 2 cleaner application when its URL is available.
- Choose a newsletter destination before re-enabling signup.
- Continue production smoke tests/security-header hardening from current `main`.
