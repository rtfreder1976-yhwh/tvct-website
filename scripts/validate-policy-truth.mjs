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
const numericPriceProp = /\bprice="\$[\d,]+(?:\.\d{2})?"/i;

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
    pattern: /small offices?[^\n]{0,180}\$\d+/i,
    why: 'commercial pricing is custom-quoted from square footage, task list, and services per week',
  },
];

const failures = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const rule of rules) {
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
  }
}

if (failures.length) {
  console.error('Verified pricing/policy drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Verified pricing/policy drift audit passed (${rules.length} repository-wide contradiction patterns plus custom-quote schema guards).`);
