import fs from 'node:fs';
import path from 'node:path';
import { serviceFloorAllowlist } from './service-price-floor-allowlist.mjs';

/**
 * Service-aware price-floor guard.
 *
 * WHY THIS EXISTS
 * ---------------
 * Nine post-construction pages shipped prices below the service's own floor —
 * "$300-$800+", "starts at $299", "starts at $350", "up to $600" — while every
 * existing validator passed. Three separate blind spots let it through:
 *
 *   1. The retired-Offer-price scan only knows the ten banned tokens
 *      ($99, $119, ...). $299, $300 and $350 are not on that list, because
 *      they are perfectly legal prices — just not for THIS service.
 *   2. validate-policy-truth's residential range rule is hardcoded to
 *      "homes ... range from $X ... regular cleaning" with a $150 floor. It
 *      cannot see a post-construction page, a different phrasing, or a
 *      different floor.
 *   3. The prices lived in FAQ answer strings and prose, not in JSON-LD Offer
 *      fields or `price=` props, so the structural checks never looked at them.
 *
 * The bug is the same shape every time: a number that is fine in the abstract
 * appears next to a service whose floor is higher than it. So this guard is
 * service-aware rather than token-aware. It reads the canonical floor for each
 * service and reports any price quoted below it within the same sentence as
 * that service's name.
 *
 * FLOORS ARE DERIVED, NEVER HARDCODED
 * -----------------------------------
 * Floors come from src/data/pricing.ts and src/data/claims.ts at run time. If
 * a price changes in the canonical source, this guard's expectations move with
 * it and no edit here is required. That is deliberate: a validator carrying its
 * own copy of the numbers is just a fourth place for them to drift.
 *
 * The floor used is the PUBLISHED starting price (the smallest bracket, raised
 * by MINIMUMS where the minimum binds) — not MINIMUMS alone. For
 * post-construction those differ: MINIMUMS.postconstruction is $450 (an
 * internal floor) while the advertised entry price is $526 (the 750 sq ft
 * bracket). Customers see $526, so $526 is what copy must not undercut.
 *
 * SCOPE
 * -----
 * Covers .astro, .ts, .js, .json, .md and .mdx under src/ — which includes
 * location pages, service pages, FAQ answer strings, JSON-LD blocks, and blog
 * posts (both .astro blog routes and markdown content).
 *
 * Sentence-scoped on purpose: a page may legitimately mention $200 regular
 * cleaning and $526 post-construction. Only a low number sitting in the SAME
 * sentence as a higher-floor service is a contradiction.
 */

const extensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);
const roots = ['src'];

/** Read a canonical source file once so floors trace to real code. */
function readSource(relPath) {
  try {
    return fs.readFileSync(relPath, 'utf8');
  } catch {
    throw new Error(
      `validate-service-price-floors: cannot read ${relPath}. Floors must derive from canonical data; refusing to run with guessed numbers.`,
    );
  }
}

const pricingSource = readSource('src/data/pricing.ts');
const claimsSource = readSource('src/data/claims.ts');

/** First value of a PRICE_TABLE row, e.g. postconstruction: [526, 579, ...]. */
function firstBracketPrice(service) {
  const row = new RegExp(`\\b${service}\\s*:\\s*\\[\\s*(\\d+)`).exec(pricingSource);
  return row ? Number(row[1]) : null;
}

