# Marketing Stack — The Valley Clean Team

_Initialized 2026-08-22 by /start-here (fresh start, second pass). Updated 2026-08-23 for brand-brief.md._

## Business

**Authoritative brand brief: `brand/brand-brief.md` (Todd, 2026-08-23).** Premium *residential* cleaning company first; commercial is a secondary segment. We charge more because of expertise, systems, accountability, consistency, and the customer experience — we do NOT compete primarily on price. Voice: "make an expert company sound human, not a cleaning company sound fun." Premium residential + commercial cleaning. North Alabama (the Shoals, Huntsville) and Middle Tennessee (Nashville). Veteran-owned and woman-owned. Firm price quoted on the first call from a published square-footage rate card.

**Goal:** GROW REVENUE. Traffic exists (~43K search impressions/mo); phone-click conversions are near zero. Fix conversion, not reach.

## Systems of record

| System | Role | Status |
| ------ | ---- | ------ |
| **BookingKoala** | Booking system of record. Residential CTAs are phone-first (tel: links); commercial CTAs link `/booknow/office_cleaning`. Native GA4/Pixel events. | ✓ authoritative |
| **Stripe** | Reliable financial source of truth (not QuickBooks). | ✓ connected (MCP) |
| **GA4** | Site analytics; `phone_click` is the conversion event. Filter to AL/TN + production hostname only. | Not currently connected |
| **Replicate** | Image/video generation for /creative. | ✓ connected (MCP) |
| **Google Business Profile** | Local pack presence (Tuscumbia pin). 4.9 / 148 reviews. | ✓ live |
| **Github** | Patch and version control/checks, repos live here | ✓ live |
| **Vercel** | Hosting for the Astro site; env keys live here, no local `.env`. | ✓ live |
| **Email ESP** | — | ○ not connected (GHL social-posting API available, unused)|
| **Social scheduling** | — | ○ not connected (GHL social-posting API available, unused) |

## Other MCP servers available

stripe, posthog, replicate, firecrawl, local-falcon, apollo, n8n, zapier, notion, github, playwright, claude-in-chrome, gmail, google-calendar, gohighlevel, .

## Retired — do not rebuild (per CLAUDE.md)



## Hard constraints every skill must obey

- `src/data/claims.ts` is the only source for prices, reviews, checklist count, customers served, quote SLA.
- `CLAUDE.md` claim guardrails: no same-day/emergency, no clinical credentials, no "luxury" as the general position, no retired prices ($99/$119/$129/$135/$149/$175/$176/$225/$275/$400).
- "1,500+" = customers served, never cleanings completed.
- Canonical phones: AL (256) 826-1100 · TN (615) 510-1427.
- `brand/brand-brief.md` copy rules: no oversell words in customer copy (best/premium/luxury/exceptional/superior/unmatched/unparalleled/elite/five-star), none of the 15 banned generic cleaning phrases, witty-not-funny, run the 10-question VCT Voice Test before publishing anything.
