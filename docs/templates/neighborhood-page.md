---
# Neighborhood Page Template
# File: src/pages/areas/[hub]/[neighborhood].astro
# Usage: Create pages for each neighborhood/sub-area under a market hub
---

```astro
---
// Neighborhood Page Template
// This template is for neighborhood pages like /areas/huntsville/madison/

import BaseLayout from '../../../layouts/BaseLayout.astro';
import ServiceCard from '../../../components/ServiceCard.astro';
import CTASection from '../../../components/CTASection.astro';
import FAQSection from '../../../components/FAQSection.astro';
import Breadcrumbs from '../../../components/Breadcrumbs.astro';
import { getLocationData, getNeighborhoodData } from '../../../data/locations';

// Get slugs from URL
const { hub, neighborhood } = Astro.params;

// Fetch data
const parentLocation = getLocationData(hub);
const neighborhoodData = getNeighborhoodData(hub, neighborhood);

// SEO Meta - highly targeted for neighborhood
const title = `Cleaning Services in ${neighborhoodData.name}, ${parentLocation.stateAbbr} | The Valley Clean Team`;
const description = `Professional house cleaning and maid services in ${neighborhoodData.name} near ${parentLocation.city}. Residential, commercial, deep cleaning, move-in/out. Serving ${neighborhoodData.zipCodes.join(', ')}. Free quotes!`;
const canonicalURL = `https://thevalleycleanteam.com/areas/${hub}/${neighborhood}/`;

// Schema markup - LocalBusiness + Place
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `https://thevalleycleanteam.com/areas/${hub}/${neighborhood}/#localbusiness`,
      "name": "The Valley Clean Team",
      "description": `Professional cleaning services in ${neighborhoodData.name}, ${parentLocation.stateAbbr}`,
      "url": canonicalURL,
      "telephone": parentLocation.phone,
      "areaServed": {
        "@type": "Place",
        "name": neighborhoodData.name,
        "containedInPlace": {
          "@type": "City",
          "name": parentLocation.city,
          "containedInPlace": {
            "@type": "State",
            "name": parentLocation.state
          }
        }
      },
      "priceRange": "$$"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://thevalleycleanteam.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Areas",
          "item": "https://thevalleycleanteam.com/areas/"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": parentLocation.city,
          "item": `https://thevalleycleanteam.com/areas/${hub}/`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": neighborhoodData.name,
          "item": canonicalURL
        }
      ]
    }
  ]
};

// Breadcrumbs for UI
const breadcrumbs = [
  { label: "Home", href: "/" },
  { label: "Areas", href: "/areas/" },
  { label: parentLocation.city, href: `/areas/${hub}/` },
  { label: neighborhoodData.name, href: canonicalURL, current: true }
];

// Generate neighborhood-specific content
const neighborhoodServices = [
  {
    title: `House Cleaning in ${neighborhoodData.name}`,
    description: `Regular residential cleaning services for homes in ${neighborhoodData.name}`,
    href: "/services/residential-cleaning/",
    keywords: [`house cleaning ${neighborhoodData.name}`, `maid service ${neighborhoodData.name}`]
  },
  {
    title: `Deep Cleaning in ${neighborhoodData.name}`,
    description: `Thorough deep cleaning for ${neighborhoodData.name} homes`,
    href: "/services/deep-cleaning/",
    keywords: [`deep cleaning ${neighborhoodData.name}`]
  },
  {
    title: `Move-Out Cleaning in ${neighborhoodData.name}`,
    description: `Get your deposit back with our move-out cleaning in ${neighborhoodData.name}`,
    href: "/services/move-in-move-out-cleaning/",
    keywords: [`move out cleaning ${neighborhoodData.name}`, `move in cleaning ${neighborhoodData.name}`]
  },
  {
    title: `Emergency Cleaning in ${neighborhoodData.name}`,
    description: `Same-day cleaning service available in ${neighborhoodData.name}`,
    href: "/services/emergency-cleaning/",
    keywords: [`same day cleaning ${neighborhoodData.name}`, `emergency cleaning ${neighborhoodData.name}`]
  }
];

