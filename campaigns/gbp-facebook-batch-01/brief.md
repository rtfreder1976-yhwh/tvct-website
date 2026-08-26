# GBP / Facebook Batch 01 — Brief

_Created 2026-08-24 by /content-atomizer (scoped to GBP, Facebook, Instagram, one LinkedIn). Status: ALL DRAFT — pending Todd/Christen review. Nothing published._

## Source content

- `campaigns/foundation-voice-samples/voice-copy-samples.md` (v3, Todd/Christen-reviewed):
  - **#4** — the GBP exact-price pattern: real price over the phone isn't a trick; square footage + type of cleaning set the price; not hourly, not a guess.
  - **#5** — the teach-one-thing pattern Christen liked: useful tip first, then the turn ("that one's a freebie; the checklist is the part we charge for").
  - **#3 / #10** — owners story and warm wrong-fit shapes, reused.
- `brand/voice-profile.md` platform table (GBP 30-60 words compressed; FB 40-90 neighbor-to-neighbor; LinkedIn commercial-only, no jokes) + Christen's Review Rules + Never Say block — all treated as binding.
- `brand/audience.md` language bank; `brand/creative-kit.md` for image notes (brushstroke card, peach-cloth photo scaffold, before/after scaffold, GBP 1200x900 4:3 spec).

## Extraction summary

| Element | Used in |
| --- | --- |
| Exact price = sq ft + type of cleaning; one call; number quoted = number billed (two exceptions, both yours) | gbp-01, gbp-02, fb-03, ig-02 |
| Teach one thing + freebie turn | gbp-03 (granite vs marble), gbp-04 (ceiling fan), gbp-05 (shower glass film), fb-01, fb-02, ig-01 |
| Warm wrong-fit ("we'd love to clean for everyone; we can't") | gbp-06 |
| Client-reported re-clean (tell us within 24 hours, scheduled right away, no charge) | gbp-07 |
| Owners (Todd, a veteran, runs the company; Christen makes sure you've heard of us; 1,500+ customers served) | gbp-08, fb-04 |
| Commercial: 3 quote inputs, written quote in 2 business hours | linkedin/commercial-01 |

All numbers from `src/data/claims.ts` at write time: from $200 / $276 / $351 / $125 / $526; 4.9 from 148; 44/57/49 checklists; $2M liability; 1,500+ customers served; 2 business hours; re-clean window 24 hours (client-reported).

## Algorithm-check findings (web search, 2026-08-24)

1. **GBP:** post cap is 1,500 characters, but mobile truncates at roughly **80-100 characters** behind a "more" link — every post here front-loads the idea into the first sentence. Photos: JPG/PNG, 720x720 minimum recommended, crops to 4:3 in feed (matches the creative kit's 1200x900 spec). Use the built-in CTA buttons ("Call now" pulls the listing's number). **Deviation from sample #4:** current guidance says a raw phone number in GBP post *text* risks post rejection — so these GBP drafts keep the number out of the body and lean on the Call now button. If Todd prefers the in-text number (sample #4 precedent), it can be re-added at posting time and may pass; the button version is the safer default. Sources: [Social Champ](https://www.socialchamp.com/blog/guide-to-google-business-profile-posts/), [Wiremo](https://wiremo.co/blog/google-business-profile-posts-best-practices/), [Emet Digital](https://emetdigital.com/blog/google-business-profile-post-best-practices/).
2. **Facebook:** page organic reach in 2026 averages **1-6% of followers**; text-only posts, native video/reels, and carousels perform best; fast comment replies push reach to the top of that band. Local **groups** see 20-40% reach — the recommendation threads ("anyone know a good cleaner?") in Huntsville/Madison/Shoals groups are a bigger organic opportunity than the page itself; these page posts double as material to share there when it's welcome. Sources: [Brand24](https://brand24.com/blog/how-to-increase-reach-on-facebook/), [FB Group Bulk Poster](https://fbgroupbulkposter.com/blog/facebook-organic-reach-2026), [Rafirit](https://rafirit.com/blog-resources/how-to-grow-your-business-on-facebook-organically-9-proven-strategies-that-still-work-in-2026/).
3. **Cadence:** GBP standard posts fade from prominence over time — a steady ~2/week beats bursts; same for FB (quality over volume). Full 3-week plan in `schedule.md`.

## Posting cadence recommendation

- **GBP:** 2-3/week (Tue/Thu ~9:00 AM, occasional Sat). Keep first ~90 characters self-contained.
- **Facebook:** ~1-2/week (Wed evening + Sat morning), reply to every comment same day.
- **Instagram:** 1/week (Thu late morning), visual-first per creative kit.
- **LinkedIn:** once (Tue morning, week 2). Commercial audience only.
- **Phones:** AL (256) 826-1100 is the default everywhere below. Any TN-targeted placement (TN-geo boost, Nashville-area group share, a TN GBP if one ever exists) swaps in (615) 510-1427.

## VSL video cuts — batch 02 (planned 2026-08-25, blocked on production)

Batch 01 is text and static images only. Once "The Exact Price" video exists (`campaigns/vsl-exact-price/script.md`), its five beats each yield a short vertical cut. **This is not written yet** — it needs the footage first, and captions must be burned in since most views are muted on mobile (74% of real AL/TN traffic).

| Cut | Source beat | Runtime | Platform |
| --- | --- | --- | --- |
| "Not the cheapest. That's intentional." | Beat 1 | ~20s | Reels, GBP video, YouTube Short |
| "Square footage + type of cleaning. That's the formula." | Beat 2 | ~35s | Reels, Facebook |
| "44 items, same order, every visit" | Beat 3 | ~30s | Reels, GBP |
| **"Who we're not for"** | Beat 4 | ~30s | Facebook, Reels — **the strongest cut**; the wrong-fit beat is the most shareable thing in the script |
| "Call and you'll have your number" | Beat 5 | ~15s | GBP with Call now button |

Full placement logic across every channel: `campaigns/vsl-exact-price/distribution-map.md`.

## Scheduling

No scheduler is connected. GHL's social-posting API exists in the stack (`mcp__gohighlevel__social-media-posting_*`) and could queue these once accounts are linked — flagged as an option only; **not used**. All posts carry recommended times for manual posting after review.
