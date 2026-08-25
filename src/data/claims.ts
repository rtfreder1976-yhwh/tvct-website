/**
 * claims.ts — single source of truth for factual claims used across the site.
 *
 * Reusable claims belong here so pages/components do not drift apart. Values
 * that have not been verified must use TODO_VERIFY rather than a plausible guess.
 */

export const TODO_VERIFY = "TODO_VERIFY" as const;
export type TodoVerify = typeof TODO_VERIFY;
export type Claim<T> = T | TodoVerify;

const isUnresolved = (v: unknown): boolean =>
  v === TODO_VERIFY ||
  (Array.isArray(v) && v.some(isUnresolved)) ||
  (typeof v === "object" && v !== null && Object.values(v).some(isUnresolved));

// Pricing confirmed by Todd. These are the advertised starting prices.
//
// postConstruction was $300 until 2026-08-20. That was below the service's own
// $450 minimum and contradicted both the pricing sheet and the live
// BookingKoala rate card, which bill $526 for the smallest bracket. Verified
// directly against BookingKoala pricing parameters (variable 171, "Up to 750
// sqft", $526.00) on 2026-08-20 and corrected.
export const PRICING = {
  regular: { amount: 200, display: "$200" },
  deep: { amount: 276, display: "$276" },
  moveInOut: { amount: 351, display: "$351" },
  airbnbTurnover: { amount: 125, display: "$125" },
  postConstruction: { amount: 526, display: "$526" },
} as const;

/**
 * schema.org LocalBusiness `priceRange`.
 *
 * This is the relative Google/Yelp band for the category and locale, not a
 * dollar figure: "$" budget, "$$" mid-range, "$$$" upscale, "$$$$" highest.
 *
 * Set to "$$$" on 2026-08-20 (Todd). The site had drifted to a mix of 55 "$$"
 * and 12 "$$$" declarations. "$$" understated a premium, insured,
 * veteran-and-woman-owned service whose residential AOV runs about $249 and
 * whose 1,500 sq ft deep clean is $381.
 *
 * Note this earns no rich result — Google retired LocalBusiness price display.
 * It is a positioning signal that answer engines still read when they
 * characterise the business.
 */
export const PRICE_RANGE_BAND = "$$$" as const;

export const RECURRING_DISCOUNTS = {
  weekly: 0.3,
  biweekly: 0.25,
  monthly: 0.15,
  appliesTo: "regular_base" as const,
} as const;

export const RECURRING_MINIMUMS = {
  weekly: 150,
} as const;

function recurringRate(discount: number, floor = 0) {
  const amount = Math.max(PRICING.regular.amount * (1 - discount), floor);
  return { amount, display: `$${Math.ceil(amount)}` };
}

export const RECURRING_PRICING = {
  weekly: recurringRate(RECURRING_DISCOUNTS.weekly, RECURRING_MINIMUMS.weekly),
  biweekly: recurringRate(RECURRING_DISCOUNTS.biweekly),
  monthly: recurringRate(RECURRING_DISCOUNTS.monthly),
} as const;

// Verified against the live Google Business Profile on 2026-07-25.
export const REVIEWS = {
  rating: "4.9",
  count: 148,
  countDisplay: "148",
  verifiedOn: "2026-07-25",
} as const;

export const CHECKLIST = {
  standard: 44,
  deep: 57,
  moveInOut: 49,
  postConstruction: 37,
  total: 61,
} as const;

// Confirmed by Todd 2026-08-02.
export const IDENTITY = {
  primaryPhrase: "veteran- and woman-owned",
  primaryPhraseCapitalized: "Veteran- and woman-owned",
  isVeteranOwned: true,
  isWomanOwned: true,
  isFamilyOwned: true,
} as const;

/**
 * Customer-facing trust/service commitments confirmed directly by Todd on
 * 2026-08-11. These values are deliberately explicit so verified coverage and
 * guarantee terms are not removed by future claim-safety passes.
 */
export const TRUST = {
  isInsured: true,
  liabilityCoverageAmount: 2_000_000,
  liabilityCoverageDisplay: "$2 million",
  // Not verified — Todd, 2026-08-23. Do not claim.
  workersComp: false,
  // Confirmed FALSE by Todd 2026-08-24: "We are insured but not bonded." Never claim.
  bonded: false,
  damageClaimsCoveredByInsurance: true,
  backgroundChecks: true,
  satisfactionGuarantee: true,
  freeReclean: true,
  recleanWindowHours: 24,
  weekendAvailability: true,
} as const;

/** Business and pricing policies confirmed directly by Todd on 2026-08-11. */
export const POLICIES = {
  priceMatching: false,
  paymentMethods: ["credit card", "debit card"] as const,
  cancellation: {
    noticeHours: 24,
    feeAmount: 100,
    appliesTo: ["late cancellation", "no-show", "lock-out"] as const,
  },
  travelFee: {
    minAmount: 5,
    maxAmount: 15,
  },
  greenProducts: {
    availableUponRequest: true,
    extraCharge: 0,
  },
  addOnsAvailable: true,
  pets: {
    feePerPet: 25,
    heavyShedSurcharge: 100,
  },
  bookingAhead: {
    recommendedMinDays: 2,
    recommendedMaxDays: 3,
  },
  commercialQuoteFactors: [
    "square footage",
    "task list",
    "services per week",
  ] as const,
} as const;

