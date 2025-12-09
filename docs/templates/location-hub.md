---
# Location Hub Page Template
# File: src/pages/areas/[hub].astro
# Usage: Create one hub page per major market (huntsville, athens, florence, mountain-brook, nashville)
---

```astro
---
// Location Hub Page Template
// This template is for main market pages like /areas/huntsville/

import BaseLayout from '../../layouts/BaseLayout.astro';
import ServiceCard from '../../components/ServiceCard.astro';
import NeighborhoodCard from '../../components/NeighborhoodCard.astro';
import TestimonialSlider from '../../components/TestimonialSlider.astro';
import CTASection from '../../components/CTASection.astro';
import FAQSection from '../../components/FAQSection.astro';
import { getLocationData } from '../../data/locations';

// Get location slug from URL
const { hub } = Astro.params;

// Fetch location-specific data
const location = getLocationData(hub);

// SEO Meta
const title = `Cleaning Services in ${location.city}, ${location.state} | The Valley Clean Team`;
const description = `Professional house cleaning and maid services in ${location.city}, ${location.state}. Veteran-owned, women-owned. Residential, commercial, move-in/out, and deep cleaning. Free quotes!`;
const canonicalURL = `https://thevalleycleanteam.com/areas/${hub}/`;

// Schema markup
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `https://thevalleycleanteam.com/areas/${hub}/#localbusiness`,
  "name": "The Valley Clean Team",
  "description": description,
  "url": canonicalURL,
  "telephone": location.phone,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": location.city,
    "addressRegion": location.state,
    "postalCode": location.zip,
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": location.lat,
    "longitude": location.lng
  },
  "areaServed": location.neighborhoods.map(n => ({
    "@type": "City",
    "name": n.name
  })),
  "priceRange": "$$",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "09:00",
      "closes": "14:00"
    }
  ]
};
---

