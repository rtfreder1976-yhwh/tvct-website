/**
 * Single source of truth for every factual claim the site makes about the
 * business: pricing, review counts, identity, credentials, performance.
 *
 * Why this exists
 * ---------------
 * The same claim was previously written out by hand in hundreds of files, so it
 * drifted. An audit of `main` found, among others:
 *
 *   - four identity claims live at once (veteran-owned, women-led,
 *     women-owned, Family Owned & Operated)
 *   - two review ratings (4.9 and 5.0) and two review counts (148 and 146)
 *   - "1,047" used to mean cleanings completed *and* customers served
 *   - a "49-point checklist" asserted in 41 files while the deep-clean page
 *     computes 57 tasks from its own array
 *   - retired prices still reaching Google through JSON-LD
 *
 * The rule
 * --------
 * A claim belongs here, imported, exactly once. Anything unverified is
 * `TODO_VERIFY` and `assertClaims()` fails the build rather than letting a
 * placeholder ship. Where the codebase held two competing values, this file
 * does NOT pick a winner -- it records both under a `CONFLICT:` note and stays
 * TODO_VERIFY until Todd resolves it.
 *
 * File counts below were measured on the audited commit and are there to show
 * blast radius, not to be maintained.
 */

/** Sentinel for a claim nobody has verified yet. Never render this. */
export const TODO_VERIFY = "__TODO_VERIFY__" as const;
export type TodoVerify = typeof TODO_VERIFY;
/** A claim that is either a real value or explicitly unverified. */
export type Claim<T> = T | TodoVerify;

/** True when a claim has a real, renderable value. */
export function isVerified<T>(value: Claim<T>): value is T {
  return value !== TODO_VERIFY;
}

// ---------------------------------------------------------------------------
// Pricing
// ---------------------------------------------------------------------------

/**
 * Current published tiers. These three are verified and already applied to the
 * schema sources; the retired $99 / $175 / $225 tier is gone from JSON-LD.
 */
export const PRICING = {
  /** Recurring / regular cleaning, starting. */
  regularFrom: 176,
  /** Deep cleaning, starting. */
  deepFrom: 276,
  /** Move-in / move-out cleaning, starting. */
  moveInOutFrom: 351,

  /**
   * CONFLICT: the Airbnb turnover rate.
   *   $99  -- src/pages/services/airbnb-cleaning.astro (body copy, retired)
   *           and the SchemaMarkup turnover Offer (both now removed)
   * No current replacement exists anywhere in the repo. The Offer is omitted
   * from structured data rather than fabricated; restore it once this is set.
   */
  airbnbTurnoverFrom: TODO_VERIFY as Claim<number>,

  /**
   * CONFLICT: the pre-festival (Tuscumbia / Helen Keller Festival) rate.
   *   $149 -- src/components/SchemaMarkup.astro Event offer (retired, removed)
   */
  preFestivalFrom: TODO_VERIFY as Claim<number>,

  /**
   * CONFLICT: post-construction cleaning.
   *   $300 -- src/constants/schemaData.ts offer catalogue
   * Not part of the three audited tiers, so it was left as-is rather than
   * updated on the assumption that it moved with them.
   */
  postConstructionFrom: TODO_VERIFY as Claim<number>,

  /**
   * CONFLICT: the Huntsville weekly rate.
   *   $119/visit advertised as "20% off" -- 6 files
   *   ...which does not reconcile with a $176 recurring base: 20% off $176 is
   *   $140.80, not $119, and $119 is below the advertised starting rate.
   * Either the base, the discount, or the $119 is wrong. Todd to say which.
   */
  huntsvilleWeekly: TODO_VERIFY as Claim<number>,
} as const;

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export const REVIEWS = {
  /**
   * CONFLICT: star rating.
   *   4.9 -- 83 files (the dominant form, "4.9★ from 148 reviews")
   *   5.0 -- 3 files
   */
  rating: TODO_VERIFY as Claim<number>,

  /**
   * CONFLICT: review count.
   *   148 -- 68 files
   *   146 -- 2 files
   */
  count: TODO_VERIFY as Claim<number>,
} as const;

