# SEO Page Checklist

Use this checklist for EVERY new page before publishing.

## Quick Reference

### ✅ Must Have (Required for Every Page)
- [ ] Unique title tag (under 60 characters)
- [ ] Unique meta description (150-160 characters)
- [ ] H1 tag with primary keyword
- [ ] Schema markup (type depends on page)
- [ ] Canonical URL set
- [ ] Internal links (minimum 3)
- [ ] At least one CTA
- [ ] Mobile responsive
- [ ] Page loads under 3 seconds

---

## Detailed Checklist by Category

### 1. Title Tag
- [ ] Under 60 characters
- [ ] Primary keyword at beginning
- [ ] Includes location (for local pages)
- [ ] Brand name at end: `| The Valley Clean Team`
- [ ] Unique (not duplicated on any other page)

**Format:**
```
[Service] in [City], [State] | The Valley Clean Team
```

**Examples:**
```
House Cleaning in Huntsville, AL | The Valley Clean Team (52 chars)
Move-Out Cleaning Athens, Alabama | The Valley Clean Team (56 chars)
Emergency Cleaning Service Madison, AL | The Valley Clean Team (59 chars)
```

### 2. Meta Description
- [ ] 150-160 characters
- [ ] Includes primary keyword naturally
- [ ] Contains call-to-action
- [ ] Mentions location (for local pages)
- [ ] Unique to this page

**Template:**
```
Professional [service] in [City], [State]. [Trust signal]. [Benefit]. [CTA]!
```

**Examples:**
```
Professional house cleaning in Huntsville, AL. Veteran-owned, insured. Same team every visit. Get your free quote today! (119 chars)

Move-out cleaning in Athens, Alabama. Get your deposit back! Thorough cleaning, transparent pricing. Book same-day service! (124 chars)
```

### 3. Heading Structure
- [ ] Only ONE H1 per page
- [ ] H1 contains primary keyword
- [ ] H2s for main sections
- [ ] H3s for subsections
- [ ] Logical hierarchy (no skipping levels)

**Example Structure:**
```
H1: House Cleaning Services in Huntsville, AL
  H2: Our Residential Cleaning Services
    H3: Standard Cleaning
    H3: Deep Cleaning
    H3: Recurring Service
  H2: Why Choose The Valley Clean Team
  H2: Areas We Serve Near Huntsville
  H2: Frequently Asked Questions
```

### 4. URL Structure
- [ ] Lowercase only
- [ ] Hyphens between words (no underscores)
- [ ] Under 75 characters
- [ ] Contains primary keyword
- [ ] No stop words (the, and, of, etc.)
- [ ] No parameters or session IDs

**Patterns:**
```
/services/[service-slug]/
/areas/[hub]/
/areas/[hub]/[neighborhood]/
/blog/[post-slug]/
```

**Examples:**
```
✅ /services/move-in-move-out-cleaning/
✅ /areas/huntsville/madison/
✅ /blog/house-cleaning-cost-huntsville/

❌ /services/Move_In_Move_Out_Cleaning/
❌ /areas/huntsville-alabama-cleaning-services/
❌ /blog?post=123&category=tips
```

### 5. Schema Markup
- [ ] Appropriate type for page
- [ ] Valid JSON-LD syntax
- [ ] Tested in Rich Results Test
- [ ] No errors or warnings

**Schema by Page Type:**

| Page Type | Required Schema |
|-----------|-----------------|
| Homepage | LocalBusiness + Organization |
| Service Page | Service + LocalBusiness |
| Location Hub | LocalBusiness + areaServed |
| Neighborhood | LocalBusiness + Place + BreadcrumbList |
| Blog Post | Article/BlogPosting |
| Pricing | Service + Offer |
| FAQ (any page) | FAQPage (add to existing) |

### 6. Internal Linking
- [ ] Minimum 3 internal links
- [ ] Links to relevant service pages
- [ ] Links to parent/child location pages
- [ ] Links to related blog content
- [ ] Descriptive anchor text (not "click here")
- [ ] No broken links

**Anchor Text Examples:**
```
✅ "our deep cleaning services"
✅ "house cleaning in Madison, AL"
✅ "move-out cleaning checklist"

❌ "click here"
❌ "learn more"
❌ "this page"
```

