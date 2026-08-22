# Positioning — The Valley Clean Team

_Rebuilt 2026-08-22 by /positioning-angles. Replaces the 2026-05-13 auto-generated file._

> **Why this file was rebuilt.** The previous version's ⭐ recommended angle was
> "Booked in 2 hours. Cleaned today." The "cleaned today" half is a **banned claim** —
> CLAUDE.md prohibits same-day and emergency cleaning language outright. That file also
> carried several stale or wrong numbers (49-point checklist, "130+ reviews",
> "recurring discounts up to 20%", $300 post-construction). None of those survive here.
> Anything quoted below traces to `src/data/claims.ts` or `src/data/pricing.ts`.

---

## ✅ CANONICALIZED — approved 2026-08-22

The primary angle rests on a claim that is **now canonical**. Todd approved it and it is in
`src/data/claims.ts` as `QUOTE_ON_CALL`. `npm run validate:claims` passes.

> **"You get a firm, flat price on the phone call."** — approved, with the scope below.

**Todd's answers to the three gating questions:**

1. **Scope** — most standard residential homes.
2. **Hours** — business hours, live person.
3. **Is the price held?** — **YES.** The quoted number is the number billed. It moves only if
   the customer **added scope** after the quote, or the home was **misstated at quote time**
   (sq ft, bedrooms, baths, pets). **Condition found on arrival is not a permitted reason to
   revise a quoted price.**

Answer 3 is the load-bearing one, and it came back strong — so this stays a **firm price**
angle, not a "fast estimate" angle. "The price is the price" is literally true.

**Boundaries that still apply.** These route to `quoteResponseSla` ("2 business hours"),
NOT to a price on the call: after-hours/voicemail, **commercial**, **post-construction**, and
homes outside the published square-footage brackets. And this claim concerns the **quote**
only — it says nothing about how fast we clean. Same-day cleaning remains banned.

---

## 🚧 DEFERRED — dual capture: call OR lead form (Todd, 2026-08-22)

**Status (Todd, 2026-08-22): DEFERRED.** The lead form and its landing page will be built as
part of a `/start-here` skills pass, not now. Nothing in `vercel.json` changes until then — the
BookingKoala redirects stay exactly as they are. **Commercial CTAs are also on hold:** `CLAUDE.md`
still says commercial keeps the BookingKoala link (`/booknow/office_cleaning`), and that rule
stands until the form work happens. Do not change commercial routing in the meantime.

**Decision:** prospects get **two** ways in — call for a firm price, **or** fill out a quote
request form. Applies to **both homeowners and businesses**. This supersedes phone-only.

**HOLD in effect.** Do not change the BookingKoala redirects in `vercel.json` until the lead
form exists. Today `/get-quote`, `/booking`, and `/booknow` all 30x straight to
`bookingkoala.com/booknow/home_cleaning`. `/get-quote` is the natural home for the new form,
so that redirect is the one that must be retired **as part of** shipping the form — not before,
or the URL dead-ends.

**Still open — settle at build time:**

- **Where the form submits.** `/api/submit-form` is deleted and `CLAUDE.md` forbids generic
  forms that bypass BookingKoala. Two viable paths: (a) embed BookingKoala's **native Lead
  Form** — the precedent already used on `/get-quote` (commit `0ab7262`), no new endpoint,
  BK keeps capture; or (b) a **new Astro API route** posting into BK — more control, but it is
  new public API surface and `CLAUDE.md` requires explicit abuse controls (rate limiting, spam
  protection).
- **Commercial routing.** `CLAUDE.md` still says commercial CTAs keep the BookingKoala link
  (`/booknow/office_cleaning`). Todd wants businesses able to call or use the form. The repo
  rule needs an explicit update, or the next contributor reverts it.

**Copy implication now:** CTAs read as *call **or** request a quote*, not phone-only. But the
`QUOTE_ON_CALL` firm-price promise applies to the **call** path only — a form submission falls
under `quoteResponseSla` ("2 business hours"). Do not let form copy imply an instant price.

---

## Primary Positioning ⭐

**Angle name:** The Price Is the Price

**One-liner:**
Most cleaning companies make you wait days for a number that changes anyway. Call The
Valley Clean Team during business hours and a real person gives you a firm flat price for
your home — the price you're quoted is the price you pay.

