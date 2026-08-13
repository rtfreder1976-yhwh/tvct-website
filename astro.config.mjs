import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
// ---------------------------------------------------------------------------
// Real per-URL <lastmod> from git history.
// ---------------------------------------------------------------------------
// Previously the sitemap stamped `lastmod: new Date()` on EVERY url, so every
// deploy claimed all ~200 pages changed "today". Crawlers (and AI freshness
// scoring) learn to distrust a lastmod that is always today, so it became
// noise. Instead we read each page's true last-commit date from git.
//
// The resolution logic now lives in src/lib/pageFreshness.mjs so the layouts
// can render a VISIBLE "Last updated" date from the exact same value the
// sitemap reports — an AI crawl found the site's citable pages undated, and a
// visible date that disagreed with <lastmod> would be its own problem.
//
// Shallow-clone guard (in that module): Vercel shallow-clones by default (git
// depth 1), which would collapse every file's "last commit" to the single most
// recent commit — worse than useless. When a shallow repo is detected, or git
// is unavailable, git dates are disabled entirely and lastmod is OMITTED (a
// neutral "unknown"), never faked to today. To get real dates on Vercel, set
// VERCEL_DEEP_CLONE=1 (or increase fetch depth) so full history is present.
import { lastmodForPath } from './src/lib/pageFreshness.mjs';

// Map a sitemap URL to its git lastmod. Returns null when the url can't be
// resolved to a source file (→ lastmod omitted, which is safe/neutral).
function lastmodForUrl(url) {
  return lastmodForPath(new URL(url).pathname);
}

// Scheduled blog posts set `noindex={!isPublished}` based on a future publishDate.
// Mirror that logic here so unpublished posts are kept OUT of the sitemap until
// their date passes (fixes Ahrefs "Noindex page in sitemap"). Self-maintaining:
// a post auto-appears in the sitemap on the next build after its publish date.
// Also exclude blog posts that canonicalize to another URL (e.g. transactional
// posts pointing at their /locations/{city}/{service} money page) — a sitemap
// should only list canonical URLs.
const blogDir = fileURLToPath(new URL('./src/pages/blog', import.meta.url));
const excludedBlogSlugs = new Set();
try {
  const now = Date.now();
  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.astro')) continue;
    const src = readFileSync(`${blogDir}/${file}`, 'utf8');
    const slug = `/blog/${file.slice(0, -6)}`;
    // (1) Unpublished/scheduled posts (noindex until their publishDate passes)
    if (src.includes('noindex={!isPublished}')) {
      const m = src.match(/const publishDate = new Date\("([^"]+)"\)/);
      if (m && new Date(m[1]).getTime() > now) { excludedBlogSlugs.add(slug); continue; }
    }
    // (2) Posts canonicalized to a different URL
    if (/canonicalUrl="https?:\/\/[^"]+"/.test(src)) excludedBlogSlugs.add(slug);
  }
} catch { /* if the scan fails, fall back to including everything */ }

// Pages retired in favour of the hosted BookingKoala flow. They still exist as
// .astro files, but vercel.json now 301s each path straight to
// thevalleycleanteam.bookingkoala.com/booknow, so listing them in the sitemap
// would advertise URLs that only redirect off-site.
//
// /booking-commercial is included because the booknow flow's first step now
// asks business vs residential, so a separate commercial booking page is
// redundant. Exact-path matches, so /booking-complete (the post-booking thank
// you page, already filtered below) and /commercial-quote are unaffected.
const retiredPaths = new Set(['/booking', '/get-quote', '/booking-commercial']);

