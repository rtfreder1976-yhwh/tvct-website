// Schema Generation Agent
// File: scripts/generate-schema.ts
// Usage: Called by Claude Code to generate appropriate schema for pages

import { LocationData, getLocationData, getNeighborhoodData } from '../src/data/locations';

type PageType = 'service' | 'location-hub' | 'neighborhood' | 'blog' | 'pricing' | 'home';

interface SchemaConfig {
  pageType: PageType;
  url: string;
  title: string;
  description: string;
  
  // For location pages
  hubSlug?: string;
  neighborhoodSlug?: string;
  
  // For service pages
  serviceName?: string;
  serviceType?: string;
  
  // For blog posts
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  
  // For pages with FAQs
  faqs?: Array<{ question: string; answer: string }>;
  
  // For pricing pages
  offers?: Array<{ name: string; price: string; description: string }>;
}

// Company-wide constants
const COMPANY = {
  name: "The Valley Clean Team",
  url: "https://thevalleycleanteam.com",
  logo: "https://thevalleycleanteam.com/images/logo.png",
  phone: "+12565551234",
  email: "hello@thevalleycleanteam.com",
  priceRange: "$$",
  foundingDate: "2020",
  slogan: "Life is messy. We've got this."
};

// Generate LocalBusiness schema
function generateLocalBusinessSchema(config: SchemaConfig, location?: LocationData) {
  const baseSchema: any = {
    "@type": "LocalBusiness",
    "@id": `${COMPANY.url}/#organization`,
    "name": COMPANY.name,
    "url": config.url,
    "logo": COMPANY.logo,
    "telephone": location?.phone || COMPANY.phone,
    "email": COMPANY.email,
    "priceRange": COMPANY.priceRange,
    "description": config.description,
    "image": `${COMPANY.url}/images/team-cleaning.webp`,
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
    ],
    "sameAs": [
      "https://www.facebook.com/thevalleycleanteam",
      "https://www.instagram.com/thevalleycleanteam"
    ]
  };

  if (location) {
    baseSchema.address = {
      "@type": "PostalAddress",
      "addressLocality": location.city,
      "addressRegion": location.stateAbbr,
      "postalCode": location.zip,
      "addressCountry": "US"
    };
    
    baseSchema.geo = {
      "@type": "GeoCoordinates",
      "latitude": location.lat,
      "longitude": location.lng
    };
    
    baseSchema.areaServed = location.neighborhoods.map(n => ({
      "@type": "City",
      "name": n.name
    }));
    
    if (location.rating && location.reviewCount) {
      baseSchema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": location.rating,
        "reviewCount": location.reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      };
    }
  }

  return baseSchema;
}

// Generate Service schema
function generateServiceSchema(config: SchemaConfig) {
  return {
    "@type": "Service",
    "serviceType": config.serviceType || "HousekeepingService",
    "name": config.serviceName || config.title,
    "description": config.description,
    "url": config.url,
    "provider": {
      "@id": `${COMPANY.url}/#organization`
    },
    "areaServed": {
      "@type": "State",
      "name": "Alabama"
    }
  };
}

// Generate Article/BlogPosting schema
function generateArticleSchema(config: SchemaConfig) {
  return {
    "@type": "BlogPosting",
    "headline": config.title,
    "description": config.description,
    "url": config.url,
    "datePublished": config.publishDate || new Date().toISOString(),
    "dateModified": config.modifiedDate || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": COMPANY.name,
      "url": COMPANY.url
    },
    "publisher": {
      "@type": "Organization",
      "name": COMPANY.name,
      "logo": {
        "@type": "ImageObject",
        "url": COMPANY.logo
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": config.url
    }
  };
}

// Generate FAQ schema
function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// Generate BreadcrumbList schema
function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Main schema generator function
export function generateSchema(config: SchemaConfig): string {
  const schemas: any[] = [];
  
  switch (config.pageType) {
    case 'home':
      schemas.push(generateLocalBusinessSchema(config));
      schemas.push({
        "@type": "Organization",
        "@id": `${COMPANY.url}/#organization`,
        "name": COMPANY.name,
        "url": COMPANY.url,
        "logo": COMPANY.logo,
        "foundingDate": COMPANY.foundingDate,
        "slogan": COMPANY.slogan
      });
      break;
      
    case 'service':
      schemas.push(generateLocalBusinessSchema(config));
      schemas.push(generateServiceSchema(config));
      break;
      
    case 'location-hub':
      if (config.hubSlug) {
        const location = getLocationData(config.hubSlug);
        schemas.push(generateLocalBusinessSchema(config, location));
      }
      break;
      
    case 'neighborhood':
      if (config.hubSlug) {
        const parentLocation = getLocationData(config.hubSlug);
        schemas.push(generateLocalBusinessSchema(config, parentLocation));
        
        // Add breadcrumbs for neighborhoods
        schemas.push(generateBreadcrumbSchema([
          { name: "Home", url: COMPANY.url },
          { name: "Areas", url: `${COMPANY.url}/areas/` },
          { name: parentLocation.city, url: `${COMPANY.url}/areas/${config.hubSlug}/` },
          { name: config.title.replace(' Cleaning Services', ''), url: config.url }
        ]));
      }
      break;
      
    case 'blog':
      schemas.push(generateArticleSchema(config));
      break;
      
    case 'pricing':
      schemas.push(generateLocalBusinessSchema(config));
      if (config.offers) {
        schemas.push({
          "@type": "Service",
          "name": "Cleaning Services",
          "provider": { "@id": `${COMPANY.url}/#organization` },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Cleaning Packages",
            "itemListElement": config.offers.map(offer => ({
              "@type": "Offer",
              "name": offer.name,
              "description": offer.description,
              "price": offer.price,
              "priceCurrency": "USD"
            }))
          }
        });
      }
      break;
  }
  
  // Add FAQ schema if FAQs provided
  if (config.faqs && config.faqs.length > 0) {
    schemas.push(generateFAQSchema(config.faqs));
  }
  
  // Return formatted JSON-LD
  const schemaObject = {
    "@context": "https://schema.org",
    "@graph": schemas
  };
  
  return JSON.stringify(schemaObject, null, 2);
}

// CLI usage example
// ts-node scripts/generate-schema.ts --type=neighborhood --hub=huntsville --neighborhood=madison

if (require.main === module) {
  const args = process.argv.slice(2);
  const config: SchemaConfig = {
    pageType: 'service',
    url: 'https://thevalleycleanteam.com/',
    title: 'Test Page',
    description: 'Test description'
  };
  
  args.forEach(arg => {
    const [key, value] = arg.replace('--', '').split('=');
    (config as any)[key] = value;
  });
  
  console.log(generateSchema(config));
}

export default generateSchema;
