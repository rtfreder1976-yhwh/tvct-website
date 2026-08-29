# Positioning — The Valley Clean Team

## Last Updated
2026-08-23 by /positioning-angles (update mode; reconciled to `brand/brand-brief.md`, Todd's authoritative brief of 2026-08-23)

**What moved and why:** the prior ⭐ (2026-08-22) was THE POSTED PRICE, a price-certainty angle. The brief says the company does not compete primarily on price; the primary position is an expert company that sounds human, with the higher price explained through expertise, systems, accountability and consistency. The Posted Price survives intact as the lead *proof* of the honesty/transparency trait and as angle ② in its own right (it still owns the cost-intent SERP), but it is no longer the headline value claim.

Competitor table below was verified live on 2026-08-22 and was not re-run. Every number in this document traces to `src/data/claims.ts` or `src/data/pricing.ts`. If a claim is not in those files, it is not in this document.

---

## Core Positioning (from brand-brief.md)

The Valley Clean Team is a **premium residential cleaning company** ("premium" is the internal stance label, `POSITIONING.stance`; it is not a word for copy). We charge more than many competitors because we provide more than basic cleaning: **expertise, experience, reliable systems, accountability, consistency, and a professional customer experience.**

**We do NOT want to compete primarily on price.**

The brand should communicate:
1. We know what we're doing.
2. We take cleaning seriously.
3. We have high standards.
4. We're honest about what we do and what we don't do.
5. We're transparent about pricing and expectations.
6. We're friendly and approachable.
7. We're confident enough to occasionally be witty.
8. We treat customers like intelligent adults.
9. We don't need to constantly tell people we're "premium" or "exceptional." The quality of our communication should demonstrate it.

**Core statement:** *We're the experts who happen to be really likable people.*

> We're trying to make an expert company sound human — not make a cleaning company sound fun.

**Premium value drivers (what the higher price is connected to, per the brief):** experience, expertise, systems, consistency, reliability, accountability, quality control, customer communication, professional standards, the overall experience. The goal is for the customer to conclude: "Now I understand why they cost more."

**Pricing posture:** explain it, never defend it. "We're not the cheapest option. That's intentional." Then say what the customer is actually paying for.

---

## Primary Positioning

**Angle: ⭐ THE EXPERTS WHO HAPPEN TO BE LIKABLE** ("Not the cheapest. That's intentional.")

**Dunford statement:**
For busy households in Huntsville/Madison, the Shoals and the Nashville suburbs who want the house handled by people who know what they're doing, The Valley Clean Team is the residential cleaning company that runs a disciplined, repeatable system and is honest about what it costs, what's included, and who it's right for. Unlike interchangeable cleaning-company marketing and "starting at" estimates, we publish the price, explain the work, and tell you plainly if we're not the right fit.

**One-sentence statement:** We cost more than many cleaning companies, on purpose, and we'd rather show you the system behind that number than talk you into it.

**Psychology:** The market is Stage 3 (crowded, identical claims). When every site says "insured, background-checked, satisfaction guaranteed, free estimate," the buyer has nothing to compare except price, so price wins by default. The only way out of that comparison is to give the buyer a different thing to evaluate: competence they can see (teaching, specificity, a system with numbers) and honesty they can feel (what's included, what isn't, who we're not for). A company willing to disqualify a customer reads as confident, and confidence is the signal that says "these people know what they're doing." Likability is the bonus that makes them pick up the phone.

**Mechanism (the "how"):** The System. Nobody at TVCT is guessing.
- The price comes off an internal 25-bracket square-footage rate card, four services, 750 to 10,000+ sq ft (`pricing.ts` RATE_CARD_ROWS), so it can be quoted firm in one call and held (`QUOTE_ON_CALL`). Publicly we post real starting prices only (deliberate, 2026-08-21) — the exact number is the reason to call.
- The work is a published checklist per service: 44 items standard, 57 deep, 49 move-in/out, 37 post-construction (`CHECKLIST`). The difference between services is a list, not an adjective.
- The people are background-checked employees covered by $2 million in liability insurance (`TRUST`; workers' comp is false — never claim), averaging 15 years of cleaning experience (`PERFORMANCE.avgCleanerExperienceYears`).
- The accountability is $2 million in liability coverage, damage claims covered by insurance, and a free re-clean within 24 hours (`TRUST`).
- The consistency shows up as 98% on-time arrival and 85% repeat customers (`PERFORMANCE`).
- The policies are published, including the ones that cost the customer money: 24-hour cancellation notice / $100 fee, $5-$15 travel fee, $25 per pet, green products at no extra charge (`POLICIES`). Treating people like adults means telling them the fee before it happens.

**Enemy (primary):** Generic, interchangeable cleaning-company marketing. "We make your home sparkle." "Sit back and relax." "Attention to detail." "We treat your home like our own." Copy that could be any company, which is exactly why the buyer ends up comparing on price.

**Enemy (secondary):** The estimator and the "starting at" upsell: the number that exists to get you on the phone and is gone by the time the team arrives.

**Proof stack (in order of use):**
1. **The Exact Price (lead proof of honesty):** real starting prices published on /pricing (not teasers); the exact number is read in one call, firm for most standard residential homes during business hours, held with two exceptions that are both the customer's own changes (`QUOTE_ON_CALL.priceHeld`, `.priceChangeExceptions`). See angle ②.
2. Published checklists, 44 / 57 / 49 / 37 items (`CHECKLIST`) — what's included, stated as a list
3. Crew averaging 15 years of experience; employees, not contractors (`PERFORMANCE.avgCleanerExperienceYears`, `TRUST.workersComp`)
4. 98% on-time arrival, 85% repeat customers (`PERFORMANCE`)
5. $2 million liability coverage, background checks, free re-clean within 24 hours (`TRUST`; workers' comp is false — never claim)
6. 4.9 stars, 148 Google reviews, verified 2026-07-25 (`REVIEWS`)
7. 1,500+ customers served (`PERFORMANCE.customersServedDisplay`) — customers, never "cleanings"
8. Starting prices: regular $200, deep $276, move-in/out $351, Airbnb turnover $125, post-construction $526 (`PRICING`); recurring 30% / 25% / 15% off the regular base (`RECURRING_DISCOUNTS`)
9. No price matching (`POLICIES.priceMatching: false`) — stated calmly, never apologized for
10. Veteran- and woman-owned, family-owned (`IDENTITY`) — a fact about who answers the phone, not a sales line

**Out-of-scope fallbacks (say them, do not hide them):** after-hours/voicemail, commercial, post-construction and homes outside the brackets get a written quote within 2 business hours (`QUOTE_ON_CALL.fallbackToSla`, `PERFORMANCE.quoteResponseSla`). Bookings are recommended 2-3 days ahead (`POLICIES.bookingAhead`); no same-day.

### Who we ARE for
- Busy households (dual-income, young kids, two careers) who want the house handled on a schedule by people who know what they're doing — the every-other-week customer (`RECURRING_DISCOUNTS`, 85% repeat)
- People who have been burned by a no-show, a gig cleaner who varied visit to visit, or a price that grew once the crew was inside
- People who want to know the number and what's included before anyone comes to the door
- Homes where "done properly" matters more than "done cheapest"
- Customers who would rather be told "that's not included, here's what it costs" than discover it on the invoice

### Who we're NOT for
- Bargain hunters collecting three quotes to take the lowest
- Hourly-rate shoppers comparing us to $18-$25/hr gig teasers
- One-off price-match seekers — we do not price match (`POLICIES.priceMatching: false`)
- Anyone who needs a crew today; we book 2-3 days out and do not do same-day
- Anyone who wants a "starting at" number to negotiate down from

Say this without edge. The brief's line is the model: "We're not the right cleaning company for everyone. And we're okay with that." Then say who we are right for.

**Best channels / audience:**
- Homepage hero and About page (this is the on-page position; the SERP title/meta still belong to ②, see "Where each angle lives")
- /pricing: a "why we cost more" panel above or beside the rate card, written as an explanation, not a defense
- Expertise content: blog posts and GBP posts that teach (surface differences, why deep vs regular, what a move-out clean actually covers) — the white-space no competitor occupies
- The phone call itself: "explain, don't defend" is a script, not just copy
- Google Business Profile description and review responses (the map-pack gap outside the Shoals)
- Post-first-clean email/SMS (BookingKoala): the system is what makes the second booking feel safe

**Headline candidates (brief's voice; none use best/premium/luxury/exceptional/superior/unmatched/unparalleled/elite/five-star):**
1. "We're not the cheapest option. That's intentional." — positioning headline
2. "We're not the right cleaning company for everyone." — positioning / qualifying headline
3. "We're the people who notice the stuff you weren't looking for." — expertise, shown not claimed
4. "Curious what your house would actually cost to clean properly? Let's figure it out." — CTA / transparency headline (brief verbatim; runs long, use where space allows)
5. "Your exact price. On the phone." — **transparency-proof headline** (current live H1). Keep it; it is proof of trait 5, not the positioning headline
6. "Here's what you're actually paying for." — pricing-explanation headline, pairs with a driver list
7. "You shouldn't have to chase your cleaning company for an answer." — accountability
8. "Not every surface cleans the same way. We know which is which." — expertise demonstrated

Supporting lines (social, asides, not H1s): "You know that weird little ledge nobody ever cleans? Yeah. We know about it." / "No one needs to come look at your house to tell you the price." / "The number we quote is the number we bill."

**Where each angle lives (the SERP/page split):** the CTR problem is at the SERP, where a cost-intent searcher wants a number. Title tags and meta descriptions on cost guides and /pricing keep The Exact Price (②): lead with the real starting price for the service (public numbers only — do not surface internal card brackets in metas), then "your exact number in one call — firm." The page they land on carries ⭐: the system behind the number, what's included, who it's for.

---

## This, But Not That (positioning guardrails from the brief)
- Smart, but not academic.
- Premium, but not pretentious.
- Friendly, but not cutesy.
- Witty, but not comedic.
- Honest, but not blunt.
- Confident, but not cocky.
- Professional, but not corporate.
- Helpful, but not preachy.
- Modern, but not trendy for the sake of being trendy.

Applied to positioning: disqualify customers calmly, never smugly; explain price, never defend or apologize; demonstrate expertise by teaching, never by saying "we're experts"; joke about baseboards and the industry, never about the customer's house.

---

## Competitive Landscape Summary

Live research 2026-08-22 (WebSearch + Firecrawl; MaidPro/Merry Maids via Firecrawl after 403s). Not re-run 2026-08-23.

**Sophistication: Stage 3 — crowded; the market needs a mechanism.** Nine operators make near-identical promises (insured, background-checked, satisfaction guarantee, free re-clean, free estimate). Trust claims are table stakes. Quote *speed* is partially claimed. Quote *certainty* (a published number that is held) is unclaimed. So is *explanation*: nobody teaches, nobody says why they cost what they cost, nobody says who they are not for.

**Primary alternative (what customers do instead):** Request a free estimate from a franchise and wait for an in-home visit (Molly Maid, Merry Maids); or book a solo/gig cleaner at $18-$25/hr teaser rates (Care.com Huntsville avg ~$19/hr) and accept variability; or do nothing and keep searching cost guides.

**Competitors analyzed (verbatim hero/value copy):**
| Competitor | Market | Headline / key claim | Quote model | Proof |
| --- | --- | --- | --- | --- |
| MaidPro Huntsville / The Shoals | HSV + Shoals | "49-Point Checklist", "Get A Free Estimate", Best of Cleaning Awards 2019-2023 | Free estimate | 4.7 / 310 reviews |
| Bear Brothers Cleaning | HSV, N. AL incl. Florence/Muscle Shoals | "Beary Clean Guaranteed, or we re-clean for free"; "Free phone quote in under five minutes, no in-home estimator visit needed"; "$2,000,000 in insurance" | Phone, minutes | "2,000+ cleans", "250+ 5-star reviews"; discloses it is a referral agency that does not employ the cleaners |
| Two Maids Huntsville | HSV | "Your day just got a whole lot better"; "Call for a Free Estimate"; "Calculate Your Price" | Free estimate / calculator | 4.7 / 487 reviews; "trusted by 1,000 households daily nationwide" |
| Molly Maid (HSV/Decatur/Athens) | HSV | "A clean you can count on"; "Neighborly Done Right Promise"; "Request a Free Quote in under 2 minutes" | Complimentary in-home estimate | 4.8 / 381; "1.5M customers since the 1980s" |
| The Cleaning Authority Huntsville | HSV/Madison | "Life's Too Short to Clean Your Own Home"; "Detail-Clean Rotation System"; "Immediate, Accurate Online Quotes" | Online quote / free estimate | 4.8 Google |
| Merry Maids Huntsville | HSV | "re-energize your home"; "40 years of experience"; "Start my quote" | Free quote | Women's Choice Award |
| Hive Home Services | Nashville | "Fixed flat rates. No hidden fees."; "Know the price before we arrive"; per-bedroom prices listed | Instant online, flat by bedrooms | Re-clean guarantee |
| Maid Cleaning Nashville | Nashville | "Nashville's Premier Luxury Cleaning Service"; "Always-Deep"; sq-ft brackets "from $X" | Online, 60 seconds | "800+ 5-star reviews", "5,000+ satisfied customers" |
| Music City Maid Service | Nashville | "transparent flat-rate structure... know the exact price"; "book in 60 seconds" | Instant online quote | "700+ 5-star reviews", 14 years |
| Solo / gig cleaners | All | $18-$25/hr teaser; established independents $30-$50/hr | Hourly, negotiated | None portable |

**Saturated claims (3+ sites; do not lead with these):**
- Insured / background-checked
- Satisfaction guarantee, free re-clean within 24 hours
- "Free estimate" / "free quote" as the CTA
- Eco-friendly / green products
- A named checklist or system (49-Point, Detail-Clean Rotation, Always-Deep)
- Review-count social proof (250 to 800+)
- Lifestyle-relief copy ("Your day just got a whole lot better", "Life's Too Short", "re-energize your home") — the generic register the brief bans

**Partially claimed (1-2 sites):**
- Phone quote in minutes, no estimator visit — Bear Brothers (HSV). "No estimator" alone is no longer white space in Huntsville.
- "Know the price before we arrive" / flat rate by bedrooms — Hive (Nashville only)
- Square-footage bracket pricing published on the page — Maid Cleaning Nashville (Nashville only; still "from $X")
- "$2,000,000 insurance" — Bear Brothers
- "Luxury" / "premier" framing — Maid Cleaning Nashville, MaidPro (asserted, never explained)

**White space identified:**
- **Expertise-led, teach-the-customer content.** No competitor explains the work: why a surface is cleaned one way and not another, what a deep clean adds over a regular one, what "not included" actually means. The closest is MaidPro's "49-Point Checklist" (a named list, not an explanation) and The Cleaning Authority's "Detail-Clean Rotation System" (a named process, not taught). Naming a system is partially claimed; explaining one is open in all three markets.
- **Explaining the price.** Maid Cleaning Nashville asserts "luxury"; Hive positions cheap ("$119-$149"). Nobody says "here's why we cost more" and then itemizes what the money buys.
- **Qualifying the customer.** All nine sell to everyone. Nobody says "we're not for you if…"
- Nobody says the quoted price is HELD. Every published number is "from", "starting at", or "estimated." A held price with two named exceptions is unclaimed in all three markets.
- Nobody in Huntsville or the Shoals publishes a square-footage rate card at all.
- Workers'-comp employees vs. referral-agency contractors is unspoken; Bear Brothers' own disclosure opens it.
- "Veteran- and woman-owned" appears on no competitor site in any of the three markets.
- Commercial: no one promises a written quote on a clock.

---

## All Angles Explored (re-ranked 2026-08-23)

### Angle 1: ⭐ THE EXPERTS WHO HAPPEN TO BE LIKABLE (selected)
- Statement: We cost more than many cleaning companies, on purpose, and we'd rather show you the system behind that number than talk you into it.
- Psychology: Escapes the price comparison by giving the buyer competence and honesty to evaluate instead; willingness to disqualify reads as confidence.
- Headline: "We're not the cheapest option. That's intentional."
- Enemy: generic, interchangeable cleaning-company marketing; secondarily the estimator / "starting at" upsell.
- Lead proof: The Exact Price (angle ②), then checklists, crew experience, on-time/repeat rates, coverage, reviews.
- Best for: homepage, About, /pricing explanation panel, teach-content, GBP, phone script, post-first-clean retention. All three markets.
- Test: specific (15 yrs, 44/57 items, 98%, 85%, two price exceptions), differentiated (no competitor explains or qualifies), believable (every driver has a number in claims.ts), relevant (busy households tired of interchangeable options), leads somewhere (the headline is the About page and the pricing panel).

### Angle 2: THE EXACT PRICE (lead proof; owns the SERP)
- Statement: Real starting prices are on the site. Your exact price takes one phone call — and the number we quote is the number we bill.
- Psychology: Removes the upsell risk that stops a cost-intent searcher from tapping the phone number; turns the call into a confirmation of a number they already saw.
- Headline: "Your exact price. On the phone." (live H1) / "One call. One number. That's your bill."
- Role now: proof of trait 5 (transparent about pricing). It is the mechanism that makes "honest" believable, and it is still the only thing that works in a title tag. It is no longer the value claim: the value is the system; the firm number is what the system lets us promise.
- How to land it without spilling everything (Todd, 2026-08-23): we do NOT publish the full card — if every price were posted there'd be no reason to call. Starting prices earn the click and prove the floor is real; the promise is that ONE call yields ONE exact, final number. Never write "every home already has a price" (nobody quotes like that) or "we read it off the card on our pricing page."
- Proof: `pricing.ts` RATE_CARD_ROWS (25 brackets x 4 services — internal), `QUOTE_ON_CALL` (firm on the call, held, two exceptions, fallbacks), `PRICING`, `RECURRING_DISCOUNTS`.
- Supporting line (was Angle 2 "The No-Estimator Clean"): "No one needs to come look at your house to tell you the price." Bear Brothers claims phone quotes in minutes, so this is a line under The Exact Price, not an angle of its own. The edge over Bear Brothers is the held, exact price.
- Best for: cost-guide titles/metas, /pricing, paid search on "house cleaning cost [city]", GBP Q&A, phone CTA microcopy ("Get your price").
- Guardrail: held-price language must carry the two exceptions on the page and scope to "most standard residential homes, business hours."

### Angle 3: OUR PEOPLE, NOT AN APP'S (accountability + consistency)
- Statement: Veteran- and woman-owned, with background-checked cleaners on our payroll covered by $2 million in liability insurance, not contractors dispatched by a referral platform or a franchise call center.
- Psychology: "Who is actually in my house" is the second anxiety after price; maps to the brief's accountability and consistency drivers.
- Headline: "Insured, background-checked, on our payroll. Not a referral app."
- Proof: `IDENTITY`, `TRUST.workersComp`, `TRUST.liabilityCoverageDisplay`, `TRUST.backgroundChecks`, `PERFORMANCE.avgCleanerExperienceYears` (15), `.onTimeArrivalPct` (98), `.repeatCustomerPct` (85).
- Best for: About page, GBP description, review responses, Huntsville (against Bear Brothers' referral model), Madison / Hampton Cove.
- Caveat: do not claim "same team every visit" unless added to claims.ts; do not imply a competitor is unsafe, only that ours are employees.

### Angle 4: THE EVERY-OTHER-WEEK HOUSE (consistency + systems)
- Statement: Built for households that want the house reset on a schedule, at a per-visit price that is lower than a one-off and does not change.
- Psychology: The recurring customer is who the system is for; a fixed recurring price compounds "no surprises," and the 85% repeat rate is the proof that the system holds up over months, not one visit.
- Headline: "Every other week, 25% off, and the price never moves."
- Proof: `RECURRING_DISCOUNTS` (30/25/15), `RECURRING_PRICING` (weekly from $150 floor, biweekly from $150, monthly from $170), `PERFORMANCE.repeatCustomerPct` 85%, `CHECKLIST.standard` 44.
- Best for: post-first-clean email/SMS (BookingKoala), pricing page second panel, Nashville suburbs, retention.
- Caveat: weekly under ~1,000 sq ft has a known margin problem; lead with biweekly.

### Angle 5: THE TWO-HOUR WRITTEN QUOTE (commercial — secondary segment)
- Statement: Office, dental and church facility managers get a written cleaning quote within 2 business hours, priced from square footage, task list and visits per week, not a walkthrough three days out.
- Psychology: Speed + specificity for a buyer comparing three vendors; non-clinical facility cleaning only.
- Headline: "A written quote in 2 business hours. Square footage, task list, visits per week."
- Proof: `PERFORMANCE.quoteResponseSla`, `POLICIES.commercialQuoteFactors`, `TRUST`, /request-a-quote?service=commercial.
- Tension, noted: the brief defines TVCT as a *residential* company. Commercial stays because CLAUDE.md keeps commercial CTAs and the revenue is real, but it is a secondary segment: never in the residential hero, never blended into the homepage position, its own pages and outreach only.
- Caveat: no clinical, OSHA, bloodborne-pathogen or disinfectant claims (`CLINICAL` all false; `CERTIFICATIONS` empty).

### Considered and rejected
- Price certainty as the headline value claim (the prior ⭐): not rejected, demoted. The brief rules out competing primarily on price; the mechanism is kept as proof and as the SERP angle.
- A "fun cleaning company" angle (Liquid Death / Method register as the lead): the brief is explicit that this is not a comedy brand; wit is seasoning, not the position.
- The 24-hour free re-clean as a lead (risk reversal): saturated, five competitors say it. Keep as proof line only.
- "Luxury" / "white-glove": gated to Mountain Brook, West Nashville and the two luxury service slugs (`POSITIONING.luxuryScope`); not the general position.
- "We're the experts" said outright: the brief bans announcing expertise; it must be demonstrated.
- Speed of arrival / same-day: prohibited by CLAUDE.md.

### Why ⭐ The Experts Who Happen to Be Likable
The brief sets the position and it is sound strategy: at Stage 3 the buyer needs a mechanism, and "the system, explained" is a mechanism no competitor in any of the three markets offers. It also solves the problem The Exact Price could not solve alone: a real number wins the click, but on its own it invites price comparison, which is the game the business does not want to play. Leading with the system and proving it with the exact, held price gets the click *and* changes what the buyer compares.

---

## 12-Ad Testing Matrix Seed — Angle: ⭐ The Experts Who Happen to Be Likable

Cell IDs: EX-H{hook}-{format}. Formats: A static image, B short video (owner to camera / phone screen), C carousel. CTA for all residential cells: "Get your price" with the tel: link (AL 256-826-1100; TN 615-510-1427). Cells marked (from PP-…) are carried over from the former Posted Price (now Exact Price) matrix because they still fit; they are now proof cells under the new angle.

| | A — Static | B — Video | C — Carousel |
| --- | --- | --- | --- |
| **H1 Direct** "We're not the cheapest option. That's intentional." | EX-H1-A: plain text on peach (#FFA985). Body: "Here's what you're paying for: a crew averaging 15 years of experience, a 44-item checklist, a price that holds, and a re-clean within 24 hours if we missed something." | EX-H1-B: owner to camera, 20s: "We're not the cheapest. We're not trying to be. Here's what the difference buys you." Three items, no adjectives. | EX-H1-C: slide 1 the line; slides 2-5 one driver each (expertise 15 yrs, system 44/57 items, accountability $2M + 24-hr re-clean, consistency 98% / 85%); slide 6 CTA. |
| **H2 Question** "Curious what your house would actually cost to clean properly?" | EX-H2-A (from PP-H1-A): rate card crop, one row highlighted (1,500 sq ft: regular $281, deep $381). Body: "Published by square footage. Tell us the size, we tell you the number. It holds." | EX-H2-B (from PP-H2-B): phone-screen recording of /pricing scrolling to the caller's bracket, voiceover explaining what "properly" means for that service. | EX-H2-C: slide 1 the question; slides 2-4 what "properly" means (44 vs 57 items, what a move-out adds, what isn't included); slide 5 the bracket; slide 6 CTA. |
| **H3 Proof** "Your exact price. On the phone." | EX-H3-A (from PP-H2-A): "starting at" struck through. Body: "The number we quote is the number we bill. Two exceptions, both yours: you add scope, or the house is bigger than you said." | EX-H3-B (from PP-H1-B): owner reads the card on camera, 15s: "Tell me your square footage. I'll tell you the price. It doesn't change when we get there." | EX-H3-C (from PP-H3-C): slide 1 "4.9 stars, 148 reviews, one price list"; slides 2-4 three verbatim attributed reviews; slide 5 the card; slide 6 CTA. |
| **H4 Contrarian** "We're not the right cleaning company for everyone." | EX-H4-A: plain text. Body: "If you want the lowest of three quotes, we're not it. If you want the house handled by people who know what they're doing, at a number that doesn't move, call." | EX-H4-B: owner to camera: "We don't price match. Here's who we're right for, and who we're honestly not." Calm, matter-of-fact. | EX-H4-C: slide 1 the line; slide 2 "Not for you if…" (three items from the NOT-for list); slide 3 "For you if…" (three items); slide 4 the system; slide 5 the price holds; slide 6 CTA. |

Develop first: EX-H1-A, EX-H4-B, EX-H2-A, EX-H3-B. Track by cell ID in PostHog UTM (filter to AL/TN + production hostname).

---

## Guardrails carried into every downstream asset
- Prices only from `claims.ts` / `pricing.ts`; never $99, $119, $129, $135, $149, $175, $176, $225, $275, $400.
- "1,500+" is customers served, never cleanings completed.
- No same-day / emergency. No clinical, OSHA, bloodborne-pathogen, disinfectant or certification claims (`CLINICAL` all false; `CERTIFICATIONS` empty).
- "Premium" is the internal stance label, not copy. Banned oversell words in copy: best, premium, luxury, exceptional, superior, unmatched, unparalleled, elite, five-star. "Luxury" vocabulary only inside `POSITIONING.luxuryScope`.
- Banned generic phrases (brief, rule 1): "make your home sparkle", "sit back and relax", "treat your home like our own", "attention to detail", "customer satisfaction is our top priority", "locally owned and operated", "go above and beyond", "take back your time", "let us do the dirty work", "a cleaner, healthier home", "professional cleaning you can trust".
- Held-price language must carry the two exceptions somewhere on the page and must scope to "most standard residential homes, business hours."
- Never make the customer's house the joke.
- Canonical phones: AL (256) 826-1100, TN (615) 510-1427.