// ---------------------------------------------------------------------------
// Volume
// ---------------------------------------------------------------------------

export const VOLUME = {
  /**
   * CONFLICT: "1,047" appears in 17 files meaning two different things --
   *   "1,047+ Homes Cleaned" / "1,047+ Cleanings completed"  (jobs)
   *   "1,047+ families ... already made the switch"          (customers)
   * These cannot both be the same number. Split into two claims once Todd
   * confirms which is which.
   */
  cleaningsCompleted: TODO_VERIFY as Claim<number>,
  customersServed: TODO_VERIFY as Claim<number>,
} as const;

// ---------------------------------------------------------------------------
// The deep-clean checklist
// ---------------------------------------------------------------------------

// The derived counts live in ./deepCleanChecklist (DEEP_CLEAN_TASK_COUNT,
// DEEP_CLEAN_ROOM_COUNT) and are imported from there directly. They are
// deliberately NOT re-exported here: this module is loaded by the build gate in
// astro.config.mjs through Node's ESM loader rather than Vite, so it stays a
// leaf with no imports of its own.

/**
 * CONFLICT: the size of the checklist.
 *   "49-point checklist" -- asserted in 41 files, hardcoded, unsourced
 *   57 tasks / 9 room types -- computed at build time on
 *       /services/deep-cleaning from `deepCleanChecklist`
 *
 * These are not obviously the same list: 57 is specifically the *deep clean*
 * task total (and includes 2 "Extra Services" add-ons), whereas "49-point" is
 * used as a general company claim on move-out, location and comparison pages.
 * So this is deliberately NOT resolved to 57 -- doing that would rewrite 41
 * files on an assumption. Todd to confirm whether there is one checklist or
 * two, and what each contains. Once confirmed, render the derived
 * DEEP_CLEAN_TASK_COUNT rather than a literal so it can never drift again.
 */
export const CHECKLIST_POINTS = TODO_VERIFY as Claim<number>;

// ---------------------------------------------------------------------------
// Identity
// ---------------------------------------------------------------------------

/**
 * CONFLICT: four identity claims are live simultaneously.
 *   "veteran-owned"           -- ~270 files (all case variants)
 *   "women-led"               -- 53 files
 *   "women-owned"             -- 35 files
 *   "Family Owned & Operated" -- sitewide footer
 *
 * "women-owned" is not a synonym for "women-led": woman-owned carries a >=51%
 * ownership meaning used by certifying bodies and public procurement. Do not
 * normalise toward it without explicit confirmation.
 *
 * Todd supplies ONE exact phrase; it then applies everywhere.
 */
export const IDENTITY = TODO_VERIFY as Claim<string>;

/**
 * CONFLICT: positioning.
 *   "luxury" -- 62 files including the sitewide footer tagline
 * ...which sits awkwardly against a $176 entry price and the plain, practical
 * voice used everywhere else. Todd is choosing between "transparent value +
 * operational rigor" and "luxury/concierge". Nothing is stripped until he does.
 */
export const POSITIONING = TODO_VERIFY as Claim<string>;

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

/**
 * Named certifying bodies. Empty because there is no named certifying body
 * anywhere in the repo -- the "Certified" trust badge is currently unattributed
 * in 15 files.
 *
 * Add entries only with a real issuing organisation, e.g.
 *   { name: "...", issuedBy: "...", validThrough: "2027-01-01" }
 */
export const CERTIFICATIONS: ReadonlyArray<{
  name: string;
  issuedBy: string;
  validThrough?: string;
}> = [];

/** Gate for the "Certified" trust badge. False while nothing is attributable. */
export function hasCertifications(): boolean {
  return CERTIFICATIONS.length > 0;
}

// ---------------------------------------------------------------------------
// Healthcare / clinical compliance
// ---------------------------------------------------------------------------

/**
 * "OSHA" appears in 34 files and not one names a standard. OSHA does not
 * certify cleaning contractors, so "OSHA-compliant" is only meaningful as a
 * shorthand for specific, verifiable things:
 */
