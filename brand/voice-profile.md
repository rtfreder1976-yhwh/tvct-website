# The Valley Clean Team — Voice Profile

## Last Updated
2026-08-22 by /brand-voice (full rebuild)

> **Why this was rebuilt.** The prior profile (auto-generated 2026-05-13) carried claims the repo
> now bans: same-day/emergency availability, a 49-point standard checklist (actually 44 — and 49 is
> a MaidPro collision), "130+ five-star reviews" (actually 4.9 / 148), and "1,047+ cleanings
> completed" (the real figure is 1,500+ **customers served**). Every number in this document is
> traceable to `src/data/claims.ts`. Nothing here may be used to justify a claim that file does not
> contain.
>
> **Tone decision (Todd, 2026-08-22):** premium is the general voice default, and it is now
> canonical — `POSITIONING.stance = "premium"` in `src/data/claims.ts`. Luxury *vocabulary*
> stays gated to `luxuryScope` (Mountain Brook, West Nashville). See **✅ RESOLVED** near the
> end of this document for what moved and what deliberately did not.

---

## ✅ "Priced on the call" is now CANONICAL

Approved by Todd and landed in `src/data/claims.ts` as `QUOTE_ON_CALL` on **2026-08-22**.
`npm run validate:claims` passes.

```ts
QUOTE_ON_CALL = {
  available: true,
  scope: "most standard residential homes",
  hours: "business hours",
  priceHeld: true,                 // the quoted number is the number billed
  priceChangeExceptions: [ "customer added scope", "home details misstated at quote time" ],
  fallbackToSla: [ "after hours or voicemail", "commercial", "post-construction",
                   "homes outside the published sq-ft brackets" ],
}
```

**What this licenses:** "Your exact price, on the call." "The price we say is the price you pay."

**What it does NOT license:** a price on the call for **commercial**, **post-construction**,
**after-hours/voicemail**, or homes outside the published brackets. Those fall back to
`quoteResponseSla` — "2 business hours." Never imply anything about *cleaning* speed; this
claim is about the **quote** only. Same-day cleaning remains banned.

---

## Voice Summary

The Valley Clean Team sounds like the most competent person in the room who does not need to raise
their voice. Elevated, exact, and unhurried — a business that quotes you a real number on the phone
while the competition is still "getting back to you." Warmth is present but disciplined: it shows up
as care for the people in the home, never as chatter, exclamation points, or filler enthusiasm.

The feeling on the other end should be **relief**. Someone finally gave a straight answer.

---

## Core Personality Traits

- **Decisive.** We give the price. On the call, in plain dollars, without a site visit for a
  standard home. The voice never hedges, never says "it depends" without immediately saying what it
  depends on. Certainty is the product.

- **Elevated without ornament.** Premium is carried by precision, restraint, and specificity — not
  by adjectives. We describe the standard and the process; the reader infers the tier. One idea per
  sentence. No stacked modifiers.

- **Disciplined warmth.** Veteran-run and family-run. The care is real — Christen's whole role is
  making sure clients feel served, not "cleaned for" — but it arrives as reliability, not as
  effusiveness. Warmth is a kept promise, not a compliment.

- **Plainly accountable.** Numbers, coverage, guarantees, and the fallback if we get it wrong. 98%
  on-time. $2 million liability. Free re-clean within 24 hours. We name the terms because we intend
  to be held to them.

- **Rooted, not regional-generic.** We name the road, the neighborhood, the market. Not a franchise
  routing a call to a call center — a local operator who knows which homes have original hardwoods
  and which sit on an unpaved road.

---

## Tone Spectrum

| Dimension | Position | Notes |
|-----------|----------|-------|
| Formal ↔ Casual | **Composed-conversational.** Contractions yes; slang no | Reads like a capable professional speaking plainly, not a friend texting and not a legal notice. Fragments allowed for emphasis, sparingly. |
| Serious ↔ Playful | **Mostly serious.** Dry warmth only | Humor never at the customer's expense and never about the mess. The tagline "Life is messy. We've got this." is the ceiling for lightness. |
| Reserved ↔ Bold | **Bold in commitment, reserved in adjective** | We make hard promises (a firm price, a re-clean) and refuse soft superlatives ("best," "amazing," "unbeatable"). |
| Simple ↔ Sophisticated | **Simple words, high-standard ideas** | Sophistication lives in what we commit to and how precisely we say it — never in vocabulary difficulty. Read-level target: grade 7-8. |
| Warm ↔ Direct | **Direct delivery, warm intent** | Lead with the answer. The warmth is in what we chose to answer. |

