/**
 * claims.ts — single source of truth for every factual claim the site makes.
 *
 * Why this exists: the same claim was being retyped across hundreds of pages and
 * drifting as it went. Four different identity phrases, two review ratings, five
 * different checklist sizes, and a retired price tier that was still being
 * published into JSON-LD long after the site copy moved on.
 *
 * How to use it:
 *   import { PRICING, REVIEWS } from "../data/claims";
 *   <p>Regular cleaning from {PRICING.regular.display}</p>
 *
 * Rules:
 *   1. A claim that appears on more than one page belongs here, not in the page.
 *   2. A value nobody has verified is TODO_VERIFY. It is not a guess, and it is
 *      not omitted — assertClaims() fails the build until someone resolves it.
 *   3. Every value below carries the date and source it was verified against.
 *      Re-verify before changing; do not round in the business's favour.
 */

/**
 * Sentinel for a claim nobody has verified yet. Deliberately a string that is
 * obvious in rendered output — if one ever escapes assertClaims(), it should be
 * unmissable on the page rather than quietly plausible.
 */
export const TODO_VERIFY = "TODO_VERIFY" as const;
export type TodoVerify = typeof TODO_VERIFY;
export type Claim<T> = T | TodoVerify;

const isUnresolved = (v: unknown): boolean =>
  v === TODO_VERIFY ||
  (Array.isArray(v) && v.some(isUnresolved)) ||
  (typeof v === "object" && v !== null && Object.values(v).some(isUnresolved));

// ---------------------------------------------------------------------------
// PRICING — verified 2026-08-01 against /pricing, which is the canonical page.
// The retired $99 / $175 / $225 tier was still reaching JSON-LD; that is what
// kept Google serving the old numbers in indexed snippets.
// ---------------------------------------------------------------------------

export const PRICING = {
  // $200, not the $176 that appears in the sheet's Standard Clean table.
  // Confirmed by Todd 2026-08-10: the "Standard Clean $200" line in the sheet's
  // Minimum Prices block is the real floor, so $176 is a table value nobody is
  // ever actually charged. Advertising it was quoting a price we do not honour.
  regular: { amount: 200, display: "$200" },
  deep: { amount: 276, display: "$276" },
  moveInOut: { amount: 351, display: "$351" },
  airbnbTurnover: { amount: 125, display: "$125" },
  postConstruction: { amount: 300, display: "$300" },
} as const;

/**
 * Recurring discounts, per the /pricing FAQ. Confirmed by Todd 2026-08-02:
 * the percentages are correct and PRICING.regular is the pre-discount list
 * price, so a recurring per-visit rate is that base minus the discount.
 *
 * This retires the per-visit rates that were live on location pages
 * ($99/visit, $119/week, $109/visit, $89/week, $129/week, $109/week) — none of
 * them matched this schedule.
 */
export const RECURRING_DISCOUNTS = {
  weekly: 0.3,
  biweekly: 0.25,
  monthly: 0.15,
  appliesTo: "regular_base" as const,
} as const;

/**
 * Per-visit minimums for recurring service, from the pricing sheet's Minimum
 * Prices block. Only weekly carries its own floor: at 30% off a $200 base the
 * arithmetic gives $140, which is below the $150 the sheet says we charge.
 */
export const RECURRING_MINIMUMS = {
  weekly: 150,
} as const;

/**
 * Per-visit recurring rates, derived rather than retyped.
 *
 * Display rounds UP to whole dollars, and never below the sheet's minimum.
 * Both rules point the same way: rounding down, or ignoring a floor, would
 * advertise a price below what is actually charged.
 */
function recurringRate(discount: number, floor = 0) {
  const amount = Math.max(PRICING.regular.amount * (1 - discount), floor);
  return { amount, display: `$${Math.ceil(amount)}` };
}

export const RECURRING_PRICING = {
  // $140 by arithmetic, floored to the sheet's $150 weekly minimum.
  weekly: recurringRate(RECURRING_DISCOUNTS.weekly, RECURRING_MINIMUMS.weekly),
  biweekly: recurringRate(RECURRING_DISCOUNTS.biweekly), // $150.00 -> "$150"
  monthly: recurringRate(RECURRING_DISCOUNTS.monthly), // $170.00 -> "$170"
} as const;

// ---------------------------------------------------------------------------
// REVIEWS — mirrors constants/schemaData.ts REVIEWS, which was verified
// 2026-07-25 against the live Google Business Profile. Do not round up.
// ---------------------------------------------------------------------------