**Positioning statement (Dunford form):**
For North Alabama and Middle Tennessee homeowners who need a house cleaned and are tired
of chasing estimates, The Valley Clean Team is an insured residential and commercial
cleaning company that quotes a firm flat price on the phone. Unlike the national chains
that schedule an in-home estimator before naming a number — and unlike the low-ball
"starting at" ads that climb 30–80% by the day of service — the number you hear on the
call is the number you pay.

**The transformation:**
From *"I've called four places, nobody will tell me what this costs, and I still don't
have a cleaner"* → *"I made one call, I know exactly what it costs, it's booked."*

**The enemy (two heads, one frustration):**

1. **The estimate runaround.** Molly Maid sends an estimator to walk your home before
   quoting. Merry Maids publishes no price list and routes you to a consultation. MaidPro
   offers a "free estimate" you have to request. Every one of these puts days and a
   stranger-in-your-house between the customer and a number.
2. **"Starting at" bait.** The documented industry pattern where a headline rate exists
   to get a foot in the door and the real invoice lands far higher — extras billed for a
   second bathroom, for appliance exteriors, for things any reasonable person assumed
   were included.

These are the same emotional wound: **the customer does not trust that the number they
were shown is real.** TVCT's answer is not "cheaper." It is "certain."

---

## Why this angle wins

**1. It attacks a bottleneck that is actually CTR/conversion, not ranking.**
Per brand memory, positions 4–10 already convert at 0.29% and the problem is that people
do not click and do not call. "Get a free estimate" is the single most saturated,
lowest-information CTA in this category — it reads identically across every listing in the
SERP. A number-on-the-call promise gives the snippet something no neighbor listing has,
and it converts the click into a phone call rather than a form.

**2. It is the one differentiator that survives the MaidPro collision.**
MaidPro Huntsville/Shoals is also veteran- and woman-owned and also runs a numbered
checklist. Those trust signals are *neutralized* in TVCT's two most important markets —
leading with them invites a comparison against a franchise with more brand recognition.
Pricing certainty is the differentiator MaidPro cannot mirror, because franchise pricing
policy is not theirs to set.

**3. TVCT can actually deliver it, which is rare.**
`src/data/pricing.ts` holds a deterministic square-footage rate card: 25 brackets from
750 to 10,000 sq ft, across regular, deep, move-in/out, and post-construction. Whoever
answers the phone can produce a real number for essentially any standard home without
looking at it first. **The capability already exists — this angle just names it and puts
it in the window.** That is a Type 2 mechanism (revealed, not invented): the one who
explains it first owns it.

**4. It matches the canonical stance.**
`POSITIONING.stance = "premium"` and `POLICIES.priceMatching = false`. TVCT does
not compete on being cheapest and does not chase competitor quotes. "The price is the
price" is the exact consumer-facing expression of a no-price-matching, transparent-value
posture — it converts a policy that could read as rigid into a promise that reads as
honest.

**5. It is defensible against the closest threat.**
Bear Brothers (Birmingham/Huntsville) already advertises a phone quote "in under five
minutes, no in-home estimator visit needed." **Speed of quote is therefore partially
claimed and must not be the lead.** But their guarantee covers re-cleaning only — it says
nothing about price finality, and their site does not commit to the quoted number being
final. The white space is not *fast*, it is *firm*. Lead with finality; let speed be the
supporting detail.

---

## The mechanism (name it, then explain it)

**Name:** The Bracket Book

**Explanation for copy (2 sentences):**
Every home size from 750 to 10,000 square feet already has a set price for every service
we offer, written down before you ever call. So when you tell us your square footage and
what you need, we are reading you a number — not inventing one, and not guessing what you
will pay.

**Why the mechanism matters:** It answers the skeptic's real question — *"How can you
possibly know without seeing it?"* Without the mechanism, "firm price on the call" sounds
like a bluff a salesperson will walk back. With it, the promise becomes obviously
operable, and simultaneously explains why the chains *can't* do it: they price per-home
per-estimator, so they have nothing to read from.

Use "The Bracket Book" as an internal name and an explanatory device. Do not
trademark-style it or over-brand it in customer copy.

---

## Proof stack

Ranked by conversion weight for this specific angle. Every item is canonical today unless
marked.