**Premium means how we sound: elevated, confident, quality-forward, spare.**
**Premium does not mean luxury vocabulary.** "Estate," "white-glove," "concierge," "bespoke,"
"discerning" are gated words — see Vocabulary.

---

## Positioning the Voice Must Carry

The lead angle in every channel, in this order:

1. **Flat-rate pricing.** One number, agreed before we arrive. Not "starting at," not an estimate
   that moves on the day.
2. **An immediate quote by phone.** Call during business hours and most standard residential homes
   get a firm price on that call. No form, no waiting, no site visit.
3. **The same team every visit,** insured and background-checked.
4. **Proof, quietly:** 4.9 from 148 Google reviews. 98% on-time. 85% of customers stay. 1,500+
   customers served. 15 years average cleaner experience.

**The SLA is the fallback, not the headline.** "Answered within 2 business hours" applies to
voicemail, after-hours, and commercial inquiries. Never lead residential copy with the 2-hour SLA
when we can lead with "priced on the call" — leading with the wait is a CTR loss.

**Larger homes, heavy-condition jobs, and commercial** may need a follow-up before the number is
firm. Say so plainly when it applies. Never imply a phone quote is guaranteed for every job.

---

## Vocabulary

### USE

| Phrase | When |
|---|---|
| "Your exact price, on the call" | Primary residential hook. The differentiator. |
| "Flat rate" / "one price, agreed before we start" | Wherever pricing is discussed. Replaces "starting at." |
| "Same team, every visit" | Reliability proof. Highest-performing trust line we own. |
| "Insured, background-checked" | Trust row. $2 million liability, workers comp. |
| "Free re-clean within 24 hours" | Risk reversal. Use near every price. |
| "98% on time" / "85% stay with us" | Numeric proof. Use one, not all four, per block. |
| "1,500+ customers served" | **Customers served. Never "cleanings completed."** |
| "4.9 from 148 Google reviews" | Social proof, exact figures only. |
| "44-point checklist" | Standard-clean scope. **Excluded from Huntsville and Shoals copy — see Market Rules.** |
| "Weekends available" | Scheduling objection. |
| "Save 30% weekly / 25% biweekly / 15% monthly" | Recurring offer. |
| "Life is messy. We've got this." | The tagline. Closing beat, never a headline crutch. |
| "Call for your exact price" | Canonical CTA phrasing. |
| Named places — Twickenham, Hampton Cove, Monte Sano, the Shoals | Location pages. Specificity is the premium signal. |

### AVOID

| Phrase | Why | Use instead |
|---|---|---|
| "Same-day" / "emergency" / "24/7" | **Banned claim.** We do not offer it. | "Weekends available." "Book 2-3 days ahead." |
| "Starting at" / "as low as" | Undercuts the flat-rate angle and reads like a bait price. | "Flat rate." "Your exact price." |
| "Free quote in 60 seconds" | Legacy claim from the retired web form. That flow no longer exists. | "Priced on the call." |
| "49-point checklist" | Wrong (44) **and** a MaidPro collision. | "44-point checklist," where market rules allow. |
| "1,047+ cleanings" / "cleanings completed" | Wrong figure, wrong noun. | "1,500+ customers served." |
| "130+ five-star reviews" | Wrong. | "4.9 from 148 Google reviews." |
| "Sanitize," "disinfect to protocol," "OSHA," "bloodborne," "medical-grade," "hospital-grade" | **Banned.** No clinical credential is held. | "Thorough, professional cleaning." For medical facilities: "non-clinical facility cleaning." |
| "Certified," "accredited" | No named certification is held. | "Insured, background-checked, 15 years average experience." |
| "Estate," "white-glove," "concierge," "bespoke," "discerning," "indulge" | **Luxury vocabulary — gated.** | Mountain Brook and West Nashville only. Everywhere else: describe the standard. |
| "Amazing," "incredible," "sparkle," "shine," "magical," "dazzling," "spotless" | Hype and cleaning-industry cliché. Cheapens a premium voice. | A specific outcome or number. |
| "Best in [city]," "#1," "unbeatable," "industry-leading," "world-class" | Unverifiable superlative. | The 4.9/148 rating. |
| "Cheap," "affordable rates," "budget" | Wrong tier. | The actual dollar figure. |
| "Reach out," "touch base," "circle back," "leverage," "solutions" | Corporate filler. | "Call." "Text." "Email." |
| "Click here" | Non-descriptive. Also an accessibility problem. | "See full pricing." "Call 256-826-1100." |
| Retired prices: $99, $119, $129, $135, $149, $175, $176, $225, $275, $400 | **Never publish.** Validators fail the build on these. | Canonical `PRICING` figures only. |

