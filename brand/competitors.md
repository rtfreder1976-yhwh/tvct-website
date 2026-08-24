# Competitor Intel — The Valley Clean Team

## Last Updated
2026-08-23 (manual port; no /competitive-intel skill yet in v2.1). Owner of this file: /competitive-intel once it exists.

**Sources and capture dates**
- `brand/positioning.md` competitor table and claims map — verified LIVE 2026-08-22 (WebSearch + Firecrawl). Marked **[2026-08-22]**.
- Spot-verified today, 2026-08-23 (Firecrawl, live fetch): Bear Brothers homepage (page modified 2026-08-12). Marked **[2026-08-23]**.
- Pre-reset file at git `7a2eb93:brand/competitors.md` (captured 2026-05 / 2026-08-22 first pass). Marked **[old file, unverified since]**. Facts only; nothing restored wholesale.
- TVCT's own facts: `src/data/claims.ts` and `brand/brand-brief.md`. No competitor fact appears here that is not in one of the sources above.

**Rule.** Re-verify before publishing any comparison copy. A competitor can rewrite a page overnight. Nothing here is a licence to price-match (`POLICIES.priceMatching = false`). The enemy is generic, interchangeable cleaning-company marketing, not any named company.

---

## Market Map by Geography

**Huntsville / Madison**
| Competitor | Quote model | Price posture | Reviews | Employment model | Headline (verbatim) |
| --- | --- | --- | --- | --- | --- |
| Bear Brothers Cleaning | Phone, minutes; online bed/bath calculator | Mid; formula priced | "250+ 5-Star Google Reviews" (also "225+" elsewhere on same page) [2026-08-23] | Referral platform; contractors [2026-08-23] | "Beary Clean Guaranteed, or we re-clean for free!" |
| MaidPro Huntsville / The Shoals | Free estimate | Unstated ("Best of Cleaning Awards") | 4.7 / 310 [2026-08-22] | Franchise | "49-Point Checklist" |
| Two Maids Huntsville | Free estimate; "Calculate Your Price" | Unstated | 4.7 / 487 [2026-08-22] | Franchise | "Your day just got a whole lot better" |
| Molly Maid (HSV / Decatur / Athens) | Complimentary in-home estimate | Unstated | 4.8 / 381 [2026-08-22] | Franchise (Neighborly) | "A clean you can count on" |
| The Cleaning Authority Huntsville | Online quote / free estimate | Unstated | 4.8 Google [2026-08-22] | Franchise | "Life's Too Short to Clean Your Own Home" |
| Merry Maids Huntsville | "Start my quote" | Unstated | Women's Choice Award (no count captured) [2026-08-22] | Franchise | "re-energize your home"; "40 years of experience" |

**The Shoals (Florence / Muscle Shoals / Tuscumbia)**
MaidPro (same franchise as HSV) and Bear Brothers (lists Florence/Muscle Shoals in N. AL coverage [2026-08-22]). Otherwise solo/gig cleaners. This is TVCT's home market and the only one where the map pack already works (see memory: CTR problem).

**Nashville suburbs**
| Competitor | Quote model | Price posture | Reviews | Employment model | Headline (verbatim) |
| --- | --- | --- | --- | --- | --- |
| Hive Home Services | Instant online, flat by bedrooms | Low ("$119-$149" per-bedroom prices listed) | Re-clean guarantee only | Unknown | "Fixed flat rates. No hidden fees."; "Know the price before we arrive" |
| Maid Cleaning Nashville | Online, "60 seconds"; sq-ft brackets "from $X" | High-asserted ("Luxury") | "800+ 5-star reviews", "5,000+ satisfied customers" | Unknown | "Nashville's Premier Luxury Cleaning Service"; "Always-Deep" |
| Music City Maid Service | Instant online quote, "book in 60 seconds" | Flat-rate, transparent | "700+ 5-star reviews", 14 years | Unknown | "transparent flat-rate structure... know the exact price" |

All three Nashville rows [2026-08-22]. Note: the Hive URL captured on 2026-08-22 redirected to a babysitting site (hivesitters.com) on 2026-08-23; re-locate the correct domain before quoting Hive anywhere.

**Mountain Brook / Birmingham**
Bear Brothers (Birmingham metro incl. Mountain Brook, Homewood, Vestavia Hills, Hoover [2026-08-23]). No other Birmingham operator has been read. Do not name any until captured.

