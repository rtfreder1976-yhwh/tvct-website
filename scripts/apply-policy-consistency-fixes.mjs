import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'src';
const commercialPricingSentence = /Small offices(?: \([^)]*\))? (?:typically |may )?start(?: at| around)? \$\d+(?:[–-]\$\d+)?(?:\/visit| per visit)?\./g;
const travelFeePhrase = /small travel fee/gi;
const customQuotePath = /src[\\/]pages[\\/]locations[\\/][^\\/]+[\\/](?:commercial-cleaning|office-cleaning|medical-office-cleaning|dental-office-cleaning)\.astro$/;
const numericPriceProp = /\bprice="\$[\d,]+(?:\.\d{2})?"/g;

const replacementCommercialPricing = 'Commercial pricing is custom-quoted based on square footage, task list, and services per week.';

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.astro')) files.push(full);
  }
  return files;
}

let commercialPricingCount = 0;
let travelFeeCount = 0;
let customQuotePricePropCount = 0;
const changedFiles = new Set();

for (const file of walk(ROOT)) {
  let source = fs.readFileSync(file, 'utf8');
  const before = source;

  source = source.replace(commercialPricingSentence, () => {
    commercialPricingCount += 1;
    return replacementCommercialPricing;
  });

  source = source.replace(travelFeePhrase, () => {
    travelFeeCount += 1;
    return '$5–$15 travel fee';
  });

  if (customQuotePath.test(file)) {
    source = source.replace(numericPriceProp, () => {
      customQuotePricePropCount += 1;
      return 'price="Call"';
    });
  }

  if (source !== before) {
    fs.writeFileSync(file, source);
    changedFiles.add(file);
  }
}

const trustPath = path.join(ROOT, 'pages', 'trust.astro');
let trust = fs.readFileSync(trustPath, 'utf8');
const trustBefore = trust;

const staleTrustFaq = "(3) We don't charge cancellation fees when life happens.";
const verifiedTrustFaq = '(3) Cancellations with less than 24 hours notice, no-shows, and lock-outs have a $100 fee.';
if (!trust.includes(staleTrustFaq)) throw new Error('Expected stale trust FAQ cancellation sentence was not found.');
trust = trust.replace(staleTrustFaq, verifiedTrustFaq);

const staleTrustComparison = '{ aspect: "Cancellation policy", us: "Flexible - life happens", them: "$50+ cancellation fees" },';
const verifiedTrustComparison = '{ aspect: "Cancellation policy", us: "$100 fee for late cancellations, no-shows, or lock-outs", them: "Varies by provider" },';
if (!trust.includes(staleTrustComparison)) throw new Error('Expected stale trust comparison row was not found.');
trust = trust.replace(staleTrustComparison, verifiedTrustComparison);

if (trust !== trustBefore) {
  fs.writeFileSync(trustPath, trust);
  changedFiles.add(trustPath);
}

if (commercialPricingCount !== 7) {
  throw new Error(`Expected 7 stale commercial-pricing sentences, changed ${commercialPricingCount}.`);
}
if (travelFeeCount !== 4) {
  throw new Error(`Expected 4 vague travel-fee phrases, changed ${travelFeeCount}.`);
}
if (customQuotePricePropCount < 1) {
  throw new Error('Expected at least one numeric custom-quote price prop to retire.');
}

console.log(`Updated ${changedFiles.size} files.`);
console.log(`Commercial pricing sentences: ${commercialPricingCount}`);
console.log(`Travel fee phrases: ${travelFeeCount}`);
console.log(`Custom-quote numeric price props: ${customQuotePricePropCount}`);
console.log('Trust cancellation FAQ/comparison: 2');
