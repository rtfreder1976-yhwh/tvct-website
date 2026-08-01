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
 *   3. Where the codebase held several values for one claim, every competing
 *      value is recorded in a CONFLICT comment with its source, so whoever
 *      resolves it can see what they are choosing between.
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
  regular: { amount: 176, display: "$176" },
  deep: { amount: 276, display: "$276" },
  moveInOut: { amount: 351, display: "$351" },
  airbnbTurnover: { amount: 125, display: "$125" },
  postConstruction: { amount: 300, display: "$300" },
} as const;

/**
 * Recurring discounts, per the /pricing FAQ.
 *
 * CONFLICT: it is not established whether these come off PRICING.regular or off
 * a higher "standard cleaning price". /pricing labels $176 as the base rate for
 * the "Weekly or Bi-Weekly" product while simultaneously badging it "Save up to
 * 30%", which reads both ways.
 *   - If off $176: weekly $123.20, biweekly $132, monthly $149.60
 *   - Location pages currently publish: $99/visit (5 biweekly pages),
 *     $119/week, $109/visit, $89/week, $129/week, $109/week, $125/visit
 * None of the published per-visit rates match either reading. Until this is
 * settled, no page should compute a per-visit price from these.
 *   src/pages/pricing.astro:754, src/pages/locations/{decatur,huntsville,
 *   athens,muscle-shoals,florence}/biweekly-cleaning.astro
 */
export const RECURRING_DISCOUNTS = {
  weekly: 0.3,
  biweekly: 0.25,
  monthly: 0.15,
  /** Does the discount apply to PRICING.regular, or to a higher list price? */
  appliesTo: TODO_VERIFY as Claim<"regular_base" | "separate_list_price">,
} as const;

// ---------------------------------------------------------------------------
// REVIEWS — mirrors constants/schemaData.ts REVIEWS, which was verified
// 2026-07-25 against the live Google Business Profile. Do not round up.
// CONFLICT: "5.0" appears in 259 files and "146" in 2; both predate that check.
// ---------------------------------------------------------------------------

export const REVIEWS = {
  rating: "4.9",
  count: 148,
  countDisplay: "148",
  verifiedOn: "2026-07-25",
} as const;

// ---------------------------------------------------------------------------
// CHECKLIST SIZES
//
// Each service page defines its own checklistData array; these are the actual
// computed lengths as of 2026-08-01, not claims:
//   deep-cleaning.astro            57  (already rendered as a computed "57+")
//   move-in-out-cleaning.astro     49
//   post-construction-cleaning.astro 37
//   components/CleaningChecklist.astro  61 total, tagged per service:
//     deep 55 · weekly 44 · monthly 55 · moveInOut 44   (component is unused)
//
// CONFLICT: 44 files claim a "49-point checklist" for the STANDARD/recurring
// clean ("a 49-point checklist for every standard clean", "each biweekly visit
// includes our comprehensive 49-point checklist"). But 49 is the move-in/out
// array length, and no standard-clean array has 49 entries — the candidates are
// 44 (CleaningChecklist weekly flag) or 61 (that component's full list).
// Replacing "49-point" with the deep-clean 57 would be wrong in a new way.
// Also live: 60-point (4 files), 47-point (1), 200-Point (1).
// ---------------------------------------------------------------------------

export const CHECKLIST = {
  deep: 57,
  moveInOut: 49,
  postConstruction: 37,
  /** Size of the standard/recurring clean checklist. See CONFLICT above. */
  standard: TODO_VERIFY as Claim<number>,
} as const;

// ---------------------------------------------------------------------------
// IDENTITY
//
// CONFLICT — four phrases are live, and they are not interchangeable:
//   "veteran-owned"          270 files
//   "women-led"               53 files
//   "women-owned"             35 files
//   "Family Owned & Operated"  components/Footer.astro:144
//
// "woman-owned" carries a specific >=51% ownership meaning and is a
// certifiable status; do not normalise toward it without confirmation.
// One exact phrase is needed, then it applies everywhere.
// ---------------------------------------------------------------------------

