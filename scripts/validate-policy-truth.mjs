import fs from 'node:fs';
import path from 'node:path';
import {
  RETIRED_PRICE_TOKENS,
  retiredPricePattern,
  retiredPriceAllowlist,
} from './retired-price-allowlist.mjs';

/**
 * Repository-wide regression guard for customer-facing business policies.
 * Canonical values live in src/data/claims.ts. This script blocks wording that
 * contradicts policies confirmed directly by Todd on 2026-08-11.
 */
const extensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);
const roots = ['src'];
const customQuoteLocationPage = /^src[\\/]pages[\\/]locations[\\/][^\\/]+[\\/](?:commercial-cleaning|office-cleaning|medical-office-cleaning|dental-office-cleaning)\.astro$/;
const recurringLocationPage = /^src[\\/]pages[\\/]locations[\\/][^\\/]+[\\/](weekly-cleaning|biweekly-cleaning|monthly-cleaning)\.astro$/;
const numericPriceProp = /\bprice="\$[\d,]+(?:\.\d{2})?(?:\/(?:visit|week|month))?"/i;
const recurringTruth = {
  'weekly-cleaning': { price: 150, discount: 30, label: 'weekly' },
  'biweekly-cleaning': { price: 150, discount: 25, label: 'biweekly' },
  'monthly-cleaning': { price: 170, discount: 15, label: 'monthly' },
};

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const rules = [
  {
    pattern: /price\s*match\s*guarantee/i,
    why: 'The Valley Clean Team does not price-match competitors',
  },
  {
    pattern: /(?:we(?:'|’)ll|we will)\s+match\s+(?:it|their|the)\b/i,
    why: 'competitor price matching is not offered',
  },
  {
    pattern: /(?<!non-)\b(?:cash|venmo|zelle|checks|(?:paper|personal)\s+check)\b[^\n.]{0,120}\b(?:payment|accept|accepted)\b/i,
    why: 'customer payments are credit or debit card only',
  },
  {
    pattern: /\b(?:payment|accept|accepted)\b[^\n.]{0,120}(?<!non-)\b(?:cash|venmo|zelle|checks|(?:paper|personal)\s+check)\b/i,
    why: 'customer payments are credit or debit card only',
  },
  {
    pattern: /(?:cancellations?|cancel)[^\n.]{0,140}\$50\b/i,
    why: 'late cancellations use the verified $100 fee',
  },
  {
    pattern: /(?:we\s+)?don['’]?t charge cancellation fees|no cancellation fees/i,
    why: 'late cancellations, no-shows, and lock-outs use the verified $100 fee',
    skipFiles: new Set(['src/pages/best-cleaning-company-nashville-tn.astro']),
  },
  {
    // Residential price RANGES whose low end sits under the published floor.
    // The retired-Offer-price scan only catches "from $X" / "starting at $X",
    // so a hand-authored "homes range from $135-$300 for regular cleaning"
    // slipped through on four location pages and quoted a rate we do not
    // honour — inside FAQ JSON-LD, where answer engines read it.
    //
    // $150 is the weekly-recurring minimum and the lowest number the site is
    // allowed to pair with residential cleaning; anything under it is a price
    // no customer is ever charged. Commercial, medical, dental and estate
    // ranges are deliberately NOT matched: those are custom-quote services
    // with no authoritative residential equivalent.
    pattern:
      /\b(?:homes?|houses?)\b[^\n.]{0,60}\brange[sd]?\s+from\s+\$(?:1[0-4][0-9]|[1-9][0-9]|[1-9])(?![0-9])[^\n.]{0,80}\b(?:regular|standard|house|home|recurring)\s+cleaning/i,
    why:
      'residential cleaning ranges must not start below the $150 recurring minimum (see claims.ts RECURRING_MINIMUMS / pricing.ts MINIMUMS)',
  },
  {
    pattern: /no[- ]shows?[^\n.]{0,140}(?:full service|full amount|entire service)/i,
    why: 'no-shows use the verified $100 fee',
  },
  {
    pattern: /(?:pets?|pet households?)[^\n.]{0,100}(?:no extra (?:charge|fee)|included at no (?:charge|fee))/i,
    why: 'the verified pet fee is $25 per pet',
  },
  {
    pattern: /no travel (?:fees?|charges?)/i,
    why: 'travel fees are $5–$15 when applicable',
  },
  {
    pattern: /(?:small|modest) travel fee/i,
    why: 'travel-fee copy should use the verified $5–$15 range rather than a vague amount',
  },
  {
    pattern: /small offices?[^.\n]{0,180}\b(?:typically\s+)?(?:start(?:s|ing)?|range|from|around)[^.\n]{0,100}\$\d+/i,
    why: 'commercial pricing is custom-quoted from square footage, task list, and services per week',
  },
];

const failures = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const rule of rules) {
      if (rule.skipFiles?.has(file)) continue;
      const match = source.match(rule.pattern);
      if (!match) continue;
      failures.push(`${file}: found ${JSON.stringify(match[0].trim())} — ${rule.why}`);
    }

    if (customQuoteLocationPage.test(file)) {
      const match = source.match(numericPriceProp);
      if (match) {
        failures.push(
          `${file}: found ${JSON.stringify(match[0])} — custom-quoted commercial/office pages must not emit a numeric Offer price`,
        );
      }
    }

    const recurringMatch = file.match(recurringLocationPage);
    if (recurringMatch) {
      const serviceSlug = recurringMatch[1];
      const expected = recurringTruth[serviceSlug];
      const priceMatch = source.match(/\bprice="\$([\d,]+)(?:\.\d{2})?(?:\/(?:visit|week|month))?"/i);
      if (priceMatch) {
        const amount = Number(priceMatch[1].replace(/,/g, ''));
        if (amount !== expected.price) {
          failures.push(
            `${file}: found recurring price $${amount}, expected $${expected.price}/visit for ${expected.label} service`,
          );
        }
      }

      // Keep both sides non-greedy so "20% ... discount" is captured as 20,
      // not as the trailing 0 from a backtracking match.
      const discountPattern = /(?:save\s+)?\b(\d+)%[^.\n]{0,80}?(?:recurring|discount|one-time)|(?:recurring|discount|save)[^.\n]{0,80}?\b(\d+)%/gi;
      for (const match of source.matchAll(discountPattern)) {
        const amount = Number(match[1] ?? match[2]);
        if (amount !== expected.discount) {
          failures.push(
            `${file}: found ${amount}% recurring discount language, expected ${expected.discount}% for ${expected.label} service`,
          );
          break;
        }
      }

      const startingPricePattern = new RegExp(
        `${expected.label}[^.\\n]{0,140}starts? at \\$([\\d,]+)`,
        'gi',
      );
      for (const match of source.matchAll(startingPricePattern)) {
        const amount = Number(match[1].replace(/,/g, ''));
        if (amount !== expected.price) {
          failures.push(
            `${file}: found ${expected.label} starting price $${amount}, expected $${expected.price}/visit`,
          );
          break;
        }
      }
    }
  }
}

