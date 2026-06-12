# Verified Data Findings — BookingKoala

_Generated 2026-06-07, updated with 2026 data, from 8 BookingKoala CSV exports
(2022-11 → 2026-06-07): ~2,290 paid jobs, ~$593K revenue, ~512 cancellations.
Mostly the **residential** engine — but note SOME commercial (America1) now flows
through BookingKoala under "Test Location" / Office Cleaning. Rogersville and
Precision MD are still billed outside BK. Companion: `TVCT_BookingKoala_Verified_Metrics.xlsx`._

> **Why this document exists:** the 7 Forces assessment was interview-based and its
> financial claims were never data-checked. They are now. Where they conflict, the
> data wins. **Read this top to bottom — the story refined twice as more data arrived.**

## The headline (corrected with 2026 data)

The assessment's "revenue doubled to $20K/mo, cause unknown" is **wrong** — but so was
the alarming "residential is in free-fall" read from the 2022–2025 data alone. The full
picture through 2026 is more interesting and more positive:

**You deliberately traded volume for value, and in 2026 it's working.** Job count fell,
but **average job value rose ~50%**, so revenue is recovering while you do far fewer,
higher-value, more-recurring cleans. This is the premium repositioning the assessment
*praised* (Force 2) — the data now shows you executing it.

| Year | Revenue | Jobs | AOV | What it means |
|---|---|---|---|---|
| 2023 | ~$188K | 783 | $240 | ramp-up |
| 2024 | ~$200K | 811 | $246 | peak volume |
| 2025 (full) | ~$132K | 496 | $266 | volume drop begins; AOV creeps up |
| 2026 (Jan–Jun 7) | ~$71K | 195 | **$365** | **fewer jobs, ~50% higher AOV** |

**Apples-to-apples (Jan 1 – Jun 7, same window each year):**

| YTD | Jobs | Revenue | AOV |
|---|---|---|---|
| 2024 | 364 | $81,693 | $224 |
| 2025 | 287 | $69,998 | $244 |
| **2026** | **195** | **$71,148** | **$365** |

2026 YTD revenue ≈ 2025 YTD on **32% fewer jobs**. The monthly trend confirms recovery:
the late-2025 trough (~$8–9K/mo) reversed to $10.9K → $11.7K → $14.4K → **$18.2K (May 2026,
best month since mid-2024)**. (June shows low only because it's a partial month to the 7th.)

## The repositioning is real (not a commercial-leak artifact)
- **Residential-only 2026** (excluding the commercial "Test Location"): 147 jobs,
  $52.6K, **AOV $358** — so the premium shift is in the residential book itself.
- **Recurring share rose 57% (2025) → 68% (2026)** — more predictable revenue, less
  founder-sold one-off work. The single healthiest trend in the data.
- **Service mix shifted up:** 2026's top revenue lines are Office Cleaning ($385),
  Deep Cleaning Flat Rate ($467), Move-In/Out ($453) — vs 2025's hourly/flat-rate mix.
- **Caveat:** ~$18.5K of 2026 YTD is **commercial (America1) running through BK** as
  "Test Location" / Office Cleaning. So part of the top-line recovery is commercial
  visibility, not pure residential growth. Both engines are contributing.

## The real remaining question
Volume is still **well below** 2024 (195 vs 364 YTD jobs). The strategy raised value per
job; it has **not** replaced the lost lead/booking volume. The open question — still
**unanswerable from BookingKoala** (it holds bookings, not leads) — is whether fewer
bookings = fewer Google leads (a demand problem) or the same leads converting to fewer,
bigger jobs (a deliberate filter). **That needs GA4/GMB lead data.** If leads are down,
channel diversification is urgent; if leads are steady and you're just closing bigger,
the strategy is working and the move is to scale it.

## Assessment claim vs. verified reality

| Metric | Assessment | BookingKoala data | Verdict |
|---|---|---|---|
| Revenue trend | "doubled to $20K/mo, cause unknown" | 2023–24 peak → 2025 volume drop → **2026 recovering via premium repositioning** | ❌ backwards, but recovering |
| AOV | $312 | $246 (2024) → **$365 (2026 YTD)** | trending toward/above the claim, by design |
| Cleanings completed | "1,047+" | **~2,290** (2022→2026) | understated ~2× |
| Repeat customer rate | "85% repeat" | ~58% one-and-done historically; **recurring share now 68%** and rising | ❌ as stated, but improving |
| Active recurring clients | (roadmap needs 32) | recurring share up 57%→68%; base rebuilding around higher value | shifting favorably |
| Lead source | "single channel (Google)" | Google 1,214 vs all referral ~180 | ✅ accurate — still the key risk |

## What's NOT broken (important — keeps the diagnosis honest)

- **Quality is not the problem.** Of 489 cancellations, only ~3.5% cite quality/
  service dissatisfaction. The top reasons are **scheduling** ("you did not have the
  time I wanted", 42), **price/financial** (~54), and **life-change** (moving, etc.).
  The Raving Fan score (8/10) is real — customers don't leave because the clean is bad.
- **Recurring mix is stable** (~43% one-time, ~57% recurring across all 3 years). The
  problem isn't that people won't go recurring; it's that **fewer total customers are
  coming in** and ~58% never book a second time.
- **Commercial base is intact** (3 contracts, billed outside BK) and likely what's
  been holding the top line up while residential eroded.

## What this means strategically

The assessment's frame — *"you're an 8 running at 4, just activate what's built"* —
assumed an easy-upside business. The data says otherwise: **the core residential
channel has real demand erosion.** The fixes still matter, but the priority shifts:

1. **The #1 problem is residential demand decline + single-channel (Google) dependency**
   — not conversion optimization on a growing funnel. If Google rankings/leads softened
   (consistent with the new-site re-indexing noted in `PROJECT_CONTEXT.md`), that alone
   could explain the decline. **Diagnose lead volume by month** (needs the GA4/GMB data
   we still can't query) and treat channel diversification as urgent, not "someday."
2. **58% one-and-done is the highest-leverage retention fix** — and the post-purchase /
   recurring-upsell sequence (already built, Step 2) directly attacks it. Its value just
   went UP: it's not a nice-to-have review tool, it's a **churn intervention** on the
   single worst metric.
3. **Scheduling is a real churn cause** ("you didn't have the time I wanted", 42 cancels)
   — capacity/availability, not marketing. Worth a hard look.

## Caveats (so this isn't over-read)
- **Residential only.** Total business revenue is higher and steadier (commercial not shown).
- **Service-month basis** (when the clean happened, by `Booking start date time`). A
  booking-created-date view would shift timing slightly but not the trend.
- **Lead→booking conversion still unverified** — these files are bookings, not leads.
  The assessment's 30% conversion and 200 leads/mo remain unconfirmed; needs GA4/GMB.
