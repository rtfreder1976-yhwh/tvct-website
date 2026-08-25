# BookingKoala Report Pull — 2026-08-25

_Pulled by Claude via in-app browser (logged in as Todd). Read-only: filters changed, no data modified. Purpose: answer the open questions in `brand/audience.md` with verified numbers instead of inferences._

---

## 1. Active customer mix (Customer reports → Report Metrics, as of 08/25/2026)

**This is the answer to audience.md open question #4 (recurring frequency split).**

| Segment | Active customers |
| --- | --- |
| **Active customers total** | **22** |
| Active recurring | **19 (86%)** |
| Active one-time | 3 (14%) |

Recurring, broken out:

| Frequency | Active customers | Share of recurring |
| --- | --- | --- |
| Once per month | **11** | 58% |
| Twice a month (biweekly) | **5** | 26% |
| Once per week | 2 | 11% |
| Twice a week | 1 | 5% |
| Every 3 weeks | 1 | — |
| Quarterly | 1 | — |

> ⚠️ **This contradicts the audience.md assumption.** `audience.md` names **biweekly** as "the money segment" and the primary ICP. The active book is actually **monthly-dominant**: 11 monthly vs 5 biweekly. Monthly is the 15%-discount tier — the *least* discounted recurring tier, but also the least frequent revenue.
>
> Two readings, and Todd should settle which: (a) monthly is genuinely what this market buys, and the copy should stop centering biweekly; or (b) biweekly is the better product and we have simply never pushed customers up from monthly — which would make a monthly→biweekly upgrade campaign the highest-value email we could write.

## 2. Lifetime revenue by customer type (same report)

| Metric | Amount |
| --- | --- |
| Total revenue from customers (all time) | **$654,834.57** |
| From one-time customers | $382,286.76 (58%) |
| From recurring customers | $272,547.81 (42%) |

By frequency (all time):

| Frequency | Revenue |
| --- | --- |
| One-Time | $381,843.06 |
| Twice a month | $106,807.68 |
| Once per month | $96,403.99 |
| Once per week | $41,893.80 |
| Every 3 weeks | $24,824.10 |
| Twice a week | $2,618.24 |

> **Note the inversion:** biweekly ("twice a month") has produced *more lifetime revenue* ($106.8K) than monthly ($96.4K) despite there being fewer than half as many active biweekly customers today. That supports reading (b) above — biweekly customers are worth materially more each.

## 3. 2026 year-to-date bookings and revenue (Reports dashboard, 01/01/2026-12/31/2026)

| Metric | Value |
| --- | --- |
| Total revenue | $181,445.38 |
| Billed total revenue | $151,958.66 |
| Pending payments | $29,486.72 |
| **Recurring revenue** | **$93,483.60 (52%)** |
| Total bookings | **544** |
| Recurring bookings | **411 (76%)** |
| Revenue per booking | $333.16 |
| Revenue per recurring booking | $282.07 |

2026 bookings by frequency: once per month 117 · **twice a month 132** · once per week 86 · twice a week 56 · every 3 weeks 18.

2026 revenue by frequency: twice a month $33,703.93 · once per month $32,228.51 · once per week $19,333.66 · every 3 weeks $4,590 · twice a week $2,045.50.

> **Revenue per booking of $333.16 is well above the $249 residential AOV** recorded in `audience.md` (Stripe-derived). The difference is almost certainly commercial and post-construction work pulling the average up, since this figure is All Industries. **Do not publish $333 as a residential figure.** Re-pull with Industry filtered to residential before using any AOV number in copy.

## 4. Ratings (2026)

**4.92 / 5 from 12 in-app ratings** — 91.67% five-star, 8.33% four-star, zero at three or below.

> Distinct from the canonical public claim (4.9 from 148 Google reviews, `claims.ts`). These are BookingKoala's own post-clean ratings, a much smaller sample. **Do not merge the two numbers or publish the 4.92.** Useful only as internal corroboration that quality is not the churn driver.

## 5. Cancellation reasons — 2026, all 51 cancellations

**This is the answer to audience.md open question #7, and the most useful finding of the pull.**

| Reason | Count | Share |
| --- | --- | --- |
| **Other** | **16** | 31% |
| **No reason provided** | **12** | 24% |
| **You did not have the time I wanted** | **7** | **14%** |
| I will be back | 6 | 12% |
| Financial reason | 5 | 10% |
| I am moving | 2 | 4% |
| Not happy with the customer service | 1 | 2% |
| Not happy with the quality of the service | 1 | 2% |
| Too expensive | 1 | 2% |
| Not happy with the overall service | 0 | 0% |

Cancellations by frequency: once per month 19 · one-time 18 · twice a month 13 · every 3 weeks 1.

### What this actually says

1. **Scheduling is the single biggest *stated* cause of churn.** "You did not have the time I wanted" at 7 is more than *quality, service, and price complaints combined* (3 total). The 2-3 day booking window and slot availability are costing more customers than the price ever has.
2. **Price is almost never the reason.** "Too expensive" = 1 of 51 (2%). "Financial reason" (5) reads as the customer's own budget, not our pricing. **The premium positioning is not driving churn** — this is direct evidence for the brand strategy, and it belongs in front of Christen.
3. **Quality complaints are 2 of 51 (4%).** Consistent with 4.92/5 ratings.
4. ~~**55% of cancellations have no usable reason**~~ **CORRECTED 2026-08-25 (Todd):** selecting "Other" requires a written note, and those notes live on the booking row, not in this report. They were pulled separately — see **`cancellation-notes-2026.md`** in this folder. The signal is not missing; it just isn't in the summary report. Re-coding the 50 verbatim notes puts **our own capacity/availability at 24% — the single largest cause** — and confirms price at 1 of 50.
5. **"I will be back" (6)** is a win-back list nobody is working. These people self-identified as pausing, not leaving.

### Copy implications

- The wrong-fit language ("if you need someone there today, that's not us") is **honest and correct**, but scheduling friction is the top churn driver — so the operational fix (more slots, longer booking horizon) likely beats any copy change.
- A **win-back sequence** for "I will be back" customers has an obvious, self-identified audience.
- Do NOT write copy defending the price against churn. The data says price is not why people leave.

---

## Still unanswered (needs a different source)

- **Customer age / household type** (audience.md Q1) — BookingKoala does not collect it. Would need a survey or inference from address data.
- **Square-footage distribution of recurring customers** (Q3) — likely in individual booking records, not in any dashboard report. Needs an export.
- **Where customers came from** (Q5) — the Referrals report shows all zeros (the referral *program* is unused, which is itself a finding). Acquisition source is not tracked in BK; GA4/PostHog is the only path, and phone-call attribution is a genuine gap.
- **Military/defense household share** (Q2) — not collected.
- **"Do I have to be home?" / "same team every visit?"** (Q6) — operational answers from Todd, not reports.

## Recommended next actions

1. **Todd decides**: is monthly-dominant the real market, or an un-pushed biweekly opportunity? This changes which frequency the copy centers.
2. **Fix the cancellation reason list** in BK settings so more than 45% of churn produces a usable signal.
3. **Re-pull revenue per booking with Industry = residential** before any AOV number goes into copy.
4. **Consider a win-back sequence** for the "I will be back" segment.
5. Investigate scheduling capacity — the top stated churn reason is availability, not price or quality.