const nashvilleComparison = 'src/pages/best-cleaning-company-nashville-tn.astro';
if (fs.existsSync(nashvilleComparison)) {
  const source = fs.readFileSync(nashvilleComparison, 'utf8');
  for (const retired of [
    'Standard from $150 · Deep clean from $250 · Move-out from $300',
    'The Valley Clean Team quotes standard cleans from $150, deep cleans from $250, and move-outs from $300',
  ]) {
    if (source.includes(retired)) {
      failures.push(
        `${nashvilleComparison}: found ${JSON.stringify(retired)} — TVCT pricing must use canonical $200/$276/$351 values`,
      );
    }
  }
}


// ---------------------------------------------------------------------------
// Retired Offer price tokens, repository-wide.
//
// The rules above are filename-gated: the recurring-price guard only looks at
// (weekly|biweekly|monthly)-cleaning.astro, and only at a price="$X" prop. That
// is why nine recurring-maid-service.astro pages carried a retired discount
// ladder in body copy for months without tripping anything. This scan is
// repo-wide over every .astro/.ts file, and the allowlist is the only escape.
// ---------------------------------------------------------------------------
const scanRoots = ['src'];
const scannedExtensions = new Set(['.astro', '.ts']);
const today = new Date().toISOString().slice(0, 10);

