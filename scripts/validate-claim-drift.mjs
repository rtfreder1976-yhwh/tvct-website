import fs from 'node:fs';
import path from 'node:path';

// Commercial capture is site-owned as of 2026-08-29 (decision: Todd). Customer-facing
// commercial CTAs point at the quote flow; BookingKoala is internal-only for booking/ops.
// On-site links use the path; email/doc references need the absolute URL.
const COMMERCIAL_QUOTE_PATH = '/request-a-quote?service=commercial';
const AIRBNB_QUOTE_PATH = '/request-a-quote?service=airbnbTurnover';
const COMMERCIAL_QUOTE_ABSOLUTE = 'https://thevalleycleanteam.com/request-a-quote?service=commercial';
const RETIRED_COMMERCIAL_BOOKING_URL = 'https://thevalleycleanteam.bookingkoala.com/booknow/office_cleaning';
// Careers stays on BookingKoala on purpose: cleaner applicants must never enter
// customer quote/CRM infrastructure (CLAUDE.md §3).
const CAREERS_URL = 'https://thevalleycleanteam.bookingkoala.com/hiring/form/careers';

/**
 * Regression checks for architectural invariants that are easy to accidentally
 * undo. Canonical values live in claims.ts; this script checks that high-impact
 * consumers use that layer rather than reintroducing retired literals.
 */
const required = [
  {
    file: 'src/pages/locations/[city]/[slug].astro',
    text: 'canonicalServicePrice',
    why: 'generated service pages must normalize pricing before rendering/schema',
  },
  {
    file: 'src/pages/locations/[city]/[slug].astro',
    text: 'normalizeServiceCopy',
    why: 'generated service copy must normalize retired recurring-discount language',
  },
  {
    file: 'src/pages/index.astro',
    text: 'RECURRING_DISCOUNTS',
    why: 'homepage recurring percentages must derive from claims.ts',
  },
  {
    file: 'src/pages/index.astro',
    text: 'PERFORMANCE.customersServedDisplay',
    why: '1,500+ is customers served, not an invented cleanings-completed metric',
  },
  {
    file: 'src/constants/schemaData.ts',
    text: 'export { REVIEWS } from "../data/claims"',
    why: 'schemaData must re-export, not redefine, canonical review figures',
  },
  {
    file: 'src/components/SchemaMarkup.astro',
    text: 'REVIEWS.rating',
    why: 'structured rating must consume canonical review data',
  },
  {
    file: 'src/layouts/BaseLayout.astro',
    text: 'REVIEWS.countDisplay',
    why: 'default metadata must derive its review count from claims.ts',
  },
  {
    file: 'src/layouts/BaseLayout.astro',
    text: 'IDENTITY.primaryPhraseCapitalized',
    why: 'default metadata ownership language must derive from claims.ts',
  },
  {
    file: 'src/pages/admin/login.astro',
    text: 'Astro.request.method === "POST"',
    why: 'browser admin authentication must submit the secret in a POST body',
  },
  {
    file: 'src/pages/admin/login.astro',
    text: 'createAdminSessionCookie',
    why: 'successful admin login must mint the short-lived signed session cookie',
  },
  {
    file: 'src/pages/commercial-quote.astro',
    text: COMMERCIAL_QUOTE_PATH,
    why: 'the commercial quote route must forward into the site-owned quote flow',
  },
  {
    file: 'src/pages/careers.astro',
    text: CAREERS_URL,
    why: 'the established careers route must hand off to the verified BookingKoala form',
  },
];

const forbidden = [
  {
    file: 'src/pages/index.astro',
    text: 'Cleanings Completed',
    why: 'there is no separately verified cleanings-completed total',
  },
  {
    file: 'src/pages/index.astro',
    text: 'Same-day service available',
    why: 'same-day service is not a sitewide guaranteed claim',
  },
  {
    file: 'src/components/SchemaMarkup.astro',
    text: 'numberOfEmployees',
    why: 'employee-count range was not governed by a verified claim',
  },
  {
    file: 'src/components/SchemaMarkup.astro',
    text: 'W-2 employees',
    why: 'employment-model detail is not part of the verified canonical claim set',
  },
  {
    file: 'src/components/SchemaMarkup.astro',
    text: 'Same-day service available',
    why: 'structured data must not assert unverified availability',
  },
  {
    file: 'src/data/serviceIntent.ts',
    text: 'following clinical disinfection protocols',
    why: 'clinical compliance gate is false; comparison copy cannot bypass it',
  },
  {
    file: 'src/data/serviceIntent.ts',
    text: 'healthcare-grade protocols',
    why: 'clinical compliance gate is false; comparison copy cannot bypass it',
  },
  {
    file: 'src/components/QuoteForm.astro',
    text: '/api/submit-form',
    why: 'legacy website quote forms are retired in favor of BookingKoala',
  },
  {
    file: 'src/layouts/BaseLayout.astro',
    text: '150+ 5-star reviews',
    why: 'default metadata must not reintroduce stale review-count copy',
  },
  {
    file: 'src/lib/adminAuth.ts',
    text: "searchParams.get('key')",
    why: 'ADMIN_SECRET must never be accepted from a browser query string',
  },
  {
    file: 'src/lib/adminAuth.ts',
    text: '?key=YOUR_ADMIN_SECRET',
    why: 'admin documentation/errors must not instruct users to put secrets in URLs',
  },
  {
    file: 'src/pages/about.astro',
    text: 'Same-day and weekend appointments available',
    why: 'same-day appointment availability is not a verified sitewide promise',
  },
];

