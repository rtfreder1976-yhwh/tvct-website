import fs from 'node:fs';
import path from 'node:path';

const replacements = new Map([
  ['availability shown in BookingKoala requests can be tighter', 'current BookingKoala availability can be tighter'],
  ['If your delivery date slips, which happens, a same-day option matters. We keep current BookingKoala availability open for military moves specifically because PCS timelines rarely hold. Text us your window and we\'ll work around the truck.', 'If your delivery date slips, which happens, flexibility matters. Check BookingKoala for current availability and choose the best available window around your delivery.'],
  ['On the cleaning side, the reason we keep current BookingKoala availability open is PCS timelines. When your household goods land a day early or three days late, a cleaner who can only book you two weeks out doesn\'t help. We built around that because I\'ve lived it.', 'On the cleaning side, PCS timelines can move quickly. Check BookingKoala for current availability when your household-goods delivery changes, and choose the best available window for your move.'],
  ['<strong>Current BookingKoala availability for PCS moves</strong>, because your truck doesn\'t run on a two-week schedule and neither should your cleaner.', '<strong>BookingKoala scheduling for PCS moves</strong>, so you can check current openings when your delivery timeline changes.'],
  ['For turnover scheduling; book in advance and check current availability in BookingKoala.', 'For turnover scheduling, book in advance and check current availability in BookingKoala.'],
  ['We can typically schedule post-event cleaning for the next morning or through BookingKoala based on current availability. Let us know your timeline when booking so we can accommodate your needs.', 'We can typically schedule post-event cleaning based on current availability. Check BookingKoala for open times and include your event timeline when booking.'],
  ['Current BookingKoala availability exists but cannot be guaranteed.', 'Check BookingKoala for current openings; availability varies by date.'],
  ['Do you offer same-day move-out cleaning in Nashville?', 'How do I check near-term move-out cleaning availability in Nashville?'],
  ['Yes — we offer move-out cleaning in Nashville based on current BookingKoala availability.', 'Current move-out cleaning availability is shown in BookingKoala.'],
  ['Can I get same-day or next-day move-out cleaning in West Nashville?', 'How do I check near-term move-out cleaning availability in West Nashville?'],
  ['Check current service availability in BookingKoala based on schedule', 'Check current service availability in BookingKoala'],
  ['Check current availability in BookingKoala based on schedule', 'Check current availability in BookingKoala'],
  ['Check Current Availability in BookingKoala - Call Now!', 'Check Current Availability in BookingKoala'],
  ['Same-day service:</strong\n              > +$25-50 rush fee (when available)', 'Scheduling:</strong\n              > Check BookingKoala for current availability'],
  ['Service availability is shown in BookingKoala and\n              includes a $25-50 rush fee depending on the service type. For best\n              availability, we recommend booking at least 24-48 hours in\n              advance. We recommend booking 2–3 days ahead for the best availability. Call 256-826-1100 for current scheduling options.', 'Current scheduling options are shown in BookingKoala. For the best\n              selection, we recommend booking 2–3 days ahead when possible.'],
]);

const extensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);
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
    const parts = next.split(from);
    replacementCount += parts.length - 1;
    next = parts.join(to);
  }
  if (next !== original) {
    fs.writeFileSync(file, next);
    changedFiles += 1;
    console.log(`updated ${file}`);
  }
}

if (!replacementCount) throw new Error('Availability copy polish produced no replacements');

const forbiddenAwkwardCopy = [
  'availability shown in BookingKoala requests',
  'For turnover scheduling;',
  'next morning or through BookingKoala',
  'Current BookingKoala availability exists',
  'same-day option matters',
  'keep current BookingKoala availability open',
  '$25-50 rush fee',
];
for (const file of walk('src')) {
  const source = fs.readFileSync(file, 'utf8');
  for (const phrase of forbiddenAwkwardCopy) {
    if (source.includes(phrase)) throw new Error(`${file}: residual copy ${JSON.stringify(phrase)}`);
  }
}

console.log(`Polished ${replacementCount} availability phrase(s) across ${changedFiles} file(s).`);
