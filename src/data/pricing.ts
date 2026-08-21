/**
 * Single source of truth for published cleaning prices.
 *
 * WHY THIS MODULE EXISTS: these numbers used to live only inside the /pricing
 * client `<script>`. That meant the entire square-footage rate card — 18
 * brackets x 3 services — existed solely inside the bundled JS and never
 * appeared as text in the server-rendered HTML. An AI-visibility crawl flagged
 * that as a static extraction gap: assistants that read HTML without executing
 * JavaScript could see "from $176" but could not quote a single rate for a real
 * home size, which is exactly the question buyers ask.
 *
 * Importing from here lets the page render the rate card as real HTML *and*
 * hand the same arrays to the calculator via `define:vars`, so the visible
 * table, the schema Offers and the interactive estimate can never drift apart.
 *
 * SOURCE OF TRUTH: the live BookingKoala rate card (Settings → Industries →
 * Home Cleaning → Form 1 → Pricing Parameter), read directly on 2026-08-20 and
 * matched bracket-for-bracket against these arrays. BookingKoala wins any
 * disagreement because it is what actually bills the customer.
 *
 * Originally transcribed from the "New TVCT Cleaning Biz Pricing" sheet on
 * 2026-08-10. The 2026-08-20 review found the site was correct and BookingKoala
 * had two stalled brackets (5201-5600 stuck at $821, 5601-6000 stuck at $876);
 * those were corrected in BookingKoala to $876/$931 to match this table.
 *
 * Extended 2026-08-20: brackets now run to 10,000+ sq ft (was 6,500), and
 * post-construction is published alongside the other three services. Both
 * ranges are transcribed from the live BookingKoala parameters.
 *
 * On the sheet but deliberately NOT published here, because publishing a price
 * is a business decision and nobody has asked for these to go live:
 *   - Per-visit recurring rows (weekly -30%, bi-weekly -25%, monthly -15%).
 *     claims.ts RECURRING_PRICING derives these instead. Note the sheet's own
 *     rows are computed off the $176 TABLE value, not the $200 minimum, so its
 *     smallest-bracket weekly ($123) sits below the "Weekly Standard Clean
 *     $150" minimum printed on the same sheet. We floor to the minimum, which
 *     is the rule Todd gave on 2026-08-10: where a table value and a minimum
 *     disagree, the minimum wins.
 *   - Extras (inside oven $50, pet hair $100, blinds $10/each, fridge $75,
 *     dishwasher $50).
 */

import { PRICING, ClaimsError } from "./claims";

export const SQFT_BRACKETS = [
  750, 1000, 1250, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 4000, 4400,
  4700, 5200, 5600, 6000, 6500, 7000, 7500, 8000, 8500, 9000, 9500, 10000,
] as const;

export const PRICE_TABLE: Record<string, number[]> = {
  // Standard / regular clean
  regular:   [176, 211, 246, 281, 316, 351, 381, 436, 491, 546, 601, 656, 711, 766, 821, 876, 931, 1045, 1200, 1375, 1550, 1725, 1900, 2075, 2250],
  // First / deep clean
  deep:      [276, 311, 346, 381, 416, 451, 506, 561, 616, 671, 726, 781, 836, 891, 946, 1001, 1056, 1170, 1350, 1550, 1750, 1950, 2150, 2350, 2550],
  // Move in/out (Deep + $75 through 6,500; the extended range is set directly)
  moveinout: [351, 386, 421, 456, 491, 526, 581, 636, 691, 746, 801, 856, 911, 966, 1021, 1076, 1131, 1181, 1425, 1625, 1825, 2025, 2225, 2425, 2625],
  // Post-construction / post-renovation. Through 6,500 this is Move In/Out x 1.5.
  // From 6,501 up it switches to a flat $0.50/sq ft: the multiplier underpriced
  // large new builds against Nashville market rates ($3,200-$4,400 for 8,000
  // sq ft), so the jump from $1,820 to $3,500 at 6,501 is deliberate, not a typo.
  postconstruction: [526, 579, 631, 684, 736, 789, 871, 954, 1036, 1119, 1201, 1284, 1366, 1449, 1531, 1614, 1696, 1820, 3500, 3750, 4000, 4250, 4500, 4750, 5000],
};