const failures = [];

for (const rule of required) {
  if (!fs.existsSync(rule.file)) {
    failures.push(`${rule.file}: required file is missing — ${rule.why}`);
    continue;
  }
  const source = fs.readFileSync(rule.file, 'utf8');
  if (!source.includes(rule.text)) {
    failures.push(`${rule.file}: missing ${JSON.stringify(rule.text)} — ${rule.why}`);
  }
}

for (const rule of forbidden) {
  if (!fs.existsSync(rule.file)) continue;
  const source = fs.readFileSync(rule.file, 'utf8');
  if (source.includes(rule.text)) {
    failures.push(`${rule.file}: found ${JSON.stringify(rule.text)} — ${rule.why}`);
  }
}

// Search customer-facing source broadly for language that turns "same-day"
// into an availability promise. Historical redirect paths and neutral mentions
// are allowed; statements that same-day appointments/openings/availability are
// available are not, because current availability belongs in BookingKoala.
// Neutral scheduling-policy language is allowed; cancellation terms are not availability claims.
const sameDayNeutralPatterns = [/same[- ]day cancellations?/i];
const customerSourceExtensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx']);
const sameDayAvailabilityPatterns = [
  /same[- ]day[^\n.]{0,100}\b(?:available|availability|appointments?|openings?|slots?)\b/i,
  /\b(?:available|availability|appointments?|openings?|slots?)\b[^\n.]{0,100}same[- ]day/i,
];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(full));
    } else if (customerSourceExtensions.has(path.extname(entry.name))) {
      files.push(full);
    }
  }
  return files;
}

for (const file of walk('src')) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of sameDayAvailabilityPatterns) {
    const match = source.match(pattern);
    if (match && sameDayNeutralPatterns.some((neutral) => neutral.test(match[0]))) continue;
    if (match) {
      failures.push(
        `${file}: unverified same-day availability promise ${JSON.stringify(match[0].trim())}`,
      );
      break;
    }
  }
}

// Redirects are part of the public architecture too. Validate destinations as
// parsed data so formatting changes in vercel.json do not weaken the guard.
const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const redirects = Array.isArray(vercel.redirects) ? vercel.redirects : [];

function redirectFor(source) {
  return redirects.find((redirect) => redirect.source === source);
}

function requireRedirect(source, destination) {
  const redirect = redirectFor(source);
  if (!redirect) {
    failures.push(`vercel.json: missing redirect ${source} -> ${destination}`);
    return;
  }
  if (redirect.destination !== destination) {
    failures.push(
      `vercel.json: ${source} points to ${redirect.destination}, expected ${destination}`,
    );
  }
}

function forbidRedirect(source, why) {
  const redirect = redirectFor(source);
  if (redirect) {
    failures.push(`vercel.json: ${source} must not redirect to ${redirect.destination} — ${why}`);
  }
}

for (const source of ['/privacy-policy', '/privacy-policy/']) {
  requireRedirect(source, '/privacy');
}

for (const source of ['/customer-login', '/customer-login/']) {
  requireRedirect(source, 'https://thevalleycleanteam.bookingkoala.com/login');
}

for (const source of [
  '/professional-cleaning-jobs-tennessee-valley',
  '/professional-cleaning-jobs-tennessee-valley/',
]) {
  requireRedirect(source, CAREERS_URL);
}

for (const source of ['/terms', '/terms/', '/careers', '/careers/']) {
  forbidRedirect(source, 'an Astro page owns this route');
}

const bookingKoalaHandoffs = [
  {
    url: COMMERCIAL_QUOTE_PATH,
    files: ['src/components/Footer.astro', 'src/pages/pricing.astro'],
    why: 'on-site commercial quote CTAs must use the site-owned quote flow',
  },
  {
    // Email and docs are read outside the site, so they need the absolute URL.
    url: COMMERCIAL_QUOTE_ABSOLUTE,
    files: [
      'templates/ghl_email_church.html',
      'templates/ghl_email_dental.html',
      'templates/ghl_email_dialysis.html',
      'templates/ghl_email_medical.html',
      'README_OUTREACH.md',
      'docs/OUTREACH_GHL_LOGIC.md',
      'docs/OUTREACH_GROWTH_PLAYBOOK.md',
      'docs/GROWTH_ENGINE_SYSTEM_MAP.md',
    ],
    why: 'outreach commercial quote CTAs must use the site-owned quote flow',
  },
  {
    url: CAREERS_URL,
    files: ['src/components/Navigation.astro', 'src/components/Footer.astro'],
    why: 'careers links must use the verified BookingKoala destination',
  },
];