**Everywhere: the category alternative**
Solo / gig cleaners (Care.com, Homeaglow, Handy, Facebook groups): $18-$25/hr teaser, Care.com Huntsville avg ~$19/hr; established independents $30-$50/hr; hourly, negotiated; no portable proof [2026-08-22].

---

## Competitor Cards

### ① Bear Brothers Cleaning — Huntsville, N. Alabama, Birmingham, 30A
**Positioning claim:** "Beary Clean Guaranteed, or we re-clean for free!" Secondary: free phone quote in minutes, no estimator visit; "Insured (Up to $2M)". [2026-08-23]
**Proof they show:** "2,000+ cleans completed", "250+ 5-Star Google Reviews", published checklists, $2M general liability. [2026-08-23] (The same homepage also says "1,750+ cleans" and "225+ five-star" in a lower block; their counts are not internally consistent.)
**Model:** their own words: "connects homeowners and businesses with vetted, background-checked professional cleaners"; "Our cleaners are independent contractors who bring their own equipment and supplies"; "contractors carry their own insurance." [2026-08-23] Old file adds: contractors paid 50% of the clean [old file, unverified since].
**Pricing:** "Enter your home size by bedrooms and bathrooms" [2026-08-23]. Old file: $125 minimum (1bd/1ba), +$75/bedroom, +$25/bath; worked example 3bd/3ba = $425; recurring discounts 20/15/10; $50 cancellation fee; 33-step checklist; will not clean >7,000 sq ft [old file, unverified since — re-capture the pricing page before citing any number].
**Policies:** "We don't issue refunds"; guarantee requires the customer present for a post-clean walkthrough on first-time/one-time cleans; card charged after walkthrough or 24-48h silence. [2026-08-23]
**What they do well (concede it):** fastest quote in Huntsville, phone or online, no estimator. Clear public checklists. Strong review velocity. New since old file: "we assign the same cleaner to your home whenever possible" on recurring plans [2026-08-23]. That is a consistency claim TVCT cannot make (not in claims.ts).
**Where they are weak:** the price is derived from bedroom/bath count, not the size of the house; the company does not employ the people in your home and the contractor carries their own insurance; no refunds, and the guarantee has a walkthrough precondition; no public statement that the quoted number is the billed number.
**How TVCT copy handles them:** never name them. Concede speed ("nobody needs to come look at your house to price it" is a shared truth), then differentiate on what the number is based on (square footage, 25 brackets) and on the number holding (`QUOTE_ON_CALL.priceHeld`, two exceptions). On "who's in your house": say ours are background-checked employees on our payroll, covered by $2M liability; do not imply theirs are unsafe. Do NOT claim workers' comp, bonded, or same team every visit.

### ② MaidPro Huntsville / The Shoals
**Positioning claim:** "49-Point Checklist"; "Get A Free Estimate"; Best of Cleaning Awards 2019-2023. [2026-08-22]
**Proof:** 4.7 / 310 reviews [2026-08-22]. Old file: owned since 2006; also veteran-owned and women-owned; teal/white photographed-cleaner visual identity [old file, unverified since].
**What they do well:** the named checklist is the closest thing to a system claim in the market; award streak; the only direct overlap in the Shoals.
**Where they are weak:** the checklist is a count, not an explanation; free-estimate CTA; no pricing on site.
**How TVCT copy handles them:** the "MaidPro collision" [old file]: in Huntsville and the Shoals, veteran-owned, woman-owned and a numbered checklist are NOT differentiators. Do not lead with 44 items vs 49 there. Lead with what the list means: which items, why, what "not included" means. Teach; they name.

### ③ Two Maids Huntsville
**Positioning claim:** "Your day just got a whole lot better"; "Call for a Free Estimate"; "Calculate Your Price". [2026-08-22]
**Proof:** 4.7 / 487 reviews (largest local count captured); "trusted by 1,000 households daily nationwide". [2026-08-22]
**What they do well:** review volume; a price calculator on site; national brand recognition.
**Where they are weak:** lifestyle-relief hero copy (the generic register); calculator still lands on an estimate; proof is national, not Huntsville.
**How TVCT copy handles them:** do not compete on review count (487 vs 148). Make the comparison about specificity: what the price is based on, what's included, what happens if it isn't right. Their register is the enemy the brief describes, so just do not sound like it.