**Jargon level:** Light. Industry terms (pH-neutral, top-down, high-touch surfaces) are welcome
where they demonstrate craft, but each must earn its place by being concrete.

**Profanity:** Never.

**Exclamation points:** At most one per page. Ideally zero. A premium voice does not need them.

---

## Market Rules (non-negotiable)

### MaidPro collision — Huntsville and the Shoals

MaidPro Huntsville/Shoals is **also** veteran-owned, **also** women-owned, and **also** markets a
numbered checklist. In those two markets these are not differentiators; leading with them makes us
sound like the second-best version of a competitor.

**In Huntsville and Shoals copy, do NOT lead with:** veteran-owned, woman-owned, or the 44-point
checklist. They may appear later as supporting detail. They must never be the headline, the first
subhead, or the meta description hook.

**Lead instead with:** the exact price on the call, flat-rate pricing, same team every visit, and
place-specific knowledge (Twickenham, Hampton Cove, Monte Sano dust).

Outside those two markets, veteran- and woman-owned is a genuine and usable differentiator.

### Luxury vocabulary scope

`usesLuxuryFraming()` permits luxury framing only for **Mountain Brook** and **West Nashville**
(plus the `white-glove-cleaning` and `luxury-homes` service routes). Everywhere else the voice stays
premium in register while using ordinary words.

### Phone routing

Alabama pages dial **(256) 826-1100**. Tennessee pages dial **(615) 510-1427**. A TN page showing
the AL number is a bug, not a style choice. Commercial CTAs keep their BookingKoala link;
residential CTAs are phone-first.

---

## Rhythm & Structure

**Sentences.** Short to medium — 8 to 16 words is the working range. One idea each. Lead the
paragraph with the conclusion. A three-to-five-word fragment for emphasis is permitted once per
section, not once per paragraph.

**Paragraphs.** One to three sentences on web. Generous white space is part of the premium read —
the visual brand (peach on a light ground, one accent per composition) and the voice follow the same
restraint rule.

**Openings.** Open with the answer or the number, never with throat-clearing. "Your Huntsville deep
clean is $381." Not "At The Valley Clean Team, we understand that every home is different."

**Numbers.** Numerals, always. They carry the proof and the design (the creative kit sets them
large and confident). One headline number per section — stacking four dilutes all four.

**Closings.** A single, plain CTA. Phone number visible as text, not hidden behind a label. Optional
tagline beat: "Life is messy. We've got this."

**Formatting.** Headers that state a fact rather than tease one. Checkmark lists for scope. Bold for
the number or the promise, not for whole sentences. Minimal emoji — none in body copy.

---

## POV & Address

**First person:** "We." "I" is reserved for Todd or Christen speaking under their own byline (About
page, blog author notes, owner emails).

**Reader address:** "You," direct and singular. "Your home," "your price," "your Tuesday."

**Relationship stance:** The trusted operator. Not a guru, not a buddy, not a vendor. We know this
work, we have done it 1,500+ customers over, and we are telling you plainly what it costs and what
you get.

---

## Platform Adaptations