/**
 * Brand stance. Confirmed by Todd 2026-08-22.
 *
 * "premium" describes the REGISTER: elevated, precise, confident, quality-
 * forward. It is carried by specificity and restraint, not by adjectives.
 * This is consistent with PRICE_RANGE_BAND "$$$" above.
 *
 * It is NOT a licence for luxury vocabulary. "Estate", "white-glove",
 * "concierge" and "bespoke" remain gated to `luxuryScope` below and are
 * enforced by usesLuxuryFraming(). Premium is how the whole brand sounds;
 * luxury is a specific vocabulary for two specific markets.
 *
 * Was "transparent_value" until 2026-08-22. That value predated the rebuilt
 * voice profile and contradicted PRICE_RANGE_BAND, which has been "$$$" since
 * 2026-08-20. Transparency is still a core proof (flat pricing, a firm price
 * on the call, published policies) — it is just no longer the stance label.
 */
export const POSITIONING = {
  stance: "premium" as const,
  luxuryScope: ["Mountain Brook", "West Nashville"] as readonly string[],
  luxuryServices: ["white-glove-cleaning", "luxury-homes"] as readonly string[],
} as const;

export function usesLuxuryFraming(marketOrService?: string): boolean {
  if (!marketOrService) return false;
  return (
    POSITIONING.luxuryScope.includes(marketOrService) ||
    POSITIONING.luxuryServices.includes(marketOrService)
  );
}

export interface Certification {
  body: string;
  name: string;
  credentialId?: string;
}

// Confirmed by Todd 2026-08-02: no named professional certification is held.
export const CERTIFICATIONS: readonly Certification[] = [];

export function hasCertifications(): boolean {
  return CERTIFICATIONS.length > 0;
}

// Confirmed by Todd 2026-08-02: no clinical/medical cleaning credential set.
export const CLINICAL = {
  bloodbornePathogensTraining: false,
  epaRegisteredDisinfectant: null as string | null,
  writtenMedicalProtocol: false,
} as const;

export function canClaimClinicalCompliance(): boolean {
  return (
    Boolean(CLINICAL.bloodbornePathogensTraining) &&
    typeof CLINICAL.epaRegisteredDisinfectant === "string" &&
    CLINICAL.epaRegisteredDisinfectant.length > 0 &&
    Boolean(CLINICAL.writtenMedicalProtocol)
  );
}

// Confirmed by Todd / BookingKoala reporting.
export const PERFORMANCE = {
  onTimeArrivalPct: 98,
  repeatCustomerPct: 85,
  avgCleanerExperienceYears: 15,
  customersServed: 1500,
  customersServedDisplay: "1,500+",
  quoteResponseSla: "2 business hours",
} as const;

/**
 * Phone-quote commitment. Confirmed by Todd 2026-08-22.
 *
 * A caller reaching a live person during business hours gets a FIRM FLAT PRICE on the
 * call for a standard residential home — not a range, not a "starting at", and not a
 * callback. The quoted number is the number billed.
 *
 * This is possible because pricing is deterministic: whoever answers reads the sq-ft
 * bracket rate card rather than estimating. It is the reason the claim is safe to make.
 *
 * `priceHeld: true` is the load-bearing part. The price moves ONLY when the customer
 * added scope after the quote, or the home was misstated at quote time (square footage,
 * bedroom/bath count, pets). Condition found on arrival is NOT a permitted reason to
 * revise a quoted price.
 *
 * OUT OF SCOPE — these still route to `quoteResponseSla` ("2 business hours"):
 * after-hours and voicemail, commercial inquiries, post-construction, and homes
 * outside the published sq-ft brackets.
 */
export const QUOTE_ON_CALL = {
  available: true,
  scope: "most standard residential homes" as const,
  hours: "business hours" as const,
  priceHeld: true,
  /** The only permitted reasons a quoted price may change. */
  priceChangeExceptions: [
    "customer added scope after the quote",
    "home details misstated at quote time (sq ft, bedrooms, baths, pets)",
  ] as const,
  /** Inquiry types that fall back to the 2-business-hour SLA instead. */
  fallbackToSla: [
    "after hours or voicemail",
    "commercial",
    "post-construction",
    "homes outside the published square-footage brackets",
  ] as const,
  confirmedBy: "Todd",
  confirmedOn: "2026-08-22",
} as const;

export class ClaimsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaimsError";
  }
}

