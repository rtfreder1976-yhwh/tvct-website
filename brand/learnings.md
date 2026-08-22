# Learnings — The Valley Clean Team

_What worked, what didn't, audience insights. Append-only._

## What works

- **Verify brand memory against the codebase, not against itself.** `#FFA985` appears
  6,016 times in `src/**/*.astro`; the palette `creative-kit.md` claimed appeared 0 times.
  One grep settled a question that had already cost a wrong image batch. Logged 2026-08-22.
- **Grep the generator, not just the doc.** Correcting `creative-kit.md` would have left the
  wrong palette armed in four Replicate scripts that hardcoded the hex values in prompts.
  The doc describes intent; the script is what actually runs. Logged 2026-08-22.

## What doesn't work

- **Auto-generated foundation files drift into banned claims.** Both `creative-kit.md`
  (palette) and `voice-profile.md` / `positioning.md` (same-day, 49-point, 130+ reviews,
  "1,047+ cleanings") were auto-generated in May 2026 and silently contradicted rules the
  repo adopted later. Every skill downstream treats them as authoritative. Re-verify any
  foundation file older than the guardrails it must obey. Logged 2026-08-22.
- **Building a whole funnel on one unverified claim is a total loss.** The
  `2-hour-quote-checklist` campaign — lead magnet, landing page, 7 emails, ~30 images,
  GHL templates — was architected on same-day cleaning, which is banned. Retired unbuilt.
  Check the lead claim against `claims.ts` and `CLAUDE.md` BEFORE producing assets.
  Logged 2026-08-22.
- **Retired prices reach graphics through prompt strings.** `$99 / $175 / $225` were
  hardcoded into an image prompt and would have rendered into a publishable price-list
  graphic. Claim validators check site source, not Python prompt literals. Logged 2026-08-22.

## Audience insights

- **CTR is the constraint, not ranking position.** Positions 4-10 already convert at 0.29%;
  brand CTR is 21.6% while local CTR is 0.07% — because TVCT is absent from the map pack
  outside the Shoals. More content does not fix this. Logged 2026-08-22.
- **`phone_click` has recorded zero real conversions to date.** Instrumentation is verified
  working; the conversions genuinely are not happening yet. Any phone-first CTA claim needs
  a real baseline before it can be called a win. Logged 2026-08-22.
- **MaidPro Huntsville/Shoals shares TVCT's identity claims** — also veteran/women-owned,
  also a numbered checklist. Origin-story positioning is NOT a differentiator in the two
  largest markets. Logged 2026-08-22.

## Session checkpoint — 2026-05-13

**Built (drafts on disk, not yet live):**
- Brand foundation: voice-profile.md, positioning.md
- Campaign: 2-hour-quote-checklist (lead magnet, landing page, 7-email welcome sequence, 13-piece social kit + 3-week schedule)

**Pending after Claude Code restart:**
1. Generate visuals with /creative + Replicate (IG carousel slides, lead-magnet cover, FB header, Reel keyframes)
2. Push 7-email sequence into LeadConnector workflow (frontmatter on each email has all metadata)
3. Deploy landing page (GHL pages OR Astro `/checklist` route)
4. Queue social posts via LeadConnector planner (Nextdoor posts manual — no GHL integration)

**MaidPro collision flag stays in effect:** never lead Huntsville/Shoals copy with veteran/women-owned or 49-point checklist (MaidPro Huntsville/Shoals owned by Ashlee J. Smith uses identical claims).
