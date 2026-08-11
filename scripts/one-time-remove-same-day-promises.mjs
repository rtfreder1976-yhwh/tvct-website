import fs from 'node:fs';
import path from 'node:path';

const extensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);
const replacements = new Map([
  ['Same-day available', 'Check current availability in BookingKoala'],
  ['Same-Day Available', 'Check Current Availability in BookingKoala'],
  ['availability for last-minute or same-day', 'availability shown in BookingKoala'],
  ['same-day or last-minute availability', 'current BookingKoala availability'],
  ['Same-day turnovers available', 'Check current turnover availability in BookingKoala'],
  ['Same-day service available', 'Check current availability in BookingKoala'],
  ['Same-day service often available', 'Check current availability in BookingKoala'],
  ['Same-day service is available based on team availability', 'Service availability is shown in BookingKoala'],
  ['same-day availability', 'current BookingKoala availability'],
  ['Same-day availability', 'Current BookingKoala availability'],
  ['Same-day and next-day service available', 'Check current service availability in BookingKoala'],
  ['same-day turnovers, book in advance to ensure availability', 'turnover scheduling; book in advance and check current availability in BookingKoala'],
  ['Same-Day Service Available', 'Check Current Availability in BookingKoala'],
  ['same-day turnover available', 'current turnover availability in BookingKoala'],
  ['Same-day turnover available', 'Check current turnover availability in BookingKoala'],
  ['Same-Day Availability', 'Current BookingKoala Availability'],
  ['Same-day and next-day service is often available', 'Current scheduling availability is shown in BookingKoala'],
  ['Same-day and next-day availability', 'Current BookingKoala availability'],
  ['same day depending on availability', 'through BookingKoala based on current availability'],
  ['same-day move-out cleaning in Nashville based on availability', 'move-out cleaning in Nashville based on current BookingKoala availability'],
  ['Same-Day Turnover Available', 'Check Current Turnover Availability in BookingKoala'],
]);

const forbidden = [
  /same[- ]day[^\n.]{0,100}\b(?:available|availability|appointments?|openings?|slots?)\b/i,
  /\b(?:available|availability|appointments?|openings?|slots?)\b[^\n.]{0,100}same[- ]day/i,
];
const neutralSameDayPatterns = [/same[- ]day cancellations?/i];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extensions.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

let changedFiles = 0;
let replacementCount = 0;
for (const file of walk('src')) {
  const original = fs.readFileSync(file, 'utf8');
  let next = original;
  for (const [from, to] of replacements) {
    if (!next.includes(from)) continue;
    const pieces = next.split(from);
    replacementCount += pieces.length - 1;
    next = pieces.join(to);
  }
  if (next !== original) {
    fs.writeFileSync(file, next);
    changedFiles += 1;
    console.log(`updated ${file}`);
  }
}

// Keep the permanent guard strict about service availability while allowing
// neutral policy wording such as "same-day cancellations".
const validatorPath = 'scripts/validate-claim-drift.mjs';
let validator = fs.readFileSync(validatorPath, 'utf8');
if (!validator.includes('sameDayNeutralPatterns')) {
  const withNeutralPattern = validator.replace(
    "const customerSourceExtensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);",
    "const sameDayNeutralPatterns = [/same[- ]day cancellations?/i];\nconst customerSourceExtensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);",
  );
  const withNeutralSkip = withNeutralPattern.replace(
    '    if (match) {\n      failures.push(',
    '    if (match && sameDayNeutralPatterns.some((neutral) => neutral.test(match[0]))) continue;\n    if (match) {\n      failures.push(',
  );
  if (withNeutralSkip === validator || !withNeutralSkip.includes('sameDayNeutralPatterns')) {
    throw new Error('Could not refine permanent same-day claim guard');
  }
  validator = withNeutralSkip;
  fs.writeFileSync(validatorPath, validator);
  console.log(`updated ${validatorPath}`);
}

const residuals = [];
for (const file of walk('src')) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of forbidden) {
    const match = source.match(pattern);
    if (match && neutralSameDayPatterns.some((neutral) => neutral.test(match[0]))) continue;
    if (match) {
      residuals.push(`${file}: ${JSON.stringify(match[0].trim())}`);
      break;
    }
  }
}

if (residuals.length) {
  console.error('Unmatched same-day availability promises remain:');
  for (const residual of residuals) console.error(`  - ${residual}`);
  process.exit(1);
}

console.log(`Removed ${replacementCount} same-day availability promise(s) across ${changedFiles} file(s).`);
