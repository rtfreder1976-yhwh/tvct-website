# Marketing Stack — The Valley Clean Team

_Rewritten 2026-08-22. The 2026-05-13 version was badly out of date — it listed PostHog and
Replicate as "not connected" when both are live, and treated GoHighLevel as the primary ESP after
the repo retired it._

## Systems of record

| System | Role | Status |
| ------ | ---- | ------ |
| **BookingKoala** | **Booking system of record.** Owns the booking flow, customer-facing pages, and native GA4/Pixel events. | ✓ authoritative |
| **Stripe** | Reliable financial source of truth (residential AOV ~$249). Not QuickBooks. | ✓ connected (MCP) |
| **PostHog** | Product/site analytics. Primary conversion instrumentation. | ✓ connected (MCP) |
| **Google Business Profile** | Local pack presence. **The current growth bottleneck.** | ✓ live (Tuscumbia) |
| **Vercel** | Hosting for the Astro site. | ✓ live |

## Retired — do not rebuild

Per `CLAUDE.md`, these are **retired systems for this website**. The `gohighlevel` MCP server is
still configured in `.mcp.json` and still works, but that is a *connection*, not a mandate — do not
route new website marketing through it.

| System | Status | Notes |
| ------ | ------ | ----- |
| **GoHighLevel / LeadConnector** | ⛔ retired for website | No webhooks, contact writes, or booking fan-out. MCP connection remains for legacy/CRM lookups only. |
| **Outscraper** | ⛔ retired | Quote dependencies removed. |
| **`/api/submit-form`** | ⛔ deleted | Verified 2026-08-22: `src/pages/api/` is empty. Production 404s. |
| **Generic website lead forms** | ⛔ do not create | Anything bypassing BookingKoala. |
| **Newsletter signup POST** | ⛔ disabled | No configured destination. Needs a provider + explicit contract first. |
| **Careers application** | ⛔ disabled | Awaiting a dedicated BookingKoala 2 cleaner form URL. Applicants must never enter customer CRM. |

## Connected MCP servers (2026-08-22 session)

| Server | Enhances |
| ------ | -------- |
| **posthog** | Analytics, funnels, conversion measurement |
| **stripe** | Revenue truth, AOV, commercial billing |
| **local-falcon** | Local rank grid scans ⚠️ *see coordinate warning below* |
| **apollo** | Commercial outreach / B2B prospect enrichment |
| **firecrawl** | Competitive scraping, SERP research |
| **n8n** | Workflow automation (the path for any GHL automation) |
| **replicate** | `/creative` image + video generation |
| **notion / asana** | Docs and task tracking |
| **github / vercel** | Repo + deploy |
| **perplexity** | Research |
| **playwright / claude-browser** | Site verification, BookingKoala branding work |
| **gohighlevel** | Legacy CRM reads only — see retired table |

Several plugin servers (Ahrefs, Klaviyo, Supermetrics, Slack, Figma, Linear…) are installed but
**unauthenticated**. They require OAuth via claude.ai connector settings or `claude mcp` in an
interactive session; they are unusable until authorized.

## Known data-quality traps

These have each caused a wrong diagnosis. Check before trusting a dashboard.

1. **Local Falcon's saved coordinates are wrong** — its record says Cullman, ~60mi from the real
   Tuscumbia GBP. Every dashboard scan is centered incorrectly. **Pass explicit lat/lng to API scans.**
2. **PostHog data before 2026-08-22 is inflated ~5×** — Lighthouse CI on `*.vercel.app` preview URLs
   minted 1,170 fake persons vs 241 real. Fixed in PR #167. **Verify tracking on the production
   hostname only.**
3. **~85% of raw visitors are datacenters** — always filter to AL/TN before reading any number.
4. **Booking funnel events are unreliable** — `booking_abandoned` over-fires ~2.9×/person;
   `booking_completed` fires zero. Booking conversion is effectively unmeasurable on-site; BK is
   now the native tracker.
5. **PostHog "sync failing" emails are warehouse connectors**, not site errors.

## Web platform

- **Site:** thevalleycleanteam.com — Astro, deployed on Vercel
- **Repo:** `C:\Users\rtfre\Projects\tvct-website`
- **Design tokens:** Peach `#FFA985` + charcoal `#333333`; Playfair Display + Inter.
  See `brand/creative-kit.md`.
- **Canonical claims:** `src/data/claims.ts` — single source for all prices/stats.
- **CTA architecture:** Residential CTAs are **phone-first** (`tel:` — AL 256-826-1100,
  TN 615-510-1427). Commercial CTAs keep the BookingKoala link.

## Current bottleneck

Not covered by any tool above, and worth stating plainly: **CTR, not ranking position, is the
constraint.** Positions 4–10 already convert at 0.29%; brand CTR is 21.6% while local CTR is 0.07%
— because TVCT is absent from the map pack outside the Shoals. `phone_click` instrumentation is
verified working but has recorded **zero real conversions** to date. A second GBP for the Huntsville
market is an open decision.
