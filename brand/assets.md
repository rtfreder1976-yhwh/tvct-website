# Asset Registry — The Valley Clean Team

_Initialized 2026-08-22 by /start-here (fresh start). Append-only. Every skill that creates an asset adds a row._

## Active

| Asset | Type | Date | Campaign | Status | Notes |
| ----- | ---- | ---- | -------- | ------ | ----- |
| Commercial Hiring Sheet | Lead magnet (gated page) | 2026-08-28 | commercial-hiring-sheet | ✅ LIVE | Shipped as a PAGE not a PDF: gate `/commercial-hiring-sheet` (indexable, 3-field form) → `/commercial-hiring-sheet/read` (noindex + print CSS). Reuses `/quote-submit` with `formType`; n8n `Which Form?` branch keeps downloads OUT of the Quotes pipeline and off Todd's phone. Both branches verified (n8n exec 29/30). DEPLOYED + verified in prod 2026-08-28 (n8n exec 31, real webhook: hiring-sheet branch taken, NO opportunity, NO Todd SMS). Cleanup owed: GHL contact WD0j0YLk3GJFXazcjFxX |
| Quote follow-up sequence (4 emails) | Email sequence | 2026-08-24 | ghl-esp | draft | Replaces blocked legacy Quoting Follow up folder; Day 0/2/5/9, no scarcity, phone-first, signed Todd; 3 subject variants each. campaigns/ghl-esp/quote-follow-up/ — pending Todd/Christen review, then push to GHL as new folder |
| GHL legacy template audit | Audit | 2026-08-24 | ghl-esp | done | 38 templates: 29 BLOCK, 9 REWRITE, 0 salvageable; worst: $97 offer everywhere. campaigns/ghl-esp/template-audit-2026-08-24.md |
| GSC baseline (before metas) | Measurement | 2026-08-24 | exact-price-metas | captured | 18-page rewrite set = 113 clicks / 26.8K impr / 0.42% CTR; re-pull ~2026-09-21. campaigns/exact-price-metas/gsc-baseline-2026-08-24.md |
| Keyword plan | Strategy | 2026-08-23 | foundation | draft | CTR-first: 12+ money-page title/meta rewrites ranked, gaps, teach-content topics; live SERP checks. brand/keyword-plan.md |
| Voice copy samples (10 formats) | Copy | 2026-08-23 | foundation-voice-samples | draft v3 | Christen reviewed v1, Todd reviewed v2 (owner roles, price drivers, re-clean wording, wrong-fit); v3 awaiting sign-off; hero, pricing panel, About, GBP, FB, email, SMS, review replies, blog intro, fit section. campaigns/foundation-voice-samples/voice-copy-samples.md |
| Brand brief (voice & website copy) | Brand foundation | 2026-08-23 | foundation | approved | AUTHORITATIVE source from Todd; voice-profile.md and positioning.md derive from it. brand/brand-brief.md |
| Positioning (5 angles, ⭐ The Experts Who Happen to Be Likable) | Brand foundation | 2026-08-23 | foundation | draft | Re-ranked to brand-brief.md: expert-company-sounds-human primary, Posted Price as transparency proof (angle ②, still owns the SERP); 9 competitors scraped live 2026-08-22, not re-run; 12-ad matrix re-seeded in brand/positioning.md |
| Voice profile | Brand foundation | 2026-08-23 | foundation | draft | Updated to brand-brief.md; witty-not-funny; expert-company-sounds-human; 11 reference brands; VCT Voice Test. Provisional pending Christen. brand/voice-profile.md |
| Creative kit | Brand foundation | 2026-08-23 | foundation | draft | Setup mode; authoritative peach/charcoal palette from brand guide (navy/cream/brass was wrong); typography + logo + photo direction pulled from repo. brand/creative-kit.md |
| Audience profile | Brand foundation | 2026-08-23 | foundation | draft | Built from brief + positioning + verified Stripe/GSC/PostHog facts; inferences marked. brand/audience.md |
| GBP/FB/IG social batch 01 (15 posts) | Social | 2026-08-24 | gbp-facebook-batch-01 | draft | 8 GBP + 4 FB + 2 IG + 1 LI; teach-one-thing + exact-price patterns; 3-week schedule. Pending Todd/Christen review |
| Competitor intel | Brand foundation | 2026-08-23 | foundation | draft | Ported from positioning.md live-verified table (2026-08-22) + salvaged 2026-05 notes; per-competitor cards + saturation map. brand/competitors.md |

## Retired

| Asset | Retired | Reason |
| ----- | ------- | ------ |
