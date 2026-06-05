import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

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
      filter: (page) => !page.includes('/404') && !page.includes('/Draft') && !page.includes('/careers') && !page.includes('/dashboard') && !page.includes('/thank-you') && !page.includes('/api/') && !page.includes('/ads/') && !excludedBlogSlugs.has(new URL(page).pathname.replace(/\/$/, '')),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
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
      ],
      serialize(item) {
        // Set custom priorities based on page type
        const url = item.url;

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