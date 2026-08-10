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
 * SOURCE OF TRUTH: "New TVCT Cleaning Biz Pricing – Cleaning Pricing" sheet,
 * supplied by Todd and verified against these arrays on 2026-08-10. All three
 * published tables below (brackets, standard, deep, move-in/out) match that
 * sheet value-for-value.
 *
 * On the sheet but deliberately NOT published here, because publishing a price
 * is a business decision and nobody has asked for these to go live:
 *   - Construction Clean Up ($526 … $1,820, "50% more than Move In/Out")
 *   - Per-visit recurring rows (weekly -30%, bi-weekly -25%, monthly -15%);
 *     claims.ts RECURRING_PRICING derives these instead, and rounds UP where
 *     the sheet rounds down (weekly $124 vs $123, monthly $150 vs $149).
 *   - Extras (inside oven $50, pet hair $100, blinds $10/each, fridge $75,
 *     dishwasher $50).
 */

import { PRICING, ClaimsError } from "./claims";

export const SQFT_BRACKETS = [
  750, 1000, 1250, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 4000, 4400,
  4700, 5200, 5600, 6000, 6500,
] as const;

export const PRICE_TABLE: Record<string, number[]> = {
  // Standard / regular clean
  regular:   [176, 211, 246, 281, 316, 351, 381, 436, 491, 546, 601, 656, 711, 766, 821, 876, 931, 1045],
  // First / deep clean
  deep:      [276, 311, 346, 381, 416, 451, 506, 561, 616, 671, 726, 781, 836, 891, 946, 1001, 1056, 1170],
  // Move in/out (Deep + $75)
  moveinout: [351, 386, 421, 456, 491, 526, 581, 636, 691, 746, 801, 856, 911, 966, 1021, 1076, 1131, 1181],
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
 * `regular` is the one deliberate divergence: the sheet's Standard Clean
 * minimum is $200, but its Standard Clean table starts at $176, and $176 is the
 * number claims.ts carries (verified against /pricing by Todd on 2026-08-02)
 * and that ~90 pages advertise. Setting this to 200 would make the calculator
 * quote $200-$220 for a 750 sq ft home while the homepage band, the tier card
 * and every location page still say "from $176" — the exact drift that was
 * fixed once already. Raising it is a pricing decision, not a code fix: change
 * claims.PRICING.regular and the site copy in the same commit, or the build
 * guard below will (correctly) refuse.
 */
export const MINIMUMS: Record<string, number> = {
  regular: 176,
  deep: 200,
  moveinout: 350,
};

export const SERVICE_LABELS: Record<string, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  moveinout: "Move In/Out Cleaning",
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

/** Formatted "$176 - $195" label for a home size + service. */
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
}));
