# Plan: Blog Internal Linking & Untracked Service Pages

## Overview
Two remaining items from Week 4 SEO audit plus cleanup of untracked service pages.

---

## Task 1: Review & Commit Untracked Service Pages (10 files)

### Birmingham (4 pages)
- [ ] `dental-office-cleaning.astro` - Review schema, content quality
- [ ] `same-day-cleaning.astro` - Review schema, content quality
- [ ] `senior-cleaning.astro` - Review schema, content quality
- [ ] `weekly-cleaning.astro` - Review schema, content quality

### Decatur (6 pages)
- [ ] `dental-office-cleaning.astro` - Review schema, content quality
- [ ] `medical-office-cleaning.astro` - Review schema, content quality
- [ ] `office-cleaning.astro` - Review schema, content quality
- [ ] `same-day-cleaning.astro` - Review schema, content quality
- [ ] `senior-cleaning.astro` - Review schema, content quality
- [ ] `weekly-cleaning.astro` - Review schema, content quality

### Validation Checklist (per page)
- [ ] Has proper ServiceLocationLayout or similar template
- [ ] Has FAQPage schema
- [ ] Has Service schema with GeoCoordinates
- [ ] Has internal links to hub page and related services
- [ ] Meta title < 60 chars
- [ ] Meta description < 160 chars

---

## Task 2: Add Internal Links to Location-Specific Blog Posts (30 posts)

### Strategy
Add a "Get Local Cleaning Services" CTA section at the end of each location-specific blog post linking to:
1. The location hub page (e.g., `/locations/athens/`)
2. The most relevant service page based on blog topic

### Blog Posts by Location

#### Athens, AL (6 posts)
| Blog Post | Link To |
|-----------|---------|
| `house-cleaning-cost-athens-al.astro` | `/locations/athens/`, `/locations/athens/recurring-maid-service/` |
| `reliable-cleaning-company-athens-al.astro` | `/locations/athens/`, `/locations/athens/deep-cleaning/` |
| `spring-cleaning-guide-athens-al.astro` | `/locations/athens/`, `/locations/athens/deep-cleaning/` |
| `deep-vs-standard-cleaning-athens-al.astro` | `/locations/athens/`, `/locations/athens/deep-cleaning/` |
| `move-out-cleaning-athens-al.astro` | `/locations/athens/`, `/locations/athens/move-out-cleaning/` |
| `commercial-cleaning-athens-al.astro` | `/locations/athens/`, `/locations/athens/commercial-cleaning/` |

#### Florence, AL (6 posts)
| Blog Post | Link To |
|-----------|---------|
| `house-cleaning-cost-florence-al.astro` | `/locations/florence/`, `/locations/florence/recurring-maid-service/` |
| `reliable-cleaning-company-florence-al.astro` | `/locations/florence/`, `/locations/florence/deep-cleaning/` |
| `spring-cleaning-guide-florence-al.astro` | `/locations/florence/`, `/locations/florence/deep-cleaning/` |
| `deep-vs-standard-cleaning-florence-al.astro` | `/locations/florence/`, `/locations/florence/deep-cleaning/` |
| `move-out-cleaning-florence-al.astro` | `/locations/florence/`, `/locations/florence/move-out-cleaning/` |
| `commercial-cleaning-florence-al.astro` | `/locations/florence/`, `/locations/florence/commercial-cleaning/` |

#### Huntsville, AL (6 posts)
| Blog Post | Link To |
|-----------|---------|
| `house-cleaning-cost-huntsville-al.astro` | `/locations/huntsville/`, `/locations/huntsville/recurring-maid-service/` |
| `reliable-cleaning-company-huntsville-al.astro` | `/locations/huntsville/`, `/locations/huntsville/deep-cleaning/` |
| `spring-cleaning-guide-huntsville-al.astro` | `/locations/huntsville/`, `/locations/huntsville/deep-cleaning/` |
| `deep-vs-standard-cleaning-huntsville-al.astro` | `/locations/huntsville/`, `/locations/huntsville/deep-cleaning/` |
| `move-out-cleaning-huntsville-al.astro` | `/locations/huntsville/`, `/locations/huntsville/move-out-cleaning/` |
| `commercial-cleaning-huntsville-al.astro` | `/locations/huntsville/`, `/locations/huntsville/commercial-cleaning/` |

