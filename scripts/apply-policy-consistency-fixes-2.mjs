import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, source) {
  fs.writeFileSync(file, source);
}

function replaceExact(source, from, to, file) {
  if (!source.includes(from)) throw new Error(`Expected text not found in ${file}: ${from}`);
  return source.replace(from, to);
}

function replaceAllCount(source, pattern, replacement, expectedMin, file) {
  let count = 0;
  const next = source.replace(pattern, () => {
    count += 1;
    return replacement;
  });
  if (count < expectedMin) throw new Error(`Expected at least ${expectedMin} replacements in ${file}, changed ${count}.`);
  return { source: next, count };
}

const weekly = 'src/pages/locations/athens/weekly-cleaning.astro';
let source = read(weekly);
let result = replaceAllCount(source, /20%/g, '30%', 4, weekly);
source = result.source;
source = replaceExact(source, 'price="$150/week"', 'price="$150/visit"', weekly);
source = replaceExact(source, '$99 per visit — that\'s our 30% recurring discount', '$150 per visit — that\'s our 30% recurring discount', weekly);
source = replaceExact(
  source,
  'no contracts, no cancellation fees, and no lock-in periods. You can pause for a vacation, cancel for a season, or stop entirely — all with just 48 hours notice.',
  'no contracts and no lock-in periods. You can pause for a vacation, cancel for a season, or stop entirely. Cancellations with less than 24 hours notice, no-shows, and lock-outs carry a $100 fee.',
  weekly,
);
write(weekly, source);

for (const file of [
  'src/pages/locations/athens/biweekly-cleaning.astro',
  'src/pages/locations/decatur/biweekly-cleaning.astro',
]) {
  source = read(file);
  result = replaceAllCount(source, /15%/g, '25%', 4, file);
  source = result.source;
  source = replaceExact(source, 'price="$132/visit"', 'price="$150/visit"', file);
  source = replaceExact(source, '$99 per visit with our automatic 25% recurring discount applied', '$150 per visit with our automatic 25% recurring discount applied', file);
  source = replaceExact(
    source,
    'No contracts, no cancellation fees, no lock-in periods.',
    'No contracts and no lock-in periods. Cancellations with less than 24 hours notice, no-shows, and lock-outs carry a $100 fee.',
    file,
  );
  write(file, source);
}

const office = 'src/pages/locations/decatur/office-cleaning.astro';
source = read(office);
source = replaceExact(
  source,
  'Small offices (under 2,000 sq ft) typically range from $200-400/month for weekly service. Larger facilities and manufacturing offices are custom-quoted.',
  'Commercial pricing is custom-quoted based on square footage, task list, and services per week. Larger facilities and manufacturing offices are custom-quoted.',
  office,
);
write(office, source);

const comparison = 'src/pages/best-cleaning-company-nashville-tn.astro';
source = read(comparison);
source = replaceExact(
  source,
  "pricing: 'Standard from $150 · Deep clean from $250 · Move-out from $300',",
  "pricing: 'Standard from $200 · Deep clean from $276 · Move-out from $351',",
  comparison,
);
source = replaceExact(
  source,
  'The Valley Clean Team quotes standard cleans from $150, deep cleans from $250, and move-outs from $300 — flat and upfront.',
  'The Valley Clean Team quotes standard cleans from $200, deep cleans from $276, and move-outs from $351 — flat and upfront.',
  comparison,
);
write(comparison, source);

console.log('Applied second guarded policy-consistency pass.');
