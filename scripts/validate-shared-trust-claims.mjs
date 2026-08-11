import fs from 'node:fs';

const sharedFiles = [
  'src/components/TrustBadges.astro',
  'src/components/Footer.astro',
];

const required = [
  'IDENTITY',
  'PERFORMANCE',
  'REVIEWS',
];

const forbidden = [
  'Licensed & Insured',
  '$2M Insured',
  '$2M Liability',
  '$2,000,000 General Liability Insurance',
  'Workers\' Compensation',
  'Bonded',
  'Background Checked',
  '100% Satisfaction',
  'Satisfaction Guaranteed',
  'Re-Clean Free',
  'Damage Protection',
  'Professional Cleaning Certified',
  'Eco-Friendly Products Trained',
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
      failures.push(`${file}: retired/unverified trust claim ${JSON.stringify(phrase)}`);
    }
  }
}

if (failures.length) {
  console.error('Shared trust-claim drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log('Shared trust-claim audit passed (Footer + TrustBadges use canonical claims only).');
