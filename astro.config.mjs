import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import vercel from '@astrojs/vercel';
// https://astro.build/config
export default defineConfig({
  site: 'https://thevalleycleanteam.com',
  trailingSlash: 'never',

  integrations: [
    tailwind(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/Draft') &&
        !page.includes('/admin') &&
        !page.includes('/dashboard'),
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
        if (url.match(/\/(huntsville|nashville|birmingham|madison|athens|muscle-shoals|mountain-brook)-cleaning\/?$/)) {
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