<BaseLayout title={title} description={description} canonicalURL={canonicalURL}>
  <!-- Schema Markup -->
  <script type="application/ld+json" set:html={JSON.stringify(localBusinessSchema)} />
  
  <!-- Hero Section -->
  <section class="hero">
    <div class="container">
      <h1>Professional Cleaning Services in {location.city}, {location.state}</h1>
      <p class="hero-subtitle">
        Veteran-owned. Women-owned. Your trusted local cleaning team.
      </p>
      <div class="hero-cta">
        <a href="/get-quote/" class="btn btn-primary">Get Your Free Quote</a>
        <a href={`tel:${location.phone}`} class="btn btn-secondary">Call {location.phoneDisplay}</a>
      </div>
      <div class="trust-badges">
        <span>⭐ {location.rating}/5 ({location.reviewCount}+ Reviews)</span>
        <span>✓ Insured & Bonded</span>
        <span>✓ Background Checked</span>
      </div>
    </div>
  </section>

  <!-- Services Overview -->
  <section class="services-overview">
    <div class="container">
      <h2>Our Cleaning Services in {location.city}</h2>
      <p class="section-intro">
        From regular house cleaning to emergency same-day service, we've got {location.city} covered.
      </p>
      
      <div class="services-grid">
        {location.services.map((service) => (
          <ServiceCard 
            title={service.title}
            description={service.description}
            href={service.href}
            icon={service.icon}
            location={location.city}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- Areas/Neighborhoods We Serve -->
  <section class="neighborhoods">
    <div class="container">
      <h2>Areas We Serve Near {location.city}</h2>
      <p class="section-intro">
        We proudly serve {location.city} and these surrounding communities:
      </p>
      
      <div class="neighborhoods-grid">
        {location.neighborhoods.map((neighborhood) => (
          <NeighborhoodCard
            name={neighborhood.name}
            href={`/areas/${hub}/${neighborhood.slug}/`}
            zipCodes={neighborhood.zipCodes}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- Why Choose Us -->
  <section class="why-choose-us">
    <div class="container">
      <h2>Why {location.city} Chooses The Valley Clean Team</h2>
      
      <div class="benefits-grid">
        <div class="benefit">
          <h3>Same Team, Every Time</h3>
          <p>Your home is cleaned by the same trusted team each visit. They know your preferences and your space.</p>
        </div>
        <div class="benefit">
          <h3>Transparent Pricing</h3>
          <p>The price we quote is the price you pay. No hidden fees, no surprises. Ever.</p>
        </div>
        <div class="benefit">
          <h3>49-Point Checklist</h3>
          <p>Every clean follows our detailed checklist. We send before/after photos so you see exactly what we did.</p>
        </div>
        <div class="benefit">
          <h3>Fast Response</h3>
          <p>We respond to inquiries in minutes, not days. Need same-day service? We'll make it happen.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="testimonials">
    <div class="container">
      <h2>What {location.city} Residents Say</h2>
      <TestimonialSlider location={location.city} />
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq">
    <div class="container">
      <h2>Frequently Asked Questions About Cleaning in {location.city}</h2>
      <FAQSection location={location.city} faqs={location.faqs} />
    </div>
  </section>

  <!-- CTA Section -->
  <CTASection 
    heading={`Ready for a Cleaner Home in ${location.city}?`}
    subheading="Get your free, no-obligation quote today. We'll respond within the hour."
    primaryCTA={{ text: "Get Free Quote", href: "/get-quote/" }}
    secondaryCTA={{ text: `Call ${location.phoneDisplay}`, href: `tel:${location.phone}` }}
  />
</BaseLayout>

<style>
  /* Mobile-first responsive styles */
  .hero {
    background: linear-gradient(135deg, #1B4F72 0%, #2471A3 100%);
    color: white;
    padding: 4rem 1rem;
    text-align: center;
  }
  
  .hero h1 {
    font-size: clamp(1.75rem, 5vw, 3rem);
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
    opacity: 0.9;
    margin-bottom: 2rem;
  }
  
  .hero-cta {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 640px) {
    .hero-cta {
      flex-direction: row;
    }
  }
  
  .trust-badges {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    font-size: 0.875rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  section {
    padding: 4rem 0;
  }
  
  h2 {
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    text-align: center;
    margin-bottom: 1rem;
    color: #1B4F72;
  }
  
  .section-intro {
    text-align: center;
    max-width: 600px;
    margin: 0 auto 2rem;
    color: #666;
  }
  
  .services-grid,
  .neighborhoods-grid,
  .benefits-grid {
    display: grid;
    gap: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .neighborhoods-grid { grid-template-columns: repeat(2, 1fr); }
    .benefits-grid { grid-template-columns: repeat(2, 1fr); }
  }
  
  @media (min-width: 1024px) {
    .services-grid { grid-template-columns: repeat(3, 1fr); }
    .neighborhoods-grid { grid-template-columns: repeat(4, 1fr); }
    .benefits-grid { grid-template-columns: repeat(4, 1fr); }
  }
  
  .benefit {
    text-align: center;
    padding: 1.5rem;
  }
  
  .benefit h3 {
    color: #2471A3;
    margin-bottom: 0.5rem;
  }
  
  .btn {
    display: inline-block;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .btn-primary {
    background: #F39C12;
    color: white;
  }
  
  .btn-secondary {
    background: white;
    color: #1B4F72;
  }
  
  .neighborhoods {
    background: #f8f9fa;
  }
  
  .faq {
    background: #f8f9fa;
  }
</style>
```

## Location Data Structure

Create a data file at `src/data/locations.ts`:

```typescript
// src/data/locations.ts

export interface Neighborhood {
  name: string;
  slug: string;
  zipCodes: string[];
}

export interface Service {
  title: string;
  description: string;
  href: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface LocationData {
  city: string;
  state: string;
  stateAbbr: string;
  zip: string;
  lat: number;
  lng: number;
  phone: string;
  phoneDisplay: string;
  rating: number;
  reviewCount: number;
  neighborhoods: Neighborhood[];
  services: Service[];
  faqs: FAQ[];
}

const locations: Record<string, LocationData> = {
  huntsville: {
    city: "Huntsville",
    state: "Alabama",
    stateAbbr: "AL",
    zip: "35801",
    lat: 34.7304,
    lng: -86.5861,
    phone: "+12565551234",
    phoneDisplay: "(256) 555-1234",
    rating: 4.9,
    reviewCount: 150,
    neighborhoods: [
      { name: "Madison", slug: "madison", zipCodes: ["35758", "35757"] },
      { name: "Hampton Cove", slug: "hampton-cove", zipCodes: ["35763"] },
      { name: "Harvest", slug: "harvest", zipCodes: ["35749"] },
      { name: "Owens Cross Roads", slug: "owens-cross-roads", zipCodes: ["35763"] },
      { name: "Meridianville", slug: "meridianville", zipCodes: ["35759"] },
      { name: "Hazel Green", slug: "hazel-green", zipCodes: ["35750"] },
      { name: "Decatur", slug: "decatur", zipCodes: ["35601", "35603"] },
    ],
    services: [
      { title: "Residential Cleaning", description: "Regular house cleaning tailored to your needs", href: "/services/residential-cleaning/", icon: "home" },
      { title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning service", href: "/services/deep-cleaning/", icon: "sparkles" },
      { title: "Move-In/Move-Out", description: "Get your deposit back or start fresh", href: "/services/move-in-move-out-cleaning/", icon: "truck" },
      { title: "Commercial Cleaning", description: "Office and business cleaning solutions", href: "/services/commercial-cleaning/", icon: "building" },
      { title: "Emergency Cleaning", description: "Same-day service when you need it fast", href: "/services/emergency-cleaning/", icon: "clock" },
      { title: "Post-Construction", description: "New build and renovation cleanup", href: "/services/post-construction-cleaning/", icon: "hammer" },
    ],
    faqs: [
      { question: "How much does house cleaning cost in Huntsville?", answer: "House cleaning in Huntsville typically costs $120-$250 for a standard clean, depending on home size. We offer free quotes with transparent, locked-in pricing." },
      { question: "Do you offer same-day cleaning in Huntsville?", answer: "Yes! We offer same-day and emergency cleaning services throughout Huntsville and Madison County. Contact us early for best availability." },
      { question: "What areas near Huntsville do you serve?", answer: "We serve all of Huntsville plus Madison, Decatur, Hampton Cove, Harvest, Meridianville, Owens Cross Roads, and surrounding areas." },
    ]
  },
  
  athens: {
    city: "Athens",
    state: "Alabama",
    stateAbbr: "AL",
    zip: "35611",
    lat: 34.8026,
    lng: -86.9717,
    phone: "+12565551234",
    phoneDisplay: "(256) 555-1234",
    rating: 5.0,
    reviewCount: 45,
    neighborhoods: [
      { name: "East Limestone", slug: "east-limestone", zipCodes: ["35611"] },
      { name: "Elkmont", slug: "elkmont", zipCodes: ["35620"] },
      { name: "Ardmore", slug: "ardmore", zipCodes: ["35739"] },
      { name: "Tanner", slug: "tanner", zipCodes: ["35671"] },
    ],
    services: [
      { title: "Residential Cleaning", description: "Regular house cleaning tailored to your needs", href: "/services/residential-cleaning/", icon: "home" },
      { title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning service", href: "/services/deep-cleaning/", icon: "sparkles" },
      { title: "Move-In/Move-Out", description: "Get your deposit back or start fresh", href: "/services/move-in-move-out-cleaning/", icon: "truck" },
      { title: "Emergency Cleaning", description: "Same-day service when you need it fast", href: "/services/emergency-cleaning/", icon: "clock" },
    ],
    faqs: [
      { question: "How much does house cleaning cost in Athens, AL?", answer: "House cleaning in Athens typically costs $100-$200 for a standard clean. We offer competitive rates and free quotes." },
      { question: "Do you serve all of Limestone County?", answer: "Yes! We serve Athens and all of Limestone County including Elkmont, Ardmore, Tanner, and East Limestone." },
    ]
  },
  
  florence: {
    city: "Florence",
    state: "Alabama",
    stateAbbr: "AL",
    zip: "35630",
    lat: 34.7998,
    lng: -87.6773,
    phone: "+12565551234",
    phoneDisplay: "(256) 555-1234",
    rating: 4.9,
    reviewCount: 60,
    neighborhoods: [
      { name: "Muscle Shoals", slug: "muscle-shoals", zipCodes: ["35661", "35662"] },
      { name: "Tuscumbia", slug: "tuscumbia", zipCodes: ["35674"] },
      { name: "Sheffield", slug: "sheffield", zipCodes: ["35660"] },
      { name: "Killen", slug: "killen", zipCodes: ["35645"] },
      { name: "Rogersville", slug: "rogersville", zipCodes: ["35652"] },
      { name: "St. Florian", slug: "st-florian", zipCodes: ["35630"] },
    ],
    services: [
      { title: "Residential Cleaning", description: "Regular house cleaning tailored to your needs", href: "/services/residential-cleaning/", icon: "home" },
      { title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning service", href: "/services/deep-cleaning/", icon: "sparkles" },
      { title: "Move-In/Move-Out", description: "Get your deposit back or start fresh", href: "/services/move-in-move-out-cleaning/", icon: "truck" },
      { title: "Commercial Cleaning", description: "Office and business cleaning solutions", href: "/services/commercial-cleaning/", icon: "building" },
      { title: "Emergency Cleaning", description: "Same-day service when you need it fast", href: "/services/emergency-cleaning/", icon: "clock" },
    ],
    faqs: [
      { question: "Do you serve all of the Shoals area?", answer: "Yes! We serve Florence, Muscle Shoals, Tuscumbia, Sheffield, and the entire Shoals area in Lauderdale and Colbert counties." },
      { question: "How much does cleaning cost in Florence?", answer: "House cleaning in Florence typically costs $100-$200 for a standard clean. We offer free quotes with transparent pricing." },
    ]
  },
  
  "mountain-brook": {
    city: "Mountain Brook",
    state: "Alabama",
    stateAbbr: "AL",
    zip: "35213",
    lat: 33.4940,
    lng: -86.7520,
    phone: "+12055551234",
    phoneDisplay: "(205) 555-1234",
    rating: 4.9,
    reviewCount: 85,
    neighborhoods: [
      { name: "Crestline", slug: "crestline", zipCodes: ["35213"] },
      { name: "English Village", slug: "english-village", zipCodes: ["35213"] },
      { name: "Mountain Brook Village", slug: "mountain-brook-village", zipCodes: ["35223"] },
      { name: "Cherokee Bend", slug: "cherokee-bend", zipCodes: ["35223"] },
      { name: "Vestavia Hills", slug: "vestavia-hills", zipCodes: ["35216", "35242"] },
      { name: "Homewood", slug: "homewood", zipCodes: ["35209"] },
    ],
    services: [
      { title: "Luxury Home Cleaning", description: "Premium cleaning for discerning homeowners", href: "/services/residential-cleaning/", icon: "home" },
      { title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning service", href: "/services/deep-cleaning/", icon: "sparkles" },
      { title: "Estate Cleaning", description: "Comprehensive cleaning for large properties", href: "/services/deep-cleaning/", icon: "castle" },
      { title: "Move-In/Move-Out", description: "Get your deposit back or start fresh", href: "/services/move-in-move-out-cleaning/", icon: "truck" },
      { title: "Commercial Cleaning", description: "Office and boutique cleaning", href: "/services/commercial-cleaning/", icon: "building" },
    ],
    faqs: [
      { question: "Do you specialize in luxury home cleaning?", answer: "Yes! We have extensive experience cleaning luxury homes in Mountain Brook and the greater Birmingham area, including estates and high-end properties." },
      { question: "What neighborhoods in Mountain Brook do you serve?", answer: "We serve all Mountain Brook neighborhoods including Crestline, English Village, Mountain Brook Village, Cherokee Bend, and surrounding areas." },
    ]
  },
  
  nashville: {
    city: "Nashville",
    state: "Tennessee",
    stateAbbr: "TN",
    zip: "37203",
    lat: 36.1627,
    lng: -86.7816,
    phone: "+16155551234",
    phoneDisplay: "(615) 555-1234",
    rating: 4.8,
    reviewCount: 120,
    neighborhoods: [
      { name: "Green Hills", slug: "green-hills", zipCodes: ["37215"] },
      { name: "Belle Meade", slug: "belle-meade", zipCodes: ["37205"] },
      { name: "Brentwood", slug: "brentwood", zipCodes: ["37027"] },
      { name: "Franklin", slug: "franklin", zipCodes: ["37064", "37067"] },
      { name: "East Nashville", slug: "east-nashville", zipCodes: ["37206", "37216"] },
      { name: "The Gulch", slug: "the-gulch", zipCodes: ["37203"] },
      { name: "12 South", slug: "12-south", zipCodes: ["37204"] },
      { name: "Germantown", slug: "germantown", zipCodes: ["37208"] },
    ],
    services: [
      { title: "Residential Cleaning", description: "Regular house cleaning tailored to your needs", href: "/services/residential-cleaning/", icon: "home" },
      { title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning service", href: "/services/deep-cleaning/", icon: "sparkles" },
      { title: "Move-In/Move-Out", description: "Get your deposit back or start fresh", href: "/services/move-in-move-out-cleaning/", icon: "truck" },
      { title: "Airbnb Turnover", description: "Quick turnover for short-term rentals", href: "/services/airbnb-vacation-rental-cleaning/", icon: "key" },
      { title: "Commercial Cleaning", description: "Office and business cleaning solutions", href: "/services/commercial-cleaning/", icon: "building" },
      { title: "Emergency Cleaning", description: "Same-day service when you need it fast", href: "/services/emergency-cleaning/", icon: "clock" },
    ],
    faqs: [
      { question: "How much does house cleaning cost in Nashville?", answer: "House cleaning in Nashville typically costs $150-$300 for a standard clean, depending on home size and location. We offer free quotes." },
      { question: "Do you offer Airbnb turnover cleaning in Nashville?", answer: "Yes! We specialize in short-term rental turnovers throughout Nashville. Fast turnaround times and reliable service for hosts." },
    ]
  },
};

export function getLocationData(slug: string): LocationData {
  return locations[slug];
}

export function getAllLocationSlugs(): string[] {
  return Object.keys(locations);
}
```

## Usage

1. Save template as `src/pages/areas/[hub].astro`
2. Create data file at `src/data/locations.ts`
3. Astro will automatically generate pages for each location in the data
4. Access via `/areas/huntsville/`, `/areas/athens/`, etc.