### 7. Images
- [ ] WebP format
- [ ] Width and height attributes set
- [ ] Alt text with keyword (natural, not stuffed)
- [ ] Descriptive filename
- [ ] Compressed (< 100KB for content images)
- [ ] Lazy loading for below-fold

**Alt Text Examples:**
```
✅ alt="Professional house cleaning team in Huntsville home"
✅ alt="Before and after move-out cleaning in Athens apartment"

❌ alt="cleaning service huntsville al house cleaning maid service"
❌ alt="IMG_2847.jpg"
❌ alt=""
```

### 8. Content Quality
- [ ] Minimum 500 words (service pages)
- [ ] Minimum 1000 words (blog posts)
- [ ] Minimum 2500 words (pillar pages)
- [ ] Primary keyword in first 100 words
- [ ] Keywords used naturally (not stuffed)
- [ ] Unique content (not copied)
- [ ] Answers user intent
- [ ] Includes local references (for local pages)

### 9. Calls to Action
- [ ] Minimum 1 CTA per page
- [ ] Above the fold CTA
- [ ] End of content CTA
- [ ] Phone number clickable (tel: link)
- [ ] CTA buttons have clear action text

**CTA Examples:**
```
✅ "Get Your Free Quote"
✅ "Book Online Now"
✅ "Call (256) 555-1234"

❌ "Submit"
❌ "Click Here"
❌ "Learn More"
```

### 10. Technical SEO
- [ ] Page loads under 3 seconds
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Canonical URL set
- [ ] No noindex tag (unless intentional)
- [ ] HTTPS enabled
- [ ] No duplicate content
- [ ] XML sitemap updated

---

## Page Type Quick Checklists

### Service Page Checklist
```
[ ] Title: [Service] in [City], [State] | The Valley Clean Team
[ ] H1: [Service] in [City], [State]
[ ] Schema: Service + LocalBusiness
[ ] Content: 500+ words
[ ] CTAs: 2+ (hero + end)
[ ] Links: Related services, location pages
[ ] FAQ section with schema
```

### Location Hub Checklist
```
[ ] Title: Cleaning Services in [City], [State] | The Valley Clean Team
[ ] H1: Professional Cleaning Services in [City], [State]
[ ] Schema: LocalBusiness with areaServed
[ ] Content: 800+ words
[ ] Links: All neighborhood pages, services
[ ] Neighborhood list with links
[ ] Local testimonials
```

### Neighborhood Page Checklist
```
[ ] Title: Cleaning Services in [Neighborhood], [State] | The Valley Clean Team
[ ] H1: Cleaning Services in [Neighborhood]
[ ] Schema: LocalBusiness + BreadcrumbList
[ ] Content: 500+ words
[ ] Links: Parent hub, sibling neighborhoods, services
[ ] Zip codes mentioned
[ ] Unique local content
```

### Blog Post Checklist
```
[ ] Title: [Topic] | The Valley Clean Team
[ ] H1: [Engaging headline with keyword]
[ ] Schema: BlogPosting
[ ] Content: 1000+ words
[ ] Links: Parent pillar, 2+ cluster articles, service page
[ ] Feature image with alt text
[ ] Author attribution
[ ] Publish/modified dates
```

---

## Pre-Publish Validation

Run these checks before publishing:

```bash
# Validate HTML
npx html-validate dist/[page].html

# Check for broken links
npx broken-link-checker https://localhost:4321/[page]/

# Validate schema
# Paste JSON-LD at: https://search.google.com/test/rich-results

# Check mobile friendliness
# Use: https://search.google.com/test/mobile-friendly

# Run Lighthouse
npx lighthouse https://localhost:4321/[page]/ --view
```

---

## Common Mistakes to Avoid

### ❌ Don't Do This:
1. Duplicate title tags across pages
2. Missing H1 or multiple H1s
3. Images without alt text
4. Keyword stuffing in content
5. Generic anchor text
6. Missing schema markup
7. Broken internal links
8. Thin content (under 300 words)
9. Missing CTAs
10. Ignoring mobile experience

### ✅ Always Do This:
1. Research target keywords before writing
2. Write for humans first, then optimize
3. Include local signals for local pages
4. Test schema in Rich Results Test
5. Check page speed after changes
6. Update internal links when adding pages
7. Keep content fresh (update dates)
8. Monitor Search Console for errors
