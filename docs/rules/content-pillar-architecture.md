# Content Pillar Architecture Guide

## Overview

Content pillars are comprehensive "hub" pages that cover a topic in depth, with supporting "cluster" content that links back to the pillar. This structure builds topical authority, which Google rewards with higher rankings.

## Pillar Structure

```
[PILLAR PAGE] ← Main hub, 2000-4000 words
    ├── [CLUSTER 1] ← Supporting content, 1000-2000 words
    ├── [CLUSTER 2] 
    ├── [CLUSTER 3]
    ├── [CLUSTER 4]
    └── [CLUSTER 5+]
```

## The Valley Clean Team Content Pillars

### Pillar 1: Residential Cleaning Hub

**Pillar Page:** `/guides/residential-cleaning-guide/`
**Title:** "The Complete Guide to Professional House Cleaning in [Market]"
**Word Count:** 3,000-4,000 words

**Sections to Include:**
1. Introduction to professional house cleaning
2. Types of residential cleaning services
3. What's included in standard vs. deep cleaning
4. How often should you have your house cleaned?
5. How to choose a cleaning service
6. What to expect on cleaning day
7. How to prepare for cleaners
8. Pricing overview
9. FAQs

**Cluster Content:**
- `/blog/how-much-does-house-cleaning-cost/` - Pricing deep dive
- `/blog/weekly-vs-biweekly-vs-monthly-cleaning/` - Frequency guide
- `/blog/how-to-prepare-home-for-cleaners/` - Preparation tips
- `/blog/what-to-look-for-in-cleaning-service/` - Selection criteria
- `/blog/house-cleaning-checklist/` - What cleaners should do
- `/blog/green-cleaning-products-guide/` - Eco-friendly options

**Internal Linking:**
- Pillar links OUT to all cluster pages
- Each cluster links BACK to pillar
- Clusters link to relevant service pages
- Clusters interlink where relevant

---

### Pillar 2: Move-In/Move-Out Cleaning Hub

**Pillar Page:** `/guides/move-out-cleaning-guide/`
**Title:** "The Ultimate Move-Out Cleaning Guide: Get Your Full Deposit Back"
**Word Count:** 2,500-3,500 words

**Sections to Include:**
1. Why move-out cleaning matters
2. Move-out cleaning vs. regular cleaning
3. Complete move-out cleaning checklist (room by room)
4. DIY vs. professional move-out cleaning
5. How landlords inspect for deposits
6. Timeline: When to schedule move-out cleaning
7. Cost breakdown
8. Move-in cleaning essentials
9. FAQs

**Cluster Content:**
- `/blog/move-out-cleaning-checklist/` - Printable checklist
- `/blog/how-to-get-security-deposit-back/` - Deposit tips
- `/blog/what-landlords-look-for-inspection/` - Inspection guide
- `/blog/move-out-cleaning-cost-[city]/` - Local pricing (per market)
- `/blog/move-in-cleaning-new-home/` - Move-in specific guide
- `/blog/apartment-move-out-cleaning-tips/` - Apartment-specific

---

### Pillar 3: Commercial Cleaning Hub

**Pillar Page:** `/guides/commercial-cleaning-guide/`
**Title:** "Commercial Cleaning Services: The Complete Business Guide"
**Word Count:** 3,000-4,000 words

**Sections to Include:**
1. What is commercial cleaning?
2. Types of commercial cleaning services
3. Industries we serve (office, medical, retail, etc.)
4. How often should businesses be cleaned?
5. Day porter vs. nightly cleaning
6. Green commercial cleaning
7. Compliance and certifications
8. Choosing a commercial cleaner
9. Contract vs. on-demand services
10. Pricing models

**Cluster Content:**
- `/blog/office-cleaning-frequency-guide/` - How often to clean
- `/blog/medical-office-cleaning-standards/` - Healthcare compliance
- `/blog/commercial-cleaning-checklist/` - What's included
- `/blog/janitorial-vs-commercial-cleaning/` - Terminology guide
- `/blog/green-office-cleaning/` - Eco-friendly business cleaning
- `/blog/restaurant-cleaning-requirements/` - Food service cleaning

---

### Pillar 4: Deep Cleaning Hub

**Pillar Page:** `/guides/deep-cleaning-guide/`
**Title:** "Deep Cleaning Your Home: Everything You Need to Know"
**Word Count:** 2,500-3,000 words