/**
 * Price floors, from the "Minimum Prices" block at the bottom of the pricing
 * sheet: Deep Clean $200, Standard Clean $200, Weekly Standard Clean $150,
 * Move In/Out $350, Construction Clean Up $450.
 *
 * `deep` and `moveinout` match the sheet exactly. Neither floor actually binds,
 * because the first bracket already exceeds it ($276 > $200, $351 > $350) — the
 * minimum only matters if a smaller job is ever quoted off-table.
 *
 * `regular` is $200 even though the Standard Clean table starts at $176.
 * Confirmed by Todd 2026-08-10: the minimum is the real floor, so $176 is a
 * table value nobody is ever charged. The site advertised "from $176" in ~90
 * places before this; that was quoting a price we do not honour, and it is now
 * $200 everywhere. Only the smallest bracket is affected — from 1,000 sq ft up,
 * the table price already exceeds the floor.
 */
export const MINIMUMS: Record<string, number> = {
  regular: 200,
  deep: 200,
  moveinout: 350,
  postconstruction: 450,
};

export const SERVICE_LABELS: Record<string, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  moveinout: "Move In/Out Cleaning",
  postconstruction: "Post-Construction",
};

/** Pick the first bracket >= size, else the largest. */
export function bracketIndex(size: number): number {
  for (let i = 0; i < SQFT_BRACKETS.length; i++) {
    if (size <= SQFT_BRACKETS[i]) return i;
  }
  return SQFT_BRACKETS.length - 1;
}

/**
 * The quoted range for a home size + service. Shared by the server-rendered
 * rate card and the client calculator so both always agree.
 */
export function priceRange(service: string, size: number): { low: number; high: number } {
  const table = PRICE_TABLE[service] || PRICE_TABLE.regular;
  const low = Math.max(table[bracketIndex(size)], MINIMUMS[service] || 200);
  // ~+10%, rounded to $5, so the on-page number reads as an estimate (the final
  // price is confirmed in BookingKoala / before the clean).
  const high = Math.round((low * 1.1) / 5) * 5;
  return { low, high };
}

/** Formatted "$200 - $220" label for a home size + service. */
export function priceRangeLabel(service: string, size: number): string {
  const { low, high } = priceRange(service, size);
  return `$${low} - $${high}`;
}

/** The lowest published price for a service — the honest "from $X" number. */
export function startingPrice(service: string): number {
  const table = PRICE_TABLE[service] || PRICE_TABLE.regular;
  return Math.max(table[0], MINIMUMS[service] || 200);
}

/**
 * Guard: the bracket table below and claims.ts PRICING are two statements of
 * the same fact — the lowest published price per service. claims.ts is the
 * authority (it carries the verification date and gates the build); this module
 * owns the full square-footage curve that claims.ts does not model.
 *
 * Without this check the two could drift exactly the way the retired
 * $99/$149/$175 tier drifted from /pricing: silently, for months, across
 * hundreds of pages. Failing the build is the cheaper outcome.
 */
const CLAIMS_STARTING_PRICE: Record<string, number> = {
  regular: PRICING.regular.amount,
  deep: PRICING.deep.amount,
  moveinout: PRICING.moveInOut.amount,
  postconstruction: PRICING.postConstruction.amount,
};

for (const [service, claimed] of Object.entries(CLAIMS_STARTING_PRICE)) {
  const derived = Math.max(PRICE_TABLE[service][0], MINIMUMS[service]);
  if (derived !== claimed) {
    throw new ClaimsError(
      `pricing.ts disagrees with claims.ts for "${service}": the rate card starts at ` +
        `$${derived} but claims.PRICING says $${claimed}. Re-verify against /pricing ` +
        `and update BOTH, or the site will publish two different starting prices.`,
    );
  }
}

/**
 * Rows for the visible rate card. Every bracket is emitted so the page carries
 * a real, quotable number for any home size rather than a single "starting at".
 */
export const RATE_CARD_ROWS = SQFT_BRACKETS.map((sqft, i) => ({
  sqft,
  label:
    i === 0
      ? `Up to ${sqft.toLocaleString()} sq ft`
      : `${(SQFT_BRACKETS[i - 1] + 1).toLocaleString()}–${sqft.toLocaleString()} sq ft`,
  regular: Math.max(PRICE_TABLE.regular[i], MINIMUMS.regular),
  deep: Math.max(PRICE_TABLE.deep[i], MINIMUMS.deep),
  moveinout: Math.max(PRICE_TABLE.moveinout[i], MINIMUMS.moveinout),
  postconstruction: Math.max(
    PRICE_TABLE.postconstruction[i],
    MINIMUMS.postconstruction,
  ),
}));
