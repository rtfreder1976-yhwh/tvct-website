import fs from 'node:fs';

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, source) { fs.writeFileSync(file, source); }
function replaceAtLeast(source, pattern, replacement, min, file, label) {
  let count = 0;
  const next = source.replace(pattern, () => { count += 1; return replacement; });
  if (count < min) throw new Error(`${file}: expected at least ${min} ${label} replacements, got ${count}`);
  return next;
}
function replaceExact(source, from, to, file) {
  if (!source.includes(from)) throw new Error(`${file}: expected text not found: ${from}`);
  return source.replace(from, to);
}

const weeklyDiscountFiles = [
  'src/pages/locations/decatur/weekly-cleaning.astro',
  'src/pages/locations/huntsville/weekly-cleaning.astro',
  'src/pages/locations/mountain-brook/weekly-cleaning.astro',
  'src/pages/locations/nashville/weekly-cleaning.astro',
];
for (const file of weeklyDiscountFiles) {
  let source = read(file);
  source = replaceAtLeast(source, /20%/g, '30%', 1, file, 'weekly discount');
  source = source.replace(/price="\$150\/week"/g, 'price="$150/visit"');
  write(file, source);
}

const weeklyStartingPrices = new Map([
  ['src/pages/locations/florence/weekly-cleaning.astro', 119],
  ['src/pages/locations/huntsville/weekly-cleaning.astro', 99],
  ['src/pages/locations/mountain-brook/weekly-cleaning.astro', 129],
  ['src/pages/locations/muscle-shoals/weekly-cleaning.astro', 119],
]);
for (const [file, oldPrice] of weeklyStartingPrices) {
  let source = read(file);
  source = replaceExact(source, `starts at $${oldPrice}`, 'starts at $150', file);
  source = source.replace(/price="\$150\/week"/g, 'price="$150/visit"');
  write(file, source);
}

const biweekly = new Map([
  ['src/pages/locations/florence/biweekly-cleaning.astro', 99],
  ['src/pages/locations/huntsville/biweekly-cleaning.astro', 99],
  ['src/pages/locations/mountain-brook/biweekly-cleaning.astro', 109],
  ['src/pages/locations/muscle-shoals/biweekly-cleaning.astro', 99],
  ['src/pages/locations/nashville/biweekly-cleaning.astro', 109],
]);
for (const [file, oldStart] of biweekly) {
  let source = read(file);
  source = replaceAtLeast(source, /15%/g, '25%', 1, file, 'biweekly discount');
  source = replaceExact(source, 'price="$132/visit"', 'price="$150/visit"', file);
  source = replaceExact(source, `starts at $${oldStart}`, 'starts at $150', file);
  write(file, source);
}

console.log('Applied guarded recurring-policy corrections to the audited weekly and biweekly pages.');