### ④ Molly Maid (Huntsville / Decatur / Athens)
**Positioning claim:** "A clean you can count on"; "Neighborly Done Right Promise"; "Request a Free Quote in under 2 minutes". [2026-08-22]
**Proof:** 4.8 / 381; "1.5M customers since the 1980s". [2026-08-22]
**What they do well:** brand trust from four decades; the Neighborly guarantee is a real, national risk reversal; the 2-minute form is frictionless.
**Where they are weak:** the 2-minute form requests a quote; the quote itself is a complimentary in-home estimate [2026-08-22]. That is the exact wait the brief's honesty angle removes.
**How TVCT copy handles them:** concede the guarantee is real. Differentiate on the path to a number: one call, one number, held. Never say "franchise" pejoratively; say "the people who answer are the people who own it" (IDENTITY: family-owned) only as a fact.

### ⑤ The Cleaning Authority Huntsville / Madison
**Positioning claim:** "Life's Too Short to Clean Your Own Home"; "Detail-Clean Rotation System"; "Immediate, Accurate Online Quotes". [2026-08-22]
**Proof:** 4.8 Google (count not captured). [2026-08-22]
**What they do well:** the only Huntsville franchise with a named process AND an instant online quote; Madison coverage matters for the pending 2nd-GBP decision.
**Where they are weak:** the system is named, not taught; "accurate" quote is asserted without a held-price commitment; lifestyle hero.
**How TVCT copy handles them:** this is the nearest competitor to TVCT's mechanism angle. Out-explain, not out-name: a rotation system tells you when; a checklist plus a teach-piece tells you what and why. Do not claim TVCT rotates deep-clean areas unless it does.

