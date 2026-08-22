/**
 * Files permitted to quote a price below their own service's published floor,
 * and why.
 *
 * validate-service-price-floors.mjs derives each service's starting price from
 * pricing.ts + claims.ts and reports any figure advertised below it. This list
 * is the only escape, so a new file cannot fall outside coverage by being
 * forgotten.
 *
 * WHY THIS LIST EXISTS
 * --------------------
 * The guard was written after nine post-construction pages shipped prices below
 * their own floor ($299, $300, $350) while every existing validator passed. It
 * immediately found 62 more of the same defect across 48 files that predate it.
 * Failing the build on all 62 at once would have meant either a 48-file rewrite
 * in one change, or shelving the guard entirely and leaving new work unguarded.
 *
 * So the backlog is declared here instead: the guard protects every new and
 * edited file from today, and the existing debt is visible, counted, and dated
 * rather than silent.
 *
 * 2026-08-22: the 26 neighborhood and county FAQ pages were fixed and their
 * entries removed — those opened their pricing range at the $150 weekly-
 * recurring minimum (or lower) while describing one-time regular cleaning,
 * whose floor is $200. 36 findings across 22 files remain, listed below.
 *
 * EVERY ENTRY IS A BUG, NOT AN EXEMPTION
 * --------------------------------------
 * Unlike the retired-price allowlist, there is no `attributed` type here. A
 * competitor or market figure should not be flagged in the first place — the
 * guard only reports figures introduced as OUR price ("from", "starts at",
 * "ranges from"). If a market rate is being reported, the fix is to word it as
 * someone else's number, not to allowlist it. Every entry below is copy that
 * quotes a price The Valley Clean Team does not honour.
 *
 * Entries are occurrence-counted on purpose. Allowlisting a whole file would
 * mean a genuinely new bad price added to that file later passes unnoticed —
 * `count` makes any change to the number of findings fail the build and force a
 * fresh look. A count that DROPS is a failure too: the entry is stale and should
 * be trimmed or removed.
 *
 * Types:
 *   debt — pre-existing copy quoting a price below the service floor.
 *          Requires `expires`. Past that date the build fails rather than
 *          letting the debt go quiet.
 *
 * HOW TO CLEAR AN ENTRY
 * ---------------------
 * Rewrite the copy so its lowest figure is the canonical starting price, ideally
 * interpolated (`${PRICING.regular.display}`) rather than typed. Then delete the
 * entry. The guard will fail if you delete an entry without fixing the copy, and
 * fail if you fix the copy without deleting the entry — either way the list and
 * the source stay in agreement.
 *
 * Kept separate from validate-service-price-floors.mjs so the validator stays
 * readable and this list can be reviewed on its own as the standing debt
 * register.
 */

/**
 * Review deadline for the whole backlog.
 *
 * One shared date rather than 48 hand-picked ones: the debt was found in a
 * single sweep and should be worked down as a batch. ~6 months is long enough
 * to schedule a content pass and short enough that it cannot be forgotten.
 */
const BACKLOG_EXPIRES = '2027-02-22';

const COST_GUIDE_STALE =
  'cost-guide service list predates the 2026-08-20 pricing reconciliation and quotes pre-reconciliation starting prices';

const MARKET_RANGE_AS_OURS =
  'market-rate range written as our own price; either re-anchor to the canonical floor or attribute it explicitly as a market figure';

export const serviceFloorAllowlist = [
  // --- cost guides: stale service lists -----------------------------------
  // These enumerate every service with a "From $X" and were not updated when
  // pricing was reconciled. Highest-value entries to clear: they are exactly
  // the pages a buyer reads to learn what things cost.
  { file: 'src/pages/blog/house-cleaning-cost-alabama.astro', count: 3,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/house-cleaning-cost-athens-al.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/house-cleaning-cost-decatur-al.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/house-cleaning-cost-florence-al.astro', count: 3,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/house-cleaning-cost-huntsville-al.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/house-cleaning-cost-madison-al.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/house-cleaning-cost-nashville-tn.astro', count: 3,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },
  { file: 'src/pages/blog/why-19-dollar-cleaning-costs-more-shoals.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: COST_GUIDE_STALE },

  // --- blog: deep-clean ranges opening below the $276 floor ----------------
  { file: 'src/pages/blog/deep-cleaning-cost-shoals-guide.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/how-to-budget-for-house-cleaning-services-in-2026.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/spring-cleaning-guide-athens-al.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/spring-cleaning-guide-florence-al.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/spring-cleaning-guide-huntsville-al.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/spring-cleaning-guide-nashville-tn.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },

  // --- blog: regular-cleaning ranges opening below the $200 floor ----------
  // Several of these ($135, $125) are also retired banned tokens that the
  // retired-price scan misses because they sit inside prose ranges rather
  // than Offer fields.
  { file: 'src/pages/blog/is-hiring-house-cleaner-worth-it.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/reliable-cleaning-company-athens-al.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/reliable-cleaning-company-florence-al.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/reliable-cleaning-company-huntsville-al.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },
  { file: 'src/pages/blog/reliable-cleaning-company-nashville-tn.astro', count: 2,
    type: 'debt', expires: BACKLOG_EXPIRES, reason: MARKET_RANGE_AS_OURS },

  // --- move-out pages quoting below the $351 floor -------------------------
  { file: 'src/pages/blog/move-out-cleaning-costs-in-nashville-2026-updated-guide.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES,
    reason: 'move-out answer block opens at $200; the move-in/out floor is $351' },
  { file: 'src/pages/locations/decatur/move-out-cleaning.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES,
    reason: 'move-out FAQ range opens at $200; the move-in/out floor is $351' },
  { file: 'src/pages/locations/mountain-brook/move-out-cleaning.astro', count: 1,
    type: 'debt', expires: BACKLOG_EXPIRES,
    reason: 'states "starts at $350" — one dollar under the $351 floor; almost certainly a stale rounding of the old price' },

];
