# Core Web Vitals Rules & Performance Checklist

## Overview

Google uses Core Web Vitals as ranking factors. Poor performance = lower rankings. This document defines the rules Claude Code MUST follow for every change.

## Target Metrics

| Metric | Target | Maximum Allowed |
|--------|--------|-----------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | 4.0s |
| **INP** (Interaction to Next Paint) | < 200ms | 500ms |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 0.25 |
| **FCP** (First Contentful Paint) | < 1.8s | 3.0s |
| **TTFB** (Time to First Byte) | < 0.8s | 1.8s |

## Mandatory Rules

### Rule 1: Image Optimization

**ALWAYS:**
```astro
<!-- ✅ CORRECT -->
<img 
  src="/images/cleaning-huntsville.webp"
  alt="Professional house cleaning in Huntsville, AL"
  width="800"
  height="600"
  loading="lazy"
  decoding="async"
/>

<!-- Or with Astro's Image component -->
import { Image } from 'astro:assets';
import cleaningImg from '../images/cleaning-huntsville.webp';

<Image 
  src={cleaningImg}
  alt="Professional house cleaning in Huntsville, AL"
  loading="lazy"
/>
```

**NEVER:**
```html
<!-- ❌ WRONG - No dimensions, wrong format -->
<img src="/images/photo.jpg" alt="cleaning">

<!-- ❌ WRONG - No lazy loading on below-fold images -->
<img src="/images/team.webp" alt="team" width="800" height="600">
```

**Image Rules:**
1. Format: WebP with JPG/PNG fallback
2. Always include `width` and `height` attributes
3. Use `loading="lazy"` for ALL images below the fold
4. Use `loading="eager"` ONLY for hero/LCP images
5. Include `decoding="async"` for better performance
6. Max dimensions: 1200px for heroes, 800px for content
7. Compress to < 100KB for most images, < 200KB for heroes

### Rule 2: Font Loading

**ALWAYS:**
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

<!-- Use font-display: swap -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var.woff2') format('woff2');
    font-weight: 100 900;
    font-display: swap;
  }
</style>
```

**NEVER:**
```html
<!-- ❌ WRONG - External font that blocks rendering -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
```

**Font Rules:**
1. Self-host fonts (no Google Fonts CDN)
2. Use WOFF2 format only
3. Always use `font-display: swap`
4. Preload only 1-2 critical font files
5. Subset fonts to include only needed characters

### Rule 3: CSS Delivery

**ALWAYS:**
```astro
---
// Critical CSS inlined in <head>
---
<head>
  <style>
    /* Critical above-fold styles only */
    .hero { ... }
    .nav { ... }
  </style>
  
  <!-- Non-critical CSS loaded async -->
  <link rel="preload" href="/styles/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/styles/main.css"></noscript>
</head>
```

**CSS Rules:**
1. Inline critical CSS (above-fold styles) in `<head>`
2. Load non-critical CSS asynchronously
3. Avoid `@import` in CSS files
4. Remove unused CSS (use PurgeCSS in build)
5. Keep total CSS < 50KB compressed

### Rule 4: JavaScript Loading

**ALWAYS:**
```html
<!-- Defer non-critical scripts -->
<script src="/js/analytics.js" defer></script>

<!-- Or load after page load -->
<script>
  window.addEventListener('load', () => {
    const script = document.createElement('script');
    script.src = '/js/chat-widget.js';
    document.body.appendChild(script);
  });
</script>
```

**NEVER:**
```html
<!-- ❌ WRONG - Render-blocking script -->
<script src="/js/app.js"></script>

<!-- ❌ WRONG - Large inline script -->
<script>
  // 500 lines of JavaScript...
