# The Valley Clean Team — Project Context

_Last updated: 2026-08-25. This document describes the current `main` architecture. The historical GHL and Outscraper **workflows** are retired and must not be restored from old commits or closed PRs — note that GoHighLevel itself is current (ESP/CRM, decided 2026-08-24); it is the old wiring that is dead, not the platform. Where this file and `CLAUDE.md` disagree, CLAUDE.md wins._

## Business

The Valley Clean Team (TVCT) is a veteran-owned and woman-owned cleaning company serving Alabama and Tennessee markets.

- Tagline: “Life is messy. We’ve got this.”
- Alabama phone: (256) 826-1100
- Tennessee phone: (615) 510-1427
- Email: hello@thevalleycleanteam.com
- Website: https://thevalleycleanteam.com
- Repository: `rtfreder1976-yhwh/tvct-website`

## Stack

- Astro `^6.1.10`
- TypeScript `^5.9.3`
- Tailwind CSS
- Vercel deployment
- BookingKoala for customer quoting/booking

## Systems of record

### Business claims

`src/data/claims.ts` is the single source of truth for factual business claims. Do not hard-code competing prices, review counts, checklist counts, ownership claims, performance metrics, or clinical/compliance claims in pages/components.

Current verified values include:

- Regular cleaning: from $200
- Deep cleaning: from $276
- Move-in/out cleaning: from $351
- Airbnb turnover: from $125
- Post-construction: from $300
- Recurring discounts: weekly 30%, biweekly 25%, monthly 15%
- Weekly recurring minimum: $150
- Reviews: 4.9 average / 148 reviews
- Standard checklist: 44 items
- Customers served: 1,500+
- On-time arrival: 98%
- Repeat customers: 85%
- Average cleaner experience: 15 years
- Quote-response SLA: 2 business hours

If a value changes, update the canonical data first and make consumers derive from it.

### Customer quoting and booking

BookingKoala is the customer quoting/booking system.

- Residential quote/booking CTAs go to BookingKoala.
- Commercial quote traffic goes to BookingKoala.
- Shared `QuoteForm.astro` behavior is a BookingKoala CTA, not a local lead form.
- The old public `/api/submit-form` lead fan-out endpoint has been removed.
- **Outscraper is fully retired.** Do not add Outscraper quote dependencies back into the site.
- **GoHighLevel is current** — it is the ESP/CRM as of Todd's 2026-08-24 decision. What stays retired is the *old implementation*: the `/api/submit-form` ad-hoc webhook wiring and the booking-started/abandoned/completed browser-heuristic fan-out. Do not restore either from history.
- The site itself still does not write to GHL. Capture currently flows BookingKoala → Zapier → GHL. New site-owned capture feeding GHL through a deliberate integration is permitted and expected once designed — see CLAUDE.md §2 and project memory `quote-flow-redesign`. Any such integration needs an explicit capture contract, abuse controls, and no secrets in client bundles.

### Careers

Cleaner applications are owned by BookingKoala. `/careers` is a live 301 to the dedicated hiring form at `thevalleycleanteam.bookingkoala.com/hiring/form/careers` (confirmed live 2026-08-25). The old site-hosted application form stays retired.

Do not route cleaner applications through customer-lead infrastructure. That separation is the point of this section and it has not changed.

### Newsletter

The former blog newsletter form is disabled because no newsletter destination is currently configured. Do not reconnect it to a generic lead endpoint. If newsletter capture returns, give it a dedicated provider/contract and explicit consent flow.

## Content and claim guardrails

- No emergency/same-day cleaning promise.
- No clinical, medical-compliance, OSHA, bloodborne-pathogen, or disinfectant credential claims unless `claims.ts` is explicitly updated with verified support.
- Healthcare/dental/medical-office work must be described as non-clinical facility cleaning unless verified credentials are added.
- “Luxury” positioning is limited to the markets/services intentionally designated for it; the general brand stance is transparent value.
- “1,500+” means customers served, not cleanings completed.
- Do not revive retired prices such as $99, $119, $129, $135, $149, $175, $176, $225, $275, or $400 as Offer prices.

## Generated pages and structured data

Generated location/service routes normalize service pricing before copy or JSON-LD is emitted. `services.json` is not authoritative for current advertised price numbers.

Structured-data changes must preserve the CI invariant that retired prices do not appear in `Offer` or `PriceSpecification` objects. Custom-quote services should omit numeric Offer pricing rather than invent a placeholder amount.

## Admin dashboard

Admin browser sessions use a signed, expiring token; the browser cookie never contains `ADMIN_SECRET` itself.

- `ADMIN_SECRET` must be at least 16 characters.
- Browser sessions expire after 8 hours.
- Rotating `ADMIN_SECRET` invalidates existing sessions.
- `/admin/dashboard` uses live Search Console and GA4 data where configured.
- The legacy GHL lead-analytics fan-out is retired and must not be presented as current funnel truth. (GHL itself is current as the ESP/CRM — it is the old browser-heuristic event data that is untrustworthy, not the platform.)

## CI / verification

Before merging meaningful changes, run or verify:

```bash
npm run check
npm run validate:claims
npm run build
```

GitHub Actions additionally validates generated JSON-LD and retired Offer-price invariants. Lighthouse and Vercel preview checks should be green for substantive UI/route changes.

## Current deferred work

- ~~Connect `/careers` to the new BookingKoala 2 cleaner application URL when supplied.~~ **Done** — `/careers` 301s to the live hiring form (confirmed 2026-08-25).
- Decide whether a newsletter is still desired and, if so, choose a dedicated destination before re-enabling signup.
- Continue security-header hardening and production smoke testing as separate, current-main work.

## Historical material

Closed PRs and old commits can contain useful research, but they are not configuration documentation. In particular, do not copy old GHL webhook URLs, `$176` regular pricing, old review/checklist counts, same-day language, or clinical claims from repository history back into current code.

Copying an old GHL webhook URL is still prohibited even though GoHighLevel is the current ESP/CRM. A new integration gets designed deliberately; it does not get resurrected from a stale endpoint in history.
