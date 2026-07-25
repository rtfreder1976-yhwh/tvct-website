# Conversion Audit — thevalleycleanteam.com

**Audited:** 2026-07-25 · **Pages reviewed:** `/` (homepage, full render) and `/get-quote` (the destination of every CTA on the homepage)
**Method:** Live page fetched and rendered, then traced back to source so every finding below has a line you can open right now.

Every item in this document points at something that is actually on the page today. No best practices, no "consider A/B testing," no filler.

---

## Status: what has been fixed

Findings **3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 17** and the gate half of **16** are shipped. Finding **7** and the honest half of **8** are shipped. The rest are blocked on inputs only you have:

| # | Status |
|---|---|
| 1, 2 | **Yours** — the BookingKoala quote form is being rebuilt separately |
| 3 | ✅ Pricing added to nav (desktop + mobile); `from $99 / $175 / $225` band added under the hero |
| 4 | ✅ Gallery "3+ Years Experience" → "$2M Liability Insured"; hero relabelled "Avg. Cleaner Experience" |
| 5 | ✅ "150 5-Star Reviews" → "4.9★ from 148 Reviews" across 30 files. Count verified live: GBP is **148**, not 150 — `schemaData.ts` was publishing the inflated number as `reviewCount` in AggregateRating schema |
| 6 | ✅ One promise everywhere: "within 2 hours during business hours". "Answered live" removed. Hours now read "Mon–Fri 9am–5pm · Weekends by appointment" — the canonical `BUSINESS_HOURS` value, which resolves the contradiction without inventing weekend coverage |
| 7 | ✅ `ui-avatars.com` avatar replaced with a locally rendered initial; synthetic "Michelle T." quote replaced with the real Rhonda B. Google review |
| 8 | ⚠️ **Partial** — the duplicated Cloudinary "Post-Construction" card is deleted and the unsupported "Before & After" badge is now "Our Work". Genuine before/after pairs still need real photos from you |
| 9 | ✅ Mobile order is now H1 → subhead → CTA → image |
| 10 | ✅ New H1 "The Same Cleaning Team, Every Single Visit"; the "concierge model matches homes with cleaners" subhead is gone |
| 11 | ✅ Keyword-stuffed "near me" paragraph deleted |
| 12 | ✅ Third CTA card now points at `/booking` and reads "Book Online" |
| 13 | ✅ Decatur → `/locations/decatur`, Tuscumbia → `/locations/tuscumbia`, Hartselle → `/locations/morgan-county`, Franklin → `/locations/nashville`, footer careers → `/careers` |
| 14 | ✅ "0 Complaints" → "24hr Re-Clean Guarantee". Thumbtack **verified accurate** (4.9, 27 reviews, Top Pro) and restored as a real link. Yelp **not restored** — see #17 |
| 17 | ⚠️ **New, found while verifying #14** — the site advertised a Yelp rating it does not have |
| 15 | ⏳ **Needs your data** — I will not invent testimonials. Send recent Google reviews and I will swap the 2023 ones out |
| 16 | ✅ Gate fixed (`numberOfRuns: 3`, median-run assertions). ⏳ The ~3.1 s paint itself is still open — that is real engineering work |

