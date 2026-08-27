# Koalified Podcast — Atomization Pass 2

Created 2026-08-25. **All drafts. Nothing published.**

Source: the 2h39m Koalified Podcast interview with Todd & Christen Frederickson.
Clips: `campaigns/koalified-podcast/clips/clip-plan-v2-2026-08-25.md` (cut, verified, on disk at `C:\Users\rtfre\Downloads\tvct-clips\`).

## Why a second pass

Pass 1 (`social/`, 23 files) atomized the **origin story**: the couch, the broken leg, the under-$5K bootstrap, the provider-first model, money-buys-time, the dementia client. Those are claimed and nothing here repeats them.

This pass works the 14 *new* cuts found in the second audit — material pass 1 skipped entirely. The center of gravity is different: pass 1 was the founding narrative, this is **how the company actually operates**, and it's the half where Christen carries most of the weight.

## What was extracted

**Core insight:** The interesting thing about this company isn't how it started — it's the set of small, specific operating decisions behind how it runs.

**Supporting material used:**

| Element | Source cut | Where it went |
|---|---|---|
| Can't clean in the dark (sunlight vs lamp light) | NEW-03 | FB, IG Reel, TikTok |
| No arrival window, "there is no range" | NEW-12 | FB, YouTube Short, GBP |
| Walked away from the apartment contract | NEW-04 | LinkedIn |
| Realtors' association lockbox access | NEW-02 | LinkedIn, Bluesky |
| "Could you be dehydrated?" | NEW-11 | FB |
| Turned down a corporate account | NEW-05 | IG Reel |
| "I smell lemon" recruiting method | NEW-06 | TikTok |
| "Because they're a house cleaner, they're not valued" | NEW-10 | Threads |
| The death stare | NEW-07 | IG Reel |

**Deliberately not used in this pass:** NEW-01 (father's death), NEW-08 ($250K year one), NEW-09, NEW-13, NEW-14. Reasons below.

## 12 pieces, 8 platforms

```
social-v2/
├── facebook/
│   ├── post-01-clean-in-the-dark.md      teach-then-turn
│   ├── post-02-cable-guy.md              no arrival window
│   └── post-03-dehydrated.md             provider care
├── instagram/
│   ├── reel-01-clean-in-the-dark.md      highest-save candidate
│   ├── reel-02-death-stare.md            personality
│   └── reel-03-said-no.md                recruiting
├── linkedin/
│   ├── text-post-01-walked-away.md       commercial register
│   └── text-post-02-realtor-lockbox.md   operator lesson
├── tiktok/
│   ├── script-01-clean-in-the-dark.md
│   └── script-02-i-smell-lemon.md        recruiting
├── youtube/
│   └── short-01-no-range.md
├── threads/
│   └── post-01-not-valued.md             Christen-led
├── bluesky/
│   └── post-01-lockbox.md
└── gbp/
    └── post-01-no-arrival-window.md
```

Twelve, not sixteen. Four of the fourteen cuts are strong video but weak text posts, and padding the count with thin copy would have meant shipping pieces that fail the Voice Test. The clips still exist for whoever wants them.

## Voice compliance

Every piece was checked against the 10-question VCT Voice Test, the 15 banned generic phrases, and the 9 oversell words. Specific calls made:

- **"Attention to detail"** appears once, in the Threads post, describing a skill the industry *undervalues* — not as self-description. Flagged in that file; swap line provided if Christen reads it the other way.
- **One emoji total** — a location pin in an Instagram metadata line. Flagged; cuttable.
- **No exclamation marks anywhere.** No "spotless," "sparkling," "free quote," "premium," "best."
- **Humor is one dry observation per piece**, never in a price line or a CTA, never at the customer's expense.
- **Pricing:** only "regular cleaning from $200" appears, on Facebook and GBP, always with the held-price line. No retired prices. No hourly framing.

## Claim guardrails applied

- **$5M insurance (NEW-04):** that figure is what the apartment complex *demanded*. TVCT carries $2M. The LinkedIn file requires the on-screen caption read "a multi-million-dollar policy" with no number.
- **"$75" (pass-1 Clip 4):** already handled — `FIX-clip4` is cut at the safe in-point.
- **Provider pay:** the "$25 to $55 an hour" line is a year old and stays on the do-not-use list. The recruiting posts name the 50/50 split (already public) and no rate.
- **Employee vs. contractor:** never argued in TVCT's favor. The "not employees, but still humans" phrasing stays intact wherever it appears.
- **No same-day/emergency framing.** The arrival-window posts are about honoring a set time, not speed.
- **Capacity:** the dehydration post explains why we don't overbook without ever claiming unlimited availability. Adjacent to the parked capacity project; deliberately does not touch it.

## Held back

- **NEW-01 (Todd's father's death)** — the most affecting cut in the interview, and the reason it isn't a social post is that turning a bereavement into engagement content is a decision the family makes, not a marketing skill. The clip exists. If Todd wants it used, it should be his call and probably his framing.
- **Christen's mental-health disclosure (02:33:07)** — not cut, not written, needs her explicit sign-off. Unchanged from the clip plan.
- **NEW-08 ($250K year one)** — safe under the pricing rules, but a revenue number is a founder-audience flex, and TVCT's channels are customer- and recruit-facing. It would land on LinkedIn if the goal were attracting operators. It isn't.
- **NEW-13 / NEW-14** — good closers for a highlight reel, thin as standalone posts.

## Open questions — ALL RESOLVED 2026-08-25 (Todd)

1. **Where do cleaner applicants land?** ✅ **A live BookingKoala hiring form.** `thevalleycleanteam.com/careers` → `thevalleycleanteam.bookingkoala.com/hiring/form/careers`, already wired into the site nav, footer, and a `vercel.json` redirect. It's a dedicated cleaner form, separate from customer quote/CRM infrastructure, which is what CLAUDE.md §3 requires. All three recruiting pieces now carry the short branded path rather than a phone number. *(CLAUDE.md §3, its follow-ups list, and the two matching sections in `PROJECT_CONTEXT.md` were updated 2026-08-25 — they had all still described `/careers` as disabled pending this form.)*
2. **Still the only cleaning company in the realtors' association?** ❌ **No — someone else has joined.** Both posts corrected to past tense ("when we joined, we were the only cleaning company in it" / "nobody else in our category had joined yet"). The "competitors can't easily copy this" line was cut entirely. **The NEW-02 clip states the stale claim on tape** — flagged in the clip plan; it needs an interview-date caption, a trimmed in-point, or text-only publication.
3. **FB/IG tokens** ✅ **reconnected.** All twelve pieces are now queueable.

## For Christen

Her call on all of it, per the tone rules. Three things worth her specific attention:

- **The death-stare Reel** puts her on camera being funny. Some people want that, some don't.
- **The Threads post** compresses her argument and Todd's detail into one unattributed voice. Running the clip instead keeps them both in their own words.
- **The recruiting posts** speak on behalf of what it's like to work here. She'd know better than anyone whether they're accurate.