/** A MINIMUMS entry, e.g. postconstruction: 450. */
function minimumPrice(service) {
  const block = /export const MINIMUMS[^{]*\{([\s\S]*?)\}/.exec(pricingSource);
  if (!block) return null;
  const row = new RegExp(`\\b${service}\\s*:\\s*(\\d+)`).exec(block[1]);
  return row ? Number(row[1]) : null;
}

/** A PRICING entry in claims.ts, e.g. postConstruction: { amount: 526 }. */
function claimsAmount(key) {
  const row = new RegExp(`\\b${key}\\s*:\\s*\\{\\s*amount:\\s*(\\d+)`).exec(claimsSource);
  return row ? Number(row[1]) : null;
}

/**
 * Services this guard polices.
 *
 * `pricingKey`  — PRICE_TABLE / MINIMUMS key in pricing.ts
 * `claimsKey`   — PRICING key in claims.ts (cross-check; must agree)
 * `namePattern` — how the service is written in customer-facing copy
 */
const SERVICES = [
  {
    // Airbnb turnover has no PRICE_TABLE row — it is priced per turnover, not
    // by square-foot bracket — so its floor comes from claims.ts alone.
    // It must still be listed: without a name pattern for it, "$125 for Airbnb
    // turnover" binds to whatever service IS recognised nearby (usually
    // "regular", floor $200) and a correct $125 price reads as a violation.
    id: 'airbnb-turnover',
    claimsKey: 'airbnbTurnover',
    claimsOnly: true,
    namePattern: /airbnb|short[-\s]?term rental|turnover clean/i,
  },
  {
    id: 'post-construction',
    pricingKey: 'postconstruction',
    claimsKey: 'postConstruction',
    namePattern: /post[-\s]?construction|post[-\s]?renovation|construction clean[-\s]?up/i,
  },
  {
    id: 'move-in-out',
    pricingKey: 'moveinout',
    claimsKey: 'moveInOut',
    namePattern: /move[-\s]?(?:in|out)(?:[-\s]?\/?[-\s]?(?:in|out))?\s+clean/i,
  },
  {
    id: 'deep',
    pricingKey: 'deep',
    claimsKey: 'deep',
    namePattern: /deep clean/i,
  },
  {
    id: 'regular',
    pricingKey: 'regular',
    claimsKey: 'regular',
    // "recurring", "standard" and "maintenance" are all the regular service.
    // They must be recognised as service names even though the canonical key
    // is `regular`: in a list like "recurring from $200, deep cleans from
    // $276", if "recurring" is not a known name then $200 binds to the nearest
    // name that IS known — "deep cleans" — and a correct price list is
    // reported as a violation. Synonym coverage is what makes nearest-name
    // binding trustworthy.
    // The trailing noun is optional because price lists routinely drop it —
    // "Recurring from $200 · Deep clean from $276". If "Recurring" alone is
    // not a recognised name, $200 binds to "Deep clean" and a correct list is
    // reported as a violation.
    namePattern: /\b(?:regular|standard|recurring|maintenance)\b(?:\s+(?:clean(?:ing|s)?|service))?/i,
  },
];

/* Resolve each floor, and fail loudly if the two canonical sources disagree. */
const configErrors = [];
for (const service of SERVICES) {
  const claims = claimsAmount(service.claimsKey);

  // Services with no square-foot rate card (Airbnb turnover) take their floor
  // straight from claims.ts; there is no bracket table to cross-check against.
  if (service.claimsOnly) {
    if (claims === null) {
      configErrors.push(
        `${service.id}: claims.ts PRICING.${service.claimsKey} not found — cannot derive a floor.`,
      );
      continue;
    }
    service.floor = claims;
    continue;
  }

  const bracket = firstBracketPrice(service.pricingKey);
  const minimum = minimumPrice(service.pricingKey);

  if (bracket === null || minimum === null || claims === null) {
    configErrors.push(
      `${service.id}: could not derive a floor (bracket=${bracket}, minimum=${minimum}, claims=${claims}). ` +
        `Check that pricing.ts PRICE_TABLE/MINIMUMS and claims.ts PRICING still use the expected keys.`,
    );
    continue;
  }

  // The published entry price: the table's smallest bracket, lifted by the
  // minimum where the minimum actually binds (regular: table 176, floor 200).
  const published = Math.max(bracket, minimum);

  if (published !== claims) {
    configErrors.push(
      `${service.id}: pricing.ts implies a published starting price of $${published} but claims.ts PRICING.${service.claimsKey} is $${claims}. ` +
        `These must agree — one of the two canonical sources has drifted.`,
    );
    continue;
  }

  service.floor = published;
}

if (configErrors.length > 0) {
  console.error('Service price-floor audit could not run:\n');
  for (const error of configErrors) console.error(`  - ${error}`);
  process.exit(1);
}

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

/**
 * Prices that are NOT this service's price, even in the same sentence.
 * Each is checked against the characters immediately around the figure.
 */
const NOT_A_SERVICE_PRICE = [
  // Trust and insurance figures: "$2M insured", "$2 million liability".
  /\$\s*2\s*(?:m\b|million)/i,
  // Fees and surcharges quoted alongside a service.
  /(?:cancellation|no[-\s]?show|lock[-\s]?out|travel|pet|per pet|surcharge|fee)[^.\n]{0,40}$/i,
  // Deposits and landlord deductions — someone else's money.
  /(?:deposit|deduct|withhold|landlord|inspector|property manager)[^.\n]{0,60}$/i,
  // Competitor, market-survey and hourly figures.
  /(?:competitor|market|industry|average|national|others? charge|gig|per hour|\/hour|hourly|an hour)[^.\n]{0,40}$/i,
  // Savings and discounts are differences, not prices.
  /(?:save|saving|savings|discount|less than|cheaper by|off)[^.\n]{0,30}$/i,
];

/** Figures introduced as this service's own price. */
const PRICE_LEAD_IN =
  /(?:from|starts? at|starting at|start(?:ing)? from|as low as|ranges? from|range[sd]? from|typically (?:cost|run|range)s?|priced at|only|just|up to|between)\s*$/i;

const priceToken = /\$\s?(\d{1,3}(?:,\d{3})*|\d+)(?:\.\d{2})?/g;

/**
 * Split into sentences while keeping offsets, so context checks stay local.
 *
 * A bare newline is NOT a boundary: source files hard-wrap prose, so
 * "…recurring\ncleans from $200, deep cleans from $276…" would otherwise split
 * mid-list and strand $200 from the service that introduces it. Only real
 * sentence punctuation and block-level tags end a sentence; a blank line ends
 * a paragraph.
 */
function sentences(text) {
  const parts = [];
  let start = 0;
  const boundary = /[.!?]|\n\s*\n|(?:<\/(?:p|li|h[1-6]|div|span)>)/g;
  let match;
  while ((match = boundary.exec(text)) !== null) {
    const end = match.index + match[0].length;
    if (end > start) parts.push({ text: text.slice(start, end), offset: start });
    start = end;
  }
  if (start < text.length) parts.push({ text: text.slice(start), offset: start });
  return parts;
}

const failures = [];

for (const root of roots) {
  for (const file of walk(root)) {
    // pricing.ts and claims.ts hold the canonical tables themselves, and
    // this validator's own prose quotes the example figures.
    if (
      file === path.join('src', 'data', 'pricing.ts') ||
      file === path.join('src', 'data', 'claims.ts')
    ) {
      continue;
    }

    const source = fs.readFileSync(file, 'utf8');

    for (const { text, offset } of sentences(source)) {
      // Which services are named in this sentence, and where.
      const mentions = [];
      for (const service of SERVICES) {
        const pattern = new RegExp(service.namePattern.source, 'gi');
        let nameHit;
        while ((nameHit = pattern.exec(text)) !== null) {
          mentions.push({ service, index: nameHit.index });
        }
      }
      if (mentions.length === 0) continue;

      priceToken.lastIndex = 0;
      let hit;
      while ((hit = priceToken.exec(text)) !== null) {
        const amount = Number(hit[1].replace(/,/g, ''));
        // Ignore trivial figures: cents, "$0", and per-sq-ft rates.
        if (amount < 50) continue;

        const before = text.slice(Math.max(0, hit.index - 60), hit.index);
        const after = text.slice(hit.index + hit[0].length, hit.index + hit[0].length + 40);

        if (NOT_A_SERVICE_PRICE.some((pattern) => pattern.test(before))) continue;
        // "$0.50/sq ft" style rates.
        if (/^\s*(?:\/|per\s)/i.test(after)) continue;
        // Only consider figures actually presented as a price.
        if (!PRICE_LEAD_IN.test(before)) continue;

        // Bind the figure to the service that INTRODUCES it — the nearest name
        // appearing BEFORE the price. English puts the service first and its
        // price second ("Recurring from $200 · Deep clean from $276"), so a
        // plain nearest-by-distance match binds $200 to "Deep clean" (7 chars
        // away) instead of "Recurring" (15 chars away) and reports a correct
        // price list as a violation. Only fall back to a following name when no
        // name precedes the figure, as in "From $99: deep cleaning".
        let owner = null;
        let bestDistance = Infinity;
        for (const mention of mentions) {
          if (mention.index > hit.index) continue;
          const distance = hit.index - mention.index;
          if (distance < bestDistance) {
            bestDistance = distance;
            owner = mention.service;
          }
        }
        if (!owner) {
          for (const mention of mentions) {
            const distance = mention.index - hit.index;
            if (distance >= 0 && distance < bestDistance) {
              bestDistance = distance;
              owner = mention.service;
            }
          }
        }
        if (!owner || amount >= owner.floor) continue;

        const line = source.slice(0, offset + hit.index).split('\n').length;
        failures.push({
          file,
          message:
            `${file}:${line}: ${hit[0].trim()} quoted for ${owner.id}, which starts at $${owner.floor} — ` +
            `${JSON.stringify(text.trim().slice(0, 130))}`,
        });
      }
    }
  }
}

/* ---------------------------------------------------------------------------
 * Reconcile findings against the declared backlog.
 *
 * A file's finding count must match its allowlist entry EXACTLY. More findings
 * than declared means new bad copy landed. Fewer means the entry is stale and
 * the debt was partly paid without trimming the register — both fail, so the
 * list and the source cannot drift apart.
 * ------------------------------------------------------------------------- */

/** Normalise separators so Windows and POSIX paths compare equal. */
const normalise = (p) => p.replace(/\\/g, '/');

const allowByFile = new Map();
for (const entry of serviceFloorAllowlist) {
  allowByFile.set(normalise(entry.file), entry);
}

const foundByFile = new Map();
for (const failure of failures) {
  const file = normalise(failure.file);
  if (!foundByFile.has(file)) foundByFile.set(file, []);
  foundByFile.get(file).push(failure);
}

const today = new Date().toISOString().slice(0, 10);
const reported = [];
const registerErrors = [];

for (const [file, hits] of foundByFile) {
  const entry = allowByFile.get(file);
  if (!entry) {
    reported.push(...hits.map((h) => h.message));
    continue;
  }
  if (hits.length !== entry.count) {
    const direction = hits.length > entry.count ? 'more' : 'fewer';
    registerErrors.push(
      `${file}: found ${hits.length} price(s) below floor but the allowlist permits ${entry.count} — ` +
        `${direction} than declared. ` +
        (hits.length > entry.count
          ? 'New below-floor copy was added; fix it rather than raising the count.'
          : 'Debt was partly paid; lower the count or delete the entry.'),
    );
    reported.push(...hits.map((h) => h.message));
  }
}

for (const entry of serviceFloorAllowlist) {
  const file = normalise(entry.file);

  if (!fs.existsSync(entry.file)) {
    registerErrors.push(`${file}: allowlisted but the file no longer exists — delete the entry.`);
    continue;
  }
  if (!foundByFile.has(file)) {
    registerErrors.push(
      `${file}: allowlisted for ${entry.count} below-floor price(s) but none were found — ` +
        'the copy was fixed. Delete the entry.',
    );
  }
  if (!entry.expires) {
    registerErrors.push(`${file}: allowlist entries require an "expires" date.`);
  } else if (entry.expires < today) {
    registerErrors.push(
      `${file}: price-floor allowance expired on ${entry.expires} — ${entry.reason ?? '(no reason recorded)'}. ` +
        'Fix the copy or renew the date with a deliberate decision.',
    );
  }
}

if (reported.length > 0 || registerErrors.length > 0) {
  if (reported.length > 0) {
    console.error(
      `Service price-floor audit failed (${reported.length} undeclared ${reported.length === 1 ? 'price' : 'prices'} below the published floor):\n`,
    );
    for (const failure of reported) console.error(`  - ${failure}`);
    console.error(
      '\nEach figure above is advertised below the starting price for its own service.\n' +
        'Fix the copy to derive from claims.ts (e.g. ${PRICING.postConstruction.display})\n' +
        'rather than a hardcoded literal. If a figure is not that service\'s price\n' +
        '(a fee, a deposit, a competitor rate), word it so the context is explicit.\n',
    );
  }
  if (registerErrors.length > 0) {
    console.error(`Allowlist register out of date (${registerErrors.length}):\n`);
    for (const error of registerErrors) console.error(`  - ${error}`);
    console.error('\nSee scripts/service-price-floor-allowlist.mjs.\n');
  }
  process.exit(1);
}

const floors = SERVICES.map((s) => `${s.id} $${s.floor}`).join(', ');
console.log(
  `Service price-floor audit passed (${SERVICES.length} services, floors derived from pricing.ts + claims.ts: ${floors}).`,
);