**Blocked on you:** real before/after photo pairs (#8), recent Google review text (#15 — Google blocks scraping, so this needs a GBP export), and the ~3.1 s paint (#16), which is engineering work rather than copy.

**Worth your judgment, not code:** responding to the Yelp reviews (#17), and confirming whether the Facebook badge's "4.9 / 50+ reviews" is real — it is the one platform claim still unverified.

---

## The one-paragraph verdict

You have built a *trust* site and shipped it as a *conversion* site. The credibility layer is genuinely strong — $2M liability, bonded, veteran-owned, 8 real named Google reviews with service type and date, a 24-hour re-clean guarantee. That's better than most of your competitors. But the entire machine funnels into one button, that button makes a promise the destination does not keep, and the destination is a third-party iframe with no fallback. Meanwhile the page contradicts itself on experience, review count, and response time within a single scroll. You are spending your trust equity to get the click, then burning it at the moment of highest intent.

**The single highest-leverage sentence in this document:** twelve CTAs say *"See My Price"* and the page they land on cannot show a price.

---

## TOP 3, RANKED BY REVENUE IMPACT

### #1 — Every "See My Price" button leads to a form that shows no price and cannot calculate one
**Severity: CRITICAL** · **Est. impact: largest single leak on the site**

**Where on the page:** All of these, all pointing at `/get-quote`:
- Sticky header button, desktop + mobile — "See My Price" (`src/components/Navigation.astro:182`, `:330`)
- Mobile above-the-fold button — "See My Price" (`src/pages/index.astro:127`)
- Hero right-hand card — "See Your Exact Price Instantly" / "Show Me My Price" (`src/components/BookingCTA.astro:83`)
- Mid-page — "Claim Your Clean Home" (`src/pages/index.astro:225`)
- Gallery close — "Your home can look like this. See your exact price in 60 seconds." / "Show Me My Price" (`src/components/BeforeAfterGallery.astro:125`)
- Response-time block — "See My Price" (`src/components/ResponseTimeStats.astro:141`)
- Final CTA card — "See Your Exact Price" (`src/pages/index.astro:~680`)
- Bottom sticky bar — "See My Price" (`src/pages/index.astro:748`)

**What actually happens on arrival:** `/get-quote` renders a BookingKoala lead-form iframe (`src/pages/get-quote.astro:84-92`) that asks for **First Name, Last Name, Email, Phone** and nothing else. The submit button says *"Reveal My Price & Schedule Now."* No price is revealed. It is a contact form.

Worse: the form collects **zero job inputs** — no bedrooms, no bathrooms, no square footage, no service type, no ZIP. It is structurally incapable of producing a price. You are not gating a quote behind an email; there is no quote behind the email.

The headline reinforces the promise — *"Your Spotless Home is 60 Seconds Away… go straight to picking your price and time"* (`get-quote.astro:57-62`). Nobody picks a price. Nobody picks a time.

**Why this is the #1 revenue item:** this is the exit point for 100% of your CTA traffic. A visitor who clicked "See My Price" arrived pre-qualified and ready to transact. They hit a name-and-email wall and correctly read it as a bait-and-switch. High-intent visitors are the *most* sensitive to this, not the least — the ones who click hardest bounce hardest.

**Ship today (pick one, 2 hours either way):**
- **Option A — keep the promise.** Swap the BookingKoala *lead* form for your BookingKoala *booking/estimate* flow (you already have `/booking` wired at `src/pages/booking.astro`), so the visitor answers beds/baths/service/ZIP and sees a real number. This is the correct fix.
- **Option B — change the promise.** If the estimate flow isn't ready, rewrite every CTA to what you actually deliver: **"Get My Free Quote"** and subcopy **"Answer 4 questions — we text your price back within 2 hours."** Honest, and it still converts.

Do not ship a third option. The gap between the button and the page is the whole problem.

---

### #2 — Your entire conversion path is one third-party iframe with no fallback, and you deleted the escape hatches
**Severity: CRITICAL** · **Est. impact: total loss of every affected session**

**Where on the page:** `/get-quote`, the white card in the middle of the page.

**What's wrong, specifically:**
- The form is an `<iframe>` pointing at `thevalleycleanteam.bookingkoala.com` (`get-quote.astro:84-92`). If BookingKoala is slow, down, or blocked, the visitor sees a headline, three trust chips, and a **blank 1000px white box**.
- Third-party iframes and their scripts are routinely blocked by ad blockers, privacy extensions, corporate/guest networks, and iOS content blockers. This is not a rare edge case.
- The auto-resizer script that makes the form usable loads `defer` **from the same third-party origin** (`get-quote.astro:147`). One origin failing takes out both the form and its sizing.
- Height is hardcoded `height="1000px"` with `scrolling="yes"` — on a phone that's a scroll-container inside a scroll-container. Nested scroll traps are one of the most reliable ways to lose a mobile form fill.
- **And you removed the exits.** `showNav={false} showFooter={false}` (`get-quote.astro:9-10`). When the iframe fails there is no navigation, no footer, no menu — nothing but a logo and a dead white rectangle. That's a terminal page.

**Ship today (about 90 minutes):**
1. Add a native HTML fallback form directly beneath the iframe, hidden by default, revealed by a 4-second timer if the iframe hasn't reported a load. You already have a native form component built — `src/components/QuoteForm.astro` (616 lines). Wire it in as the fallback and you're done.
2. Move the two phone numbers **above** the form card, not below it (`get-quote.astro:129-141`). Right now the only working path off a broken page sits underneath the broken thing.
3. Set `showFooter={true}`. Removing distraction from a landing page is right; removing the only navigation from a page that can render blank is not.

---

### #3 — There is no price anywhere a buyer will look, and `/pricing` isn't in the navigation
**Severity: CRITICAL** · **Est. impact: silent loss across all pre-click traffic**

**Where on the page:**
- Main nav is Home · Services · Locations · About · Careers · Blog · Contact (`src/components/Navigation.astro:33-154` and mobile `:205-322`). **"Pricing" appears zero times** — confirmed, the string does not exist in the nav component.
- You have an 880-line `/pricing` page (`src/pages/pricing.astro`) linked **only from the footer**.
- The only actual numbers on the homepage — *"from $99 for recurring cleaning, $175 for deep cleaning, and $225 for move-in/out"* — are inside **FAQ answer #1**, which sits below the services grid, the locations grid, the before/after gallery, eight testimonials, the service-area map, and the response-time block. Roughly 90% of the way down a very long page.
- That FAQ answer then ends with *"Call 256-826-1100 for your exact estimate"* — pushing the one person who found your pricing back off the page and onto the phone.

**Why this costs money:** price is the #1 pre-contact question in residential cleaning. A visitor who can't find a number does not fill out a form to find out — they open a new tab and check a competitor who published theirs. You are losing these people before any CTA gets a chance, which is why this is invisible in your form-fill numbers.

**Ship today (30 minutes):**
1. Add **Pricing** to the main nav between Services and Locations, desktop and mobile. One-line change in each of the two nav blocks.
2. Put a three-card price band directly under the hero: *Recurring from $99 · Deep Clean from $175 · Move-In/Out from $225*, with "final price depends on size and condition — free quote in 2 hours" underneath. Move those numbers up from the FAQ; they already exist, they're just buried.

---

## FULL FINDINGS

| # | Issue | Severity |
|---|-------|----------|
| 1 | "See My Price" leads to a form with no price | CRITICAL |
| 2 | Conversion page is a third-party iframe with no fallback and no nav | CRITICAL |
| 3 | No price in nav or above the fold; `/pricing` hidden in footer | CRITICAL |
| 4 | Page claims "15+ Years" and "3+ Years" experience | HIGH |
| 5 | "150 5-Star Reviews" contradicts "4.9 average from 150 reviews" | HIGH |
| 6 | Response time stated three different ways; hours contradict "same-day" | HIGH |
| 7 | Auto-generated fake avatar on the highest-intent page | HIGH |
| 8 | "Before & After" gallery contains no before images; one is a reused service photo | HIGH |
| 9 | On mobile, a button and a photo render above the H1 | MEDIUM-HIGH |
| 10 | H1 targets two entire states; subhead sells a "matching model" | MEDIUM-HIGH |
| 11 | Bolded "near me" keyword stuffing in the hero paragraph | MEDIUM |
| 12 | Final CTA offers three doors, two of which are identical | MEDIUM |
| 13 | City links that dead-end at `/contact` | MEDIUM |
| 14 | Two of four review platforms aren't clickable; "0 Complaints" | MEDIUM |
| 15 | Newest testimonial is 18 months old on a © 2026 site | LOW-MEDIUM |
| 16 | Homepage never paints under ~3.1s; perf gate too noisy to diagnose | HIGH |

---

### 4. The page tells the visitor you have 15 years of experience, then tells them you have 3
**Severity: HIGH**

**Where on the page:** Two stat blocks on the same scroll.
- Hero stats bar, directly under the fold: **"15+ / Years Cleaner Experience"** (`src/pages/index.astro:184-185`)
- Before/After gallery stats, about four screens down: **"3+ / Years Experience"** (`src/components/BeforeAfterGallery.astro:111-112`)

Reinforced a third time in the trust strip — *"15 Years Avg. / Cleaner Experience"* — and a fourth in the footer — *"15 years cleaner experience on average"* (`src/components/Footer.astro:168`).

Both numbers may be technically defensible ("our cleaners average 15 years" vs. "the company is 3 years old"), but nothing on the page says that. The visitor reads two numbers, notices they don't match, and downgrades every other number on the page — including the ones that are doing real work for you, like $2M and 1,047+.

**Ship today (10 minutes):** Change `BeforeAfterGallery.astro:111-112` to **"1,047+ / Jobs Completed"** or delete the tile. Then make the hero stat unambiguous: **"15 yrs / Avg. Cleaner Experience."** Two words, and the contradiction is gone.

---

### 5. "150 5-Star Reviews" and "4.9 average from 150 reviews" cannot both be true
**Severity: HIGH**

**Where on the page:** the claim appears at least five times:
- Hero quote card trust chip — "150 5-Star Reviews"
- Hero stats bar — "150 / 5-Star Reviews" (`index.astro:192-193`)
- Testimonials header — **"4.9 average from 150 reviews"**
- Footer — "1,047+ Cleanings completed with 150 5-star reviews" (`Footer.astro:168`)
- `/get-quote` trust chips — "150 Five-Star Reviews" (`get-quote.astro:73`) and again at `:101`, and again in the testimonial line at `:125`

If all 150 reviews were 5 stars, the average would be 5.0. A 4.9 average across 150 reviews means roughly 15 of them aren't 5 stars. The two claims sit within one screen of each other in the testimonials section.

This is the kind of thing that costs you nothing to fix and quietly poisons the well when a careful buyer — exactly the buyer who pays for "luxury concierge" cleaning — spots it.

**Ship today (15 minutes):** Standardize on the true, verifiable claim everywhere: **"4.9★ from 150 Google reviews."** It's stronger anyway — a perfect 5.0 reads fake; a 4.9 reads real.

---

### 6. You promise a 2-hour response, a minutes-long response, and a 10-minute response — and your stated hours contradict all three
**Severity: HIGH**

**Where on the page:**
- Homepage hero, under the phone number: *"⚡ Most quotes replied to within 2 hours"* (`index.astro:171-173`)
- Hero quote card: *"Reply within 2 hours"*
- Response-time block: *"2 hrs / Quote Response Time — During business hours"* and *"Phone Calls — Answered live"*
- Final trust strip: *"Response in 2 Hours"*
- `/get-quote` trust chip: **"We Reply in Minutes"** (`get-quote.astro:77`)
- `/get-quote` testimonial: **"They responded within 10 minutes"** (`get-quote.astro:123`)

Then the "Call Us Now" card in the final CTA says **"Mon-Fri, 9am-5pm"** (`index.astro:668`) — while the card directly beside it advertises **"Same-day service available"** (`index.astro:698`), the response block promises *"Flexible scheduling — evenings & weekends included,"* and *"Phone Calls — Answered live."*

A visitor at 7pm on a Saturday — a very normal time to shop for a cleaner — reads "answered live" and "evenings and weekends," calls, gets voicemail, and is done with you.

**Ship today (20 minutes):** Pick one number and make it true everywhere. Recommend **"We reply within 2 hours, 7 days a week"** on both pages. Then either extend the stated phone hours to match your real availability, or replace "Mon-Fri, 9am-5pm" with **"Call or text — we reply within 2 hours."** Texting is how this market actually books; you already have "Text Us" as an approved secondary CTA and it appears nowhere on the homepage.

---

### 7. The only testimonial on your highest-intent page uses a machine-generated avatar
**Severity: HIGH**

**Where on the page:** `/get-quote`, directly below the form card — the circular orange avatar above the Michelle T. quote.

**What it actually is:** `src/pages/get-quote.astro:113` loads
`https://ui-avatars.com/api/?name=Michelle+T&background=FFA985&color=fff&rounded=true&size=48`

That's a third-party API that generates a colored circle with initials. It is a placeholder standing in for a customer photo, on the page where you are asking a stranger for their name, email, and phone number. It also fires an external network request on your conversion page, and it will render as a broken image if that service is blocked.

Compounding it: this is the *only* social proof on `/get-quote`, and "Michelle T." does not appear among the eight named reviewers on your homepage (Mckala H., Brandi S., Ginny B., Tina R., Chris P., Rhonda B., Christina T., Abigail R.). You have eight real, dated, service-tagged Google reviews and you chose to show a synthetic one instead.

**Ship today (10 minutes):** Delete the `ui-avatars.com` image entirely and swap the quote for a real one from your homepage set — **Rhonda B., January 2025** is the strongest fit for this page ("The automatic response was greatly appreciated… notifications of arrival and leaving are fantastic! Getting the photos helped a lot"). It's recent, it's verifiable, and it sells your process. Label it "via Google" like you do on the homepage.

---

### 8. The "Before & After" gallery has no before images — and one of them is a photo from your services grid
**Severity: HIGH**

**Where on the page:** "See the Difference We Make — Real results from real cleaning jobs across Alabama & Tennessee." Four cards: Kitchen Deep Clean (Huntsville), Bathroom Transformation (Madison), Move-Out Cleaning (Nashville), Post-Construction (Mountain Brook).

**What's wrong:** each card in `src/components/BeforeAfterGallery.astro:5-32` carries exactly **one** `image` field. One photo. The card then overlays a badge reading **"Before & After"** and a caption reading **"See the Transformation."** There is no before. There is nothing to compare. The `type: "grid"` / `type: "split"` fields on each item suggest a comparison layout was planned and never built.

**And the fourth card is worse:** the "Post-Construction — Mountain Brook, AL" before/after image is
`.../media/692080293937416b676d02dd.webp` — **the exact same Cloudinary asset used as the Post-Construction card image in your Services grid higher up the same page.** A visitor who scrolls the whole page sees the identical photo presented first as a service illustration and then as proof of a real job in Mountain Brook.

Before/after is the single most persuasive asset a cleaning company owns. Yours currently promises a transformation and delivers one stock-feeling photo with a badge on it.

**Ship today (1 hour):** You reference post-clean photos as a core differentiator ("49-point checklist with post-clean photos") — so the real images exist in your job records. Add a `beforeImage` field to each of the four `galleryItems` and render a simple two-up split (before left, after right) with labels. If you can only source two real pairs today, ship two cards with genuine pairs and delete the other two. **Two real before/afters beat four fake ones.** And remove the Cloudinary duplicate regardless — reusing a services-grid photo as job proof is the one finding here that could actually be called deceptive.

---

### 9. On mobile, the first things a visitor reads are a photo and a button — the H1 comes third
**Severity: MEDIUM-HIGH**

**Where on the page:** homepage hero on any phone. DOM order in `src/pages/index.astro`:
1. `:108-119` — hero photo (`lg:hidden`, mobile only)
2. `:121-133` — "See My Price" button + "Takes 60 seconds. No credit card required."
3. `:134-140` — the H1, *"House Cleaning Services in Alabama & Tennessee"*

So the mobile visitor gets a generic cleaning photo, then a button asking them to commit, and only after scrolling past both do they learn what the business does or where it operates.

I understand the intent — get a CTA above the fold on mobile. That instinct is right. But a CTA that fires before the value proposition asks for a decision from someone who hasn't been given a reason. Mobile is the majority of local-service traffic, so this is your primary experience, not your secondary one.

**Ship today (20 minutes):** Reorder the mobile block to **H1 → one-line subhead → CTA → photo**. Keep the button above the fold; just let one sentence earn it. Tighten the H1 to something that fits a phone screen — see #10.

---

### 10. Your H1 targets two entire states, and your subhead describes you as a matching service
**Severity: MEDIUM-HIGH**

**Where on the page:** homepage hero, `src/pages/index.astro:134-144`.

**H1:** *"House Cleaning Services in Alabama & Tennessee."* Nobody searches for cleaning across two states. It names no city, no benefit, and no differentiator — it's a category label. At `text-7xl` on desktop it's also the largest element on the page, so your biggest piece of real estate says the least.

**Subhead:** *"Our luxury concierge model matches homes with vetted, insured cleaners who meet strict white glove standards."*

Read that as a customer: *"matches homes with cleaners"* means you are a broker who sends whoever's available. That directly contradicts the promise you actually win on — **"Same team, every time."** It's also the only sentence on the page written in vendor-speak ("concierge model," "white glove standards") on a site that otherwise talks like a person. Your own brand guidance says avoid jargon and use second person; this sentence does neither.

**Ship today (15 minutes):**
- **H1:** *"House Cleaning You Don't Have to Manage"* or, if you want the local SEO weight in the visible headline, *"House Cleaning in Huntsville, Nashville & the Shoals."* Both name a benefit or a place. Neither names two states.
- **Subhead:** *"The same insured, background-checked team every visit — with photos when we're done, so you know exactly what you paid for."* That's your actual differentiator, in your actual voice, and it kills the broker read.

---

### 11. You've bolded "near me" search phrases inside a hero sentence
**Severity: MEDIUM**

**Where on the page:** third paragraph of the homepage hero, `src/pages/index.astro:145-152`:

> Looking for **home cleaning services near me**? The Valley Clean Team takes care of your home while you focus on what matters. Whether you need standard maintenance or detailed **house cleaners near me**, our professional team ensures a spotless space, tailored to your needs.

"…detailed **house cleaners near me**, our professional team…" is not a sentence a human wrote for another human. The bold tags make the keyword insertion *visible* — you've highlighted the seams. This is the third paragraph of your most valuable page, and it's spending that space on a search engine that stopped rewarding this pattern years ago.

**Ship today (10 minutes):** Delete the paragraph. The hero already has an H1 and a subhead; a third paragraph of body copy above the fold is dilution regardless of what it says. If you want "near me" relevance, it belongs in the location pages you already have at `/locations/huntsville`, `/locations/athens`, etc. — where the intent is real.

---

### 12. Your final CTA offers three choices, two of which go to the same place — and one of them lies about what happens next
**Severity: MEDIUM**

**Where on the page:** "Ready to stop spending your weekends cleaning? — Choose how you'd like to get started," `src/pages/index.astro:~657-702`. Three cards:

| Card | Destination |
|---|---|
| **Call Us Now** — 256-826-1100 | `tel:` |
| **See Your Exact Price** — "Takes 60 seconds. Zero obligation." | `/get-quote` |
| **Claim Your Clean Home** — "Pick your date & time. We handle the rest." | `/get-quote` |

Cards 2 and 3 are the same link with different labels and different promises. You've manufactured a choice that doesn't exist, which means one third of your visitors pick "Book online" and get a page that neither shows a price nor offers a date.

*"Pick your date & time. We handle the rest. / Same-day service available"* is the most specific promise on the entire page — and it lands on a form asking for first name, last name, email, phone.

**Ship today (20 minutes):** Make it two real doors. **Call/Text Now** and **Get My Free Quote.** Two clear options convert better than three when one is a duplicate. If you want a third, point it at `/booking` (the page exists at `src/pages/booking.astro`) and only then keep the "pick your date & time" copy — because there, it's true.

---

### 13. Clicking a city in your Service Areas section can dump you on a generic contact form
**Severity: MEDIUM**

**Where on the page:** "Service Areas — Proudly serving communities across Alabama & Tennessee," the Alabama and Tennessee city lists. In `src/components/ServiceAreaMap.astro`:

- **Decatur** → `/contact` (line 17) — but `/locations/decatur` **exists** and is linked from your own footer
- **Hartselle** → `/contact` (line 18)
- **Franklin** → `/contact` (line 29)
- **Tuscumbia** → `/locations/muscle-shoals` (line 16) — a different city's page, with no Tuscumbia content promised
- Footer: **"Join Our Team (Careers)"** → `/contact` (`src/components/Footer.astro:397`) — while `/careers` exists and is in your main nav

A visitor in Decatur clicks "Decatur" expecting a Decatur page — local proof, local reviews, local service confirmation. They get a generic form. That's the moment they conclude you don't really serve Decatur.

**Ship today (15 minutes):**
1. Point Decatur at `/locations/decatur` — the page is already built and already linked from your footer. This is a one-word change.
2. For Hartselle, Franklin, and Tuscumbia, either build the location pages or move them into the plain-text "Popular Neighborhoods" list where they carry SEO value without promising a click target.
3. Fix the footer careers link to `/careers`.

---

### 14. Two of your four review platforms aren't clickable, and "0 Complaints" invites the question you don't want asked
**Severity: MEDIUM**

**Where on the page:** "Trusted Across Multiple Platforms — See what customers are saying," the four-badge row.

In `src/components/ReviewBadges.astro`:
- **Google** — real `<a>` to `g.page/r/thevalleycleanteam/review` (line 15) ✅
- **Facebook** — real `<a>` (line 32) ✅
- **Yelp** — "4.9 Rating / 25+ Reviews" rendered as a **`<div>`, not a link** (lines 48-62) ❌
- **Thumbtack** — "4.9 Rating / Top Pro" rendered as a **`<div>`, not a link** (lines 65-79) ❌

Two of the four badges sit in a row of clickable cards and do nothing when tapped. A visitor who wants to verify your Yelp rating clicks, nothing happens, and now they're wondering why the two unverifiable badges are the two that don't link.

Directly beneath, the summary strip reads **"0 / Complaints"** (`ReviewBadges.astro:100`). Alongside "100% Would Recommend" and "100% Satisfaction Rate," that's three perfect numbers in a row — which reads as marketing, not as data. And "0 Complaints" is a claim you cannot substantiate and that a competitor could trivially challenge.

**Ship today (15 minutes):** Link the Yelp and Thumbtack badges to your real profiles. If a profile doesn't exist yet, **remove the badge** — an unverifiable rating is worth less than no rating. Replace the "0 Complaints" tile with something concrete and provable: **"24hr / Re-Clean Guarantee."** It's a real commitment, it's already elsewhere on your page, and it can't be disputed.

---

### 15. Your newest testimonial is 18 months old on a site that says © 2026
**Severity: LOW-MEDIUM**

**Where on the page:** "What Our Customers Say," the eight testimonial cards. Every card carries a service type and a date:

| Reviewer | Date |
|---|---|
| Rhonda B. | January **2025** ← newest |
| Mckala H. | October 2024 |
| Brandi S. | May 2024 |
| Abigail R. | May 2024 |
| Christina T. | March 2024 |
| Ginny B. | March 2024 |
| Tina R. | April 2023 |
| Chris P. | January **2023** |

Footer reads © 2026. So a visitor today sees a business with 150 reviews whose most recent published review is a year and a half old, and three of eight are two-to-three years old. Dating your testimonials is the right call — it's a credibility signal most competitors skip — but it only works when the dates are recent. Right now the dates are working against you.

**Ship today (30 minutes):** Pull your four most recent Google reviews and swap out the 2023 entries (Tina R., Chris P.). Keep the date labels. If you genuinely have no 2025–2026 reviews to show, that's the real finding — and the fix is a post-clean review request in your follow-up sequence, which matters more than anything else in this document over a 6-month horizon.

---

### 16. Your homepage never paints in under 3 seconds — and your performance gate is too noisy to tell you why
**Severity: HIGH**

**Where on the page:** the whole homepage, on mobile. This one isn't a judgment call — it's measured by your own CI (`.github/workflows/lighthouse.yml`, run against the Vercel preview).

I have **three** runs against **byte-identical site code** (every commit on the audit branch changed only this markdown file). Reading them together is far more informative than any one alone:

| Metric | Threshold | Run A | Run B | Run C | Verdict |
|---|---|---|---|---|---|
| Performance score (`/`) | ≥ 0.85 | 0.55 ❌ | 0.79 ❌ | 0.49 ❌ | **fails 3/3**, but swings 30 pts |
| First Contentful Paint (`/`) | ≤ 2,000 ms | 3,153 ms | 3,067 ms | 3,208 ms | **stable — never under 3.0 s** |
| Largest Contentful Paint (`/`) | ≤ 3,000 ms | 3,153 ms | 3,067 ms | 3,658 ms | over budget 3/3 |
| Total Blocking Time (`/`) | ≤ 300 ms | 1,525 ms ❌ | passed | 2,677 ms ❌ | **unusable — <300 to 2,677** |
| FCP (`/services/house-cleaning`) | ≤ 2,000 ms | 2,963 ms | 2,042 ms | 3,059 ms | over budget 3/3, ±50% |
| FCP (`/get-quote`) | ≤ 2,000 ms | 2,783 ms | 2,901 ms | 3,058 ms | **stable — never under 2.7 s** |
| LCP (`/get-quote`) | ≤ 3,000 ms | — | — | 3,058 ms ❌ | tripped once |

**The real finding, separated from the noise:**

- **Your homepage has never once painted in under 3.0 seconds.** FCP was 3,153 / 3,067 / 3,208 ms across three independent runs — a ±2% spread. This is the most trustworthy number in the whole audit, and it's a failure every time. Local-service mobile traffic arriving from a search or Maps result on cellular does not reliably wait 3 seconds. Your own project standard requires LCP within 2.5 s; you are over 3 s on every page tested.
- **`/get-quote` has never painted in under 2.7 s either** (2,783 / 2,901 / 3,058 ms) — and that's *before* the BookingKoala iframe inside it begins loading its own form. Stack that on finding #2 and the real time-to-usable-form on your conversion page is meaningfully worse than 3 s. This is the most expensive slow page you own.
- **Ignore Total Blocking Time until you can measure it properly.** It read 1,525 ms, then passed, then 2,677 ms — on identical code. That's a range from "fine" to "9× over budget" with nothing changing. Any conclusion from a single TBT sample here is unsafe.
- **One caveat on the hero, since it changes what you'd optimize:** in Runs A and B, FCP and LCP were the *same* value, which would mean the hero image is both the first and the largest paint. Run C broke that — FCP 3,208 ms but LCP 3,658 ms. So the hero is *probably* the LCP element but isn't reliably so under load, and something else can become the largest paint. Confirm which element it actually is in the Lighthouse report before optimizing for it, rather than assuming it's the hero.

**Why the noise exists (and it's a real, separate problem):** the workflow runs Lighthouse **once** per URL — the logs read `Running Lighthouse 1 time(s)`. There's no `numberOfRuns` setting, so every gate decision rests on a single unrepeated sample taken on a shared CI runner with unpredictable neighbours. That's how the score landed on 0.55, 0.79, and 0.49 for the same commit content. As configured, this check cannot distinguish a real regression from runner noise — so a genuine 10-point regression would be invisible inside the spread, and the check will eventually be ignored. That's the worst end state for a quality gate.

**Ship today, in this order:**
1. **Fix the gate before chasing the numbers (15 minutes).** Add `numberOfRuns: 3` to the `treosh/lighthouse-ci-action` step so assertions run against a median instead of a coin flip. Until this is done you cannot tell whether any performance work actually helped — which makes step 2 unmeasurable and step 3 impossible.
2. **Then attack paint time, the failure that reproduces.** FCP is over 3 s on the homepage and over 2.7 s on `/get-quote` in every run. Start by confirming from the Lighthouse report which element is actually the LCP — the preload hints at `index.astro:62-79` are already correctly media-gated, so if it *is* the hero the remaining cost is the image payload and whatever sits ahead of it in the request queue.
3. **Only then look at main-thread work.** With a median in place, re-read TBT. If it's genuinely high, the analytics/`gtag` calls wired into the CTAs (e.g. `BookingCTA.astro:80`) and other third-party tags are the first place to profile — but confirm the number is real before spending a day on it.
4. Convert the remaining PNGs (`logo.png` in `Navigation.astro:26` and `Footer.astro:217`, `og-image.png`) — small individually, free to do, listed in the minor items below.

**Scope note:** this finding is diagnosis only. Fixing it is an engineering effort, not a copy change, and it's outside what this audit PR touches — the Lighthouse job fails on this branch because the deployed site fails the 0.85 performance gate, not because of anything in this document.

---

### 17. The site advertised a Yelp rating 2.2 stars higher than the real one
**Severity: HIGH** · *Found on 2026-07-25 while verifying #14 against the live platforms.*

**Where it was on the page:** the "Trusted Across Multiple Platforms" badge row — the Yelp card, reading **"4.9 Rating / 25+ Reviews."**

**What the live profile actually says** (yelp.com/biz/the-valley-clean-team-tuscumbia):

| | Claimed on site | Actual |
|---|---|---|
| Rating | 4.9 | **2.7** |
| Reviews | 25+ | **3** |

The three reviews are Cara F. (2★, Jan 2026), Kristie C. (1★, May 2025) and M H. (5★, Jan 2023).

This is a different category from every other finding in this document. The rest are weak messaging, contradictions, or unverified claims. This one is a specific, checkable number about a third party, published on your homepage, that is wrong by 2.2 stars and roughly 8× on volume. A competitor, a journalist, or an unhappy customer can disprove it in one click. Note also that it sat directly beneath a "0 Complaints" tile.

**Fix — already shipped:** the Yelp badge is not restored, and `ReviewBadges.astro` carries a comment recording the real numbers so it doesn't get re-added by reflex. Thumbtack, which was verified accurate at 4.9 from 27 reviews with a live Top Pro badge, *is* restored as a real link.

**Two things worth your attention that I can't fix in code:**

1. **Three reviews is a tiny sample and Yelp filters aggressively.** A 2.7 there is not meaningful evidence about your service quality and I would not treat it as such. But it is a public page that ranks for your business name, and Cara F.'s review states you offered a re-clean and never followed through — that is your own 24-hour guarantee, the strongest asset on your site, publicly recorded as unhonored. Responding to that review is worth more than the badge ever was.
2. **Kristie C.'s review publicly alleges you gate Google reviews** so that only 5-star ones appear. I have no way to evaluate that claim and am not asserting it's true. But it is live, it is findable, and review gating violates Google's policies — so you should know the accusation exists rather than discover it from a customer.

**Still unverified:** the Facebook badge claims "4.9 Rating / 50+ Reviews". I did not confirm it. Given that one of the four platform claims turned out to be wrong by this margin, it is worth checking before you trust the other.

---

## Minor items (batch these into one commit)

- ~~**Logo ships as PNG in the nav and footer.**~~ **Retracted — I was wrong.** `Navigation.astro:24-27` and `Footer.astro:215-218` both already wrap the logo in a `<picture>` with a `/images/logo.webp` source and a PNG fallback, exactly as they should. My original grep matched only the `<img>` line and missed the wrapper. Nothing to fix here.
- **`og-image.png` is a PNG** — every social share and text-message preview of your site pays for it. Convert to WebP with a PNG fallback.
- **"Text Us" is an approved secondary CTA in your brand guidelines and appears nowhere on the homepage.** In residential cleaning, text-to-book converts strongly against form-fills. Add it next to the phone numbers in the hero.
- **Two phone numbers in the header on every page** (AL and TN, `Navigation.astro`). Every visitor reads both and must self-identify by state before acting. Consider a single number with routing, or show only the number matching the page's market on location pages.

---

## What's actually working — don't touch these

Worth stating plainly, because the fixes above shouldn't disturb them:

- **The trust stack is genuinely above category standard.** $2M general liability with the number stated, bonded, workers' comp, background checks, veteran-owned, family-owned. Most local competitors say "insured" and stop.
- **Eight named testimonials with service type and date.** The format is right — attributed, specific, categorized. It just needs fresher inputs (#15).
- **The 24-hour re-clean guarantee** is a real risk reversal, stated clearly, repeated consistently. This is your best asset and it's currently doing less work than it should because it never appears near a CTA.
- **Location coverage is deep** — 7 hub pages plus neighborhood pages for Belle Meade, Green Hills, Brentwood, Sheffield. That's real SEO infrastructure. It's undermined only by the four broken links in #13.
- **The FAQ block is strong** — eight questions, direct answers, real numbers, no hedging. It's the best-written content on the page. It's just at the bottom, and the pricing answer inside it deserves to be at the top (#3).

---

## Suggested order of operations

**This week — the promise gap (fixes #1, #2, #3).**
These three are one problem wearing three hats: the visitor cannot find out what it costs. Fix the CTA/destination mismatch, add the fallback form and restore the footer on `/get-quote`, and put Pricing in the nav with a price band under the hero. Nothing else on this list moves the number as much.

**Next week — the credibility contradictions (#4, #5, #6, #7, #8, #14).**
All copy and asset swaps, no engineering. Half a day of work total. Each one individually is small; collectively they're the difference between a site that reads as a real business and one that reads as a template.

**Week three — messaging and routing (#9, #10, #11, #12, #13, #15).**
Rewrite the hero, reorder the mobile block, collapse the final CTA to two real doors, fix the city links, refresh the testimonials.

**Parallel track — performance (#16).** This doesn't compete with the copy work above; it's a different kind of effort and probably a different person. Start by making the gate trustworthy (`numberOfRuns: 3`), then go after the ~3.1 s paint on `/` and `/get-quote`. A slow conversion page devalues every other fix in this document — the best CTA copy in the world is worth nothing to someone looking at a blank screen.

**Ongoing — the thing this audit can't fix for you:** a post-clean review request. Your most recent published review is from January 2025. Everything on this page is designed to convert a stranger using social proof, and the social proof has a shelf life.

---

*Findings verified against the live rendered page and traced to source on 2026-07-25. Every line reference was confirmed at time of audit.*