| Platform | Tone Shift | Structure | Length |
|---|---|---|---|
| **Landing / service page** | Most decisive. Price and phone above the fold. Premium restraint — one claim per block, heavy white space. | Hook → flat price → what's included → risk reversal (free re-clean, insured) → proof numbers → phone CTA. Repeat the phone CTA every 2-3 scrolls. | Hero 25-40 words. Full page 900-1,600 words. |
| **Location page** | Same as service page **plus** place-specific detail. Warmth rises slightly; we are a neighbor here. | Lead with market-correct hook (see Market Rules). Name real neighborhoods and real surface conditions. Correct market phone. | 1,000-1,500 words. |
| **Blog / SEO** | Teaching register. Voice present but not selling in every paragraph. Most patient version of the voice. | Named-author byline via `BlogByline` + `BlogPostLayout`. Headers answer questions. Phone CTA blocks at intro, middle, and close. | 1,500-2,200 words. |
| **Email** | Warmest. Signed by a person — "— Todd & Christen" for owner mail, "— The Valley Clean Team" for ops. | Subject line is plain and specific: "Your Tuesday cleaning is confirmed." One CTA. Short paragraphs. | 120-250 words. |
| **SMS** | Most compressed, still composed. First name, no preamble, no emoji beyond a single checkmark. | Identify yourself → the number → one question. Always include opt-out. | Under 320 characters. |
| **Google Business Profile / local** | Most direct. This is where CTR is currently losing — front-load the differentiator in the first 8 words. | "Exact price on the call." "Flat rate." "Same team every visit." Never open with "veteran-owned" in Huntsville or the Shoals. | Posts 100-150 words. |
| **Social (FB/IG)** | Warmest and most visual. Let the photograph carry; the caption stays short and concrete. | Name the neighborhood, the service, the size. One CTA — call. No trend-chasing, no sparkle graphics. | 40-90 words. |
| **Paid ads** | Most compressed premium. Every word is the differentiator or a number. | Headline = the price promise. Description = proof + phone. | Headline ≤30 chars, description ≤90 chars. |

---

## Example Phrases

### On-brand

- "Call and we'll give you your exact price. Most standard homes get a firm number on that call."
- "Flat rate, agreed before we start. It doesn't move on the day."
- "The same team, every visit. Insured, background-checked, 15 years average experience."
- "Deep cleaning, flat rate from $276. If anything's missed, we re-clean it free within 24 hours."
- "98% of our visits start on time. 85% of our customers stay with us."
- "Weekly, biweekly, or monthly — save 30%, 25%, or 15% off the regular rate."
- "Life is messy. We've got this."
- "Call for your exact Huntsville price — 256-826-1100."

### Off-brand

- "Get an amazing sparkling clean — same-day service available!" — banned claim, hype vocabulary,
  three exclamation-adjacent moves in one line.
- "Our comprehensive 49-point checklist delivers world-class results." — wrong number, MaidPro
  collision, unverifiable superlative, corporate register.
- "Indulge in the ultimate white-glove concierge experience for the most discerning homeowners." —
  luxury vocabulary outside Mountain Brook / West Nashville; also empty.
- "Prices starting as low as $99!" — retired price, "starting at" framing, undercuts flat-rate.
- "We've completed over 1,047 cleanings for happy families!" — wrong figure and wrong noun.
- "Our medical-grade disinfection protocol meets OSHA standards." — banned clinical claim.
- "Fill out our form and we'll get back to you within 2 business hours." — leads with the wait
  instead of the phone quote; also points at a retired flow.

---

## Do's and Don'ts

**DO**
- Lead with the price and the phone number. That is the differentiator and the CTR fix.
- Use exact canonical figures, pulled from `src/data/claims.ts`.
- Say "flat rate," and say what it covers.
- Name the risk reversal near the price: free re-clean within 24 hours, $2M insured.
- Vary the market hook — Huntsville and the Shoals get the pricing angle, not the ownership angle.
- Keep one number and one promise per block. Restraint reads as premium.
- Use the correct market phone number on every page.

**DON'T**
- Promise same-day, emergency, or 24/7 availability. Ever.
- Publish a retired price, a wrong checklist count, or "cleanings completed."
- Use luxury vocabulary outside Mountain Brook and West Nashville.
- Claim clinical, medical, OSHA, or certification credentials.
- Lead residential copy with the 2-business-hour SLA when a phone quote is available.
- Stack adjectives, exclamation points, or superlatives to manufacture energy.
- Say "starting at" — it contradicts the flat-rate position.

---

## Voice Test — Three Samples

**Landing page hero**

> **Your exact price. On the call.**
> Flat-rate cleaning in Huntsville — most standard homes get a firm number while we're on the
> phone. Same team every visit. Insured and background-checked.
> **Call 256-826-1100.**

**Email opening**

> Subject: Your Thursday cleaning is confirmed
>
> Hi Sarah — you're set for Thursday at 9:00. Same two cleaners as last time, and the price is the
> $276 we agreed to. Nothing changes on the day.
>
> If anything's missed, tell us within 24 hours and we'll re-clean it free.
>
> — Todd & Christen

**Google Business Profile post**

