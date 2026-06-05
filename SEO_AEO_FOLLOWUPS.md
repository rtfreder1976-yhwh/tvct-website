# The Valley Clean Team — SEO/AEO Follow-Ups & Founder's Checklist

_Last updated: 2026-06-05. Companion to the June 2026 SEO/AEO/conversion overhaul (11 commits, all deployed to production)._

---

## ✅ Already done & verified live (no action needed)
- 404s / broken links fixed; dead hero image replaced
- Over-length page titles trimmed (services, locations, blog, best-of)
- Self-serving review schema removed; **legit org `aggregateRating` (5.0/146) added**
- Sitemap made date-aware (excludes unpublished + canonicalized posts)
- Quote→Booking **prefill bug fixed**; pricing page funnels to `/get-quote`
- 35 misleading "Book Online" CTAs relabeled "Get Your Free Quote"
- Homepage FAQ mojibake fixed; founding year standardized to 2022
- Keyword cannibalization resolved (8 blog posts canonicalized to money pages)
- Services hub completed (links 10 services); junk "flexible scheduling" service deleted
- Answer-first AEO intros on 5 service pages + Huntsville/Nashville hubs
- **3 new best-of pages** (Athens, Florence/Shoals, Mountain Brook) with real competitors + schema
- `llms.txt` added; all 5 best-of pages cross-linked
- **Vercel firewall: AI crawlers now allowed** (GPTBot/ClaudeBot/PerplexityBot return 200) ✅

---

## 🟢 Your manual follow-ups (do these)

### This week
1. **Google Search Console** — _(sitemap already submitted ✅)_
   - Watch **Indexing → Pages** over the next 1-2 weeks; the new pages and fixed canonicals should get picked up.
   - Use **URL Inspection → Request Indexing** on the 3 new best-of pages to speed them up:
     - `/best-cleaning-company-athens-al`
     - `/best-cleaning-company-florence-al`
     - `/best-cleaning-company-mountain-brook-al`
   - Check **Experience → Core Web Vitals** for real-world (field) LCP once data accumulates.

2. **Validate structured data** (confirm the schema fixes landed):
   - Run a location page + a best-of page + the homepage through
     [Google Rich Results Test](https://search.google.com/test/rich-results).
   - Confirm: no "self-serving review" errors, FAQPage valid, the homepage shows the Organization `aggregateRating`.

3. **Confirm NAP consistency** across Google Business Profile, BBB, Yelp, Facebook:
   - Name: The Valley Clean Team · Phones: AL (256) 826-1100, TN (615) 510-1427
   - Founded **2022** (now consistent on-site — make sure GBP matches)

### In ~1 week (measure the impact)
4. **Re-run the Ahrefs Site Audit** (project #9192626). Expect drops in: 404s,
   "title too long," structured-data errors, "noindex page in sitemap."
5. **Test AEO directly** — ask ChatGPT / Perplexity / Claude:
   - "Who is the best house cleaning company in Huntsville, AL?"
   - "How much does house cleaning cost in the Shoals?"
   - See if TVCT gets named/cited. (Now that AI crawlers are unblocked, this should
     improve over the coming weeks as they re-crawl.)

### Ongoing / when you have time
6. **BookingKoala iframe** (`/booking`) uses a fixed `height:1200px` with `scrolling="no"`.
   Test the full booking flow on a real phone — if it cuts off, the height needs a bump
   or auto-resize. (`src/pages/booking.astro` ~line 218.)
7. **Pick ONE response-time promise.** The site mixes "within 2 hours," "within 24 hours,"
   "in minutes." Recommend standardizing on **"within 2 hours."**

---

## 🟡 Deferred work (good next projects — ask Claude to pick these up)

| Item | Why | Effort |
|---|---|---|
| **Homepage LCP/FCP (~4.1s/3.3s)** | Ranking + conversion. Fonts are already async; needs live Lighthouse to find the real win (likely trimming the large inline critical CSS in `BaseLayout.astro`). Don't guess — measure. | M |
| **Self-host Inter font** | Removes 2 cross-origin font connections. Modest LCP win; do carefully to avoid FOUT. | S |
| **More "vs competitor" pages** | "MaidPro vs", "Merry Maids vs", "The Maids vs" — high-intent AEO queries. You have the maidpro-vs template. | M |
| **Thin dynamic neighborhood pages** | `src/pages/locations/[city]/[slug].astro` fallback pages have little unique content + few internal links. Promote high-value ones to full pages or add unique copy. | M-L |
| **CTA label full standardization** | Beyond the 35 fixed, "Get Free Quote" vs "Get Your Free Quote" vs "See My Price" still vary. Pick one for full consistency. | S |
| **Real named reviews in schema** | Add 3-5 genuine Google reviews (real first names) as `Review` objects on the homepage for richer rich-results. | S |

---

## 📌 Key facts for whoever works on this next
- **Stack:** Astro v6.2.1 + Tailwind, `output: 'server'` + `prerender: true`, deploys on Vercel on push to `main`.
- **Repo:** github.com/rtfreder1976-yhwh/tvct-website
- **Titles:** `BaseLayout` appends ` | Valley Clean Team` (20 chars) only if absent. Keep brand-less titles ≤40, brand-inclusive ≤60.
- **Combo pages:** `services.json` `meta_title_template` drives `/locations/[city]/[slug]`.
- **Sitemap filter** (`astro.config.mjs`) auto-excludes unpublished + canonicalized blog posts — self-maintaining.
- **Vercel firewall** is dashboard-managed; the "Allow AI crawlers" rule lives there.