/** Stop a build if a canonical claim is unresolved or internally impossible. */
export function assertClaims(): void {
  const unresolved: string[] = [];
  const groups: Record<string, unknown> = {
    RECURRING_DISCOUNTS,
    CHECKLIST,
    IDENTITY,
    TRUST,
    POLICIES,
    POSITIONING,
    CLINICAL,
    PERFORMANCE,
    QUOTE_ON_CALL,
  };

  for (const [groupName, group] of Object.entries(groups)) {
    for (const [key, value] of Object.entries(group as object)) {
      if (isUnresolved(value)) unresolved.push(`${groupName}.${key}`);
    }
  }

  const impossible: string[] = [];

  for (const [k, v] of Object.entries(PRICING)) {
    if (v.amount <= 0) impossible.push(`PRICING.${k} is not positive (${v.amount})`);
    if (v.display !== `$${v.amount}`)
      impossible.push(`PRICING.${k}: display "${v.display}" disagrees with amount ${v.amount}`);
  }
  if (PRICING.deep.amount < PRICING.regular.amount)
    impossible.push("PRICING.deep is cheaper than PRICING.regular");
  if (PRICING.moveInOut.amount < PRICING.deep.amount)
    impossible.push("PRICING.moveInOut is cheaper than PRICING.deep");

  for (const [k, v] of Object.entries(RECURRING_DISCOUNTS)) {
    if (typeof v === "number" && (v <= 0 || v >= 1))
      impossible.push(`RECURRING_DISCOUNTS.${k} is not a fraction between 0 and 1 (${v})`);
  }

  if (RECURRING_PRICING.weekly.amount > RECURRING_PRICING.biweekly.amount)
    impossible.push("RECURRING_PRICING.weekly costs more per visit than biweekly");
  if (RECURRING_PRICING.biweekly.amount > RECURRING_PRICING.monthly.amount)
    impossible.push("RECURRING_PRICING.biweekly costs more per visit than monthly");
  if (RECURRING_PRICING.monthly.amount > PRICING.regular.amount)
    impossible.push("RECURRING_PRICING.monthly exceeds the undiscounted PRICING.regular");

  if (TRUST.liabilityCoverageAmount <= 0)
    impossible.push("TRUST.liabilityCoverageAmount must be positive");
  if (TRUST.recleanWindowHours <= 0)
    impossible.push("TRUST.recleanWindowHours must be positive");

  if (POLICIES.priceMatching)
    impossible.push("POLICIES.priceMatching must remain false unless the policy changes");
  if (POLICIES.cancellation.noticeHours <= 0 || POLICIES.cancellation.feeAmount <= 0)
    impossible.push("POLICIES.cancellation must have positive notice hours and fee amount");
  if (POLICIES.travelFee.minAmount < 0 || POLICIES.travelFee.maxAmount < POLICIES.travelFee.minAmount)
    impossible.push("POLICIES.travelFee range is invalid");
  if (POLICIES.greenProducts.extraCharge !== 0)
    impossible.push("POLICIES.greenProducts.extraCharge must be zero");
  if (POLICIES.pets.feePerPet <= 0 || POLICIES.pets.heavyShedSurcharge <= 0)
    impossible.push("POLICIES.pets fees must be positive");
  if (POLICIES.bookingAhead.recommendedMaxDays < POLICIES.bookingAhead.recommendedMinDays)
    impossible.push("POLICIES.bookingAhead range is invalid");

  for (const k of ["onTimeArrivalPct", "repeatCustomerPct"] as const) {
    const v = PERFORMANCE[k];
    if (typeof v === "number" && (v < 0 || v > 100))
      impossible.push(`PERFORMANCE.${k} is not a 0-100 percentage (${v})`);
  }

  for (const k of ["standard", "deep", "moveInOut", "postConstruction"] as const) {
    const v = CHECKLIST[k];
    if (typeof v === "number" && v > CHECKLIST.total)
      impossible.push(`CHECKLIST.${k} (${v}) exceeds CHECKLIST.total (${CHECKLIST.total})`);
  }

  const rating = Number(REVIEWS.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5)
    impossible.push(`REVIEWS.rating is not a 0-5 value (${REVIEWS.rating})`);
  if (!Number.isInteger(REVIEWS.count) || REVIEWS.count < 0)
    impossible.push(`REVIEWS.count is not a whole number (${REVIEWS.count})`);
  if (REVIEWS.countDisplay !== String(REVIEWS.count))
    impossible.push(
      `REVIEWS.countDisplay "${REVIEWS.countDisplay}" disagrees with count ${REVIEWS.count}`,
    );

  CERTIFICATIONS.forEach((c, i) => {
    if (!c.body?.trim()) impossible.push(`CERTIFICATIONS[${i}] has no issuing body`);
  });

  if (canClaimClinicalCompliance() && !CLINICAL.epaRegisteredDisinfectant)
    impossible.push("canClaimClinicalCompliance() is true without a named disinfectant");

  if (unresolved.length === 0 && impossible.length === 0) return;

  const lines = ["Unverified or impossible claims — the build stops here.", ""];
  if (unresolved.length) {
    lines.push(`${unresolved.length} claim(s) still set to ${TODO_VERIFY}:`);
    lines.push(...unresolved.map((u) => `  - ${u}`));
    lines.push("");
    lines.push("Each needs a real value in src/data/claims.ts.");
  }
  if (impossible.length) {
    if (unresolved.length) lines.push("");
    lines.push(`${impossible.length} internally inconsistent claim(s):`);
    lines.push(...impossible.map((i) => `  - ${i}`));
  }

  throw new ClaimsError(lines.join("\n"));
}