> We quote your exact price on the phone. No form, no site visit for a standard home, no "we'll get
> back to you." Flat rate, same team every visit, free re-clean within 24 hours if we miss
> something. 4.9 from 148 Google reviews. Call 256-826-1100.

---

<details>
<summary>Structured Data (JSON)</summary>

```json
{
  "brand_name": "The Valley Clean Team",
  "last_updated": "2026-08-22",
  "updated_by": "/brand-voice",
  "tagline": "Life is messy. We've got this.",
  "tone": {
    "summary": "Elevated, decisive, and unhurried — premium carried by precision and restraint rather than luxury vocabulary, with disciplined warmth underneath.",
    "default_register": "premium",
    "premium_definition": "How the brand sounds: elevated, confident, quality-forward, spare.",
    "luxury_vocabulary_gate": ["Mountain Brook", "West Nashville", "white-glove-cleaning", "luxury-homes"],
    "spectrum": [
      { "dimension": "Formality", "left_pole": "Casual", "right_pole": "Formal", "position": 6, "notes": "Composed-conversational. Contractions yes, slang no." },
      { "dimension": "Energy", "left_pole": "Serious", "right_pole": "Playful", "position": 3, "notes": "Dry warmth only. The tagline is the ceiling for lightness." },
      { "dimension": "Confidence", "left_pole": "Reserved", "right_pole": "Bold", "position": 8, "notes": "Bold in commitment, reserved in adjective. No superlatives." },
      { "dimension": "Complexity", "left_pole": "Simple", "right_pole": "Sophisticated", "position": 4, "notes": "Simple words, high-standard ideas. Grade 7-8 reading level." },
      { "dimension": "Warmth", "left_pole": "Warm", "right_pole": "Direct", "position": 7, "notes": "Direct delivery, warm intent. Lead with the answer." }
    ]
  },
  "positioning_lead": {
    "primary": "Flat-rate pricing plus an immediate quote on the phone call",
    "secondary": "Same team every visit; insured and background-checked",
    "sla_role": "fallback_only",
    "sla_value": "2 business hours",
    "sla_applies_to": ["voicemail", "after hours", "commercial", "large or heavy-condition jobs"],
    "cta_mode": "phone_first",
    "phones": { "AL": "(256) 826-1100", "TN": "(615) 510-1427" }
  },
  "vocabulary": {
    "preferred": [
      { "term": "your exact price, on the call", "context": "Primary residential hook" },
      { "term": "flat rate", "context": "All pricing copy; replaces 'starting at'" },
      { "term": "same team, every visit", "context": "Reliability proof" },
      { "term": "insured, background-checked", "context": "Trust row" },
      { "term": "free re-clean within 24 hours", "context": "Risk reversal beside price" },
      { "term": "1,500+ customers served", "context": "Scale proof — 'served', never 'cleanings completed'" },
      { "term": "4.9 from 148 Google reviews", "context": "Social proof, exact figures" },
      { "term": "44-point checklist", "context": "Standard scope — EXCLUDED from Huntsville and Shoals leads" },
      { "term": "Life is messy. We've got this.", "context": "Closing beat, not a headline crutch" }
    ],
    "avoid": [
      { "term": "same-day / emergency / 24/7", "reason": "Banned claim — not offered", "alternative": "weekends available; book 2-3 days ahead" },
      { "term": "starting at / as low as", "reason": "Contradicts flat-rate position", "alternative": "flat rate; your exact price" },
      { "term": "free quote in 60 seconds", "reason": "Legacy claim; the web form flow is retired", "alternative": "priced on the call" },
      { "term": "49-point checklist", "reason": "Wrong count and a MaidPro collision", "alternative": "44-point checklist" },
      { "term": "cleanings completed", "reason": "1,500+ means customers served", "alternative": "customers served" },
      { "term": "130+ five-star reviews", "reason": "Wrong figure", "alternative": "4.9 from 148 Google reviews" },
      { "term": "OSHA / bloodborne / medical-grade / hospital-grade / sanitize to protocol", "reason": "No clinical credential held", "alternative": "non-clinical facility cleaning" },
      { "term": "certified / accredited", "reason": "No named certification held", "alternative": "insured, background-checked, 15 years average experience" },
      { "term": "estate / white-glove / concierge / bespoke / discerning", "reason": "Luxury vocabulary is scope-gated", "alternative": "describe the standard in plain words" },
      { "term": "amazing / sparkle / shine / dazzling / spotless", "reason": "Hype and category cliché", "alternative": "a specific outcome or number" },
      { "term": "best in city / #1 / unbeatable / world-class", "reason": "Unverifiable superlative", "alternative": "the 4.9 / 148 rating" },
      { "term": "$99, $119, $129, $135, $149, $175, $176, $225, $275, $400", "reason": "Retired prices — build validators fail on these", "alternative": "canonical PRICING values" }
    ]
  },
  "personality_traits": [
    "Decisive",
    "Elevated without ornament",
    "Disciplined warmth",
    "Plainly accountable",
    "Rooted, not regional-generic"
  ],
  "market_rules": {
    "maidpro_collision_markets": ["Huntsville", "Florence/Shoals"],
    "suppressed_leads_in_those_markets": ["veteran-owned", "woman-owned", "numbered checklist"],
    "replacement_leads": ["exact price on the call", "flat-rate pricing", "same team every visit", "neighborhood-specific knowledge"]
  },
  "proof_assets": {
    "reviewRating": "4.9",
    "reviewCount": 148,
    "onTimeArrivalPct": 98,
    "repeatCustomerPct": 85,
    "avgCleanerExperienceYears": 15,
    "customersServedDisplay": "1,500+",
    "quoteResponseSla": "2 business hours",
    "liabilityCoverageDisplay": "$2 million",
    "workersComp": true,
    "backgroundChecks": true,
    "satisfactionGuarantee": true,
    "freeRecleanWindowHours": 24,
    "weekendAvailability": true,
    "sameTeamEveryVisit": true,
    "checklistStandard": 44,
    "pricing": { "regular": "$200", "deep": "$276", "moveInOut": "$351", "airbnbTurnover": "$125", "postConstruction": "$526" },
    "recurringDiscounts": { "weekly": "30%", "biweekly": "25%", "monthly": "15%" }
  },
  "platform_adaptations": {
    "landing_page": { "tone_shift": "Most decisive; price and phone above the fold", "format_preferences": "Hook, flat price, scope, risk reversal, proof, phone CTA every 2-3 scrolls", "length": "Hero 25-40 words; page 900-1600 words", "dos": ["Lead with the price"], "donts": ["Lead with the 2-hour SLA"] },
    "location_page": { "tone_shift": "Service-page voice plus neighborhood specificity", "format_preferences": "Market-correct hook, real neighborhoods, correct market phone", "length": "1000-1500 words", "dos": ["Name real places"], "donts": ["Lead Huntsville/Shoals with veteran- or woman-owned"] },
    "blog": { "tone_shift": "Teaching register; patient", "format_preferences": "BlogPostLayout + BlogByline, question-answering headers, 3 phone CTA blocks", "length": "1500-2200 words", "dos": ["Named-author byline"], "donts": ["Hand-roll byline or schema"] },
    "email": { "tone_shift": "Warmest; signed by a person", "format_preferences": "Plain specific subject, one CTA, short paragraphs", "length": "120-250 words", "dos": ["Sign as Todd & Christen for owner mail"], "donts": ["Hype subject lines"] },
    "sms": { "tone_shift": "Most compressed, still composed", "format_preferences": "Identify, give the number, ask one question, opt-out", "length": "Under 320 characters", "dos": ["First name only"], "donts": ["Emoji beyond a single checkmark"] },
    "google_business_profile": { "tone_shift": "Most direct; front-load the differentiator in the first 8 words", "format_preferences": "Price promise, proof, phone", "length": "100-150 words", "dos": ["Open with the exact-price hook"], "donts": ["Open with veteran-owned in Huntsville or the Shoals"] },
    "social": { "tone_shift": "Warmest and most visual", "format_preferences": "Photo leads; short concrete caption; one call CTA", "length": "40-90 words", "dos": ["Name the neighborhood"], "donts": ["Sparkle graphics or trend-chasing"] },
    "paid_ads": { "tone_shift": "Most compressed premium", "format_preferences": "Headline is the price promise; description is proof plus phone", "length": "Headline <=30 chars; description <=90 chars", "dos": ["Every word is a differentiator or a number"], "donts": ["Generic cleaning-category language"] }
  },
  "audience_awareness": {
    "sophistication_level": "mixed",
    "jargon_tolerance": "light",
    "reading_level": "Grade 7-8",
    "notes": "Dual audience: busy affluent-to-mid residential homeowners across North AL and Middle TN, plus commercial facility decision-makers. Residential converts on price certainty and reliability; commercial converts on insurance, consistency, and a named contact."
  },
  "signature_phrases": [
    { "phrase": "Life is messy. We've got this.", "usage": "Closing beat; never a headline crutch" },
    { "phrase": "Your exact price, on the call.", "usage": "Primary residential hook across every channel" },
    { "phrase": "Same team, every visit.", "usage": "Reliability proof in trust rows and CTAs" },
    { "phrase": "Flat rate, agreed before we start.", "usage": "Pricing sections; replaces every 'starting at'" }
  ],
  "banned_claims": [
    "same-day cleaning",
    "emergency cleaning",
    "24/7 availability",
    "49-point standard checklist",
    "1,047+ cleanings completed",
    "130+ five-star reviews",
    "clinical/medical/OSHA/bloodborne-pathogen compliance",
    "named professional certifications",
    "retired prices: $99, $119, $129, $135, $149, $175, $176, $225, $275, $400"
  ]
}
```