**Tier 1 — proves the pricing promise:**
- Published square-footage rate card, 750–10,000 sq ft, all four residential services
  (`src/data/pricing.ts`) — the single strongest asset. It is the receipt for the claim.
- Flat upfront pricing; TVCT does not advertise "starting at" as its retail promise
- Published starting prices: regular **$200**, deep **$276**, move-in/out **$351**,
  Airbnb turnover **$125**, post-construction **$526**
- Recurring discounts stated as real numbers: weekly **30%**, biweekly **25%**,
  monthly **15%**
- Published policies rather than surprise line items: 24-hour cancellation notice
  ($100 fee), travel fee $5–15, pets $25/pet, green products free on request
- `PERFORMANCE.quoteResponseSla` = **2 business hours** — the fallback promise
- ⚠️ *PENDING:* firm price on the call (`PERFORMANCE.quoteOnCall`)

**Tier 2 — proves you can trust the team behind the price:**
- **$2 million** liability coverage, workers comp, background checks
- Satisfaction guarantee with a free re-clean within **24 hours**
- **98%** on-time arrival
- **44-item** standard checklist *(see market notes — suppress in Huntsville and Shoals)*

**Tier 3 — proves other people already believed it:**
- **4.9** rating across **148** reviews
- **1,500+ customers served** — never "cleanings completed"
- **85%** repeat customers — the strongest quiet proof that the price held; people do not
  rebook a company that surprised them on the invoice
- **15 years** average cleaner experience
- Same team every visit; weekend availability

**Pairing rule:** every pricing claim ships with a trust claim. "Firm price on the call"
alone reads as a discount pitch. "Firm price on the call, from a $2M-insured,
background-checked team" reads as a premium one. This matters because `PRICE_RANGE_BAND`
is `$$$` — TVCT is not the cheap option and must never sound like it.

---

## Headline candidates

**Tier 1 — recommended, lead with these** *(all gated on claim approval)*

1. **"The price we say on the phone is the price you pay."**
   Plainest, most repeatable, hardest to misread. Best default for the homepage hero.
2. **"Get your exact price on the call. Not in three days."**
   Sharpens against the estimate runaround directly. Strong for paid search.
3. **"No estimator in your living room. No 'starting at.' Just your price."**
   Names both enemies in one line. Best for meta descriptions and ad copy where the
   competitive contrast does the clicking.
4. **"Call. Get a real number. Book it."**
   Three-beat, phone-first, mobile-friendly. Strong sticky-bar or above-the-fold CTA.

**Tier 2 — supporting and section headers**

5. "Every home size already has a price. We just read you yours."
   *(The mechanism, stated plainly. Ideal above the rate card.)*
6. "Life is messy. Pricing shouldn't be."
   *(Tagline bridge. Use sparingly — it is charming but it soft-pedals the promise.)*
7. "1,500+ homes. One price, quoted once."

