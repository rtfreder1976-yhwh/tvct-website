# FAQ Schema Template

Use this template for pages with FAQ sections. FAQ schema can help you win featured snippets.

## Base FAQ Schema

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[QUESTION-TEXT]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[ANSWER-TEXT - Keep under 300 characters for snippet eligibility]"
      }
    }
  ]
}
```

## Service-Specific FAQ Templates

### Residential Cleaning FAQs
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does house cleaning cost in [CITY]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "House cleaning in [CITY] typically costs $120-$250 for a standard clean, depending on home size and condition. The Valley Clean Team offers free quotes with transparent, locked-in pricing."
      }
    },
    {
      "@type": "Question",
      "name": "How often should I have my house professionally cleaned?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most families benefit from biweekly cleaning, which maintains cleanliness without over-cleaning. Weekly is ideal for busy households with pets or children. Monthly works well for smaller spaces or as a supplement to regular tidying."
      }
    },
    {
      "@type": "Question",
      "name": "What's included in a standard house cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our standard cleaning includes dusting all surfaces, vacuuming and mopping floors, bathroom sanitization, kitchen cleaning including appliance exteriors, and general tidying. We follow a 49-point checklist for consistency."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to be home during the cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, you don't need to be home. Many clients provide a key or door code. We're bonded and insured, and the same trusted team cleans your home each visit. We send before/after photos so you can see the results."
      }
    },
    {
      "@type": "Question",
      "name": "Do you bring your own cleaning supplies?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we bring all cleaning supplies and equipment. We use professional-grade, eco-friendly products that are safe for children and pets. If you have preferred products, we're happy to use those instead."
      }
    }
  ]
}
```

### Move-In/Move-Out Cleaning FAQs
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What's included in move-out cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Move-out cleaning includes deep cleaning of all rooms, inside appliances (oven, refrigerator), inside cabinets and closets, baseboards, light fixtures, and window sills. It's designed to meet landlord inspection standards and help secure your deposit."
      }
    },
    {
      "@type": "Question",
      "name": "How long does move-out cleaning take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Move-out cleaning typically takes 3-6 hours depending on home size and condition. A 2-bedroom apartment usually takes 3-4 hours, while a 4-bedroom house may take 5-6 hours."
      }
    },
    {
      "@type": "Question",
      "name": "Can you do same-day move-out cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer same-day and emergency move-out cleaning in [CITY]. Contact us as early as possible, and we'll do our best to accommodate your timeline. Rush availability may vary."
      }
    },
    {
      "@type": "Question",
      "name": "Will move-out cleaning help me get my deposit back?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Professional move-out cleaning significantly improves your chances of getting your full deposit back. We clean to landlord inspection standards and can provide documentation of the cleaning for your records."
      }
    },
    {
      "@type": "Question",
      "name": "How much does move-out cleaning cost in [CITY]?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Move-out cleaning in [CITY] typically ranges from $200-$400 depending on home size and condition. We provide free, no-obligation quotes with transparent pricing—no hidden fees."
      }
    }
  ]
}
```

### Commercial Cleaning FAQs
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How often should an office be professionally cleaned?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most offices benefit from daily or every-other-day cleaning for high-traffic areas. Smaller offices may need cleaning 2-3 times per week. We customize schedules based on your foot traffic, industry requirements, and budget."
      }
    },
    {
      "@type": "Question",
      "name": "Do you offer after-hours office cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer flexible scheduling including early morning, evening, and weekend cleaning to minimize disruption to your business operations. We work around your schedule."
      }
    },
    {
      "@type": "Question",
      "name": "Are you insured for commercial cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, The Valley Clean Team is fully insured and bonded for commercial work. We carry general liability and workers' compensation insurance. Certificates of insurance are available upon request."
      }
    },
    {
      "@type": "Question",
      "name": "Do you clean medical offices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we provide specialized medical office cleaning that meets healthcare facility standards. Our team is trained in proper sanitization procedures and OSHA compliance for medical environments."
      }
    }
  ]
}
```

### Emergency Cleaning FAQs
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Can you clean my house today?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we offer same-day emergency cleaning in [CITY]. Contact us as soon as possible—call or text for fastest response. Availability depends on current bookings, but we prioritize urgent requests."
      }
    },
    {
      "@type": "Question",
      "name": "How quickly can you get here for emergency cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For emergency cleaning requests, we aim to arrive within 2-4 hours when possible. Response time depends on your location and our current schedule. We'll confirm timing when you contact us."
      }
    },
    {
      "@type": "Question",
      "name": "Is there an extra charge for same-day cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Emergency and same-day cleaning may include a rush fee, typically 15-25% above standard rates. We'll provide a clear quote before confirming your booking—no surprise charges."
      }
    }
  ]
}
```

### Pricing Page FAQs
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do you determine cleaning prices?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our prices are based on home size (square footage and bedrooms/bathrooms), cleaning type (standard, deep, move-out), frequency, and current condition. We provide free quotes with locked-in pricing—no hidden fees."
      }
    },
    {
      "@type": "Question",
      "name": "Do you charge by the hour or flat rate?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We use flat-rate pricing so you know exactly what you'll pay before we start. This protects you from unexpected charges and incentivizes our team to work efficiently without cutting corners."
      }
    },
    {
      "@type": "Question",
      "name": "Are there discounts for recurring cleaning?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, recurring customers receive 10-20% off standard rates. Weekly clients save the most, followed by biweekly and monthly. Recurring service also guarantees your preferred time slot."
      }
    },
    {
      "@type": "Question",
      "name": "What payment methods do you accept?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accept all major credit cards, debit cards, and digital payments. Payment is collected after service is completed to your satisfaction. Recurring clients can set up automatic billing."
      }
    }
  ]
}
```

## Implementation Guidelines

### Best Practices
1. **Keep answers concise** - 250-300 characters is ideal for featured snippets
2. **Include location keywords** in questions when appropriate
3. **Match questions to actual user searches** - use "People Also Ask" boxes for ideas
4. **One FAQ schema per page** - don't duplicate across multiple pages
5. **Update answers regularly** - especially pricing and time-sensitive info

### Where to Use FAQ Schema
- Service pages (service-specific questions)
- Location pages (location-specific questions)
- Pricing page (pricing questions)
- Blog posts with FAQ sections
- About page (company questions)

### Validation
Always test in Google's Rich Results Test before deploying:
https://search.google.com/test/rich-results

### Common Mistakes to Avoid
- ❌ Using promotional language in answers
- ❌ Including prices that change frequently
- ❌ Duplicating FAQs across multiple pages
- ❌ Making answers too long (over 500 characters)
- ❌ Not updating outdated information
