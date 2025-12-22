# The Valley Clean Team - Claude Code Project Instructions

## Project Overview
This is the website for The Valley Clean Team, a veteran-owned and women-owned premium cleaning service operating across multiple markets in Tennessee and Alabama.

**Tagline:** "Life is messy. We've got this."

**Markets Served:**
- Huntsville, AL (primary hub)
- Athens, AL
- Florence/Shoals, AL (Florence, Muscle Shoals, Tuscumbia, Sheffield)
- Mountain Brook/Birmingham, AL
- Nashville, TN

## Critical Rules - ALWAYS FOLLOW

### 1. Performance First (Core Web Vitals)
Before committing ANY changes, verify:
- [ ] Images are WebP format with lazy loading
- [ ] No render-blocking CSS/JS in `<head>`
- [ ] All images have explicit width/height attributes
- [ ] No layout shift (CLS) from dynamic content
- [ ] LCP element loads within 2.5s

Run the performance check: `npm run perf-check` (if available) or manually audit.

### 2. Schema Markup Required
Every new page MUST include appropriate JSON-LD schema. Reference templates in `/docs/schema/`.

**Required schema by page type:**
- Service pages → `LocalBusiness` + `Service` schema
- Location hub pages → `LocalBusiness` with `areaServed`
- Neighborhood pages → `LocalBusiness` + `Place` schema
- Blog/content pages → `Article` + `FAQPage` schema (if FAQs present)
- Pricing pages → `Service` + `Offer` schema

### 3. URL Structure Standards
Follow this exact pattern:
```
/services/[service-slug]/
/areas/[market-hub]/
/areas/[market-hub]/[neighborhood-slug]/
/blog/[category]/[post-slug]/
/pricing/
/about/
/contact/
```

### 4. Internal Linking Rules
- Every location page must link to its parent hub
- Every service page must link to at least 2 related services
- Every blog post must link to relevant service pages
- Use descriptive anchor text with keywords (not "click here")

### 5. Image Standards
- Format: WebP (with JPG/PNG fallback)
- Max width: 1200px for hero images, 800px for content images
- Always include `alt` text with location + service keywords
- Use `loading="lazy"` for below-fold images
- Naming convention: `[service]-[location]-[descriptor].webp`

## File References

### Templates
- Location Hub Template: `/docs/templates/location-hub.astro`
- Neighborhood Page Template: `/docs/templates/neighborhood-page.astro`
- Service Page Template: `/docs/templates/service-page.astro`
- Content Pillar Template: `/docs/templates/content-pillar.astro`

### Schema
- LocalBusiness Schema: `src/components/Schema.astro'
- Service Schema: `/docs/schema/service.json`
- FAQ Schema: `/docs/schema/faq.json`
- Article Schema: `/docs/schema/article.json`

### Rules & Checklists
- Core Web Vitals Checklist: `/docs/rules/core-web-vitals.md`
- SEO Page Checklist: `/docs/rules/seo-checklist.md`
- Content Guidelines: `/docs/rules/content-guidelines.md`

## Service Categories

### Tier 1: Core Services (High Traffic)
- Residential Cleaning
- Commercial Cleaning
- Deep Cleaning
- Move-In/Move-Out Cleaning
- Recurring Cleaning (weekly, biweekly, monthly)

### Tier 2: Specialty Services (Low Competition, High Value)
- Emergency/Same-Day Cleaning
- Post-Construction Cleaning
- Airbnb/Vacation Rental Cleaning
- Hoarding Cleanup
- Foreclosure/REO Cleaning

### Tier 3: Add-On Services
- Organization Services

## Keyword Targeting by Market

### Athens, AL (Priority 1 - Easiest Wins)
Primary: cleaning service Athens AL, house cleaning Athens Alabama, maid service Athens AL
Emergency: emergency cleaning Athens AL, same day cleaning Athens Alabama
Specialty: move out cleaning Athens AL, post-construction cleaning Athens

### Florence/Shoals (Priority 2)
Primary: cleaning service Florence AL, house cleaning Muscle Shoals, maid service Shoals area
Location variations: Tuscumbia, Sheffield, Killen, Rogersville
Specialty: emergency cleaning Florence AL, Airbnb cleaning Shoals

### Huntsville (Priority 3 - Home Base)
Primary: cleaning service Huntsville AL, house cleaning Huntsville, maid service Huntsville
Neighborhoods: Madison, Hampton Cove, Harvest, Meridianville, Owens Cross Roads
Specialty: commercial cleaning Huntsville, office cleaning Huntsville

### Mountain Brook/Birmingham (Priority 4)
Primary: cleaning service Mountain Brook, house cleaning Mountain Brook AL
Neighborhoods: Crestline, English Village, Mountain Brook Village, Cherokee Bend
Specialty: luxury home cleaning Mountain Brook, estate cleaning Birmingham

### Nashville (Priority 5 - Long Term)
Primary: cleaning service Nashville, house cleaning Nashville TN
Neighborhoods: Green Hills, Belle Meade, Brentwood, Franklin, East Nashville
Specialty: Airbnb cleaning Nashville, commercial cleaning Nashville

## Brand Voice & Tone

### Writing Style
- Warm, professional, approachable
- Active voice preferred
- Second person ("you/your") for customer-facing content
- Emphasize trust signals: veteran-owned, women-owned, insured, bonded
- Avoid jargon - speak plainly

### Key Messages
1. Reliability: "Same team, every time"
2. Transparency: "The price you see is the price you pay"
3. Quality: "49-point checklist with post-clean photos"
4. Speed: "We respond in minutes, not days"
5. Trust: "Veteran-owned. Women-owned. Community trusted."

### CTAs
Primary: "Get Your Free Quote"
Secondary: "Book Online Now", "Text Us", "Call Now"

## Contact Information

**Phone (Alabama):** (256) 826-1100
**Phone (Tennessee):** (615) 510-1427
**Email:** hello@thevalleycleanteam.com
**Service Areas:** Huntsville, Athens, Florence, Muscle Shoals, Tuscumbia, Sheffield, Mountain Brook, Birmingham, Nashville

## Agents & Automation

### Performance Agent
When adding new pages, automatically run:
1. Image optimization check
2. Schema validation
3. Internal link audit
4. Meta tag verification

### Schema Agent
When creating pages, automatically generate appropriate JSON-LD based on page type and inject into `<head>`.

### Location Page Agent
When creating location pages:
1. Pull correct market data from config
2. Apply location hub or neighborhood template
3. Generate LocalBusiness schema with correct service area
4. Add internal links to parent hub and related services
5. Generate unique meta title/description with location keywords

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run performance audit
npm run lighthouse

# Validate schema markup
npm run validate-schema
```

## Git Commit Standards

Use conventional commits:
- `feat(location):` - New location page
- `feat(service):` - New service page
- `fix(perf):` - Performance improvements
- `fix(seo):` - SEO fixes
- `content(blog):` - Blog content updates
- `schema:` - Schema markup changes

## Pre-Commit Checklist

Before every commit, verify:
- [ ] All images optimized and in WebP format
- [ ] Schema markup valid (use Google's Rich Results Test)
- [ ] No broken internal links
- [ ] Meta title under 60 characters
- [ ] Meta description under 160 characters
- [ ] H1 contains primary keyword
- [ ] Alt text on all images
- [ ] Mobile responsive verified
- audit all pages