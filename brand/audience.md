# Audience — The Valley Clean Team

## Last Updated
2026-08-23 by /start-here (manual audience pass; no /audience-research skill in v2.1). Owner going forward: /audience-research.

**Sources:** `brand/brand-brief.md` (AUTHORITATIVE), `brand/positioning.md` (⭐ The Experts Who Happen to Be Likable; "Who we're for / NOT for"), `brand/voice-profile.md` (audience + vocabulary notes), `src/data/claims.ts` (every number), `CLAUDE.md` (guardrails), prior verified analysis (Stripe, Google Search Console, PostHog, 2026-07 to 2026-08), and a fresh PostHog pull on 2026-08-23 (last 30 days, `$pageview`, host `thevalleycleanteam.com`, US + Alabama/Tennessee only).

**Verified vs inferred.** Anything tagged **[verified]** traces to claims.ts, Stripe, GSC, or the PostHog pull. Anything tagged **[inferred]** is a reasoned guess from the verified facts and the brief; treat it as a hypothesis until Todd or Christen confirms (see "Open questions"). No customer interviews, surveys, or CRM demographics were available for this pass.

> ### ⚠️ 2026-08-25 — BookingKoala verification pass (READ THIS FIRST)
>
> Reports pulled directly from BookingKoala on 2026-08-25 (`campaigns/icp-verification/`). Three things below are now **verified** and correct earlier inferences in this file:
>
> 1. **The active book is monthly-dominant, not biweekly.** 22 active customers: 19 recurring, 3 one-time. Of the recurring — **11 monthly, 5 biweekly**, 2 weekly, 1 twice-weekly, 1 every-3-weeks, 1 quarterly. This file's "biweekly is the money segment" framing was an inference and is wrong about the current book. BUT biweekly has produced **more lifetime revenue ($106.8K) than monthly ($96.4K)** on fewer than half the customers, so per-customer it is still the better product. Open question for Todd: is monthly what this market buys, or an un-pushed upgrade opportunity?
> 2. **Price is NOT why customers leave.** Of 50 cancellations in 2026, exactly **one** mentions price — and its note shows it was a card-pre-authorization misunderstanding, not the rate. Quality/conduct complaints: 3. **Our own capacity/availability: 12 (24%) — the single largest cause.** Verbatim notes in `campaigns/icp-verification/cancellation-notes-2026.md`. Do not write copy defending the price; the objection the data supports is "can you actually fit me in."
> 3. **AOV caution.** BookingKoala's 2026 revenue-per-booking reads **$333.16**, but that is All Industries with commercial and post-construction inflating it. The residential AOV of **$249 (Stripe)** below remains the number for copy. Never publish $333 as residential.
>
> Also verified: a **6-customer win-back list** ("I will be back", named and contactable) and that ~14% of the raw cancellation count is duplicates/admin cleanup, not churn.

**Verified facts this file leans on:**
- Residential AOV ≈ $249 (Stripe). Recurring share of residential revenue rose 57% → 68% (2025 → 2026). Fewer jobs, AOV up ~50%: the premium repositioning is working. [verified]
- ~43K Google impressions/month, mostly "how much does house cleaning cost [city]" intent. Positions 4-10 already. Local CTR 0.07%; brand-term CTR 21.6%. The problem is the click, not the rank. [verified, GSC 2026-08-21]
- `phone_click` is the conversion event. Near-zero real clicks to date. ~85% of raw PostHog visitors are datacenters: ALWAYS filter to AL/TN + production hostname. [verified]
- PostHog, 30 days to 2026-08-23, AL/TN + production host: 317 visitors. Mobile 235 (74%), desktop 72, tablet 10. Alabama 195, Tennessee 122. Top cities: Huntsville 39, Birmingham 38+, Nashville 33+, Madison 13, Antioch 12, Montgomery 9, Athens 8, Muscle Shoals 14, Florence 6, Murfreesboro 6, Decatur 5, Franklin 4. Referrer is Google for the large majority; direct is second; Yahoo/Brave are noise. [verified]
- Top pages, same filter: `/` 57 visitors, `/blog/house-cleaning-cost-nashville-tn` 42, `/blog/house-cleaning-cost-alabama` 41, `/pricing` 30, `/locations/nashville` 24, `/blog/house-cleaning-cost-huntsville-al` 23, `/services/compassionate-clean` 14, `/services/deep-cleaning` 11. Three of the top six entries are cost guides. [verified]
- Policies: no price matching; book 2-3 days out; $25 per pet; recurring discounts 30% / 25% / 15% weekly / biweekly / monthly; weekly recurring margin is negative under ~1,000 sq ft. [verified, claims.ts + pricing reconciliation 2026-08-21]