export const REVIEWS = {
  rating: "4.9",
  count: 148,
  countDisplay: "148",
  verifiedOn: "2026-07-25",
} as const;

// ---------------------------------------------------------------------------
// CHECKLIST SIZES — actual array lengths, not claims.
//
// `standard` confirmed by Todd 2026-08-02 as the Weekly/Bi-Weekly column of the
// residential cleaning checklist PDF, and independently counted from that PDF:
// 61 tasks total, 44 ticked for Weekly/Bi-Weekly (All Rooms 8, Kitchen 11,
// Bathrooms 9, Bedrooms 4, Laundry 5, Dining 2, Living 2, Office 3, Extras 0).
// That matches the `weekly` flag count in components/CleaningChecklist.astro,
// which is the same checklist digitised.
//
// So the "49-point checklist" claim in 44 files was wrong: 49 is the
// move-in/out column. The standard clean is 44 points.
// ---------------------------------------------------------------------------

export const CHECKLIST = {
  standard: 44,
  deep: 57,
  moveInOut: 49,
  postConstruction: 37,
  /** Every task on the checklist, across all service levels. */
  total: 61,
} as const;

// ---------------------------------------------------------------------------
// IDENTITY — confirmed by Todd 2026-08-02: veteran owned, woman owned, and
// family owned. "women-led" (53 files) was the weaker of the two gender claims
// and is retired in favour of the ownership claim, which is the certifiable one.
// ---------------------------------------------------------------------------

export const IDENTITY = {
  primaryPhrase: "veteran- and woman-owned",
  /** For sentence-initial use. */
  primaryPhraseCapitalized: "Veteran- and woman-owned",
  isVeteranOwned: true,
  isWomanOwned: true,
  isFamilyOwned: true,
} as const;

// ---------------------------------------------------------------------------
// POSITIONING — confirmed by Todd 2026-08-02: luxury framing is kept only on
// the premium markets and the white-glove service, and retired everywhere else
// in favour of transparent value, which is what a $200 entry price supports.
//
// The premium markets are the ones already tagged as such in schemaData's
// cityConfigs ("Luxury market—..." edge).
// ---------------------------------------------------------------------------

export const POSITIONING = {
  stance: "transparent_value" as const,
  /** Pages/markets that keep the luxury framing. */
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

// ---------------------------------------------------------------------------
// CERTIFICATIONS
//
// Empty on purpose. No named certifying body appears anywhere in the repo, and
// Todd confirmed 2026-08-02 that the team is not certified. The "Certified —
// Professional Cleaners" badge is gated on hasCertifications() so it cannot
// render while this list is empty.
// ---------------------------------------------------------------------------

export interface Certification {
  /** The body that issued it, e.g. "IICRC" — not a bare adjective. */
  body: string;
  name: string;
  /** Verifiable ID where the issuer provides one. */
  credentialId?: string;
}

export const CERTIFICATIONS: readonly Certification[] = [];

export function hasCertifications(): boolean {
  return CERTIFICATIONS.length > 0;
}

// ---------------------------------------------------------------------------
// CLINICAL / HEALTHCARE COMPLIANCE
//
// Confirmed by Todd 2026-08-02: the team is NOT trained or certified in any of
// this. "OSHA" appeared in 34 files, none naming a standard, alongside
// "OSHA-compliant sanitization" and "trained in medical-grade cleaning
// standards" — all retired.
//
// These stay as explicit `false` rather than being deleted: the gate has to
// keep returning false, and a future reader needs to see that this was checked
// and answered, not merely never filled in.
// ---------------------------------------------------------------------------

export const CLINICAL = {
  /** Bloodborne pathogens training, 29 CFR 1910.1030. */
  bloodbornePathogensTraining: false,
  /** Named EPA-registered disinfectant, e.g. "Oxivir Tb, EPA Reg. No. 70627-56". */
  epaRegisteredDisinfectant: null as string | null,
  /** A written, followed medical cleaning protocol. */
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

// ---------------------------------------------------------------------------
// PERFORMANCE — confirmed by Todd 2026-08-02.
// On-time and repeat-rate both come from BookingKoala reporting.
// ---------------------------------------------------------------------------

export const PERFORMANCE = {
  /** BookingKoala data. */
  onTimeArrivalPct: 98,
  /** BookingKoala data. */
  repeatCustomerPct: 85,
  avgCleanerExperienceYears: 15,
  /**
   * Customers served, not cleanings performed. The old "1,047+" was used for
   * both nouns interchangeably; there is no separately verified cleanings
   * figure, so that claim is retired rather than guessed at.
   */
  customersServed: 1500,
  customersServedDisplay: "1,500+",
  quoteResponseSla: "2 business hours",
} as const;

// ---------------------------------------------------------------------------
// Build-time gate
// ---------------------------------------------------------------------------

export class ClaimsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClaimsError";
  }
}