const bookingKoalaAnchorHandoffs = [
  {
    file: 'src/components/Footer.astro',
    labels: ['Commercial Quote →'],
    url: COMMERCIAL_QUOTE_PATH,
  },
  {
    file: 'src/pages/pricing.astro',
    labels: ['Get Your Commercial Quote'],
    url: COMMERCIAL_QUOTE_PATH,
  },
  {
    // Airbnb turnover is not commercial office work; it had been pointed at the
    // office booking form, which sent vacation-rental hosts into the wrong flow.
    file: 'src/pages/pricing.astro',
    labels: ['Partner With Us'],
    url: AIRBNB_QUOTE_PATH,
  },
  {
    file: 'src/components/Navigation.astro',
    labels: ['Careers'],
    url: CAREERS_URL,
  },
  {
    file: 'src/components/Footer.astro',
    labels: ['Careers'],
    url: CAREERS_URL,
  },
];

for (const handoff of bookingKoalaHandoffs) {
  for (const file of handoff.files) {
    if (!fs.existsSync(file)) {
      failures.push(`${file}: required file is missing — ${handoff.why}`);
      continue;
    }
    const source = fs.readFileSync(file, 'utf8');
    if (!source.includes(handoff.url)) {
      failures.push(`${file}: missing ${handoff.url} — ${handoff.why}`);
    }
  }
}

for (const handoff of bookingKoalaAnchorHandoffs) {
  const source = fs.readFileSync(handoff.file, 'utf8');
  const anchors = [...source.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a\s*>/g)].map((match) => ({
    href: match[1].match(/\bhref=["']([^"']+)["']/)?.[1],
    label: match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
  }));

  for (const label of handoff.labels) {
    const matchingAnchors = anchors.filter((anchor) => anchor.label === label);
    if (!matchingAnchors.length) {
      failures.push(`${handoff.file}: missing named link ${JSON.stringify(label)}`);
      continue;
    }
    for (const anchor of matchingAnchors) {
      if (anchor.href !== handoff.url) {
        failures.push(
          `${handoff.file}: ${JSON.stringify(label)} points to ${anchor.href}, expected ${handoff.url}`,
        );
      }
    }
  }
}

// Inverted guard for the 2026-08-29 decision. The rule this replaces required
// commercial CTAs to point AT BookingKoala, so the old checks cannot simply be
// deleted — the protection has to survive pointing the other way. Any customer-
// facing surface that reintroduces the BookingKoala commercial booking form is a
// regression, whether it is a link, an iframe embed, or an email template.
const retiredCommercialRoots = ['src', 'templates', 'public'];
const retiredCommercialExtensions = new Set(['.astro', '.ts', '.js', '.json', '.md', '.mdx', '.html', '.txt']);

function scanForRetiredCommercialUrl(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanForRetiredCommercialUrl(full);
      continue;
    }
    if (!retiredCommercialExtensions.has(path.extname(entry.name))) continue;
    if (fs.readFileSync(full, 'utf8').includes(RETIRED_COMMERCIAL_BOOKING_URL)) {
      failures.push(
        `${full}: found ${RETIRED_COMMERCIAL_BOOKING_URL} — customer-facing commercial ` +
          `capture is site-owned; link ${COMMERCIAL_QUOTE_PATH} instead (CLAUDE.md §2)`,
      );
    }
  }
}

for (const root of retiredCommercialRoots) scanForRetiredCommercialUrl(root);

for (const [market, hub] of [
  ['huntsville', '/locations/huntsville'],
  ['nashville', '/locations/nashville'],
  ['athens', '/locations/athens'],
  ['muscle-shoals', '/locations/muscle-shoals'],
  ['mountain-brook', '/locations/mountain-brook'],
]) {
  requireRedirect(`/${market}-same-day-cleaning`, hub);
  requireRedirect(`/locations/${market}/same-day-cleaning`, hub);
}

// These files are deliberately absent after migration. Reintroducing either
// restores a legacy public ingestion path or a bespoke stale-pricing route.
for (const retired of [
  'api/submit-form.ts',
  'src/pages/locations/mountain-brook/recurring-maid-service.astro',
]) {
  if (fs.existsSync(retired)) {
    failures.push(`${retired}: retired file was reintroduced`);
  }
}

if (failures.length) {
  console.error('Business-claim / architecture drift detected:\n');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const redirectInvariantCount = 2 + 2 + 2 + 4 + 10;
const bookingKoalaHandoffCount = bookingKoalaHandoffs.reduce(
  (count, handoff) => count + handoff.files.length,
  0,
);
const bookingKoalaAnchorCount = bookingKoalaAnchorHandoffs.reduce(
  (count, handoff) => count + handoff.labels.length,
  0,
);
console.log(
  `Claim/architecture drift audit passed (${required.length + forbidden.length + 2 + redirectInvariantCount + bookingKoalaHandoffCount + bookingKoalaAnchorCount} fixed invariants + repository-wide same-day availability scan).`,
);