// Neighborhood-specific FAQs
const faqs = [
  {
    question: `How much does house cleaning cost in ${neighborhoodData.name}?`,
    answer: `House cleaning in ${neighborhoodData.name} typically costs $${neighborhoodData.priceRange?.min || 100}-$${neighborhoodData.priceRange?.max || 250} depending on home size and cleaning type. We offer free, no-obligation quotes.`
  },
  {
    question: `Do you serve all of ${neighborhoodData.name}?`,
    answer: `Yes! We serve all of ${neighborhoodData.name} including zip codes ${neighborhoodData.zipCodes.join(', ')}. We're based nearby in ${parentLocation.city} for fast response times.`
  },
  {
    question: `Can I get same-day cleaning in ${neighborhoodData.name}?`,
    answer: `Yes, we offer same-day and emergency cleaning services in ${neighborhoodData.name}. Contact us as early as possible for best availability.`
  }
];
---

<BaseLayout title={title} description={description} canonicalURL={canonicalURL}>
  <!-- Schema Markup -->
  <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  
  <!-- Breadcrumbs -->
  <Breadcrumbs items={breadcrumbs} />
  
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>Cleaning Services in {neighborhoodData.name}, {parentLocation.stateAbbr}</h1>
      <p class="hero-subtitle">
        Professional house cleaning and maid services near {parentLocation.city}. 
        Serving zip codes {neighborhoodData.zipCodes.join(', ')}.
      </p>
      <div class="hero-cta">
        <a href="/get-quote/" class="btn btn-primary">Get Your Free Quote</a>
        <a href={`tel:${parentLocation.phone}`} class="btn btn-secondary">Call {parentLocation.phoneDisplay}</a>
      </div>
    </div>
  </section>

  <!-- Services Section -->
  <section class="services">
    <div class="container">
      <h2>Cleaning Services Available in {neighborhoodData.name}</h2>
      <p class="section-intro">
        From regular house cleaning to emergency same-day service, The Valley Clean Team 
        brings professional cleaning to {neighborhoodData.name} residents.
      </p>
      
      <div class="services-grid">
        {neighborhoodServices.map((service) => (
          <div class="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <a href={service.href} class="service-link">Learn More →</a>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Why Choose Section -->
  <section class="why-choose">
    <div class="container">
      <h2>Your Local Cleaning Team in {neighborhoodData.name}</h2>
      <div class="content-two-col">
        <div class="content-main">
          <p>
            When you need cleaning services in {neighborhoodData.name}, you want a team that 
            knows the area and can respond quickly. The Valley Clean Team is based right here 
            in {parentLocation.city}, which means:
          </p>
          <ul>
            <li><strong>Fast response times</strong> - We're nearby and can often accommodate same-day requests</li>
            <li><strong>Local knowledge</strong> - We understand {neighborhoodData.name} homes and what they need</li>
            <li><strong>Reliable scheduling</strong> - No long drives means we're always on time</li>
            <li><strong>Community trusted</strong> - Your neighbors in {neighborhoodData.name} already trust us</li>
          </ul>
          <p>
            Whether you need a one-time deep clean, regular weekly service, or emergency 
            same-day cleaning, we're here to help {neighborhoodData.name} residents keep 
            their homes spotless.
          </p>
        </div>
        <div class="content-sidebar">
          <div class="quick-facts">
            <h3>Quick Facts</h3>
            <ul>
              <li><strong>Zip Codes:</strong> {neighborhoodData.zipCodes.join(', ')}</li>
              <li><strong>Parent City:</strong> {parentLocation.city}</li>
              <li><strong>State:</strong> {parentLocation.state}</li>
              <li><strong>Local Phone:</strong> {parentLocation.phoneDisplay}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq">
    <div class="container">
      <h2>Frequently Asked Questions About Cleaning in {neighborhoodData.name}</h2>
      <FAQSection faqs={faqs} />
    </div>
  </section>

  <!-- Related Areas -->
  <section class="related-areas">
    <div class="container">
      <h2>We Also Serve These Areas Near {neighborhoodData.name}</h2>
      <div class="areas-grid">
        {parentLocation.neighborhoods
          .filter(n => n.slug !== neighborhood)
          .slice(0, 6)
          .map((area) => (
            <a href={`/areas/${hub}/${area.slug}/`} class="area-link">
              Cleaning in {area.name} →
            </a>
          ))
        }
      </div>
      <p class="back-link">
        <a href={`/areas/${hub}/`}>← View all {parentLocation.city} area services</a>
      </p>
    </div>
  </section>

  <!-- CTA Section -->
  <CTASection 
    heading={`Ready for a Cleaner Home in ${neighborhoodData.name}?`}
    subheading="Get your free, no-obligation quote today."
    primaryCTA={{ text: "Get Free Quote", href: "/get-quote/" }}
    secondaryCTA={{ text: `Call ${parentLocation.phoneDisplay}`, href: `tel:${parentLocation.phone}` }}
  />
</BaseLayout>

<style>
  .hero {
    background: linear-gradient(135deg, #1B4F72 0%, #2471A3 100%);
    color: white;
    padding: 3rem 1rem;
    text-align: center;
  }
  
  .hero h1 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin-bottom: 1rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
  }
  
  .hero-cta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    justify-content: center;
  }
  
  @media (min-width: 640px) {
    .hero-cta { flex-direction: row; }
  }
  
  .container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  section { padding: 3rem 0; }
  
  h2 {
    font-size: clamp(1.4rem, 3.5vw, 2rem);
    color: #1B4F72;
    margin-bottom: 1rem;
  }
  
  .section-intro {
    color: #666;
    max-width: 700px;
    margin: 0 auto 2rem;
  }
  
  .services-grid {
    display: grid;
    gap: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
  }
  
  .service-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.2s;
  }
  
  .service-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
  
  .service-card h3 {
    color: #2471A3;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  .service-link {
    color: #F39C12;
    font-weight: 600;
    text-decoration: none;
  }
  
  .content-two-col {
    display: grid;
    gap: 2rem;
  }
  
  @media (min-width: 768px) {
    .content-two-col {
      grid-template-columns: 2fr 1fr;
    }
  }
  
  .content-main ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }
  
  .content-main li {
    margin-bottom: 0.5rem;
  }
  
  .quick-facts {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
  }
  
  .quick-facts h3 {
    color: #1B4F72;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .quick-facts ul {
    list-style: none;
    padding: 0;
  }
  
  .quick-facts li {
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .faq { background: #f8f9fa; }
  
  .areas-grid {
    display: grid;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .areas-grid { grid-template-columns: repeat(2, 1fr); }
  }
  
  @media (min-width: 768px) {
    .areas-grid { grid-template-columns: repeat(3, 1fr); }
  }
  
  .area-link {
    display: block;
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    color: #2471A3;
    text-decoration: none;
    transition: background 0.2s;
  }
  
  .area-link:hover {
    background: #f8f9fa;
  }
  
  .back-link {
    text-align: center;
  }
  
  .back-link a {
    color: #666;
  }
  
  .btn {
    display: inline-block;
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
  }
  
  .btn-primary {
    background: #F39C12;
    color: white;
  }
  
  .btn-secondary {
    background: white;
    color: #1B4F72;
  }
</style>
```

## Neighborhood Data Extension

Add this to your `src/data/locations.ts`:

```typescript
// Extended neighborhood data
export interface NeighborhoodExtended {
  name: string;
  slug: string;
  zipCodes: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  description?: string;
  landmarks?: string[];
}

export function getNeighborhoodData(hubSlug: string, neighborhoodSlug: string): NeighborhoodExtended {
  const hub = locations[hubSlug];
  const neighborhood = hub.neighborhoods.find(n => n.slug === neighborhoodSlug);
  
  if (!neighborhood) {
    throw new Error(`Neighborhood ${neighborhoodSlug} not found in ${hubSlug}`);
  }
  
  // Return extended data with defaults
  return {
    ...neighborhood,
    priceRange: neighborhood.priceRange || { min: 100, max: 250 },
    description: neighborhood.description || `Professional cleaning services in ${neighborhood.name}`,
    landmarks: neighborhood.landmarks || []
  };
}

// Generate all neighborhood paths for static generation
export function getAllNeighborhoodPaths() {
  const paths: { params: { hub: string; neighborhood: string } }[] = [];
  
  for (const [hubSlug, hubData] of Object.entries(locations)) {
    for (const neighborhood of hubData.neighborhoods) {
      paths.push({
        params: {
          hub: hubSlug,
          neighborhood: neighborhood.slug
        }
      });
    }
  }
  
  return paths;
}
```

## Static Path Generation

Add this to `src/pages/areas/[hub]/[neighborhood].astro` at the top:

```astro
---
import { getAllNeighborhoodPaths } from '../../../data/locations';

export function getStaticPaths() {
  return getAllNeighborhoodPaths();
}
// ... rest of frontmatter
---
```

## Key SEO Elements

This template includes:

1. **Hyper-local targeting** - H1, title, and description include neighborhood name
2. **Zip code targeting** - Zip codes mentioned for local search
3. **Schema markup** - LocalBusiness + BreadcrumbList
4. **Internal linking** - Links to parent hub and sibling neighborhoods
5. **FAQ schema ready** - Neighborhood-specific FAQs
6. **Unique content** - Each page has unique, location-specific copy
