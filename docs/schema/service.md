# Service Schema Template

Use this template for ALL service pages (combined with LocalBusiness when location-specific).

## Base Service Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "[SERVICE-TYPE]",
  "name": "[SERVICE-NAME] in [CITY], [STATE]",
  "description": "[SERVICE-DESCRIPTION - 150-300 characters]",
  "url": "https://thevalleycleanteam.com/services/[SERVICE-SLUG]/",
  "provider": {
    "@type": "LocalBusiness",
    "@id": "https://thevalleycleanteam.com/#organization",
    "name": "The Valley Clean Team"
  },
  "areaServed": {
    "@type": "State",
    "name": "Alabama"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "[SERVICE-NAME] Packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "[PACKAGE-1-NAME]",
        "description": "[PACKAGE-1-DESCRIPTION]",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "[STARTING-PRICE]",
          "priceCurrency": "USD",
          "minPrice": "[MIN-PRICE]"
        }
      }
    ]
  },
  "termsOfService": "https://thevalleycleanteam.com/terms/",
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "08:00",
    "closes": "18:00"
  }
}
```

## Service-Specific Templates

### Residential Cleaning
```json
{
  "@type": "Service",
  "serviceType": "HousekeepingService",
  "name": "Residential House Cleaning",
  "description": "Professional residential cleaning services including regular maintenance cleaning, deep cleaning, and customized cleaning packages for homes of all sizes.",
  "url": "https://thevalleycleanteam.com/services/residential-cleaning/",
  "category": "Residential Cleaning",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Residential Cleaning Packages",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Standard Cleaning",
        "description": "Regular maintenance cleaning for homes"
      },
      {
        "@type": "Offer",
        "name": "Deep Cleaning",
        "description": "Thorough top-to-bottom cleaning"
      },
      {
        "@type": "Offer",
        "name": "Recurring Cleaning",
        "description": "Weekly, biweekly, or monthly service"
      }
    ]
  }
}
```

### Move-In/Move-Out Cleaning
```json
{
  "@type": "Service",
  "serviceType": "HousekeepingService",
  "name": "Move-In Move-Out Cleaning",
  "description": "Comprehensive cleaning service for rental turnovers, ensuring properties are spotless for new tenants or to secure security deposits.",
  "url": "https://thevalleycleanteam.com/services/move-in-move-out-cleaning/",
  "category": "Move-Out Cleaning",
  "additionalType": "https://schema.org/RentalCleaningService"
}
```

### Commercial Cleaning
```json
{
  "@type": "Service",
  "serviceType": "ProfessionalService",
  "name": "Commercial Office Cleaning",
  "description": "Professional commercial cleaning services for offices, medical facilities, retail spaces, and business properties.",
  "url": "https://thevalleycleanteam.com/services/commercial-cleaning/",
  "category": "Commercial Cleaning",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Commercial Cleaning Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "name": "Office Cleaning",
        "description": "Daily, weekly, or monthly office cleaning"
      },
      {
        "@type": "Offer",
        "name": "Medical Office Cleaning",
        "description": "Healthcare-compliant cleaning services"
      },
      {
        "@type": "Offer",
        "name": "Retail Cleaning",
        "description": "Store and retail space cleaning"
      }
    ]
  }
}
```

### Deep Cleaning
```json
{
  "@type": "Service",
  "serviceType": "HousekeepingService",
  "name": "Deep Cleaning Service",
  "description": "Intensive deep cleaning service that covers every corner of your home, including areas often missed in regular cleaning.",
  "url": "https://thevalleycleanteam.com/services/deep-cleaning/",
  "category": "Deep Cleaning"
}
```

### Emergency Cleaning
```json
{
  "@type": "Service",
  "serviceType": "EmergencyService",
  "name": "Emergency Same-Day Cleaning",
  "description": "Urgent cleaning services available same-day for unexpected situations, last-minute guests, or emergency property turnovers.",
  "url": "https://thevalleycleanteam.com/services/emergency-cleaning/",
  "category": "Emergency Cleaning",
  "hoursAvailable": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    "opens": "07:00",
    "closes": "21:00"
  },
  "availableChannel": {
    "@type": "ServiceChannel",
    "serviceType": "Emergency",
    "availableLanguage": "English"
  }
}
```

### Post-Construction Cleaning
```json
{
  "@type": "Service",
  "serviceType": "ProfessionalService",
  "name": "Post-Construction Cleaning",
  "description": "Specialized cleaning service for newly built or renovated properties, removing construction dust, debris, and preparing spaces for occupancy.",
  "url": "https://thevalleycleanteam.com/services/post-construction-cleaning/",
  "category": "Construction Cleaning"
}
```

### Airbnb/Vacation Rental Cleaning
```json
{
  "@type": "Service",
  "serviceType": "HousekeepingService",
  "name": "Airbnb Vacation Rental Turnover Cleaning",
  "description": "Professional turnover cleaning for short-term rental properties, ensuring 5-star guest experiences with quick turnaround times.",
  "url": "https://thevalleycleanteam.com/services/airbnb-vacation-rental-cleaning/",
  "category": "Vacation Rental Cleaning"
}
```

### Hoarding Cleanup
```json
{
  "@type": "Service",
  "serviceType": "ProfessionalService",
  "name": "Hoarding Cleanup and Deep Clean",
  "description": "Compassionate, thorough hoarding cleanup services with discretion and respect. We help restore homes to safe, livable conditions.",
  "url": "https://thevalleycleanteam.com/services/hoarding-cleanup/",
  "category": "Specialty Cleaning"
}
```

### Foreclosure/REO Cleaning
```json
{
  "@type": "Service",
  "serviceType": "ProfessionalService",
  "name": "Foreclosure and REO Property Cleaning",
  "description": "Bank-ready cleaning services for foreclosed and REO properties, including trash-out, deep cleaning, and property preparation.",
  "url": "https://thevalleycleanteam.com/services/foreclosure-cleaning/",
  "category": "Property Preservation"
}
```

## Combined Service + LocalBusiness (Location-Specific Service Page)

When creating a service page for a specific location (e.g., "Move-Out Cleaning in Athens, AL"), combine both schemas:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": "https://thevalleycleanteam.com/#organization",
      "name": "The Valley Clean Team",
      "url": "https://thevalleycleanteam.com/",
      "telephone": "[PHONE]",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Athens",
        "addressRegion": "AL",
        "addressCountry": "US"
      }
    },
    {
      "@type": "Service",
      "serviceType": "HousekeepingService",
      "name": "Move-Out Cleaning in Athens, AL",
      "description": "Professional move-out cleaning services in Athens, Alabama. Get your security deposit back with our thorough cleaning service.",
      "url": "https://thevalleycleanteam.com/areas/athens/move-out-cleaning/",
      "provider": {
        "@id": "https://thevalleycleanteam.com/#organization"
      },
      "areaServed": {
        "@type": "City",
        "name": "Athens",
        "containedInPlace": {
          "@type": "State",
          "name": "Alabama"
        }
      }
    }
  ]
}
```

## Validation Checklist

- [ ] Valid JSON syntax (use JSONLint)
- [ ] All URLs are absolute and correct
- [ ] Service type matches Schema.org vocabulary
- [ ] Description is unique per page (no duplicates)
- [ ] Provider references main organization
- [ ] Area served matches page location
- [ ] Test in Google Rich Results Test before deploying
