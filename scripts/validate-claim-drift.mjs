import fs from 'node:fs';

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
  requireRedirect(source, '/careers');
}

for (const source of ['/terms', '/terms/', '/careers', '/careers/']) {
  forbidRedirect(source, 'a real Astro page owns this route');
}

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
console.log(
  `Claim/architecture drift audit passed (${required.length + forbidden.length + 2 + redirectInvariantCount} invariants checked).`,
);