const allowByFile = new Map();
for (const entry of retiredPriceAllowlist) {
  if (allowByFile.has(entry.file)) {
    failures.push(`retired-price allowlist: duplicate entry for ${entry.file}`);
    continue;
  }
  allowByFile.set(entry.file, entry);
}

function findRetiredTokens(source) {
  const occurrences = [];
  const counts = new Map();
  for (const token of RETIRED_PRICE_TOKENS) {
    for (const match of source.matchAll(retiredPricePattern(token))) {
      occurrences.push({ token, index: match.index, line: source.slice(0, match.index).split('\n').length });
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }
  }
  occurrences.sort((a, b) => a.index - b.index);
  const found = [...counts.entries()].map(([token, n]) => `$${token}×${n}`);
  return { total: occurrences.length, found, occurrences };
}

/**
 * How far from an occurrence the attribution may sit. Every phrase-attributed
 * occurrence in the repository today is within 342 characters of the wording
 * that makes the figure someone else's; 400 leaves room for ordinary editing
 * without widening the window until it stops meaning anything.
 */
const ATTRIBUTION_WINDOW = 400;

const globalize = (re) => new RegExp(re.source, re.flags.includes('g') ? re.flags : `${re.flags}g`);

/**
 * Which column of its table a character offset falls in, or -1 if it is not in
 * a table row. Cells are counted by opening tag, so the index lines up with the
 * header cells of the same table.
 */
function columnAt(source, index) {
  const rowStart = source.lastIndexOf('<tr', index);
  const rowEnd = source.indexOf('</tr>', index);
  if (rowStart === -1 || rowEnd === -1 || rowEnd < index) return -1;
  const row = source.slice(rowStart, rowEnd);
  const offset = index - rowStart;
  let column = -1;
  for (const cell of row.matchAll(/<t[dh][\s>]/g)) {
    if (cell.index <= offset) column += 1;
    else break;
  }
  return column;
}

/**
 * Index of the column whose header matches `pattern`, within the table
 * containing `index`. -1 when there is no such table or no such header.
 */
function ownColumnAt(source, index, pattern) {
  const tableStart = source.lastIndexOf('<table', index);
  const tableEnd = source.indexOf('</table>', index);
  if (tableStart === -1 || tableEnd === -1 || tableEnd < index) return -1;
  const table = source.slice(tableStart, tableEnd);
  const headers = [...table.matchAll(/<th[\s>][\s\S]*?<\/th>/g)];
  return headers.findIndex((header) => pattern.test(header[0]));
}

/**
 * Attribution is checked per occurrence, not per file. A file-wide test only
 * proves that one attribution phrase survives somewhere, so in a file holding
 * several retired figures a single occurrence could quietly lose its
 * attribution and still read as a TVCT Offer while the file passed.
 *
 * An occurrence qualifies either by proximity to the contextPattern, or — for
 * figures attributed by table position rather than by prose — by sitting in a
 * market-rate cell of a comparison table.
 *
 * That second route is bound to the actual column. Matching the cell shape and
 * confirming a TVCT header exists somewhere in the file is not enough: a
 * retired range moved into the TVCT column would keep both of those true while
 * now reading as our own price. The occurrence must sit in a column other than
 * the one whose header matches structuralOwnColumn, in the same table.
 */
function unattributedOccurrences(source, entry) {
  const contextIndices = [...source.matchAll(globalize(entry.contextPattern))].map((m) => m.index);
  const lines = source.split('\n');

  const orphans = [];
  for (const { token, index, line } of findRetiredTokens(source).occurrences) {
    if (contextIndices.some((c) => Math.abs(c - index) <= (entry.contextWithin ?? ATTRIBUTION_WINDOW))) {
      continue;
    }
    if (entry.structuralPattern && entry.structuralOwnColumn && entry.structuralPattern.test(lines[line - 1])) {
      const ownColumn = ownColumnAt(source, index, entry.structuralOwnColumn);
      const column = columnAt(source, index);
      if (ownColumn === -1) {
        orphans.push({ token, line, why: 'the column header it was attributed by is gone' });
        continue;
      }
      if (column === ownColumn) {
        orphans.push({ token, line, why: "it now sits in TVCT's own column of the comparison table" });
        continue;
      }
      if (column !== -1) continue;
    }
    orphans.push({ token, line, why: 'no attribution near it' });
  }
  return orphans;
}