---

## Primary segment: the recurring household (the money segment)

**One line:** A dual-income household in a 1,500-3,500 sq ft home that wants the house handled every other week by people who know what they're doing, and would rather hear the real number up front than be sold to.

### Demographics
- Ages 35-60, two incomes, usually kids at home or recently launched. [inferred; matches voice-profile handoff, unconfirmed by CRM]
- Home 1,500-3,500 sq ft, owner-occupied. The biweekly customer in this band is where the math works: 25% off the regular base, positive margin, 85% repeat (`PERFORMANCE.repeatCustomerPct`). Weekly under ~1,000 sq ft loses money; do not chase it. [verified on the margin; inferred on the profile]
- Where they live: Madison, Hampton Cove, Jones Valley and south Huntsville; Athens and Decatur; the Shoals (Florence, Muscle Shoals, Tuscumbia); Mountain Brook and the over-the-mountain Birmingham suburbs; Brentwood, Franklin, Belle Meade, Hendersonville and Mt. Juliet around Nashville. PostHog confirms real traffic from Huntsville, Madison, Athens, Decatur, Birmingham, Nashville, Franklin, Murfreesboro, Antioch, Hendersonville. [cities verified; neighborhoods inferred]
- Household income comfortably above the metro median: $249 per visit, every other week, is a line item they can carry without negotiating. [inferred from AOV]
- A meaningful share are military or defense-adjacent (Redstone, Research Park) and PCS-experienced. Todd's own PCS to Huntsville is the origin story. [inferred; share unknown]

### Psychographics
- Time-poor, not money-poor. Cleaning is the chore they most resent paying for and most resent doing. [inferred]
- They have hired help before and been let down: a no-show, a gig cleaner who varied visit to visit, a price that grew once the crew was inside (positioning.md "Who we ARE for"). They are shopping for reliability more than for a clean. [inferred from positioning; consistent with 85% repeat rate]
- They research before they call. The cost guides are the top landing pages; `/pricing` is fourth. They want to walk in knowing the number. [verified behavior]
- They respect competence and are allergic to being sold. The brief's "treat customers like intelligent adults" is written for exactly this person.

### The hidden anxiety
Three fears sit under every "how much does it cost" search:
1. **The doorstep upsell.** The "starting at" number that becomes a different number once someone is standing in the kitchen. [inferred; positioning.md names it the secondary enemy]
2. **Being judged.** Letting a stranger see the house as it actually is. The brief's rule "never make the customer the butt of the joke" exists because this fear is real. [inferred]
3. **Wasting a call.** Phoning a company that will not answer, will not give a number, or will insist on a visit first. Brand-term CTR of 21.6% vs 0.07% local says people click when they already trust the name and hesitate when they do not. [verified pattern; motive inferred]

