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
 * Brackets and prices come straight from the company pricing sheet and match
 * the BookingKoala booking form.
 */

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
 * Price floors. A floor must never sit above the first bracket price, or the
 * calculator advertises a starting rate no customer can actually reach:
 * `regular` was once 200 against a 176 bracket price, so the smallest home
 * always quoted 200-220 while the tier card, the homepage band and 90+ pages
 * advertised "from $176".
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