</details>

---

## ✅ RESOLVED — premium is the canonical stance

Todd confirmed **Premium** on 2026-08-22, and the code was moved to match:
`POSITIONING.stance` in `src/data/claims.ts` is now **`"premium"`** (was `"transparent_value"`).

**What changed:** the stance label only.

**What deliberately did NOT change:**

- `POSITIONING.luxuryScope` stays `["Mountain Brook", "West Nashville"]`, still enforced by
  `usesLuxuryFraming()`.
- The `CLAUDE.md` guardrail — "'Luxury' is not the general brand position" — stands as written.

**The distinction this profile is built on, now backed by code:**

> **Premium is the register.** Elevated, precise, confident, quality-forward — carried by
> specificity and restraint, not adjectives. It applies everywhere.
>
> **Luxury is a vocabulary.** "Estate", "white-glove", "concierge", "bespoke". It stays gated to
> Mountain Brook and West Nashville.

This also resolves an inconsistency that predated the rebuild: `PRICE_RANGE_BAND` has been `"$$$"`
since 2026-08-20 while the stance still said `transparent_value` fifty lines below it. Those now
agree. Transparency remains a core *proof* — flat pricing, a firm price on the call, published
policies — it is simply no longer the stance label.

The eight tension points below are kept as the record of what was weighed. They are no longer
blockers; items 1-6 are now authorized, and items 7-8 are noted resolutions.

