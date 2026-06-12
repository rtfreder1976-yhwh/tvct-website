# Lead Operations SOP (draft) — the role that removes Todd as the bottleneck

_Generated 2026-06-07 from the live TVCT system. This is the Step 7 prerequisite:
a documented machine a hire (VA or lead-ops person) can run, so judgment work stops
routing to Todd's brain. Draft — Todd fills the bracketed `[ ]` decisions, then it
becomes the onboarding doc for the hire._

## Why this role exists
Automation already made TVCT **fast** (30-min lead response, abandoned-booking
recovery, quote SMS). It has NOT made TVCT **delegated** — every *judgment* step
still lands on Todd: deciding if a lead is real, sending custom quotes, handling
complaints, replying to commercial outreach. This role owns those, against the
system below, so Todd stops being the single point of failure.

**The role owns one inbox and three queues:** `hello@thevalleycleanteam.com`,
the lead queue, the complaint-escalation queue, and the commercial-reply queue.

---

## The system this role operates (so they inherit facts, not folklore)

**Lead capture is automated and reliable — don't touch it.**
- Site forms (`/get-quote`, `/booking`) POST to `api/submit-form.ts` (the root
  Vercel function; the `src/pages/api` copy is dead — ignore it).
- Every lead does two things automatically: (1) emails a copy to `hello@`, and
  (2) fires a GoHighLevel webhook that runs the follow-up workflow.
- **Quote-form leads** → GHL "Website Quote Form — New Lead" + "Incoming Quote Form
  - Hybrid V2" (sends the first quote SMS in ~30 min).
- **Booking started but not finished** → GHL "Abandoned Booking Recovery"
  (SMS → email → SMS → owner-call task, with a pre-filled magic link).
- **Booking completed** → GHL "Booking Completed - Mark Booked" (tags `booked`,
  stops recovery). _This is also what should trigger the post-purchase/review
  sequence — see `02_REVIEW_SEQUENCE_DEPLOY_CARD.md`._
- Source of truth for all GHL copy/workflows: `GHL_COPY_PASTE_ASSETS.md`,
  `PROJECT_CONTEXT.md`. **Do not rebuild what's there.**

---

## Daily checklist (the role's day)

**Queue 1 — Lead triage** (target: every lead seen within [ business hours window ])
1. New lead lands in `hello@` (subject `New Lead: …`; urgent ones prefixed `🚀 URGENT`).
2. Triage: real prospect vs. spam/vendor. [ Todd: define what counts as spam. ]
3. Urgent (same-/next-day) leads: [ Todd: who calls, and how fast? Define the SLA. ]
4. Standard leads: the GHL quote SMS already went out. Confirm it did; if the lead
   needs a **custom** quote (large sq ft, commercial, special service), prepare it
   per [ Todd: link the pricing/quote SOP — BookingKoala rate sheet ] and send.
5. Log outcome. [ Todd: where — GHL contact note / pipeline stage? Pick one. ]

**Queue 2 — Complaint escalation** (from post-purchase Email 3 replies)
1. Email 3 asks "how did we do?" — happy customers go to Google; unhappy ones reply.
2. Any reply describing a miss → [ Todd: the free-re-clean promise — who schedules
   the return visit, and what's the cutoff (sequence says 48 hrs)? ]
3. Genuine complaints only escalate to Todd: [ Todd: define the line — what does the
   role resolve directly vs. hand to you? ]

**Queue 3 — Commercial-outreach replies** (once Step 4 batch is live)
1. Replies to the medical/dental/church outreach (`docs/OUTREACH_GHL_LOGIC.md`).
2. Interested → [ Todd: book the walkthrough using
   `docs/INTERNAL_COMMERCIAL_CHECKLIST.md`; who does the site visit? ]
3. The commercial proposal still comes from Todd for now — but the role owns
   scheduling, follow-up, and chasing the no-reply tail.

---

## What stays with Todd (explicitly — so the role knows its edges)
- The commercial **site walkthrough + proposal pricing** (judgment + relationship).
- Genuine **complaint resolution** beyond the standard free-re-clean.
- **Hiring/contractor** decisions and the 50/50 split relationships.
- Anything touching **money config** (Stripe, BookingKoala billing) — e.g. the
  Rogersville fix is Todd's, not the role's.

## Tools the role needs access to
GoHighLevel (contacts, workflows, pipeline), the `hello@` inbox, BookingKoala
(read bookings/schedule), the pricing rate sheet. [ Todd: grant least-privilege
access; the role does NOT need Stripe admin or Vercel. ]

## Success measure (from the plan)
`hello@` triage + complaint escalation handled by someone **other than Todd** for
2 consecutive weeks against this SOP, with no leads dropped. That's the proof the
founder is no longer the bottleneck.

---
### Open decisions for Todd to fill before hiring
Every `[ ]` above. The biggest three: (1) the lead-response SLA, (2) what the role
resolves vs. escalates on complaints, (3) where outcomes get logged. Fill those and
this draft becomes a real onboarding doc.
