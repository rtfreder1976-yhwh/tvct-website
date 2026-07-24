import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

// ---------------------------------------------------------------------------
// Real per-URL <lastmod> from git history.
// ---------------------------------------------------------------------------
// Previously the sitemap stamped `lastmod: new Date()` on EVERY url, so every
// deploy claimed all ~200 pages changed "today". Crawlers (and AI freshness
// scoring) learn to distrust a lastmod that is always today, so it became
// noise. Instead we read each page's true last-commit date from git.
//
// Shallow-clone guard: Vercel shallow-clones by default (git depth 1), which
// would collapse every file's "last commit" to the single most recent commit —
// worse than useless. If we detect a shallow repo (or git is unavailable), we
// disable git dates entirely and OMIT lastmod (a neutral "unknown"), never
// faking today. To get real dates on Vercel, set the env var
// VERCEL_DEEP_CLONE=1 (or increase fetch depth) so full history is present.
const projectRoot = fileURLToPath(new URL('.', import.meta.url));

function git(args) {
  return execFileSync('git', args, { cwd: projectRoot, encoding: 'utf8' }).trim();
}

// gitDatesEnabled is true only when git works AND the clone has full history.
let gitDatesEnabled = false;
try {
  gitDatesEnabled = git(['rev-parse', '--is-shallow-repository']) === 'false';
} catch {
  gitDatesEnabled = false; // git missing / not a repo → omit lastmod
}

const gitDateCache = new Map();

// Last commit date (ISO 8601) for a single repo-relative file, or null.
function gitDate(relPath) {
  if (!gitDatesEnabled) return null;
  if (gitDateCache.has(relPath)) return gitDateCache.get(relPath);
  let date = null;
  try {
    const abs = fileURLToPath(new URL(relPath, import.meta.url));
    if (existsSync(abs)) {
      const iso = git(['log', '-1', '--format=%cI', '--', relPath]);
      if (iso) date = iso;
    }
  } catch { /* leave null → lastmod omitted for this url */ }
  gitDateCache.set(relPath, date);
  return date;
}

// Most recent commit date across several files (for data-driven pages whose
// content changes when any of their source/data files change). Returns null if
// none resolve.
function latestGitDate(relPaths) {
  let best = null;
  for (const p of relPaths) {
    const d = gitDate(p);
    // Compare by absolute instant, not string order: `git %cI` emits the
    // committer's local offset (e.g. -05:00), so two ISO strings can sort
    // wrong relative to their true UTC time and pick a stale date.
    if (d && (!best || Date.parse(d) > Date.parse(best))) best = d;
  }
  return best;
}

// Map a sitemap URL to the repo-relative source file(s) that determine its
// freshness, then return the git lastmod. Returns null when we can't resolve a
// url to a file (→ lastmod omitted, which is safe/neutral).
function lastmodForUrl(url) {
  if (!gitDatesEnabled) return null;

  const path = new URL(url).pathname.replace(/\/$/, ''); // trailingSlash: never

  // Homepage
  if (path === '' || path === '/') return gitDate('./src/pages/index.astro');

  // /blog index (blog.astro) vs individual posts (blog/<slug>.astro)
  if (path === '/blog') return gitDate('./src/pages/blog.astro');

  // /locations/<city>/<slug> is served by the SSR dynamic route
  // [city]/[slug].astro, driven by locations.json + services.json. There is no
  // per-url file, so key freshness on the route file + both data files.
  if (/^\/locations\/[^/]+\/[^/]+$/.test(path)) {
    return latestGitDate([
      './src/pages/locations/[city]/[slug].astro',
      './src/data/locations.json',
      './src/data/services.json',
    ]);
  }

  // Everything else maps directly to a concrete .astro file: try
  // `<path>.astro` first, then `<path>/index.astro`.
  const rel = `./src/pages${path}`;
  return gitDate(`${rel}.astro`) ?? gitDate(`${rel}/index.astro`);
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

// https://astro.build/config
export default defineConfig({
  site: 'https://thevalleycleanteam.com',
  trailingSlash: 'never',
  output: 'server',
  prerender: true,

  integrations: [
    tailwind(),
    sitemap({
      // /recurring is the noindex SMS conversion page — exact-path match so the
      // indexable /locations/*/recurring-maid-service pages are NOT excluded.
      filter: (page) => !page.includes('/404') && !page.includes('/Draft') && !page.includes('/careers') && !page.includes('/dashboard') && !page.includes('/thank-you') && !page.includes('/booking-complete') && !page.includes('/api/') && !page.includes('/ads/') && new URL(page).pathname.replace(/\/$/, '') !== '/recurring' && !excludedBlogSlugs.has(new URL(page).pathname.replace(/\/$/, '')),
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
        'https://thevalleycleanteam.com/booking',
        // foreclosure-reo-cleaning has no per-city literal .astro file (unlike
        // every other service) — it's served entirely by the SSR-only
        // [city]/[slug].astro route, so @astrojs/sitemap's automatic
        // prerendered-route discovery never finds it. List each combo here
        // explicitly, or it silently never reaches the sitemap.
        ...[
          'huntsville', 'nashville', 'athens', 'decatur', 'florence',
          'mountain-brook', 'madison', 'muscle-shoals', 'tuscumbia', 'west-nashville',
        ].map((city) => `https://thevalleycleanteam.com/locations/${city}/foreclosure-reo-cleaning`),
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

  adapter: vercel()
});