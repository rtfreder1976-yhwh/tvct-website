# Learnings — The Valley Clean Team

_Initialized 2026-08-22 by /start-here (fresh start). Append-only. Log what worked, what didn't, and audience insights with a date._

## What works

- 2026-08-23 — Christen "really liked" the teach-one-thing Facebook post (dishwasher filter → "that one's a freebie; the checklist is what we charge for"). Pattern: useful tip first, wry turn to the offer second. (foundation-voice-samples #5)

## What doesn't work

- 2026-08-23 — Describing price in time terms ("how long a 44-item clean takes"). Todd: price = square footage × type of cleaning; nothing hourly. Also: re-clean copy must say the client tells us ("tell us within 24 hours").

- 2026-08-23 — "Arithmetic" in a GBP post: pretentious, not a customer word. Plain-word test now in voice-profile.
- 2026-08-23 — Any line implying we measure/inspect the house ("if the square footage turns out different"). Christen: cleaner calls office → Christen calls client before anything changes.
- 2026-08-23 — Blunt rejection in wrong-fit copy ("it won't be us"); Christen wants scarcity/selectivity instead.

- 2026-08-28 — Campaign-brief targeting language leaking into customer copy.
  The hiring-sheet gate said "Written for office managers, practice managers,
  and church administrators in North Alabama" — that is the brief's *Target
  Audience* section, not something a reader needs told about themselves. It also
  broke the next sentence: "Ask them of every company you are considering" had
  no antecedent, so "them" read as the office managers. Todd caught it as
  "inside information not client facing." Fix was to speak TO the reader:
  "Ask these questions of every company you are considering — including us."
  **Rule:** when lifting a line out of a brief, check that (a) it addresses the
  reader rather than describing them, and (b) every pronoun still has its
  referent in the new context. The same leak hit the meta description
  ("buyer-side checklist"), which shows in search results.

- 2026-08-28 — Built a read-it-end-to-end document at reference-table density.
  The hiring sheet shipped with 14px body copy, ~4px between a question and its
  answer, and no size difference between the question, the reasoning, and the
  ask — so twelve items read as one wall of text. Todd: "looks small and not
  formatted correctly." Two rules from it: (a) a document meant to be *read*
  gets 16px+ body and real vertical rhythm, not the compact sizing that suits a
  sidebar or a table; (b) a numbered list needs three distinct visual levels
  (item marker / claim / supporting detail) or the numbers do no work.

- 2026-08-28 — New top-level pages must clear the fixed nav with `pt-32`.
  The sheet used `py-10` and its H1 rendered *underneath* the sticky header —
  the page opened mid-document with no visible title. Existing content pages
  (church-cleaning et al.) all open `pt-32 pb-20 px-6`; that is the convention.
  A page whose heading sits lower inside a grid (like the gate) can get away
  with less, which is exactly why this is easy to miss when copying one layout
  to another. **Always load a new page at the top of the viewport before
  calling it done.**

## Audience insights

- 2026-08-23 — Owner roles: Todd (veteran) runs the company; Christen runs marketing. Earlier "Christen runs the customer side/phone" was an orchestrator guess and was wrong.