export const CLINICAL = {
  /** Bloodborne pathogens training, 29 CFR 1910.1030, documented per employee. */
  bloodbornePathogensTraining: TODO_VERIFY as Claim<boolean>,
  /** A specific EPA-registered hospital disinfectant, named, with its EPA reg. no. */
  epaRegisteredDisinfectant: TODO_VERIFY as Claim<string>,
  /** A written medical-facility cleaning protocol that exists as a document. */
  writtenMedicalProtocol: TODO_VERIFY as Claim<boolean>,
} as const;

/**
 * Gate for clinical-compliance copy. Only true when all three are confirmed --
 * the credentialed version of the copy may render; otherwise use the narrowed
 * honest-scope version.
 */
export function canClaimClinicalCompliance(): boolean {
  return (
    CLINICAL.bloodbornePathogensTraining === true &&
    isVerified(CLINICAL.epaRegisteredDisinfectant) &&
    CLINICAL.writtenMedicalProtocol === true
  );
}

// ---------------------------------------------------------------------------
// Performance claims
// ---------------------------------------------------------------------------

/**
 * Left rendering as-is on the site for now, but recorded here as unverified.
 * None of these has a source in the repo.
 */
export const PERFORMANCE = {
  /** "98%+ job completion rate" -- 4 files. */
  jobCompletionRate: TODO_VERIFY as Claim<number>,
  /** "85%" repeat-customer rate -- 1 file. */
  repeatCustomerRate: TODO_VERIFY as Claim<number>,
  /** "15 years cleaner experience on average" -- 8 files, incl. the footer. */
  avgCleanerExperienceYears: TODO_VERIFY as Claim<number>,

  /**
   * CONFLICT: quote-response SLA. Three incompatible promises are live,
   * two of them on the medical page alone:
   *   "2 hours" / "2 business hours" / "24 hours"
   */
  quoteResponseSla: TODO_VERIFY as Claim<string>,
} as const;

// ---------------------------------------------------------------------------
// Build-time gate
// ---------------------------------------------------------------------------

/** Every claim that must be resolved before the site can build. */
const REQUIRED: ReadonlyArray<readonly [string, unknown, string]> = [
  ["PRICING.airbnbTurnoverFrom", PRICING.airbnbTurnoverFrom, "Airbnb turnover starting price (old: $99)"],
  ["PRICING.preFestivalFrom", PRICING.preFestivalFrom, "Pre-festival cleaning price (old: $149)"],
  ["PRICING.postConstructionFrom", PRICING.postConstructionFrom, "Post-construction starting price (currently $300)"],
  ["PRICING.huntsvilleWeekly", PRICING.huntsvilleWeekly, "Huntsville weekly rate ($119 does not reconcile with a $176 base at 20% off)"],
  ["REVIEWS.rating", REVIEWS.rating, "Star rating: 4.9 (83 files) or 5.0 (3 files)?"],
  ["REVIEWS.count", REVIEWS.count, "Review count: 148 (68 files) or 146 (2 files)?"],
  ["VOLUME.cleaningsCompleted", VOLUME.cleaningsCompleted, "Cleanings completed -- is 1,047 the jobs number?"],
  ["VOLUME.customersServed", VOLUME.customersServed, "Customers served -- 1,047 is also used to mean families; these differ"],
  ["CHECKLIST_POINTS", CHECKLIST_POINTS, "Checklist size: '49-point' (41 files) vs 57 computed deep-clean tasks -- one list or two?"],
  ["IDENTITY", IDENTITY, "ONE exact phrase: veteran-owned / women-led / women-owned / Family Owned & Operated"],
  ["POSITIONING", POSITIONING, "'luxury' (62 files) or 'transparent value + operational rigor'?"],
  ["CLINICAL.bloodbornePathogensTraining", CLINICAL.bloodbornePathogensTraining, "Documented 29 CFR 1910.1030 training? true/false"],
  ["CLINICAL.epaRegisteredDisinfectant", CLINICAL.epaRegisteredDisinfectant, "Named EPA-registered disinfectant + reg. no., or empty string if none"],
  ["CLINICAL.writtenMedicalProtocol", CLINICAL.writtenMedicalProtocol, "Written medical cleaning protocol exists? true/false"],
  ["PERFORMANCE.jobCompletionRate", PERFORMANCE.jobCompletionRate, "98%+ job completion rate -- source?"],
  ["PERFORMANCE.repeatCustomerRate", PERFORMANCE.repeatCustomerRate, "85% repeat customer rate -- source?"],
  ["PERFORMANCE.avgCleanerExperienceYears", PERFORMANCE.avgCleanerExperienceYears, "15 years average cleaner experience -- source?"],
  ["PERFORMANCE.quoteResponseSla", PERFORMANCE.quoteResponseSla, "One SLA: '2 hours', '2 business hours' or '24 hours'?"],
];

