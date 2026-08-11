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
export const PRICING = {
  regular: { amount: 200, display: "$200" },
  deep: { amount: 276, display: "$276" },
  moveInOut: { amount: 351, display: "$351" },
  airbnbTurnover: { amount: 125, display: "$125" },
  postConstruction: { amount: 300, display: "$300" },
} as const;

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
 * 2026-08-11. Keep these deliberately qualitative where the exact policy was
 * not specified: the business is insured, but no coverage amount is asserted;
 * the satisfaction guarantee includes a free re-clean, but no time window is
 * asserted; weekends are available, but evenings are not asserted here.
 */
export const TRUST = {
  isInsured: true,
  backgroundChecks: true,
  satisfactionGuarantee: true,
  freeReclean: true,
  weekendAvailability: true,
} as const;

export const POSITIONING = {
  stance: "transparent_value" as const,
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
    POSITIONING,
    CLINICAL,
    PERFORMANCE,
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