export const IDENTITY = {
  primaryPhrase: TODO_VERIFY as Claim<string>,
  isVeteranOwned: TODO_VERIFY as Claim<boolean>,
  isWomanOwned: TODO_VERIFY as Claim<boolean>,
  isFamilyOwned: TODO_VERIFY as Claim<boolean>,
} as const;

// ---------------------------------------------------------------------------
// POSITIONING
//
// CONFLICT: "luxury" appears in 78 files including the sitewide footer tagline,
// against a $176 entry price and the plain, practical voice used everywhere
// else. The choice is between "transparent value + operational rigor" and
// "luxury/concierge". Do not strip "luxury" until this is decided.
// ---------------------------------------------------------------------------

export const POSITIONING = {
  stance: TODO_VERIFY as Claim<"transparent_value" | "luxury_concierge">,
} as const;

// ---------------------------------------------------------------------------
// CERTIFICATIONS
//
// Empty on purpose. No named certifying body appears anywhere in the repo, but
// a "Certified — Professional Cleaners" trust badge renders regardless
// (components/TrustBadges.astro:73 and :108). An unattributed certification
// claim is the kind a competitor reports. The badge is gated on
// hasCertifications() so it cannot render while this list is empty.
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
// "OSHA" appears in 34 files, none naming a standard. The honest scope depends
// on three things that either exist or do not; canClaimClinicalCompliance()
// requires all three, so the credentialed copy cannot ship on a partial basis.
// ---------------------------------------------------------------------------

export const CLINICAL = {
  /** Bloodborne pathogens training, 29 CFR 1910.1030. */
  bloodbornePathogensTraining: TODO_VERIFY as Claim<boolean>,
  /** Named EPA-registered disinfectant, e.g. "Oxivir Tb, EPA Reg. No. 70627-56". */
  epaRegisteredDisinfectant: TODO_VERIFY as Claim<string>,
  /** A written, followed medical cleaning protocol. */
  writtenMedicalProtocol: TODO_VERIFY as Claim<boolean>,
} as const;

export function canClaimClinicalCompliance(): boolean {
  return (
    CLINICAL.bloodbornePathogensTraining === true &&
    typeof CLINICAL.epaRegisteredDisinfectant === "string" &&
    CLINICAL.epaRegisteredDisinfectant !== TODO_VERIFY &&
    CLINICAL.writtenMedicalProtocol === true
  );
}

// ---------------------------------------------------------------------------
// PERFORMANCE CLAIMS — published but unverified. Left in place and flagged
// rather than silently deleted; each needs a number someone can stand behind.
// ---------------------------------------------------------------------------

export const PERFORMANCE = {
  /** "98% on-time arrival" — 4 files. Measured how, over what window? */
  onTimeArrivalPct: TODO_VERIFY as Claim<number>,
  /** "85% repeat customer rate" — 1 file. */
  repeatCustomerPct: TODO_VERIFY as Claim<number>,
  /** "15 years cleaner experience on average" — 8 files. */
  avgCleanerExperienceYears: TODO_VERIFY as Claim<number>,
  /** "1,047+" — 17 files, used for both "cleanings" and "customers". */
  cleaningsCompleted: TODO_VERIFY as Claim<number>,
  /**
   * CONFLICT: quote-response SLA is published as 2 hours, 2 business hours and
   * 24 hours on the medical page alone.
   */
  quoteResponseSla: TODO_VERIFY as Claim<string>,
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

  if (unresolved.length === 0 && impossible.length === 0) return;

  const lines = ["Unverified or impossible claims — the build stops here.", ""];
  if (unresolved.length) {
    lines.push(`${unresolved.length} claim(s) still set to ${TODO_VERIFY}:`);
    lines.push(...unresolved.map((u) => `  - ${u}`));
    lines.push("");
    lines.push("Each needs a real value in src/data/claims.ts. See the CONFLICT");
    lines.push("comments there for the competing values already live in the repo.");
  }
  if (impossible.length) {
    if (unresolved.length) lines.push("");
    lines.push(`${impossible.length} internally inconsistent claim(s):`);
    lines.push(...impossible.map((i) => `  - ${i}`));
  }

  throw new ClaimsError(lines.join("\n"));
}
