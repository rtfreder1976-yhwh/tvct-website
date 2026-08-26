# GHL Legacy Email Template Audit — 2026-08-24

**Scope:** All 38 templates across the 5 legacy folders in the GoHighLevel account (location iKQIBhpKVL2XVPgU7HMd): nurture sequence (11), Nurture Sequence for Contact Us (8), Client On boarding (6), Quoting Follow up (8, incl. 3 templates from June 2025), Special Offer (5). The "Default - Invoice received"/"Document Sent" system templates were out of scope (system-generated, 2025-2026).

**Method:** Read-only. Templates listed via the GHL API (`emails_fetch-template` with each folder's parentId); each template's public Firebase-hosted `previewUrl` fetched and the rendered HTML inspected for prices, phone numbers, link targets, claims, and voice. **No create/update/delete calls were made to GHL. Nothing in the account was modified.**

**Checked against:** canonical pricing in `src/data/claims.ts` (regular from $200, deep $276, move-in/out $351, Airbnb $125, post-construction $526; 30/25/15% recurring discounts; $150/visit recurring floor), the retired-price blocklist, claim guardrails (no free-quote, no 5-star, no unhedged guarantees, etc.), canonical phones (AL 256-826-1100, TN 615-510-1427), and current CTA architecture (residential = phone-first; BookingKoala owns booking; GHL funnels/forms retired).

---

## Verdict summary

| Verdict | Count |
| ------- | ----- |
| BLOCK | 29 |
| REWRITE | 9 |
| SALVAGEABLE | 0 |
| UNREADABLE | 0 |
| **Total** | **38** |

Nothing is safe to send as-is.

---

## Folder: nurture sequence (11) — verdict: BLOCK (all 11)

Every email in this folder pitches a **"$97 deep clean" for kitchen and bath** — a price that was never canonical, is ~$179 under the current deep-clean starting price ($276), and undercuts even the $150/visit recurring floor. Every CTA points at `{{ custom_values.1hour_sales_consult_url }}`, an agency-era GHL custom value for a retired sales-consult funnel (residential CTAs are now phone-first). Voice: light tips-and-hacks register, moderately exclamation-heavy; tips content is generic but inoffensive.

| Template | ID | Verdict | Violations |
| -------- | -- | ------- | ---------- |
| Email: How Much Time Do You Spend Cleaning? The Numbers Will Surprise You! | 66e93258df67051a62441598 | BLOCK | "For just $97, we'll deep clean your kitchen and bathroom"; CTA `{{custom_values.1hour_sales_consult_url}}` |
| Email 1 | 66e92d85e086d0711987d06d | BLOCK | "$97 deep clean for your kitchen and bath"; same stale CTA |
| Email 2 | 66e92e6b0ee5b7800a3c9922 | BLOCK | "$97 deep clean"; same stale CTA |
| Email 3 | 66e92ec0df6705e8e24414c6 | BLOCK | "$97 deep clean"; same stale CTA |
| Email 4 | 66e92f0de086d0224a87d0b7 | BLOCK | "$97 deep clean"; same stale CTA |
| Email 5 | 66e92f9ee086d0bed087d0ca | BLOCK | "$97 deep clean"; same stale CTA |
| Email 6: | 66e93006cf7a7b350364e96d | BLOCK | "$97 deep clean"; same stale CTA |
| Email 7 | 66e93070e086d0e83387d0f9 | BLOCK | "$97 deep clean"; same stale CTA |
| Email 8 | 66e930d0df67059c07441536 | BLOCK | "$97 deep clean"; same stale CTA; "sparkle" register |
| Email 9 | 66e9311f0ee5b7ace03c99b3 | BLOCK | "$97 deep clean"; same stale CTA |
| Email 10 | 66e9316a0ee5b748b53c99ba | BLOCK | "$97 kitchen and bath deep clean"; same stale CTA |

## Folder: Nurture Sequence for Contact Us (8) — verdict: BLOCK (all 8)

Same $97 offer and same retired `1hour_sales_consult_url` CTA in every email. Voice: viral-hacks/hosting-tips register with fear-based mold emails; exclamation-heavy welcome ("Welcome to The Valley Clean Team family!").

| Template | ID | Verdict | Violations |
| -------- | -- | ------- | ---------- |
| Email 1: Welcome & Quick Time-Saving Tips | 66e939b780e3e13005d668fc | BLOCK | "$97 deep clean for your kitchen and bath"; stale CTA; generic "spotless" register |
| Email 2: Top 5 Viral Cleaning Hacks You Haven't Heard Of | 66e93a1580e3e10f97d66946 | BLOCK | "$97 deep clean" special; stale CTA |
| Email 3: Preparing Your Home for Guests | 66e93a4f80e3e14433d66951 | BLOCK | "$97 deep clean"; stale CTA |
| Email 4: Hosting Made Easy: Quick & Delicious Appetizer Recipes | 66e93a8a2e73b30c1aa01ac7 | BLOCK | "$97 deep clean"; stale CTA; off-topic (appetizer recipes) |
| Email 5: The Hidden Dangers of Mold in Your Home | 66e93ad880e3e1efa6d66975 | BLOCK | "$97 kitchen and bath deep clean"; stale CTA; fear-based mold framing borders on health claims |
| Email 6: How Regular Deep Cleaning Protects Your Family's Health | 66e93b2180e3e1bdb8d66982 | BLOCK | "$97 kitchen and bath deep clean"; stale CTA; health-protection framing |
| Email 6 (duplicate copy) | 66e93b57fc2db8c7007fdba6 | BLOCK | Duplicate of the above; "$97 deep clean"; stale CTA |
| Email 7: 3 Quick Cleaning Hacks to Save You Time | 66e93b98ff032dbb8a9bfb2c | BLOCK | "$97 deep clean" offer; stale CTA |

## Folder: Client On boarding (6) — verdict: REWRITE (all 6)

No prices and no false claims — but every email carries a **Terms & Conditions footer link to `https://alliebloyd.com/termsconditions`** (the 2024 marketing agency's own site, not TVCT) and CTAs to the retired `{{custom_values.1hour_sales_consult_url}}`. Email 1 thanks the client "for choosing The Valley Clean Team for your kitchen and bath deep clean" — tied to the dead $97 offer context. The upsell arc (thank-you → recurring → whole-home deep clean) is a usable skeleton for a post-first-clean sequence. Voice: mixed; several are "sparkling/gleaming countertops" register, two are genuinely restrained.

| Template | ID | Verdict | Violations |
| -------- | -- | ------- | ---------- |
| Email 1: Welcome to The Valley Clean Team! | 66e9aa58ff032d63129c2aa5 | REWRITE | Footer link `alliebloyd.com/termsconditions`; stale CTA; "kitchen and bath deep clean" framing from the $97 offer; "fresh, spotless feeling" sparkle register |
| Email 2: Stress-Free Holidays & Special Events with Regular Cleaning | 66e9abd280e3e1409ad69954 | REWRITE | `alliebloyd.com/termsconditions`; "sparkling clean," "gleaming countertops" register |
| Email 3: Keep Your Home Nicer, Longer with Regular Deep Cleaning | 66e9ac4306f2387b0bdb6880 | REWRITE | `alliebloyd.com/termsconditions`; stale CTA (otherwise restrained, best of the folder) |
| Email 4: Discover the Benefits of a Whole Home Deep Clean | 66e9acb0a76108a1cfc4482b | REWRITE | `alliebloyd.com/termsconditions`; stale CTA; "spotless and sparkling" register |
| Email 5: Why Stop at the Kitchen and Bath? Treat Your Entire Home | 66e9ad578f9ae60c2ca51ae0 | REWRITE | `alliebloyd.com/termsconditions`; stale CTA; premise tied to the dead $97 kitchen-and-bath offer |
| Email 3: Lasting Cleanliness with a Full Deep Clean | 66e9adc5ff032d5cf49c2b94 | REWRITE | `alliebloyd.com/termsconditions`; stale CTA; duplicate "Email 3" numbering |

## Folder: Quoting Follow up (8) — verdict: BLOCK (5 of 2024) / REWRITE (3 of 2025)

The five 2024 emails push a **"$79 discount on your first cleaning"** (never canonical), promise a **"FREE quote"** (violates the no-free-quote guardrail), and drive to `https://go.thevalleycleanteam.com/initial-call` — a GHL funnel booking a "15-minute call," a retired flow (residential is phone-first; BookingKoala owns booking). Day 4/5 use manufactured scarcity ("Today is the LAST day"). The three June-2025 templates are the closest thing to current: no prices, restrained tone, `{{contact.quote_link}}` CTA and a live `/what-we-clean/` link — but all three contain a **literal unmerged "[Phone Number]" placeholder** and would send broken.

| Template | ID | Verdict | Violations |
| -------- | -- | ------- | ---------- |
| Day 1: Immediate Follow-Up | 66e9d562fc2db82ff2803722 | BLOCK | "$79 discount on your first commercial or residential cleaning"; "Thanks for requesting a FREE quote"; link `go.thevalleycleanteam.com/initial-call` |
| Day 2: Logical Appeal | 66e9d5ed2e73b32b31a077f1 | BLOCK | "Save $79 on your first cleaning"; retired funnel link |
| Day 3: Emotional Appeal | 66e9d6552e73b326b5a07855 | BLOCK | "you saved $79 doing it!"; retired funnel link |
| Day 4: Urgency and Scarcity | 66e9d6ab2e73b353caa0789a | BLOCK | "Time is running out! Your $79 discount... won't be available much longer"; retired funnel link |
| Day 5: Final Push | 66e9d70bfc2db8091d80383c | BLOCK | "This is it! Today is the LAST day to book your 15-minute call and secure your $79 discount"; retired funnel link |
| Post Quote Follow-up (2025) | 6841ca7993994a3dd107a955 | REWRITE | Literal "[Phone Number]" placeholder; links otherwise OK ({{contact.quote_link}}, /what-we-clean/); tone restrained |
| Post Quote Final Follow-up (2025) | 6841d556ee4f047586805f47 | REWRITE | Literal "[Phone Number]" placeholder; checklist link target unverified |
| Post Quote Final Follow-up (2025, duplicate) | 6841d7132d59f8dbbaae855d | REWRITE | Duplicate of the above; literal "[Phone Number]" placeholder |

## Folder: Special Offer (5) — verdict: BLOCK (all 5)

Abandoned-booking chase for the same **$97 kitchen-and-bath deep clean**, CTA to `{{custom_values.call_booking_url}}` (retired call-booking funnel). Day 4/5 are scarcity-heavy ("Last Chance! This $97 Offer Won't Last Long"). Voice: "sparkling/spotless/grease-free," exclamation-heavy.

| Template | ID | Verdict | Violations |
| -------- | -- | ------- | ---------- |
| Day 1: Don't Forget: Your Kitchen & Bath Deserve Some Love! | 6710111d2cda0f0dcb5766a4 | BLOCK | "you didn't complete your booking for the $97 kitchen and bath deep clean"; stale `call_booking_url` CTA |
| Day 2: What Would You Do with an Extra Few Hours This Week? | 6710119b2cda0fb18457671b | BLOCK | "$97 deep clean" offer; stale CTA |
| Day 3: Clean Kitchen, Clean Bath, Peace of Mind! | 671011f1bf60e7b0c2341e39 | BLOCK | "$97 kitchen and bath deep clean"; stale CTA |
| Day 4: Last Chance! This $97 Offer Won't Last Long | 6710125321340c044557690f | BLOCK | "$97" + "almost gone," "last chance," "don't miss out" scarcity; stale CTA |
| Day 5: Final Chance: Grab Your $97 Deep Clean Now! | 671012bbce21140743fa6768 | BLOCK | "$97 deep clean"; "sparkling," "spotless" register; stale CTA |

---

## Worst findings

1. **"$97 deep clean" in 24 of 38 templates** (nurture 11 + Contact Us 8 + Special Offer 5). Not on the retired-price blocklist by number, but never canonical, $179 under the current deep-clean start ($276), and below the $150/visit floor. Instant fail everywhere it appears.
2. **"$79 discount on your first commercial or residential cleaning" + "Thanks for requesting a FREE quote"** (Quoting Day 1). Non-canonical discount plus a direct violation of the no-free-quote guardrail; repeated across Day 1-5 with false scarcity ("Today is the LAST day").
3. **`alliebloyd.com/termsconditions` in every Client On boarding footer** — the Terms & Conditions link points at the 2024 marketing agency's own website, not TVCT. Old branding leakage in a client-facing legal link.
4. **Every 2024 CTA targets a retired GHL funnel** — `{{custom_values.1hour_sales_consult_url}}`, `{{custom_values.call_booking_url}}`, or `go.thevalleycleanteam.com/initial-call` (15-minute call funnel). Current architecture: residential CTAs are phone-first (AL 256-826-1100 / TN 615-510-1427); booking is BookingKoala.
5. **Literal "[Phone Number]" placeholder in all three 2025 Post Quote templates** — the only structurally current templates would send with broken merge text.

Notably absent: no retired-blocklist prices ($99/$119/.../$400), no wrong phone numbers (no phone numbers at all in the 2024 sets), no workers-comp/bonded/5-star/clinical claims. The rot is prices, links, and offer mechanics, not credential claims.

## Folder → planned-sequence mapping

| Legacy folder | Maps to | Disposition |
| ------------- | ------- | ----------- |
| Quoting Follow up | New quote-follow-up sequence | Rebuild from scratch; the 2025 Post Quote trio is the only structural reference worth keeping open while writing |
| Client On boarding | New post-first-clean sequence | Reuse the arc (thank-you → recurring pitch → whole-home upsell), rewrite every word; fix T&C link and CTAs |
| nurture sequence / Contact Us nurture | New lead-nurture (if built) | Do not port; the $97 offer is load-bearing in every email |
| Special Offer | — | Retire entirely; abandoned-booking chase now belongs to BookingKoala's native abandoned-cart flow |

## Recommendation

**Nothing sends from the 2024 templates. Do not wire any legacy folder into a new workflow.** New sequences should be written via `/email-sequences` against `brand/voice-profile.md` + `src/data/claims.ts` and pushed to GHL as NEW templates in a new folder — leave the legacy folders untouched as archive.

Worth mining for structure only (never copy verbatim):
- **Post Quote Follow-up / Final Follow-up (2025, ids 6841ca79…, 6841d556…)** — restrained tone, quote-link CTA, checklist link: closest existing model for the new quote-follow-up sequence.
- **Client On boarding Email 3 "Keep Your Home Nicer, Longer" (66e9ac43…)** — the one genuinely restrained 2024 email; its home-as-investment angle fits current positioning.
- **Client On boarding arc order** (welcome → events → longevity → whole-home upsell) as a skeleton for post-first-clean.