const seenFiles = new Set();
for (const root of scanRoots) {
  for (const file of walk(root)) {
    if (!scannedExtensions.has(path.extname(file))) continue;
    const key = file.split(path.sep).join('/');
    const source = fs.readFileSync(file, 'utf8');
    const { total, found } = findRetiredTokens(source);
    if (total === 0) continue;
    seenFiles.add(key);

    const entry = allowByFile.get(key);
    if (!entry) {
      failures.push(
        `${key}: publishes retired price token(s) ${found.join(', ')} — retired Offer prices must not ship. ` +
          `Fix the source, or add a typed entry to scripts/retired-price-allowlist.mjs explaining why it is not a TVCT price.`,
      );
      continue;
    }

    if (total !== entry.count) {
      const direction = total > entry.count ? 'more' : 'fewer';
      failures.push(
        `${key}: found ${total} retired price token(s) (${found.join(', ')}) but the allowlist permits ${entry.count} — ` +
          `${direction} than recorded. Re-check the file, then update or remove its allowlist entry.`,
      );
    }

    if (entry.type === 'attributed') {
      if (!entry.contextPattern) {
        failures.push(`retired-price allowlist: ${key} is 'attributed' but has no contextPattern`);
      } else if (entry.structuralPattern && !entry.structuralOwnColumn) {
        failures.push(
          `retired-price allowlist: ${key} declares a structuralPattern but no structuralOwnColumn — ` +
            `structural attribution has to name the column the figure must not be in.`,
        );
      } else {
        const orphans = unattributedOccurrences(source, entry);
        if (orphans.length) {
          const where = orphans.map((o) => `$${o.token} on line ${o.line} (${o.why})`).join('; ');
          failures.push(
            `${key}: allowlisted as 'attributed', but ${orphans.length} occurrence(s) no longer read as ` +
              `someone else's figure — ${where}. Either restore what attributed it, or treat it as a TVCT price.`,
          );
        }
      }
    }

    if (entry.type === 'pending' || entry.type === 'deferred') {
      const required = entry.type === 'pending' ? ['owner', 'question', 'expires'] : ['tracking', 'expires'];
      const missing = required.filter((field) => !entry[field]);
      if (missing.length) {
        failures.push(`retired-price allowlist: ${key} is '${entry.type}' but is missing ${missing.join(', ')}`);
      }
      if (entry.expires && entry.expires < today) {
        const detail =
          entry.type === 'pending'
            ? `${entry.owner ?? 'owner'} still owes an answer: ${entry.question ?? '(no question recorded)'}`
            : `tracked as ${entry.tracking ?? '(untracked)'}`;
        failures.push(
          `${key}: retired-price allowance expired on ${entry.expires} — ${detail}. ` +
            `Resolve it or move the date deliberately; do not let it pass silently.`,
        );
      }
    }
  }
}

// Allowlist lint: entries that no longer describe reality.
for (const entry of retiredPriceAllowlist) {
  if (!fs.existsSync(entry.file)) {
    failures.push(`retired-price allowlist: ${entry.file} no longer exists — remove its entry`);
  } else if (!seenFiles.has(entry.file)) {
    failures.push(
      `retired-price allowlist: ${entry.file} no longer contains any retired price token — remove its entry`,
    );
  }
}

if (failures.length) {
  console.error('Verified pricing/policy drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `Verified pricing/policy drift audit passed (${rules.length} repository-wide contradiction patterns, ` +
    `custom-quote and recurring-price guards, and a repo-wide retired-Offer-price scan with ` +
    `${retiredPriceAllowlist.length} allowlisted file(s)).`,
);