**Sections to Include:**
1. What is deep cleaning?
2. Deep cleaning vs. standard cleaning
3. Room-by-room deep cleaning breakdown
4. When do you need deep cleaning?
5. How long does deep cleaning take?
6. Preparing for a deep clean
7. Seasonal deep cleaning schedule
8. Post-event/post-party deep cleaning
9. Pricing guide

**Cluster Content:**
- `/blog/deep-cleaning-checklist/` - Comprehensive checklist
- `/blog/spring-cleaning-guide/` - Seasonal deep clean
- `/blog/post-party-cleaning-tips/` - Event cleanup
- `/blog/deep-clean-kitchen/` - Kitchen focus
- `/blog/deep-clean-bathroom/` - Bathroom focus
- `/blog/how-often-deep-clean-home/` - Frequency guide

---

### Pillar 5: Specialty Cleaning Hub

**Pillar Page:** `/guides/specialty-cleaning-services/`
**Title:** "Specialty Cleaning Services: When You Need More Than a Regular Clean"
**Word Count:** 2,500-3,000 words

**Sections to Include:**
1. What are specialty cleaning services?
2. Post-construction cleaning explained
3. Airbnb/vacation rental cleaning
4. Hoarding cleanup services
5. Emergency and same-day cleaning
6. Foreclosure and REO cleaning
7. Estate cleaning services
8. When to call specialists vs. regular cleaners
9. Pricing for specialty services

**Cluster Content:**
- `/blog/post-construction-cleaning-what-to-expect/`
- `/blog/airbnb-turnover-cleaning-checklist/`
- `/blog/hoarding-cleanup-guide/` - Compassionate approach
- `/blog/same-day-emergency-cleaning/`
- `/blog/foreclosure-cleaning-services/`
- `/blog/after-renovation-cleaning/`

---

## Content Template: Pillar Page

```astro
---
// Pillar Page Template
// File: src/pages/guides/[pillar-slug].astro

import BaseLayout from '../../layouts/BaseLayout.astro';
import TableOfContents from '../../components/TableOfContents.astro';
import CTABox from '../../components/CTABox.astro';
import RelatedContent from '../../components/RelatedContent.astro';

const { pillar } = Astro.params;
const pillarData = getPillarData(pillar);

const title = pillarData.title;
const description = pillarData.metaDescription;
const canonicalURL = `https://thevalleycleanteam.com/guides/${pillar}/`;

// Article schema for pillar pages
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Organization",
    "name": "The Valley Clean Team"
  },
  "publisher": {
    "@type": "Organization",
    "name": "The Valley Clean Team",
    "logo": {
      "@type": "ImageObject",
      "url": "https://thevalleycleanteam.com/images/logo.png"
    }
  },
  "datePublished": pillarData.publishDate,
  "dateModified": pillarData.modifiedDate,
  "mainEntityOfPage": canonicalURL
};
---

<BaseLayout title={title} description={description} canonicalURL={canonicalURL}>
  <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
  
  <article class="pillar-content">
    <header class="pillar-header">
      <div class="container">
        <h1>{pillarData.h1}</h1>
        <p class="pillar-intro">{pillarData.intro}</p>
        <div class="pillar-meta">
          <span>Last Updated: {pillarData.modifiedDate}</span>
          <span>•</span>
          <span>{pillarData.readTime} min read</span>
        </div>
      </div>
    </header>
    
    <div class="container content-layout">
      <aside class="toc-sidebar">
        <TableOfContents headings={pillarData.headings} />
        <CTABox 
          heading="Get a Free Quote"
          text="Ready to experience professional cleaning?"
          buttonText="Get Quote"
          buttonHref="/get-quote/"
        />
      </aside>
      
      <main class="pillar-body">
        <!-- Content sections rendered from CMS/data -->
        {pillarData.sections.map((section) => (
          <section id={section.id}>
            <h2>{section.heading}</h2>
            <Fragment set:html={section.content} />
          </section>
        ))}
        
        <!-- Related cluster content -->
        <section class="related-content">
          <h2>Related Articles</h2>
          <RelatedContent articles={pillarData.clusterContent} />
        </section>
      </main>
    </div>
  </article>
  
  <CTASection 
    heading="Ready to Get Started?"
    subheading="Get your free, no-obligation quote today."
  />
