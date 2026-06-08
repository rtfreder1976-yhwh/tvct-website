# Step 1 — Fix Rogersville's Stripe Billing (do first)

_Generated 2026-06-07 from live Stripe data. This is a billing-config repair on a
**healthy, paying** contract (Rogersville Church of Christ / Ronnie Owens) — NOT a
churning client. The relationship is fine; the subscription is mis-set-up and the
June charge won't collect until it's repaired._

## The facts (walk into Stripe with these)

| Field | Value |
|---|---|
| Client | Rogersville Church of Christ — Ronnie Owens |
| Subscription ID | `sub_1SvtiPJHorGAQFmU013vONew` |
| Customer ID | `cus_Ta1E5yQRVMScw6` |
| Plan | "Janitorial Service @ 2500" — $2,500.00 / month |
| Product / Price | `prod_TebTvQ3YFf9VCh` / `price_1ShIGJJHorGAQFmUqxyRvVb4` |
| Created by | GoHighLevel (LeadConnector) |
| **Current status** | **`past_due`** |
| **Open invoice** | `D0DUED0N-0005` — $2,500.00, status `open` (unpaid) |
| **Cancellation flag** | `canceled_at` 2026-06-01, reason `cancellation_requested` |
| **Payment method** | `default_payment_method: null` (removed) |
| Current period | 2026-06-01 → 2026-09-30 |

Dashboard: https://dashboard.stripe.com/subscriptions/sub_1SvtiPJHorGAQFmU013vONew
Open invoice: https://dashboard.stripe.com/invoices/in_1TdOuUJHorGAQFmUpEstl2Xx

## What to do (in Stripe, or in GHL/LeadConnector since it created the sub)

1. **Re-attach Ronnie's payment method** to customer `cus_Ta1E5yQRVMScw6`
   (`default_payment_method` is currently null — that alone blocks collection).
2. **Reverse the cancellation** — clear the `cancellation_requested` / `cancel_at`
   state so the subscription stays active past this period.
3. **Collect the open June invoice** `D0DUED0N-0005` ($2,500) once a card is on file.
4. **Confirm the next monthly charge** runs clean (period renews 2026-09-30).

## One courtesy call (not a save)

Quick check with Ronnie that nothing changed on his end — purely to confirm the
card on file is current. This is a $2,500/mo relationship; a 2-minute call protects
it. Do not frame it as "we noticed you canceled" — the cancel is almost certainly a
GHL/Stripe config artifact, not his decision.

## Verify done
- Subscription status → `active`
- Invoice `D0DUED0N-0005` → `paid`
- `cancel_at` cleared, payment method attached
- Next month's $2,500 charges without intervention