/**
 * Fails the build while any claim is unresolved, or if a resolved one is
 * arithmetically impossible.
 *
 * Reports every problem at once rather than stopping at the first: the point of
 * this function is to produce the complete list of what still needs answering.
 */
export function assertClaims(): void {
  const unresolved: string[] = [];
  for (const [path, value, question] of REQUIRED) {
    if (value === TODO_VERIFY) unresolved.push(`  ${path}\n      -> ${question}`);
  }

  const impossible: string[] = [];
  const check = (cond: boolean, msg: string) => {
    if (cond) impossible.push(`  ${msg}`);
  };

  if (isVerified(REVIEWS.rating)) {
    check(REVIEWS.rating < 0 || REVIEWS.rating > 5, `REVIEWS.rating ${REVIEWS.rating} is outside 0-5`);
  }
  if (isVerified(REVIEWS.count)) {
    check(!Number.isInteger(REVIEWS.count) || REVIEWS.count < 0, `REVIEWS.count ${REVIEWS.count} is not a non-negative integer`);
  }
  for (const [name, pct] of [
    ["PERFORMANCE.jobCompletionRate", PERFORMANCE.jobCompletionRate],
    ["PERFORMANCE.repeatCustomerRate", PERFORMANCE.repeatCustomerRate],
  ] as const) {
    if (isVerified(pct)) check(pct < 0 || pct > 100, `${name} ${pct} is not a percentage`);
  }
  check(PRICING.deepFrom <= PRICING.regularFrom, `PRICING.deepFrom (${PRICING.deepFrom}) must exceed regularFrom (${PRICING.regularFrom})`);
  check(PRICING.moveInOutFrom <= PRICING.deepFrom, `PRICING.moveInOutFrom (${PRICING.moveInOutFrom}) must exceed deepFrom (${PRICING.deepFrom})`);
  if (isVerified(PRICING.huntsvilleWeekly)) {
    check(PRICING.huntsvilleWeekly > PRICING.regularFrom, `PRICING.huntsvilleWeekly (${PRICING.huntsvilleWeekly}) exceeds the advertised recurring base (${PRICING.regularFrom})`);
  }
  if (isVerified(VOLUME.cleaningsCompleted) && isVerified(VOLUME.customersServed)) {
    check(VOLUME.customersServed > VOLUME.cleaningsCompleted, `VOLUME.customersServed (${VOLUME.customersServed}) cannot exceed cleaningsCompleted (${VOLUME.cleaningsCompleted})`);
  }
  if (!hasCertifications()) {
    // Not fatal on its own -- the badge is gated -- but worth stating.
  }

  if (unresolved.length === 0 && impossible.length === 0) return;

  const parts = ["", "Unverified or impossible claims -- the build stops here on purpose.", ""];
  if (unresolved.length) {
    parts.push(`${unresolved.length} claim(s) still set to TODO_VERIFY in src/data/claims.ts:`, "", ...unresolved, "");
  }
  if (impossible.length) {
    parts.push(`${impossible.length} claim(s) are arithmetically impossible:`, "", ...impossible, "");
  }
  parts.push("Fill these in, or delete the copy that depends on them.", "");
  throw new Error(parts.join("\n"));
}
