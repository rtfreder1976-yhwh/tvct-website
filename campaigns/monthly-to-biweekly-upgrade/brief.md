# Campaign: Monthly → Biweekly Upgrade

_Created 2026-08-25 by /email-sequences. Status: ALL DRAFT — pending Todd review. Nothing pushed to GHL, nothing sending._

## Goal

Move existing **monthly** recurring customers to **biweekly**. This is the highest-value question the 2026-08-25 BookingKoala pull raised.

## The data behind it (verified, `campaigns/icp-verification/`)

| Fact | Number |
| --- | --- |
| Active monthly customers | **11** |
| Active biweekly customers | **5** |
| Lifetime revenue, biweekly | **$106,807.68** |
| Lifetime revenue, monthly | $96,403.99 |

Biweekly has earned **more lifetime revenue on fewer than half the customers**. Per customer, biweekly is materially the better product. The active book is monthly-dominant, which means either monthly is what this market buys, or nobody has ever asked monthly customers to move up. This sequence tests the second explanation.

**Realistic ceiling: 11 people.** This is not a volume play — it is a margin play on a named, known list. Even 3 conversions is a meaningful annual revenue change.

## ⚠️ The constraint that shapes this sequence

The same pull found **capacity is the #1 cause of churn** (12 of 50 cancellations, 24% — "you did not have the time I wanted"). Price was 1 of 50.

That cuts two ways here, and both matter:

1. **Do not create demand we cannot serve.** If eleven customers doubled frequency tomorrow, could the schedule absorb it? **Todd must answer this before the sequence sends.** Selling a slot we cannot staff converts a happy monthly customer into a churned one, and the data already shows that is exactly how we lose people.
2. **Recurring slots are the scarce thing, and that is honest to say.** A biweekly customer holds a standing spot. That is a real, non-manufactured reason to act — but it must be stated as a fact, never as a countdown or a scarcity tactic.

✅ **RESOLVED 2026-08-25 — Todd confirmed the schedule can absorb the upgrades.** The sequence is cleared to send after Christen's copy review. Recommend still watching for any cancellation in the weeks following the send: if capacity gets tight, that shows up as churn in exactly the group we just moved.

## Sequence Type

Upgrade / expansion (existing customers). 3 emails over 12 days — short, because these people already buy and do not need convincing that cleaning is worth it.

## Audience

Active monthly recurring customers. Excludes: biweekly and weekly customers (already there), one-time customers (different sequence), and anyone who has cancelled.

Awareness: **most aware.** They know us, they pay us, they have lived the service. No trust-building required — this is a single specific question, asked well.

## The bridge

Monthly cleaning is 15% off the $200 regular base. Biweekly is 25% off. The upgrade is not "spend more" — it is "spend more efficiently on a house that never gets far enough gone to need catching up."

The honest mechanism: at monthly intervals, three-plus weeks of buildup means part of every visit is spent recovering ground. At biweekly, the house stays close to baseline, so the same 44-item checklist goes further.

## Arc

```
01 (Day 0)   THE OBSERVATION  — what we actually see at week 3 vs week 2; the offer to switch
02 (Day 5)   THE MATH         — 25% vs 15%, stated plainly, no pressure
03 (Day 12)  THE EASY NO      — one line to stay monthly; the door stays open
```

Three emails, not seven. These are current customers; over-selling them risks the relationship that already works.

## Hard rules

- **Never imply their house is dirty or that they are failing.** The brand brief forbids making the customer the butt of anything, and this sequence is the single easiest place to violate it. The framing is always about *buildup between visits*, never about the customer's housekeeping.
- Canonical numbers only: regular from $200, monthly 15% off, biweekly 25% off, weekly 30% off ($150/visit floor), 44-item checklist, re-clean reported within 24 hours.
- No scarcity language, no countdowns, no "limited spots" — even though slots are genuinely finite, saying it as pressure is banned.
- Phone-first: (256) 826-1100; TN customers get (615) 510-1427.
- Signed Todd. Warm residential register, one dry aside maximum per email.
- **No exclamation marks. No oversell words.**

## SMS (added 2026-08-25)

**One** touch only, in `sms/sms-touches.md`, Day 14, and only to customers who did not reply to any of the three emails. These are 11 existing customers; the relationship is worth more than the upgrade, and two texts about spending more money would damage something that currently works.

**No VSL touch here** — deliberate. Existing customers do not need a prospect-facing explainer about pricing they have already lived. Sending it would read as condescending.

## Merge fields

`{{contact.first_name}}` only. Deliberately no merge of their current price or next visit date — those risk being stale or wrong in a small list, and being wrong to an existing customer costs more than the personalization gains.

## Success measure

Conversions out of 11, tracked manually in BookingKoala. Also worth watching: any cancellation following the sequence, which would be a signal the ask felt like pressure.

## Status

draft — capacity cleared by Todd 2026-08-25; now awaiting Christen's copy review only

## Voice notes

These are people who already pay us and have had us in their homes. Write like someone who knows them. The tone is an observation offered, not an offer pitched — and the "no" has to be genuinely easy, or the sequence damages a working relationship for a 15%-to-25% delta.
