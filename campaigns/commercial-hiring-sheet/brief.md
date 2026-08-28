# Campaign: Commercial Hiring Sheet

_Created 2026-08-24 by /lead-magnet. Updated 2026-08-28: built and gated on the site._

_Status: MERGED to main 2026-08-28 (commit 1cd14cb9). n8n branch published. Deploys on the next push to origin._

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

**Rolled out to all commercial pages 2026-08-28** — 32 pages carry the link:

- 23 location pages via one edit inside `ServiceLocationLayout`'s existing
  `isCommercial` branch (covers the `commercial-cleaning`, `office-cleaning`,
  `dental-office-cleaning`, `medical-office-cleaning` slugs). The same layout
  serves 43 residential pages, which is why the link sits inside that flag
  rather than in the shared CTA — a B2B vendor scorecard on a house-cleaning
  page is the wrong audience.
- 4 bespoke commercial location pages (madison, nashville, tuscumbia,
  west-nashville) — light-on-peach styling for their gradient CTA.
- 5 top-level: commercial-office-cleaning, church-cleaning,
  medical-clinic-cleaning, dental-office-cleaning, dialysis-center-cleaning.

**Deliberately skipped:**
- The 5 `/ads/` landers — all `noindex` paid-traffic pages with a single
  conversion goal. A "still comparing?" link there leaks paid clicks away from
  the CTA being paid for.
- `/booking-commercial` — the visitor is mid-booking, past comparing vendors.
- `/commercial-quote` — a bare 301 to BookingKoala, no page to edit.

Verified in the build: 32 pages carry it, 0 residential and 0 ads pages do, and
the gate does not self-link.

## Status

**MERGED — awaiting deploy.**

- ✅ n8n `Which Form?` branch **published** 2026-08-28 (activeVersionId
  `c7094a34`). Downloads no longer touch the Quotes pipeline or text Todd.
- ✅ `feat/commercial-hiring-sheet` fast-forwarded into `main` (commit
  `1cd14cb9`). check / validate:claims / build all clean on main.
- ✅ **DEPLOYED and verified in production 2026-08-28.** Vercel
  `dpl_L9TR7cAAMRsNJQipEumiGSRRVbMt` READY from commit `b183eae5`.

Ordering was the risk and it is now resolved in the safe direction: n8n was
published first, so even if the site had deployed early the branch would have
routed correctly.

### Production verification — DONE 2026-08-28

Real browser submission through the live gate (n8n execution **31**, mode
`webhook`, not a manual test):

- `Which Form?` output was `[[], [contact]]` — quote branch empty, hiring-sheet
  branch taken.
- `Email The Hiring Sheet` ran; GHL returned "Email queued successfully."
- `Send Auto-Reply`, `Create Opportunity`, and `Text Todd The Lead` do **not
  appear in runData at all** — they never executed. No Quotes opportunity, no
  SMS to Todd. The branch holds against real traffic.
- Payload shaped correctly: `formType: hiring-sheet`,
  `source: commercial-hiring-sheet`, company → `city`, no phone.

Endpoint also verified live: `invalid form type` → 400 (proves the new code is
deployed, not a cached build), and the quote branch still rejects a missing
city.

**Cleanup owed (Todd):** GHL contact `WD0j0YLk3GJFXazcjFxX`
("ZZ Deploy Test" / zz-deploytest-20260828@example.com) and its row in the n8n
data table `tvct_quote_requests`. Folds into the existing `ZZ`/`QQ` cleanup
item from the original quote-flow build.

## Voice Notes

Commercial register per brand brief: measured, no wit, no exclamation marks. No banned oversell words, no "free quote," no scarcity. Never claim "bonded," workers' comp, clinical anything, or "same team every visit." Signed as the company, not Todd (outreach emails carrying it are their own copy task).