### ⑥ Music City Maid Service — Nashville (flat-rate operator)
**Positioning claim:** "transparent flat-rate structure... know the exact price"; "book in 60 seconds". [2026-08-22]
**Proof:** "700+ 5-star reviews", 14 years. [2026-08-22]
**What they do well:** in Nashville, price certainty is already claimed, online, instantly. Hive says the same ("Know the price before we arrive"). Any Nashville copy leading on "exact price" is me-too.
**Where they are weak:** flat rate by bedrooms/plan, not by the house; nothing about who is in the home; nothing about why the price is what it is.
**How TVCT copy handles them:** in Nashville, The Exact Price is proof, not headline. Lead with the system and the explanation (why we cost what we cost, who we're for), which no Nashville operator does. Concede that instant online quotes are convenient; TVCT's one call gets you a number based on square footage and it holds.

---

## Claims Saturation Map

**Saturated (3+ sites; never lead with these) [2026-08-22]**
- Insured / background-checked (Bear Brothers even matches the $2M figure)
- Satisfaction guarantee, free re-clean within 24 hours
- "Free estimate" / "free quote" as the CTA
- Eco-friendly / green products
- A named checklist or system (49-Point, Detail-Clean Rotation, Always-Deep, Bear Brothers' public checklists)
- Review-count social proof (250 to 800+; TVCT's 148 loses that contest, so do not enter it)
- Lifestyle-relief copy ("Your day just got a whole lot better", "Life's Too Short", "re-energize your home")

**Partially occupied (1-2 sites)**
- Phone quote in minutes, no estimator — Bear Brothers (HSV). "No estimator" is a supporting line, not an angle, in Huntsville.
- "Know the price before we arrive" / flat rate — Hive, Music City Maid (Nashville only)
- Sq-ft bracket pricing on page, still "from $X" — Maid Cleaning Nashville
- "Same cleaner whenever possible" on recurring — Bear Brothers [2026-08-23]; TVCT cannot counter this (not in claims.ts)
- "Luxury" / "premier" framing — Maid Cleaning Nashville, MaidPro (asserted, never explained)
- Instant online quote + named system — The Cleaning Authority

**White space (unclaimed in all three markets)**
- Expertise-led, teach-the-customer content: why a surface is cleaned one way, what deep adds over regular, what "not included" means. Systems are named; none are explained.
- Explaining the price: "here's why we cost more" followed by an itemised list of what the money buys (15 yrs avg experience, 44/57/49/37-item lists, $2M coverage, 98% on-time, 85% repeat, 24-hr re-clean).
- Qualifying the customer: "we're not the right cleaning company for everyone." All nine sell to everyone.
- The exact price held on one call: every published competitor number is "from", "starting at", or "estimated". A quoted number that is the billed number, with two named exceptions, is unclaimed. Nobody in Huntsville or the Shoals publishes any sq-ft rate card.
- Employees on payroll vs referral-platform contractors: unspoken by everyone; Bear Brothers' own disclosure opens it. State ours as fact only.
- Veteran- and woman-owned: on no competitor site in HSV/Nashville (MaidPro claims it in the old file — treat as occupied in HSV/Shoals until re-checked).
- Commercial: nobody promises a written quote on a clock (TVCT: 2 business hours).

---

## The Category Alternative: Solo / Gig Cleaners and DIY

The real competitor for the every-other-week customer is a person from Care.com or a Facebook group at $18-$25/hr (established independents $30-$50/hr) [2026-08-22], or doing it themselves. That alternative is cheaper per hour and always will be. The brief's answer is not to argue: "We're not the cheapest option. That's intentional." Then say what the difference buys, as facts: background-checked employees covered by $2 million in liability insurance, damage claims covered by insurance, a re-clean within 24 hours, 98% on-time arrival, a published list of what gets done, a price that holds, and someone who answers the phone. The positioning explicitly lists hourly-rate shoppers under "who we're NOT for". Say that calmly, without edge, and point them elsewhere. Never disparage gig cleaners as people; many customers have used one and liked them until the no-show.

DIY is handled by the teach-content: a company that explains how to do it right is the one you call when you'd rather not.

---

## Do Not Say (comparison content)
- No competitor prices except verbatim from a dated capture; the old-file Bear Brothers formula ($125 / +$75 / +$25 / $425) must be re-captured before use.
- No unverified competitor negatives: no "they no-show", no "they rush", no "they use a different stranger every time" (Bear Brothers now claims the opposite for recurring). Facebook-group anecdotes are not evidence.
- No naming a competitor on the site or in ads. Comparison is by model ("a referral app", "an in-home estimate", "a bedroom-count formula"), never by brand.
- No claims TVCT cannot back in claims.ts: NOT workers' comp, NOT bonded, NOT same team every visit, NOT certifications, NOT clinical/OSHA, NOT same-day.
- No "we beat their recurring discounts" until Bear Brothers' current discounts are re-captured.
- No "44 vs 49 / 44 vs 33" checklist counts in Huntsville or the Shoals (MaidPro collision).
- No oversell words: best, premium, luxury, exceptional, superior, unmatched, unparalleled, elite, five-star (luxury only inside `POSITIONING.luxuryScope`).
- No retired prices: $99, $119, $129, $135, $149, $175, $176, $225, $275, $400 (Hive's "$119-$149" is theirs; do not echo it in TVCT copy).
- "1,500+" is customers served, never cleanings.

---

## Watch List (re-verify quarterly; next due 2026-11-23)
| What | How |
| --- | --- |
| Bear Brothers pricing formula, discounts, cancellation fee, contractor disclosure, "same cleaner" wording | Firecrawl scrape bearbroscleaning.com homepage + booking page, `maxAge: 0`; check `article:modified_time` |
| MaidPro HSV/Shoals: checklist count, veteran/woman-owned claim, review count | Search: `"MaidPro" Huntsville checklist`; Firecrawl (site 403s WebFetch) |
| Two Maids, Molly Maid, Cleaning Authority, Merry Maids review counts | Search: `"[brand]" Huntsville AL reviews`; read GBP count directly, not aggregator snippets |
| Hive Home Services correct domain and per-bedroom prices | Search: `"Hive Home Services" Nashville cleaning flat rate` (old URL redirects to hivesitters.com) |
| Maid Cleaning Nashville, Music City Maid: sq-ft brackets, "exact price" wording | Firecrawl scrape pricing pages; note whether any now says the price is held |
| New entrants in Madison / Hampton Cove | Search: `house cleaning Madison AL`, `cleaning service Hampton Cove`; Local Falcon scan with explicit lat/lng (saved coordinates are wrong) |
| Gig-rate benchmark | Search: `Care.com house cleaning Huntsville hourly rate` |
| Anyone claiming a held / final quoted price in AL or TN | Search: `"price won't change" house cleaning Huntsville`, `"no surprises" cleaning quote Nashville` — if found, the white space closes |