**Sub-head (recommended pairing with #1 or #2):**

> Tell us your square footage and what you need — most standard homes get a firm flat
> price right on the call. Insured to $2 million, background-checked, and the same team
> every visit. Serving North Alabama and Middle Tennessee.

**Pre-approval fallback sub-head** (use until `quoteOnCall` is canonical):

> Call for your exact price, or send details and we'll come back within 2 business hours
> with a flat quote. Insured to $2 million, background-checked, same team every visit.

**Banned in every headline:** same-day, today, emergency, immediately, right now,
"cleaned today," "24/7." *Immediate* is acceptable **only** when modifying the **quote**
("immediate quote"), never the cleaning. Even there, prefer "firm" or "exact" — they
carry the differentiator, where "immediate" drifts toward the banned territory and toward
Bear Brothers' claimed speed ground.

---

## Objection handling

| Objection | Response | Backed by |
|---|---|---|
| "How can you quote without seeing my house?" | Every home size already has a set price for every service. Tell us your square footage and we read you the number. | The Bracket Book / `pricing.ts` |
| "What if the price changes when you arrive?" | The quote holds for the home you described. It only moves if the scope does — you added rooms, or the square footage was different than stated. | ⚠️ Requires Todd's confirmation (Q3 above) |
| "That's more than the $19/hr I saw online." | That's a gig marketplace — different stranger each visit, no insurance, no accountability. We're $2M insured, background-checked, and it's the same team every time. | `TRUST`, same-team |
| "Can you match a competitor's quote?" | No — we don't price-match. We publish one honest price and hold it. | `POLICIES.priceMatching = false` |
| "Why should I trust the number?" | 85% of our customers rebook. Nobody rebooks a company that surprised them on the invoice. | `PERFORMANCE.repeatCustomerPct` |
| "What if I'm not happy?" | Free re-clean within 24 hours, satisfaction guaranteed. | `TRUST.freeReclean` |
| "I need it cleaned today." | **Never promise same-day.** Redirect: "We book 2–3 days out — let's get your price now and grab the first slot that works." | `POLICIES.bookingAhead`; same-day is banned |
| Very large home / heavy post-construction / commercial | Honest carve-out: "For a home this size / a job in this condition, I want to get you an accurate number rather than a fast one — we'll come back within 2 business hours." | `quoteResponseSla` |

**On the carve-out:** do not hide it. Stating "most standard homes" openly is what makes
the promise credible — an unqualified absolute invites the reader to hunt for the catch.
The carve-out *is* a trust asset. Copy should say **most standard homes**, never "all
homes."

---

## Market-by-market notes

| Market | Lead with | Suppress | Notes |
|---|---|---|---|
| **Huntsville** | Price certainty, insurance, same team | ❌ veteran-owned, ❌ woman-owned, ❌ "44-item checklist" | **MaidPro collision zone.** MaidPro Huntsville is veteran/woman-owned with a numbered checklist. Bear Brothers also operates here with a 5-minute phone quote — so lead on *firm*, not *fast*. Hardest market; the pricing angle is the only clean differentiator. |
| **Florence / Shoals** | Price certainty, local presence, same team | ❌ veteran-owned, ❌ woman-owned, ❌ "44-item checklist" | **MaidPro collision zone.** Bear Brothers also present (Muscle Shoals). Per brand memory this is the one market where TVCT does appear in the map pack — pricing clarity converts existing visibility. |
| **Athens** | Price certainty **+** veteran- and woman-owned | — | No MaidPro collision found. Full identity stack is available here — use it as a secondary trust layer under the pricing lead. |
| **Birmingham / Mountain Brook** | Price certainty; **Mountain Brook only:** luxury framing | Do not extend luxury framing outside Mountain Brook | Bear Brothers is the direct positioning competitor here and claims the fast-quote ground. Differentiate on **finality**, not speed. Luxury framing is code-scoped via `usesLuxuryFraming()` to Mountain Brook only. |
| **Nashville / West Nashville** | Price certainty; **West Nashville only:** luxury framing | — | TN pages must dial **(615) 510-1427**. Luxury framing scoped to West Nashville only. |
| **Commercial (all markets)** | 2-business-hour quote SLA, insurance, consistency | ❌ Do not promise a firm price on the call | Commercial pricing genuinely depends on square footage, task list, and services per week (`POLICIES.commercialQuoteFactors`). The 2-hour SLA is the right promise here. Omit numeric JSON-LD Offer pricing for custom-quoted commercial. |

**Standing rule:** the pricing angle is the one message that works in **every** market
without collision. Identity and checklist claims are market-conditional. That is precisely
why pricing is the lead and identity is support — it is the only angle that scales across
the whole footprint.

---

## CTA architecture

**Todd's decision, 2026-08-22: phone-first for BOTH residential and commercial.**

- Alabama pages → **(256) 826-1100**
- Tennessee pages → **(615) 510-1427**
- Secondary CTA next to the phone button may link to `/pricing` (price research intent) —
  this pairs unusually well with this angle, since the rate card *is* the proof
- BookingKoala remains system of record; `vercel.json` redirects and SchemaMarkup
  `ReserveAction` stay pointed at BK

> ### 🚩 CLAUDE.md conflict — needs an explicit update
>
> `CLAUDE.md` currently states: *"Commercial CTAs keep their BookingKoala link
> (/booknow/office_cleaning)."* Todd's 2026-08-22 instruction **overrides** this — commercial
> CTAs go phone-first too.
>
> **This file does not have authority to change CLAUDE.md, and I did not edit it.**
> Someone must update the "BookingKoala owns booking" section of CLAUDE.md to record the
> new decision before commercial CTA code changes land, or the repo rules and the shipped
> code will contradict each other and the next contributor will "fix" it back.

---

## Competitive landscape

```
──────────────────────────────────────────────────

  COMPETITIVE MESSAGING LANDSCAPE
  Verified 2026-08-22

──────────────────────────────────────────────────

  Competitors Analyzed
  ├── MaidPro (Huntsville / Shoals / Athens)
  │   — "Free estimate", numbered checklist,
  │     veteran + woman-owned. No public price.
  ├── Molly Maid — "Request a free in-home
  │   estimate"; estimator walks your home
  │   BEFORE a number is named.
  ├── Merry Maids — publishes no price list;
  │   routes to consultation. "Every home is
  │   different."
  ├── Bear Brothers (Birmingham / Huntsville)
  │   — "Beary Clean Guaranteed"; phone quote
  │     "in under five minutes, no in-home
  │     estimator." Guarantee covers RE-CLEAN
  │     only — silent on price finality.
  ├── The Cleaning Authority — 24-hr re-clean
  │   guarantee (reactive).
  ├── The Maids — "96% would recommend."
  └── Homeaglow / Handy / Care.com — fast and
      cheap, gig pools, no consistency.

  ──────────────────────────────────────────────

  Saturated Claims (do not lead with these)
  ├── "Free estimate" / "Get a free quote"
  ├── "Licensed, bonded and insured"
  ├── "Satisfaction guaranteed / free re-clean"
  ├── "Background-checked professionals"
  └── "Top-rated / best in [city]"

  Partially Claimed
  ├── Fast phone quote — Bear Brothers
  │   ("under five minutes"). DO NOT lead here.
  ├── Same cleaner recurring — Bear Brothers,
  │   Molly Maid, MaidPro
  └── Veteran + woman-owned + numbered
      checklist — MaidPro, in TVCT's two
      biggest AL markets

  Underexploited Territory  ← the opening
  ├── Nobody guarantees the quoted price is
  │   FINAL. Bear Brothers is fast but silent
  │   on finality; the chains won't quote at
  │   all until they've walked the house.
  ├── Nobody publishes a full size-by-size
  │   rate card. TVCT already has one built.
  ├── Nobody names the "starting at" bait
  │   pattern out loud and positions against
  │   it — despite it being the industry's
  │   best-documented consumer complaint.
  └── Nobody makes NOT price-matching a
      virtue ("one honest price, held").

──────────────────────────────────────────────────
```

**Market assessment**

```
  Sophistication:  Stage 3 — mechanism needed
  Transformation:  From "nobody will tell me
                   what this costs" to "I know,
                   and it's booked."
  Mechanism:       The Bracket Book — every home
                   size is priced in advance
  Primary alt.:    Call 3–4 companies, wait days
                   for estimates, compare, stall
```

Stage 3 is the correct read: the market has heard every promise, has been burned by
"starting at," and is now skeptical. Skeptical markets do not respond to bigger claims —
they respond to **mechanisms**. That is why the rate card must appear alongside the
promise rather than a page away.

---

## Secondary / alternative angles

Supporting material. **Not** proposals to replace the primary — Todd's lead angle is
settled. Each of these works as a section, a campaign, or a test, and each reinforces the
primary rather than competing with it.

### ② The Same Four Faces
**Statement:** Not a rotating pool of strangers — the same background-checked team at your
door every visit.
**Psychology:** The unspoken fear in home services is not bad cleaning; it is *strangers
in my house, different ones each time.* Aggregators are structurally incapable of matching
this.
**Headline:** "The same team, every visit. You'll learn their names."
**Best for:** Recurring-service conversion, aggregator switchers, families with kids/pets.
**Caution:** Bear Brothers, Molly Maid and MaidPro all make versions of this claim. Strong
as a *supporting* section, weak as a lead. Pairs naturally with the 85% repeat-customer
stat.

### ③ The Rebook Rate
**Statement:** 85% of our customers book us again — the number that actually measures
whether a cleaning company is good.
**Psychology:** Star ratings are assumed inflated. A repeat rate is a harder, stranger,
more credible statistic, and it *indirectly proves the pricing promise* — nobody rebooks a
company that surprised them on the invoice.
**Headline:** "85% of our customers book us again. Ratings can be gamed. That can't."
**Best for:** Skeptical comparison shoppers; review-heavy SERPs where 4.9 ratings are
everywhere and indistinguishable.
**Caution:** Never imply competitors fake reviews. Frame as "this is a better metric," not
"theirs are fake."

### ④ Recurring Math
**Statement:** Weekly service is 30% off every visit — the discount is published, not
negotiated.
**Psychology:** Converts a price objection into an upsell and lifts LTV. A *published*
discount reinforces the transparency angle rather than diluting it.
**Headline:** "Weekly, 30% off. Biweekly, 25%. Monthly, 15%. Published, not negotiated."
**Best for:** Pricing page, recurring-service pages, post-quote follow-up.
**⚠️ Business caution:** Per brand memory, **weekly recurring margin is negative under
~1,000 sq ft**. Do not run this as an acquisition campaign into small homes until that
pricing decision is resolved. Safe as on-site upsell copy to already-qualified leads.

---

## Messaging do / don't

**Do**
- Lead with **finality** of price ("firm", "exact", "the price you pay"), not speed
- Show the rate card near every pricing promise — mechanism beside claim
- Say "**most standard homes**"; name the carve-out openly
- Pair every price claim with a trust claim ($2M insured, background-checked)
- Use phone-first CTAs; `/pricing` as the secondary link
- Say "1,500+ **customers served**"
- Attack the *pattern* ("starting at" bait, estimator visits), never a named competitor

**Don't**
- ❌ Never same-day, today, emergency, or 24/7 — banned outright
- ❌ Never lead Huntsville or Shoals with veteran-owned, woman-owned, or the checklist number
- ❌ Never say 49 items — it is 44, and 49 is MaidPro's number
- ❌ Never "130+ reviews" — it is 4.9 / 148
- ❌ Never "cleanings completed" for the 1,500+ figure
- ❌ Never publish retired prices: $99, $119, $129, $135, $149, $175, $176, $225, $275, $400
- ❌ No clinical, medical, OSHA, or certification claims — none are held
- ❌ No luxury framing outside Mountain Brook and West Nashville
- ❌ Don't compete on hourly rate against gig platforms — reframe to insured + consistent
- ❌ Don't promise a firm phone price for **commercial** — use the 2-business-hour SLA
- ❌ Don't ship the firm-price claim at all until `quoteOnCall` is canonical

---

## Guardrail tensions logged

1. **`quoteOnCall` is not canonical.** The lead angle depends on a claim that does not
   exist in `claims.ts`. Human gate, not an automated one — `validate:claims` cannot catch
   it. **Blocking for published copy.**
2. **CLAUDE.md contradicts the new commercial CTA decision.** Repo rules still say
   commercial CTAs keep the BookingKoala link. Not edited here by design; needs an
   explicit update.
3. **`PRICING.postConstruction` is $526**, not the $300 in the old positioning file and in
   parts of CLAUDE.md's key-values list. `claims.ts` is authoritative and was corrected
   2026-08-20 against BookingKoala. CLAUDE.md's summary list is stale on this line.
4. **Bear Brothers partially occupies the fast-quote ground** with a sub-5-minute phone
   quote. Mitigated by leading on finality rather than speed — but if they ever add a
   price-lock guarantee, this angle needs re-sharpening. Worth re-checking quarterly.
5. **"Immediate" drifts toward banned territory.** Todd's framing uses "immediate quote."
   Safe only when modifying *quote*; "firm"/"exact" are preferred because they carry the
   actual differentiator and cannot be misread as same-day service.
6. **Weekly recurring margin is negative under ~1,000 sq ft.** The 30% discount is
   canonical and publishable, but should not anchor acquisition campaigns aimed at small
   homes until resolved.
7. **44-item checklist is suppressed in 2 of 5 markets** due to the MaidPro collision,
   which weakens it as a global proof point. Reflected in the tiering above.

---

## Downstream

Copy, landing pages, ads, and meta descriptions should build from the **primary angle**
and the **Tier 1 headlines** — subject to the pending-canonicalization gate. Until Todd
approves `quoteOnCall`, ship the 2-business-hour fallback and hold the firm-price
headlines in draft.

`brand/voice-profile.md` is being rebuilt in parallel and was deliberately **not** read for
this file — it currently contains banned claims. Re-check tone alignment against the
rebuilt voice profile before copy ships.