</script>
```

**JavaScript Rules:**
1. Use `defer` for all scripts
2. Never use render-blocking scripts in `<head>`
3. Lazy load third-party scripts (analytics, chat widgets)
4. Keep main bundle < 100KB compressed
5. Code-split by route when possible

### Rule 5: Layout Stability (CLS)

**ALWAYS:**
```html
<!-- Reserve space for images -->
<img src="photo.webp" width="800" height="600" alt="...">

<!-- Reserve space for ads/embeds -->
<div style="min-height: 250px;">
  <!-- Ad loads here -->
</div>

<!-- Use aspect-ratio for responsive containers -->
<div style="aspect-ratio: 16/9;">
  <iframe src="..." loading="lazy"></iframe>
</div>
```

**NEVER:**
```html
<!-- ❌ WRONG - No dimensions -->
<img src="photo.webp" alt="...">

<!-- ❌ WRONG - Dynamic content that shifts layout -->
<div id="dynamic-banner">
  <!-- Content injected by JS -->
</div>
```

**CLS Rules:**
1. Always include `width` and `height` on images and videos
2. Reserve space for dynamic content (ads, embeds)
3. Use `aspect-ratio` for responsive containers
4. Avoid inserting content above existing content
5. Use CSS `transform` for animations, not `top`/`left`

### Rule 6: Third-Party Scripts

**Allowed third-parties (load AFTER page load):**
- Google Analytics 4
- Google Tag Manager (load async)
- Schema markup validators (dev only)

**Load pattern:**
```html
<script>
  // Load GTM after page is interactive
  window.addEventListener('load', () => {
    setTimeout(() => {
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-XXXXXX');
    }, 2000); // 2 second delay
  });
</script>
```

**NOT Allowed:**
- Chat widgets that load on page load
- Heavy social media embeds
- Unoptimized booking widgets
- Any script > 100KB

## Pre-Commit Performance Checklist

Before every commit, verify:

### Images
- [ ] All images are WebP format
- [ ] All images have width/height attributes
- [ ] Below-fold images have `loading="lazy"`
- [ ] Hero image is < 200KB
- [ ] Content images are < 100KB

### CSS/JS
- [ ] Critical CSS is inlined
- [ ] No render-blocking scripts
- [ ] All scripts use `defer` or load on interaction
- [ ] Total JS bundle < 100KB (compressed)

### Layout
- [ ] No elements without explicit dimensions
- [ ] No content inserted above fold after load
- [ ] Fonts use `font-display: swap`

### Testing
- [ ] PageSpeed Insights score > 90 (mobile)
- [ ] No LCP element > 2.5s
- [ ] CLS < 0.1
- [ ] INP < 200ms

## Performance Testing Commands

```bash
# Local Lighthouse audit
npx lighthouse https://localhost:4321 --view

# Build and analyze bundle
npm run build
npm run analyze

# Check image sizes
find public/images -type f -exec ls -lh {} \; | awk '{print $5, $9}'

# Find large files
find dist -type f -size +100k
```

## Automated Performance CI Check

Add to `.github/workflows/performance.yml`:

```yaml
name: Performance Check
on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build
        run: npm ci && npm run build
      - name: Lighthouse CI
        uses: treosh/lighthouse-ci-action@v9
        with:
          configPath: './lighthouserc.json'
          uploadArtifacts: true
```

`lighthouserc.json`:
```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "interactive": ["error", {"maxNumericValue": 3800}]
      }
    }
  }
}
```

## Quick Fixes for Common Issues

### High LCP
1. Preload hero image: `<link rel="preload" as="image" href="hero.webp">`
2. Reduce hero image size
3. Remove render-blocking resources
4. Use CDN for static assets

### High CLS
1. Add dimensions to all images
2. Reserve space for dynamic content
3. Avoid font-flash with preload
4. Don't insert ads above content

### High INP
1. Reduce JavaScript
2. Break up long tasks
3. Use web workers for heavy computation
4. Debounce event handlers

### Slow TTFB
1. Enable server caching
2. Use CDN
3. Optimize database queries
4. Enable compression (gzip/brotli)