### The three sources that WERE in tension (historical — resolved 2026-08-22)

> Kept as the record of what was weighed. The stance row below is **superseded**:
> `POSITIONING.stance` is now `"premium"`. The `luxuryScope` and `CLAUDE.md` rows still stand.

| Source | What it said (before 2026-08-22) |
|---|---|
| `src/data/claims.ts` | ~~`POSITIONING.stance = "transparent_value"`~~ → now `"premium"` |
| `src/data/claims.ts` | `POSITIONING.luxuryScope = ["Mountain Brook", "West Nashville"]`, enforced by `usesLuxuryFraming()` |
| `CLAUDE.md` | "'Luxury' is not the general brand position; use it only where the canonical positioning explicitly allows it." |
| `brand/creative-kit.md` | Visual brand is warm/friendly/approachable — peach `#FFA985` + charcoal, Playfair + Inter; explicitly lists "'Luxury' framing" as a prompt guardrail to avoid |
| `claims.ts` (supporting) | `PRICE_RANGE_BAND = "$$$"` — the one code signal that *does* lean premium |

### Flagged conflicts, line by line — ALL RESOLVED 2026-08-22

> **These are closed.** Todd chose premium and `POSITIONING.stance` moved to `"premium"`, so
> items 1-6 are now authorized rather than pending. Each still says "Conflict:
> `transparent_value`" and some say "Decision needed" — that is the *original* analysis,
> preserved so the reasoning is auditable. **Do not action those prompts.** Nothing below
> requires a decision.

**1. Voice Summary — "Elevated, exact, and unhurried… the most competent person in the room."**
Conflict: `stance = "transparent_value"`. A transparent-value stance normally reads as
straightforward and accessible; "elevated" is a tier signal. Not a banned-word violation, but it is a
different stance than the code declares.
*Decision needed:* change `stance` to something like `"premium_transparent"`, or soften the summary
to plain-and-direct.

