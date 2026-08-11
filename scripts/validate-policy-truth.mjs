import fs from 'node:fs';
import path from 'node:path';

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

      const discountPattern = /(?:save\s+)?(\d+)%[^.\n]{0,80}(?:recurring|discount|one-time)|(?:recurring|discount|save)[^.\n]{0,80}(\d+)%/gi;
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

if (failures.length) {
  console.error('Verified pricing/policy drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Verified pricing/policy drift audit passed (${rules.length} repository-wide contradiction patterns plus custom-quote and recurring-price guards).`);
