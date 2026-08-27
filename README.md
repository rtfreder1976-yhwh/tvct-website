# The Valley Clean Team Website

Astro/TypeScript website for The Valley Clean Team, serving cleaning customers across Alabama and Tennessee.

## Architecture at a glance

- **Booking/quotes:** BookingKoala is the customer quoting and booking system.
- **Business claims:** `src/data/claims.ts` is the canonical source for repeated pricing, review, checklist, ownership, performance, and compliance claims.
- **Deployment:** Vercel.
- **Analytics dashboard:** Search Console and GA4 where configured; the legacy GHL lead-analytics fan-out is retired (GoHighLevel itself is the current ESP/CRM — it is the old event data that is untrustworthy, not the platform).
- **Email/CRM:** GoHighLevel is the current ESP/CRM (decided 2026-08-24). The site itself does not write to it — capture currently flows BookingKoala → Zapier → GHL.
- **Retired systems:** Outscraper, and the old GHL/LeadConnector website wiring (the `/api/submit-form` webhook fan-out and booking-heuristic events). Do not restore that wiring from history. New site-owned capture feeding GHL is permitted once deliberately designed — see CLAUDE.md §2.

See `PROJECT_CONTEXT.md` and `CLAUDE.md` for current repository rules and business guardrails.

## Requirements

- Node.js 22.12+
- npm

## Development

```bash
npm install
npm run dev
```

## Validation

Before merging meaningful changes:

```bash
npm run check
npm run validate:claims
npm run build
```

GitHub Actions also validates generated JSON-LD and blocks retired Offer prices. Lighthouse and Vercel preview checks run on pull requests.

## Deployment

`main` deploys through the connected Vercel project. Use focused pull requests and merge only after the applicable validation checks are green.