</BaseLayout>
```

---

## Content Template: Cluster Page (Blog Post)

```astro
---
// Cluster Page Template
// File: src/pages/blog/[...slug].astro

import BlogLayout from '../../layouts/BlogLayout.astro';
import AuthorBox from '../../components/AuthorBox.astro';
import RelatedPosts from '../../components/RelatedPosts.astro';
import CTABox from '../../components/CTABox.astro';

const { slug } = Astro.params;
const post = await getPostBySlug(slug);

// Get parent pillar for internal linking
const parentPillar = getParentPillar(post.category);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.title,
  "description": post.description,
  "author": {
    "@type": "Organization",
    "name": "The Valley Clean Team"
  },
  "datePublished": post.publishDate,
  "dateModified": post.modifiedDate
};
---

<BlogLayout title={post.title} description={post.description}>
  <script type="application/ld+json" set:html={JSON.stringify(articleSchema)} />
  
  <article class="blog-post">
    <header>
      <nav class="breadcrumbs">
        <a href="/">Home</a> / 
        <a href="/blog/">Blog</a> / 
        <a href={parentPillar.href}>{parentPillar.name}</a> / 
        <span>{post.title}</span>
      </nav>
      
      <h1>{post.title}</h1>
      <p class="post-meta">
        Updated {post.modifiedDate} • {post.readTime} min read
      </p>
    </header>
    
    <div class="post-content">
      <Fragment set:html={post.content} />
      
      <!-- Link back to pillar page -->
      <aside class="pillar-link-box">
        <p>📚 <strong>Want to learn more?</strong> Read our comprehensive 
        <a href={parentPillar.href}>{parentPillar.title}</a>.</p>
      </aside>
    </div>
    
    <footer>
      <AuthorBox />
      <RelatedPosts posts={post.relatedPosts} />
    </footer>
  </article>
  
  <CTABox />
</BlogLayout>
```

---

## Internal Linking Rules

### From Pillar Pages:
1. Link to EVERY cluster article at least once
2. Link to relevant service pages (e.g., `/services/deep-cleaning/`)
3. Link to location pages when mentioning markets
4. Use descriptive anchor text with keywords

### From Cluster Pages:
1. ALWAYS link back to parent pillar (required)
2. Link to 2-3 other related cluster articles
3. Link to relevant service page (conversion path)
4. Link to location pages if locally-focused

### Anchor Text Guidelines:
```html
<!-- ✅ GOOD - Descriptive, keyword-rich -->
<a href="/guides/move-out-cleaning-guide/">complete move-out cleaning guide</a>
<a href="/services/deep-cleaning/">professional deep cleaning services</a>

<!-- ❌ BAD - Generic, non-descriptive -->
<a href="/guides/move-out-cleaning-guide/">click here</a>
<a href="/services/deep-cleaning/">learn more</a>
```

---

## Content Creation Workflow

### Step 1: Plan Pillar Structure
1. Define pillar topic
2. List 5-10 cluster article ideas
3. Map internal links between content
4. Identify target keywords for each piece

### Step 2: Create Pillar Page First
1. Write comprehensive 3,000+ word guide
2. Include all cluster topics as sections
3. Add CTA boxes and conversion points
4. Implement schema markup
5. Publish and index

### Step 3: Create Cluster Content
1. Write cluster articles (1,000-2,000 words)
2. Link back to pillar page
3. Link to other relevant clusters
4. Link to service/location pages
5. Publish and internal link from pillar

### Step 4: Update and Maintain
1. Review pillar monthly for updates
2. Add new cluster content quarterly
3. Update internal links as content grows
4. Refresh outdated information

---

## SEO Checklist for Content Pillars

### Pillar Page:
- [ ] H1 contains primary keyword
- [ ] Title tag under 60 characters
- [ ] Meta description 150-160 characters
- [ ] URL is short and keyword-focused
- [ ] Table of contents with jump links
- [ ] Article schema implemented
- [ ] Links to all cluster content
- [ ] CTAs present (minimum 2)
- [ ] Internal links to services
- [ ] FAQ section with FAQ schema

### Cluster Pages:
- [ ] Links back to parent pillar
- [ ] Links to 2-3 sibling clusters
- [ ] Link to relevant service page
- [ ] BlogPosting schema implemented
- [ ] Breadcrumb navigation
- [ ] Shares unique targeting keyword
- [ ] CTA present