#### Birmingham, AL (6 posts)
| Blog Post | Link To |
|-----------|---------|
| `house-cleaning-cost-birmingham-al.astro` | `/locations/birmingham/`, `/locations/birmingham/recurring-maid-service/` |
| `reliable-cleaning-company-birmingham-al.astro` | `/locations/birmingham/`, `/locations/birmingham/deep-cleaning/` |
| `spring-cleaning-guide-birmingham-al.astro` | `/locations/birmingham/`, `/locations/birmingham/deep-cleaning/` |
| `deep-vs-standard-cleaning-birmingham-al.astro` | `/locations/birmingham/`, `/locations/birmingham/deep-cleaning/` |
| `move-out-cleaning-birmingham-al.astro` | `/locations/birmingham/`, `/locations/birmingham/move-out-cleaning/` |
| `commercial-cleaning-birmingham-al.astro` | `/locations/birmingham/`, `/locations/birmingham/commercial-cleaning/` |

#### Nashville, TN (6 posts)
| Blog Post | Link To |
|-----------|---------|
| `house-cleaning-cost-nashville-tn.astro` | `/locations/nashville/`, `/locations/nashville/recurring-maid-service/` |
| `reliable-cleaning-company-nashville-tn.astro` | `/locations/nashville/`, `/locations/nashville/deep-cleaning/` |
| `spring-cleaning-guide-nashville-tn.astro` | `/locations/nashville/`, `/locations/nashville/deep-cleaning/` |
| `deep-vs-standard-cleaning-nashville-tn.astro` | `/locations/nashville/`, `/locations/nashville/deep-cleaning/` |
| `move-out-cleaning-nashville-tn.astro` | `/locations/nashville/`, `/locations/nashville/move-out-cleaning/` |
| `commercial-cleaning-nashville-tn.astro` | `/locations/nashville/`, `/locations/nashville/commercial-cleaning/` |

### CTA Section Template
```html
<!-- Local Service CTA -->
<section class="local-cta">
  <h2>Ready for Professional Cleaning in [Location]?</h2>
  <p>The Valley Clean Team serves [Location] and surrounding areas with reliable, thorough cleaning services.</p>
  <div class="cta-links">
    <a href="/locations/[location]/" class="btn btn-primary">View [Location] Services</a>
    <a href="/locations/[location]/[service]/" class="btn btn-secondary">Get [Service] Quote</a>
  </div>
</section>
```

---

## Task 3: Add Internal Links to General Blog Posts (23 posts - Optional/Lower Priority)

These general posts could link to multiple locations. Lower priority but good for SEO.

### High-Impact General Posts
- `house-cleaning-cost-alabama.astro` → Link to all AL location hubs
- `airbnb-hosts-nightmare.astro` → Link to airbnb-cleaning service pages
- `construction-dust-destroying-home.astro` → Link to post-construction pages
- `losing-your-security-deposit.astro` → Link to move-out-cleaning pages
- `green-cleaning-guide.astro` → Link to green-cleaning service pages

---

## Execution Order

### Phase 1: Untracked Service Pages (Est: 30 min)
1. Review all 10 untracked service pages for quality
2. Check schema markup is correct
3. Verify internal links exist
4. Commit and deploy

### Phase 2: Location Blog Internal Links (Est: 1-2 hours)
1. Read one blog post to understand structure
2. Create reusable CTA component or pattern
3. Add CTA to all 30 location-specific blog posts
4. Commit and deploy

### Phase 3: General Blog Links (Optional - Est: 1 hour)
1. Add contextual links to high-impact general posts
2. Commit and deploy

---

## Success Metrics
- [ ] 10 new service pages live and indexed
- [ ] 30 location blogs have internal links to location pages
- [ ] Improved internal link graph (check via Screaming Frog or similar)