/**
 * Fails the build while any claim is unresolved or arithmetically impossible.
 *
 * A failing build here is the intended outcome, not a bug: it is cheaper to
 * stop a deploy than to publish a number nobody can stand behind. The error
 * lists exactly what needs answering.
 */
export function assertClaims(): void {
  const unresolved: string[] = [];
  const groups: Record<string, unknown> = {
    RECURRING_DISCOUNTS,
    CHECKLIST,
    IDENTITY,
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

  // Prices must be positive and ordered: a deep clean cannot cost less than a
  // regular one, and a move-out cannot cost less than a deep clean.
  for (const [k, v] of Object.entries(PRICING)) {
    if (v.amount <= 0) impossible.push(`PRICING.${k} is not positive (${v.amount})`);
    if (v.display !== `$${v.amount}`)
      impossible.push(`PRICING.${k}: display "${v.display}" disagrees with amount ${v.amount}`);
  }
  if (PRICING.deep.amount < PRICING.regular.amount)
    impossible.push("PRICING.deep is cheaper than PRICING.regular");
  if (PRICING.moveInOut.amount < PRICING.deep.amount)
    impossible.push("PRICING.moveInOut is cheaper than PRICING.deep");

  // Percentages must be percentages.
  for (const [k, v] of Object.entries(RECURRING_DISCOUNTS)) {
    if (typeof v === "number" && (v <= 0 || v >= 1))
      impossible.push(`RECURRING_DISCOUNTS.${k} is not a fraction between 0 and 1 (${v})`);
  }

  // A more frequent visit must not cost more than a less frequent one, and no
  // recurring rate may exceed the list price it is discounted from.
  if (RECURRING_PRICING.weekly.amount > RECURRING_PRICING.biweekly.amount)
    impossible.push("RECURRING_PRICING.weekly costs more per visit than biweekly");
  if (RECURRING_PRICING.biweekly.amount > RECURRING_PRICING.monthly.amount)
    impossible.push("RECURRING_PRICING.biweekly costs more per visit than monthly");
  if (RECURRING_PRICING.monthly.amount > PRICING.regular.amount)
    impossible.push("RECURRING_PRICING.monthly exceeds the undiscounted PRICING.regular");

  // Percentage claims must be percentages.
  for (const k of ["onTimeArrivalPct", "repeatCustomerPct"] as const) {
    const v = PERFORMANCE[k];
    if (typeof v === "number" && (v < 0 || v > 100))
      impossible.push(`PERFORMANCE.${k} is not a 0-100 percentage (${v})`);
  }

  // Checklist arithmetic: no service level may claim more tasks than exist.
  for (const k of ["standard", "deep", "moveInOut", "postConstruction"] as const) {
    const v = CHECKLIST[k];
    if (typeof v === "number" && v > CHECKLIST.total)
      impossible.push(`CHECKLIST.${k} (${v}) exceeds CHECKLIST.total (${CHECKLIST.total})`);
  }

  // A rating out of five, and a review count that is a whole number.
  const rating = Number(REVIEWS.rating);
  if (!Number.isFinite(rating) || rating < 0 || rating > 5)
    impossible.push(`REVIEWS.rating is not a 0-5 value (${REVIEWS.rating})`);
  if (!Number.isInteger(REVIEWS.count) || REVIEWS.count < 0)
    impossible.push(`REVIEWS.count is not a whole number (${REVIEWS.count})`);
  if (REVIEWS.countDisplay !== String(REVIEWS.count))
    impossible.push(
      `REVIEWS.countDisplay "${REVIEWS.countDisplay}" disagrees with count ${REVIEWS.count}`,
    );

  // A certification claim needs an issuer.
  CERTIFICATIONS.forEach((c, i) => {
    if (!c.body?.trim()) impossible.push(`CERTIFICATIONS[${i}] has no issuing body`);
  });

  // The clinical gate must not be able to open on a partial basis.
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