**2. Core trait "Elevated without ornament."**
Conflict: same as above. This trait exists only to make premium the default register. Under
`transparent_value` the equivalent trait would be "plainspoken."

**3. Tone Spectrum — "Simple ↔ Sophisticated: Simple words, high-standard ideas"; "Composed-conversational" formality at 6/10.**
Conflict: mild. Pushing formality above the midpoint is a premium move. `transparent_value` would
sit at 4-5.

**4. The header line: "Premium means how we sound… Premium does not mean luxury vocabulary."**
This is the load-bearing compromise in the whole document. It lets premium be the default *tone*
while keeping `usesLuxuryFraming()` intact as a *vocabulary* gate. **It is a distinction the code
does not make.** `claims.ts` has one lever (`luxuryScope`) and one stance field — there is no
representation of "premium register, non-luxury words." If Todd wants this enforced rather than
merely documented, `claims.ts` needs a new field (e.g. `POSITIONING.register = "premium"` separate
from `POSITIONING.luxuryScope`). Until then this rule lives only in prose and cannot be validated.

**5. Vocabulary — luxury words listed as "gated" rather than "banned."**
Conflict: `CLAUDE.md` says luxury is "not the general brand position," which the current profile
honors. But by framing "estate / white-glove / concierge" as *gated* rather than *forbidden*, the
profile makes them routinely available on two markets and two service routes. That matches
`usesLuxuryFraming()` exactly — **this one is compliant** — but it is worth Todd confirming that
Mountain Brook and West Nashville really should sound different from every other page, because a
premium-default voice plus a luxury-gated vocabulary means those two markets are now *two* steps
above the rest.

**6. "Restraint reads as premium" (Rhythm) and "one accent per composition" alignment with the creative kit.**
Conflict: `brand/creative-kit.md` describes the visual brand as "warm, friendly, trustworthy,
capable… like a neighbor who is genuinely good at this — **not a franchise, and not a luxury
boutique**," and lists "'Luxury' framing" under *what to avoid*. A premium-default voice on a
warm-friendly visual identity is a mismatch a reader will feel even if they cannot name it.
*Decision needed:* either the creative kit moves premium (new photography direction, tighter type
hierarchy), or the voice moves warm. Running them split is the least good option.

**7. Trait "Disciplined warmth" and the Social/Email adaptations ("warmest," neighbor register).**
Conflict: internal. These are the warm-brand holdovers that keep the profile usable with the current
visual identity. They sit awkwardly beside the premium default. They are deliberately retained — if
Todd goes fully premium, these get colder and the creative kit must move with them.

**8. `PRICE_RANGE_BAND = "$$$"` is the only code support for premium.**
Worth noting on the other side of the ledger: the schema price band was deliberately raised to `$$$`
on 2026-08-20 for exactly this reason ("$$ understated a premium, insured, veteran-and-woman-owned
service"). That change is consistent with Todd's tone decision and **contradicts** `stance =
"transparent_value"` sitting fifty lines below it in the same file. The file is already internally
inconsistent on this point, independent of anything in this profile.

### Recommended resolution path (Todd decides, not me)

- **Option A — move the code to match the voice.** Change `POSITIONING.stance` to
  `"premium_transparent"`, add a `register` field distinct from `luxuryScope`, and update the
  creative kit's mood line. Highest consistency; touches `claims.ts` and a validated file.
- **Option B — move the voice to match the code.** Drop "elevated" from the summary and traits,
  pull formality to 5/10, and let the flat-rate/exact-price angle carry the differentiation on its
  own. Requires no code change and keeps the visual brand coherent as-is.
- **Option C — split by market.** Premium default in Mountain Brook, West Nashville, and commercial;
  warm-transparent in Huntsville, Athens, the Shoals, and Nashville residential. This actually maps
  cleanly onto the existing `luxuryScope` machinery and onto the MaidPro collision problem (the two
  collision markets are the ones where a warm-local voice differentiates hardest).

**One note on the stated goal.** The bottleneck is CTR and conversion, not ranking. Of everything in
this profile, the change most likely to move that number is the **flat-rate + exact-price-on-the-call
hook replacing the 2-business-hour SLA in titles, meta descriptions, and GBP posts** — not the
premium register. The premium-vs-transparent question is worth settling, but it should not block
shipping the pricing hook.
