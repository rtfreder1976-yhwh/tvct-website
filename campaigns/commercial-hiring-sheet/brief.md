# Campaign: Commercial Hiring Sheet

_Created 2026-08-24 by /lead-magnet. Updated 2026-08-28: built and gated on the site._

_Status: BUILT — live behind a capture gate on the branch `feat/commercial-hiring-sheet`, pending merge/deploy and one manual n8n publish (see Status below)._

## Goal

Warm commercial outreach (starting with medical batch #4 — 17 Apollo-enriched Shoals decision-makers) by leading with a genuinely useful buyer-side tool instead of a pitch. Secondary: leave-behind for walkthroughs; later, a gated download on commercial pages once the new capture form ships (see quote-flow redesign).

## Format

**Shipped as a web page, not a PDF** (decision 2026-08-28). 12 questions in 5
groups, each with a "get in writing" line, plus a "how TVCT answers" footer.

- Gate: `/commercial-hiring-sheet` — indexable landing page, 3-field form
- Sheet: `/commercial-hiring-sheet/read` — noindex, print stylesheet for the
  walkthrough leave-behind (Todd prints from the browser)

Every claim in the footer reads from `claims.ts`, so the sheet cannot go stale.
That is the reason it is not a PDF: a checked-in binary would be a second copy
of the numbers, free to drift.

## Hook

"12 questions to ask any commercial cleaning company — and the answers to get in writing."

## Target Audience

Office managers, dental/medical practice managers, and church administrators in North Alabama. Practice framing is strictly **non-clinical facility cleaning** — the sheet deliberately contains no clinical/OSHA/bloodborne questions, because TVCT makes no such claims and won't invite the comparison.

## Bridge to Paid Offer

The sheet is a vendor scorecard TVCT passes by design: every footer claim is verified in `src/data/claims.ts` (background-checked, 15-yr avg experience, $2M liability, 2-business-hour written quote, sqft/task-list/visits-per-week quote factors, 24-hour re-clean report window, 98% on-time, 85% repeat, 4.9/148). The reader grades every other vendor against it. CTA is a call — (256) 826-1100; any TN-targeted use swaps (615) 510-1427.

## Competitive Differentiation

National players (Jobber, Swept, Aspire) publish generic cleaning checklists and "questions to ask" posts; local competitors' only opt-in is free-estimate bait. Nothing local pairs the questions with the demand for written answers — which is TVCT's positioning (transparency, treat buyers like adults) doing the selling.

## Distribution Plan

1. **Live on site (2026-08-28):** gated at `/commercial-hiring-sheet`, linked
   from the final CTA on `/commercial-office-cleaning` as a soft secondary CTA
   for buyers still comparing vendors. Deliberately understated so it does not
   compete with the phone and booking CTAs.
2. **Outreach:** send the gate URL in medical batch #4 emails rather than an
   attachment — the link captures, an attachment does not. Todd sends;
   call-first still recommended per prior prep.
3. **Walkthroughs:** print `/commercial-hiring-sheet/read` from the browser.
4. LinkedIn commercial posts can reference it (social batch already has 1
   commercial LinkedIn slot).

Worth adding to the other commercial pages (`/church-cleaning`,
`/dental-office-cleaning`, `/medical-clinic-cleaning`, the `/locations/*/
office-cleaning` set) once the first one proves out.

## Status

**BUILT, not yet live.** Two things remain, both outside the repo:

1. **Publish the n8n workflow.** `VCT — Website Quote Request Intake`
   (`00Z4VELE4rKJmEry`) has the `Which Form?` branch saved as a **draft**; the
   active version is still the old linear one. Both branches were verified with
   pinned test data (executions 29 and 30) but the change is not live until
   published in the n8n UI. **Until it is published, a hiring-sheet submission
   would fall through the old path and create a Quotes opportunity + text
   Todd** — so publish before the site deploys, or deploy after.
2. **Merge and deploy** `feat/commercial-hiring-sheet`.

## Voice Notes

Commercial register per brand brief: measured, no wit, no exclamation marks. No banned oversell words, no "free quote," no scarcity. Never claim "bonded," workers' comp, clinical anything, or "same team every visit." Signed as the company, not Todd (outreach emails carrying it are their own copy task).
