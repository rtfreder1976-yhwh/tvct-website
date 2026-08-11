import fs from 'node:fs';

const sharedFiles = [
  'src/components/TrustBadges.astro',
  'src/components/Footer.astro',
];

const required = [
  'IDENTITY',
  'PERFORMANCE',
  'REVIEWS',
  'TRUST',
];

// These remain unverified even after the 2026-08-11 trust clarification.
// Generic insured/background-check/guarantee/weekend claims are allowed only
// when the shared components consume TRUST from claims.ts.
const forbidden = [
  'Licensed & Insured',
  '$2M Insured',
  '$2M Liability',
  '$2,000,000 General Liability Insurance',
  'Alabama State Business License',
  'Tennessee Business Registration',
  'Workers\' Compensation',
  'Bonded',
  'Damage Protection',
  'Professional Cleaning Certified',
  'Eco-Friendly Products Trained',
  'within 24 hours',
  'evenings and weekends included',
];

const failures = [];

for (const file of sharedFiles) {
  const source = fs.readFileSync(file, 'utf8');

  for (const token of required) {
    if (!source.includes(token)) {
      failures.push(`${file}: missing canonical claim dependency ${token}`);
    }
  }

  for (const phrase of forbidden) {
    if (source.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${file}: unverified trust claim ${JSON.stringify(phrase)}`);
    }
  }
}

const claims = fs.readFileSync('src/data/claims.ts', 'utf8');
for (const token of [
  'export const TRUST',
  'isInsured: true',
  'backgroundChecks: true',
  'satisfactionGuarantee: true',
  'freeReclean: true',
  'weekendAvailability: true',
]) {
  if (!claims.includes(token)) {
    failures.push(`src/data/claims.ts: missing verified trust invariant ${JSON.stringify(token)}`);
  }
}

if (failures.length) {
  console.error('Shared trust-claim drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('Shared trust-claim audit passed (verified trust claims flow from claims.ts).');