// https://astro.build/config
export default defineConfig({
  site: 'https://thevalleycleanteam.com',
  trailingSlash: 'never',
  // Astro 7 defaults to JSX-style whitespace collapsing. Retain the Astro 6
  // rendering behavior so the framework security upgrade does not alter copy.
  compressHTML: true,
  security: {
    // Reject cross-origin state-changing requests before admin login code runs.
    checkOrigin: true,
  },
  // 'static' prerenders every page at build time; routes that genuinely need
  // per-request rendering opt out with `export const prerender = false` and
  // still run as serverless functions (the three /api routes, /admin/dashboard,
  // and the location [city]/[slug] route all already declare it).
  //
  // This was previously `output: 'server'` alongside a top-level
  // `prerender: true`, which is not a real Astro config option and was silently
  // ignored. The result was that 362 of 363 pages — the homepage, /pricing,
  // /get-quote, every location and blog page — invoked a serverless function on
  // every request instead of being served as static HTML from the CDN edge.
  output: 'static',

  integrations: [
    sitemap({
      // /recurring is the noindex SMS conversion page — exact-path match so the
      // indexable /locations/*/recurring-maid-service pages are NOT excluded.
      filter: (page) => !page.includes('/404') && !page.includes('/Draft') && !page.includes('/careers') && !page.includes('/dashboard') && !page.includes('/thank-you') && !page.includes('/booking-complete') && !page.includes('/api/') && !page.includes('/ads/') && new URL(page).pathname.replace(/\/$/, '') !== '/recurring' && !retiredPaths.has(new URL(page).pathname.replace(/\/$/, '')) && !excludedBlogSlugs.has(new URL(page).pathname.replace(/\/$/, '')),
      changefreq: 'weekly',
      priority: 0.7,
      customPages: [
        'https://thevalleycleanteam.com/',
        'https://thevalleycleanteam.com/services',
        'https://thevalleycleanteam.com/services/deep-cleaning',
        'https://thevalleycleanteam.com/services/move-in-out-cleaning',
        'https://thevalleycleanteam.com/services/post-construction-cleaning',
        'https://thevalleycleanteam.com/pricing',
        'https://thevalleycleanteam.com/contact',
        'https://thevalleycleanteam.com/locations',
        'https://thevalleycleanteam.com/blog',
        'https://thevalleycleanteam.com/about',
        'https://thevalleycleanteam.com/trust',
        'https://thevalleycleanteam.com/luxury-homes',
        // foreclosure-reo-cleaning has no per-city literal .astro file (unlike
        // every other service) — it's served entirely by the SSR-only
        // [city]/[slug].astro route, so @astrojs/sitemap's automatic
        // prerendered-route discovery never finds it. List each combo here
        // explicitly (derived from locations.json, not hand-duplicated, so a
        // new city can't silently go missing from the sitemap).
        ...JSON.parse(readFileSync('./src/data/locations.json', 'utf8'))
          .map((l) => `https://thevalleycleanteam.com/locations/${l.slug}/foreclosure-reo-cleaning`),
      ],
      serialize(item) {
        // Set custom priorities based on page type
        const url = item.url;

        // Real per-url <lastmod> from git (null when shallow/unresolved, in
        // which case we leave lastmod off — never fake "today"). Computed once
        // and carried through every branch's `{ ...item }` spread below.
        const lastmod = lastmodForUrl(url);
        if (lastmod) item.lastmod = lastmod;
        else delete item.lastmod;

        // Homepage - highest priority
        if (url === 'https://thevalleycleanteam.com/' || url === 'https://thevalleycleanteam.com') {
          return { ...item, priority: 1.0, changefreq: 'daily' };
        }

        // Main service pages - very high priority
        if (url.includes('/services') || url.includes('/pricing') || url.includes('/contact')) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }

        // Location hub page
        if (url.includes('/locations') && !url.includes('-cleaning')) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }

        // Main city location pages (huntsville-cleaning, nashville-cleaning, etc.)
        if (url.match(/\/(huntsville|nashville|madison|athens|muscle-shoals|mountain-brook)-cleaning\/?$/)) {
          return { ...item, priority: 0.85, changefreq: 'weekly' };
        }

        // Service + location combo pages (high commercial value)
        if (url.includes('weekly-cleaning') ||
          url.includes('recurring-maid') ||
          url.includes('same-day-cleaning') ||
          url.includes('move-out-cleaning') ||
          url.includes('deep-cleaning')) {
          return { ...item, priority: 0.8, changefreq: 'weekly' };
        }

        // Neighborhood pages
        if (url.includes('hampton-cove') ||
          url.includes('jones-valley') ||
          url.includes('belle-meade') ||
          url.includes('green-hills') ||
          url.includes('crestline') ||
          url.includes('limestone-county') ||
          url.includes('tanner-elkmont')) {
          return { ...item, priority: 0.75, changefreq: 'weekly' };
        }

        // Specialty service pages
        if (url.includes('airbnb-cleaning') ||
          url.includes('office-cleaning') ||
          url.includes('post-construction') ||
          url.includes('senior-cleaning') ||
          url.includes('luxury-cleaning')) {
          return { ...item, priority: 0.7, changefreq: 'weekly' };
        }

        // About page
        if (url.includes('/about')) {
          return { ...item, priority: 0.6, changefreq: 'monthly' };
        }

        // Blog pages
        if (url.includes('/blog')) {
          return { ...item, priority: 0.5, changefreq: 'monthly' };
        }

        // Default
        return { ...item, priority: 0.7, changefreq: 'weekly' };
      }
    })
  ],

  build: {
    format: 'directory',
    inlineStylesheets: 'always'
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel()
});
