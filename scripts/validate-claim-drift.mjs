import fs from 'node:fs';

/**
 * Source-level regression checks for business claims that have already been
 * retired or moved into src/data/claims.ts. This complements assertClaims():
 * assertClaims validates canonical values; this file checks that important
 * consumers have not retyped stale values around that canonical layer.
 */
const rules = [
  {
    file: 'src/layouts/BaseLayout.astro',
    forbidden: '150+ 5-star reviews',
    why: 'review figures must come from REVIEWS (currently 4.9 from 148)',
  },
  {
    file: 'src/pages/index.astro',
    forbidden: '1,500+ Cleanings Completed',
    why: '1,500+ is customers served, not a verified cleanings-completed count',
  },
  {
    file: 'src/pages/index.astro',
    forbidden: '15% off for bi-weekly, and 10% off for monthly',
    why: 'canonical recurring discounts are 30% weekly / 25% biweekly / 15% monthly',
  },
  {
    file: 'src/pages/locations/mountain-brook/recurring-maid-service.astro',
    forbidden: 'From $129',
    why: 'retired recurring rate; pricing must derive from RECURRING_PRICING',
  },
  {
    file: 'src/pages/locations/mountain-brook/recurring-maid-service.astro',
    forbidden: '20% savings',
    why: 'retired recurring discount ladder',
  },
  {
    file: 'src/pages/locations/mountain-brook/recurring-maid-service.astro',
    forbidden: '150 Five-Star Reviews',
    why: 'review figures must come from REVIEWS',
  },
  {
    file: 'src/constants/schemaData.ts',
    forbidden: 'export const REVIEWS = {',
    why: 'claims.ts must be the only canonical review source',
  },
  {
    file: 'src/data/services.json',
    forbidden: '"price_start": "$119/week"',
    why: 'retired weekly price; derive recurring price from claims.ts',
  },
  {
    file: 'src/data/services.json',
    forbidden: '"price_start": "$135/visit"',
    why: 'retired biweekly price; derive recurring price from claims.ts',
  },
  {
    file: 'src/data/services.json',
    forbidden: '"price_start": "$225"',
    why: 'retired move-out floor; move in/out canonical floor is $351',
  },
  {
    file: 'src/data/services.json',
    forbidden: '"price_start": "$400"',
    why: 'post-construction canonical starting price is $300',
  },
];

const failures = [];
for (const rule of rules) {
  const source = fs.readFileSync(rule.file, 'utf8');
  if (source.includes(rule.forbidden)) {
    failures.push(`${rule.file}: found ${JSON.stringify(rule.forbidden)} — ${rule.why}`);
  }
}

if (failures.length) {
  console.error('Business-claim drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  console.error('\nFix the consumer to import/derive the canonical claim instead of updating this allowlist.');
  process.exit(1);
}

console.log(`Claim-drift audit passed (${rules.length} retired claim patterns checked).`);