### What they respond to
- Straight numbers: "Regular cleaning from $200," then "your exact price on the phone, and it holds" (`QUOTE_ON_CALL.priceHeld`; two exceptions, both the customer's own changes).
- Being walked through the process: what is on the 44-item checklist, what deep adds (57), what is not included and what it costs.
- A company that answers: 2 business hours for a written quote; a person on the phone during business hours.
- Proof with a number attached: 4.9 stars from 148 Google reviews, 98% on-time arrival, background-checked employees insured for $2 million, re-clean within 24 hours.
- Calm willingness to say "we're not the right company for everyone" and then say who we are right for.

### What turns them off
- Hype and superlatives (best, premium, luxury, exceptional, five-star). They read it as a company with nothing specific to say.
- "Free quote" / "free estimate" bait that leads to an in-home visit or a callback funnel.
- Franchise-brochure tone: "sit back and relax," "we treat your home like our own."
- Hourly guesses ("$25-$45 an hour depending on…") that put the pricing risk back on them.
- Being made to feel their house is a problem.

### Their language
How they search [verified from GSC intent + top pages]:
- "how much does house cleaning cost in [Huntsville / Nashville / Alabama]"
- "house cleaning prices [city]" / "deep cleaning cost"
- "maid service near me" / "house cleaning service [city]"
- "move out cleaning cost" / "airbnb cleaning [city]"

How they talk [inferred; the register the copy should meet]:
- "Is it worth it?" / "What does that actually include?"
- "Do I have to be home?" / "Same people every time?"
- "I just need someone who shows up."
- "I'm embarrassed to have anyone see it right now."
- "Can you just tell me the number?"

### Objections and the honest answer
| Objection | Honest answer (brief's register) |
| --- | --- |
| "You're more expensive than the other quote." | "We're not the cheapest option. That's intentional." Then what the money buys: a crew averaging 15 years of experience, the same 44-item checklist every visit, a price that holds, a re-clean within 24 hours. |
| "Will the price change when you get here?" | No. The number we quote is the number we bill. It moves only if you add scope or the house is bigger than you told us. |
| "Can you match [competitor]?" | We don't price-match. Said plainly, no apology. |
| "I need someone this week / today." | We book 2-3 days out and don't do same-day. If that doesn't work, we're not the right fit this time. |
| "Do I have to be there?" | Answer from operations; do not invent a policy for copy. (Open question.) |
| "What about my dog?" | $25 per pet; heavy-shed surcharge $100 (`POLICIES.pets`). Say it before it lands on the invoice. |
| "What if something breaks?" | Damage claims are covered by insurance; $2 million liability. |
| "Is it worth it every other week?" | 25% off the regular base for biweekly, and the house never gets far enough gone to need a deep clean again. |

### Awareness stage (Schwartz)
- **Solution-aware, moving to product-aware.** They know a cleaning service is the answer and are pricing it (the cost-guide traffic proves it). They do not yet know TVCT specifically, which is why local CTR is 0.07% while brand CTR is 21.6%. [verified pattern]
- Copy job at this stage: lead with the real number (angle ②, The Exact Price) to earn the click, then land the page on the system (⭐) so the comparison becomes competence and honesty, not price.
- A smaller **most-aware** slice (repeat customers, referrals, 85% repeat) needs only the phone number and a reminder that the price holds.

### Decision triggers [inferred; verify against booking notes]
- New baby, or a second child.
- Moving in (PCS, relocation to Huntsville/Nashville) or preparing to sell.
- Dual-career overload: a promotion, a new commute, a return to the office.
- Aging parents: cleaning a parent's home, or a parent moving in. `/services/compassionate-clean` is a top-eight page, which suggests this trigger is already pulling traffic. [page verified; motive inferred]
- Hosting: holidays, a graduation, a party, in-laws.
- A bad experience with the last cleaner.

---

## Secondary segments

### One-time deep / move-in-out buyers
- Who: sellers and buyers, landlords turning a unit, PCS movers in and out of Redstone, and the Realtors who refer them. Deep from $276, move-in/out from $351 (49-item checklist).
- What they want: a firm number fast, a date that fits the closing or the lease, and a written scope they can forward. The 2-business-hour written quote is the hook.
- Watch-out: they are natural one-timers; treat the move-in clean as the audition for a recurring plan, not the sale.
- Realtor and property-manager referrals are the channel. [inferred]

### Airbnb / short-term rental hosts
- Who: Nashville-area hosts (Antioch, Murfreesboro, Hendersonville show up in traffic) and Shoals lake-house hosts (Wilson Lake, Pickwick). Airbnb turnover from $125. `/locations/huntsville/airbnb-cleaning` is in the top-20 pages. [traffic verified; lake detail inferred]
- What they want: reliability on a calendar they do not control, photos or a checklist per turn, and predictable per-turn pricing. Same-day turns are a real need we cannot promise; be honest about the 2-3 day booking window.
- Buy on: consistency and communication more than price.

### Commercial facility managers (secondary by brief)
- Who: office managers, dental and medical practice managers (non-clinical facility cleaning only), church administrators. Quoted from square footage, task list and visits per week (`POLICIES.commercialQuoteFactors`).
- What they want: a written quote on a clock (2 business hours), insurance certificate, a crew that is employed and background-checked.
- Note: the brand brief defines TVCT as a residential company. Commercial keeps its own pages, its BookingKoala link (`/booknow/office_cleaning`), and its own outreach; it never leads the homepage or blends into the residential position. No clinical, OSHA, bloodborne-pathogen or disinfectant claims (`CLINICAL` all false; `CERTIFICATIONS` empty).

---

## Who we're NOT for (from positioning.md)
- Bargain hunters collecting three quotes to take the lowest.
- Hourly-rate shoppers comparing us to $18-$25/hr gig teasers.
- One-off price-match seekers. We do not price match.
- Anyone who needs a crew today; we book 2-3 days out, no same-day.
- Anyone who wants a "starting at" number to negotiate down from.
- Anyone who wants to dictate the method visit to visit. The checklist is the method; that consistency is what they are paying for. [inferred extension of the brief's "systems" driver]

Say it without edge: "We're not the right cleaning company for everyone. And we're okay with that." Then say who we are right for.

---

## Language bank

| They say | We say | Avoid |
| --- | --- | --- |
| "how much does house cleaning cost" | "Regular cleaning from $200. Your exact price on the phone." | "Contact us for a free estimate" |
| "maid service" | "cleaning company," "our crew," "the team" | "maids," "the girls" |
| "starting at" | "from $200," only with the held-price promise nearby | "starting at" as a teaser |
| "is it worth it?" | "Here's what you're actually paying for." | "You deserve it" |
| "what's included?" | "the 44-item checklist," "here's what is and isn't included" | "attention to detail" |
| "will the price change?" | "The number we quote is the number we bill." | "estimate," "ballpark" |
| "same people every time?" | "the same process every visit," "the same checklist every visit" | "same team every visit" (not in claims.ts) |
| "do you do same-day?" | "We book 2-3 days out." | "emergency," "same-day" |
| "are you insured?" | "background-checked and insured for $2 million" | "bonded" (unverified), "workers' comp" (false) |
| "what if you miss something?" | "re-clean within 24 hours" | "satisfaction guaranteed" |
| "deep clean vs regular?" | "Deep adds 13 items to the 44. Here's what they are." | "top-to-bottom sparkle" |
| "my house is a mess" | "Life is messy. We've got this." | any joke about the house |
| "can you match their price?" | "We don't price-match." | "we'll work with you" |
| "who are you?" | "veteran- and woman-owned," "family-owned" | "locally owned and operated" |
| "how many people have you cleaned for?" | "1,500+ customers served" | "1,500+ cleanings" |
| "how good are you?" | "4.9 stars from 148 Google reviews" | "five-star," "the best" |
| "how fast can you quote?" | "a written quote within 2 business hours" | "instant," "in seconds" |
| "why do you cost more?" | "We're not the cheapest option. That's intentional." | "premium," "luxury," "exceptional" |

---

## Channel behavior by segment

| Channel | Primary (recurring household) | Move / deep | Airbnb hosts | Commercial |
| --- | --- | --- | --- | --- |
| Google cost queries | The front door. ~43K impr/mo, pos 4-10, 0.07% CTR. Title/meta lead with the real starting price. [verified] | High intent, "move out cleaning cost." [inferred] | "airbnb cleaning [city]," lower volume. [inferred] | Low. [inferred] |
| GBP / map pack | Where the click is lost outside the Shoals; second GBP pin for Huntsville pending. Reviews and Q&A carry the exact-price message. [verified gap] | Same. | Same. | Category "Janitorial service." [verified] |
| Facebook local groups | Recommendation threads ("anyone know a good cleaner?"); a place for the wrong-fit and exact-price lines. [inferred] | Neighborhood move-in threads. [inferred] | Host groups. [inferred] | Minimal. |
| Referrals / repeat | 85% repeat; the largest real source. [verified rate; channel share inferred] | Realtor and property-manager partners. [inferred] | Host-to-host. [inferred] | Word of mouth between practice managers. [inferred] |
| Realtor partners | Feeder into recurring after the move-in clean. [inferred] | Primary. [inferred] | Not applicable. | Not applicable. |
| Direct / brand search | 21.6% CTR on brand terms; direct is the second referrer. [verified] | | | Apollo-enriched outreach batch #4 prepared. [verified] |

Device note: 74% of real AL/TN visitors are on mobile. The phone number must be one tap away on every page; the cost guides especially. [verified]

---

## Open questions for Todd and Christen

**Answered 2026-08-25 by the BookingKoala pull** (`campaigns/icp-verification/`): Q4 (frequency split — monthly-dominant, 11 vs 5 biweekly) and Q7 (cancellation reasons — capacity 24%, price 1 of 50). Q5 (acquisition source) is **unanswerable in BookingKoala** — it isn't tracked, and the Referrals report is all zeros because the referral program is unused. Q2, Q3 (sq-ft distribution) and Q6 remain open; BK does not collect age or household type at all.

1. Actual customer age mix and household type from BookingKoala: is 35-60 / dual-income right, or is the real core older (empty-nest) or younger? **[BK does not collect this — needs a survey or address inference]**
2. Share of military / defense households among Huntsville-area customers, and whether PCS timing (summer) shows up in bookings.
3. Real square-footage distribution of recurring customers, and how many sit below ~1,000 sq ft on weekly.
4. Biweekly vs weekly vs monthly split among active recurring customers.
5. Where recurring customers actually came from (Google, referral, GBP, Facebook), even roughly, from the last 20 sign-ups.
6. "Do I have to be home?" and "same team every visit?": the operational answers, so they can go into claims.ts and then copy.
7. Top three reasons customers cancel or pause, in their words.
8. Whether compassionate-clean (aging parents, illness) traffic is converting, and whether it deserves its own segment.
9. Airbnb: Shoals lake-house hosts, real or assumed? Any active host customers today?
10. Realtor referrals: any existing relationships to formalize?
