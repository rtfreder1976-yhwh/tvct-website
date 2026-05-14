# Asset Registry — The Valley Clean Team

_Append-only log of marketing assets created by skills._

| Asset | Type | Date | Campaign | Status | Notes |
| ----- | ---- | ---- | -------- | ------ | ----- |
| The 2-Hour Quote Checklist | Lead magnet (checklist) | 2026-05-13 | 2-hour-quote-checklist | draft | 7 items + 3 bonus questions. Speed-themed; bridges to same-day booking. Built by /lead-magnet. |
| Opt-in landing page | Landing page (control + proof-led variants) | 2026-05-13 | 2-hour-quote-checklist | draft | ~1,180 words. Self-scored 59/70 (84%). 7 headline variants, 6 CTA variants, 5 A/B tests defined. Built by /direct-response-copy. |
| Welcome email sequence (7 emails) | Welcome + conversion sequence | 2026-05-13 | 2-hour-quote-checklist | draft | 12-day cadence (Tue/Thu 7:30 AM CT). 3 subject variants per email + A/B test recommendations. Sign-off rotation Todd/Christen. Built by /email-sequences. |
| Social distribution kit (13 pieces) | Multi-platform social | 2026-05-13 | 2-hour-quote-checklist | draft | IG (2 carousels + 2 reels) · Facebook (3 posts) · Nextdoor (3 hyperlocal posts) · LinkedIn (1 carousel + 2 personal-profile posts). 3-week schedule.md included. Built by /content-atomizer. |
| Creative kit (visual identity) | Brand creative system | 2026-05-14 | foundation | locked | Cream `#F5EFE6` + navy `#1B2A41` + brass `#C9A86B`. Editorial serif headlines, humanist sans body. Studio McGee / Kinfolk reference. `brand/creative-kit.md`. Built by /creative. |
| IG carousel-01 slide pack (9 slides, 1080×1080) | Instagram carousel graphics | 2026-05-14 | 2-hour-quote-checklist | draft | Combo direction: cream slides 1/2/8, navy numbered cards 3–7, photo-led CTA on 9. Generated via Replicate Nano Banana Pro. Path: `creative-output/social-graphics/instagram/feed/2hr-checklist-carousel-01/`. Slide 1 regenerated once to fix "take take" typo. |
| Lead-magnet PDF cover (1080×1350) | Lead-magnet visual | 2026-05-14 | 2-hour-quote-checklist | draft | Photo-led: clipboard on white-oak island, morning light. Title on cream paper in navy serif. Path: `creative-output/social-graphics/lead-magnet/checklist-cover-4x5-v1.png`. |
| Facebook post-01 header (16:9) | Facebook lead-post image | 2026-05-14 | 2-hour-quote-checklist | draft | Photo-led: phone on kitchen island showing the PDF cover, mug beside it, navy serif overline in negative space. Path: `creative-output/social-graphics/facebook/post-01-header-16x9-v1.png`. |
| Direction exploration round (3 variants) | Creative exploration archive | 2026-05-14 | 2-hour-quote-checklist | archived | Tested editorial cream / dark navy luxe / photo-led on slide-01 hook. Combo selected. Path: `creative-output/explorations/2hr-checklist/`. |
| 7 email templates uploaded to LeadConnector | GHL email templates (HTML) | 2026-05-14 | 2-hour-quote-checklist | deployed (API) | Brand-styled HTML, all 7 emails. Prefix `TVCT — 2hr Checklist #` in GHL Templates. Subject A variant set; preview text in preheader. Pushed via `scripts/ghl_push_templates.py`. IDs in `creative-output/_ghl_push_results.json`. |
| GHL plumbing: tag + 2 custom fields | LeadConnector contact infrastructure | 2026-05-14 | 2-hour-quote-checklist | deployed (API) | Tag `2hr-checklist-optin` (id XDbdW3DodlWipxHUadFo). Custom fields `contact.optin_zip` (id nr7YDOuinHvO6cJdPR2B) and `contact.optin_source` (id UnrSRwuERykbjiHWyrhN). Smoke-tested end-to-end. |
| GHL setup guide (form + workflow click-by-click) | Deployment doc | 2026-05-14 | 2-hour-quote-checklist | ready for execution | ~15–20 min UI checklist for the form + workflow steps the API can't do. Path: `campaigns/2-hour-quote-checklist/GHL-SETUP-GUIDE.md`. |
| Landing page `/checklist` on Astro site | Astro page (SSR via Vercel) | 2026-05-14 | 2-hour-quote-checklist | built, pending deploy | Single-route opt-in page using BaseLayout, brand creative-kit colors, FAQ schema, GHL submission via existing `/api/submit-form` webhook. New allowed source `2-Hour Quote Checklist Opt-in` added to API allowlist. Path: `src/pages/checklist.astro`. URL: thevalleycleanteam.com/checklist. |
| Round-2 social visual batch (18 images) | Multi-platform social graphics | 2026-05-14 | 2-hour-quote-checklist | draft | IG carousel-02 (7 slides, black/red exposé pivoting to cream on slides 6-7), 2 IG reel hook frames (9:16), 2 FB post headers (16:9), LinkedIn carousel (4 key slides), 3 Nextdoor hyperlocal photos. Paths under `creative-output/social-graphics/`. Spend ~$0.65. Results in `creative-output/_round2_results.json`. |

## Retired assets

| Asset | Retired | Reason |
| ----- | ------- | ------ |
| _(empty)_ | | |
