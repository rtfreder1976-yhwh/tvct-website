import {
  PRICING,
  RECURRING_DISCOUNTS,
  RECURRING_PRICING,
} from "./claims";

export const pct = (value: number) => `${Math.round(value * 100)}%`;

/**
 * Canonical starting price for programmatic location/service pages.
 * services.json still contains historical marketing copy, but generated pages
 * must never trust its price_start field directly.
 */
export function canonicalServicePrice(slug: string): string {
  switch (slug) {
    case "deep-cleaning":
      return PRICING.deep.display;
    case "recurring-maid-service":
    case "weekly-cleaning":
      return `${RECURRING_PRICING.weekly.display}/visit`;
    case "biweekly-cleaning":
      return `${RECURRING_PRICING.biweekly.display}/visit`;
    case "move-in-out-cleaning":
    case "move-out-cleaning":
      return PRICING.moveInOut.display;
    case "airbnb-cleaning":
      return PRICING.airbnbTurnover.display;
    case "post-construction-cleaning":
      return PRICING.postConstruction.display;
    case "commercial-cleaning":
    case "office-cleaning":
    case "medical-office-cleaning":
    case "dental-office-cleaning":
    case "foreclosure-reo-cleaning":
      return "Call for Quote";
    default:
      return "Call for Quote";
  }
}

/**
 * Normalize historical pricing/discount language before services.json copy is
 * rendered. This adapter is intentionally slug-aware so replacements cannot
 * accidentally rewrite competitor figures or unrelated editorial content.
 */
export function normalizeServiceCopy(slug: string, input: string): string {
  let text = input;

  if (slug === "recurring-maid-service" || slug === "weekly-cleaning") {
    text = text
      .replace(/save up to 20%/gi, `save up to ${pct(RECURRING_DISCOUNTS.weekly)}`)
      .replace(/save 20%/gi, `save ${pct(RECURRING_DISCOUNTS.weekly)}`)
      .replace(/20% savings/gi, `${pct(RECURRING_DISCOUNTS.weekly)} savings`);
  }

  if (slug === "biweekly-cleaning") {
    text = text
      .replace(/save 15%/gi, `save ${pct(RECURRING_DISCOUNTS.biweekly)}`)
      .replace(/saving you 15%/gi, `saving you ${pct(RECURRING_DISCOUNTS.biweekly)}`)
      .replace(/15% off our standard/gi, `${pct(RECURRING_DISCOUNTS.biweekly)} off our standard`);
  }

  // Correct any full recurring ladder embedded in old FAQ/template copy.
  text = text
    .replace(
      /weekly(?: cleaning)? saves? 20%,? bi-?weekly saves? 15%,? and monthly saves? 10%/gi,
      `weekly saves ${pct(RECURRING_DISCOUNTS.weekly)}, biweekly saves ${pct(RECURRING_DISCOUNTS.biweekly)}, and monthly saves ${pct(RECURRING_DISCOUNTS.monthly)}`,
    )
    .replace(
      /weekly visits save 20%,? bi-?weekly save 15%,? and monthly visits save 10%/gi,
      `weekly visits save ${pct(RECURRING_DISCOUNTS.weekly)}, biweekly save ${pct(RECURRING_DISCOUNTS.biweekly)}, and monthly visits save ${pct(RECURRING_DISCOUNTS.monthly)}`,
    );

  return text;
}

/**
 * Canonical residential price band for hand-authored neighborhood pages.
 *
 * Nine Athens/Decatur neighborhood pages shipped the same copied boilerplate
 * band, and seven other pages carried their own hand-typed variants. Every one
 * of them opened below the weekly-recurring minimum — i.e. quoted a rate no
 * customer is ever charged — inside FAQ JSON-LD where answer engines read it.
 *
 * Deriving the band here means a neighborhood page can never again invent its
 * own floor. The low end is the weekly recurring minimum from claims.ts; the
 * high end is grounded in the real rate card (2,700 sq ft regular = $436,
 * rounded up to a clean $450). Retired Offer tokens are deliberately avoided —
 * the claim validator rejects them.
 */
export function residentialRangeLabel(): string {
  return `${RECURRING_PRICING.weekly.display}-$450`;
}

/** Sentence-ready band for "Most {area} homes range from {band} for ...". */
export function residentialRangeSentence(area: string, service = "regular maintenance cleaning"): string {
  return `Most ${area} homes range from ${residentialRangeLabel()} for ${service}`;
}
