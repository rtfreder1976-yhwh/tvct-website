# Font Awesome to Lucide Icon Migration Status

## Migration Overview

This document tracks the progress of migrating from Font Awesome icons to Lucide icons using the Icon component (`src/components/Icon.astro`).

## Completed Files ✅

The following files have been **fully migrated**:
- `src/components/Footer.astro`
- `src/components/TrustBadges.astro`
- `src/components/ReviewBadges.astro`
- `src/components/TestimonialsSection.astro`
- `src/components/Navigation.astro`
- `src/pages/index.astro`
- `src/pages/contact.astro`
- `src/pages/about.astro`

## Partially Migrated Files ⚠️

### `src/layouts/LocationLayout.astro`
**Status:** ~30% complete
- ✅ Icon import added
- ✅ Hero section icons migrated (map-marker-alt, check-circle, calendar-check, phone, calendar, clock)
- ✅ Trust badges migrated (shield-alt, medal, venus, user-check)
- ✅ Pricing section partially migrated (home, sparkles, truck-moving, key)
- ❌ **55 Font Awesome icons remaining**

**Remaining icons to migrate:**
- Services grid (8x sparkles, home, truck-moving, hammer, key, building, leaf, calendar-alt)
- Social proof (heart)
- CTA buttons (phone, calendar)
- Why Choose Us section (medal, shield-alt, clock, star, leaf, redo)
- List items (check-circle - many instances)
- Testimonials (star - multiple instances)
- Neighborhoods (map-marker-alt)
- FAQs (chevron-down)
- External links (external-link-alt)
- Google icon (fab fa-google)
- Form success/error messages (spinner, check-circle, exclamation-circle)

## Files Pending Migration ⏳

###  Layouts
1. **`src/layouts/ServiceLocationLayout.astro`**
   - Similar structure to LocationLayout
   - Estimated: 40-50 icons

### Components
2. **`src/components/BeforeAfterGallery.astro`**
   - Estimated: 5-10 icons (magic, calendar-check)

3. **`src/components/ResponseTimeStats.astro`**
   - Estimated: 15-20 icons (bolt, calendar-check, clock, redo, stopwatch, chart-line, phone, calendar-check)

4. **`src/components/ServiceAreaMap.astro`**
   - Estimated: 10-15 icons (map-marked-alt, map-marker-alt, phone, arrow-right, home)

### Service Pages (src/pages/services/)
5. **`index.astro`** - Services overview
6. **`deep-cleaning.astro`**
7. **`regular-cleaning.astro`**
8. **`move-in-out-cleaning.astro`**
9. **`green-cleaning.astro`**
10. **`airbnb-cleaning.astro`**
11. **`post-construction-cleaning.astro`**
12. **`commercial-cleaning.astro`**
13. **`event-cleaning.astro`**

Each service page estimated: 30-50 icons

### Main Pages
14. **`src/pages/locations.astro`**
    - Estimated: 20-30 icons

15. **`src/pages/pricing.astro`**
    - Estimated: 40-60 icons (calculator, tag, check, arrow-right, couch, fire, warehouse, window-maximize, box, tshirt, bed, leaf, building, phone, calendar, etc.)

16. **`src/pages/booking.astro`**
    - Estimated: 10-15 icons (check-circle, shield-halved, star, flag-usa, phone, envelope)

17. **`src/pages/blog.astro`**
    - Estimated: 20-30 icons (filter, times, search, gift, clock, home, tired, user-secret, running, users, bed, hard-hat, thumbs-down, door-open, sparkles, turkey, etc.)

## Migration Pattern

### 1. Add Icon Import
```astro
import Icon from '../components/Icon.astro';  // Adjust path as needed
```

### 2. Replace FA Icons with Icon Component

**Font Awesome** → **Icon Component**

```astro
<!-- Before -->
<i class="fas fa-check-circle text-[#FFA985] mr-2"></i>

<!-- After -->
<Icon name="check-circle" class="w-5 h-5 text-[#FFA985] mr-2" />
```

### 3. Size Mapping
- `text-xl` → `w-5 h-5`
- `text-2xl` → `w-6 h-6`
- `text-3xl` → `w-8 h-8`
- `text-4xl` → `w-10 h-10`
- `text-5xl` → `w-12 h-12`
- `text-6xl` → `w-16 h-16`

### 4. Inline Block for Inline Usage
When replacing inline icons (within text), add `inline-block`:
```astro
<Icon name="phone" class="w-5 h-5 inline-block mr-2" />
```

### 5. Centering Icons
For centered icons in cards/sections:
```astro
<Icon name="sparkles" class="w-8 h-8 text-[#FFA985] mx-auto mb-3" />
```

## Icon Name Mappings

Common FA → Lucide mappings (from Icon.astro):
- `fa-check-circle` → `check-circle`
- `fa-phone` → `phone`
- `fa-calendar` → `calendar`
- `fa-calendar-check` → `calendar-check`
- `fa-map-marker-alt` → `map-marker-alt` (maps to MapPin)
- `fa-shield-alt` → `shield-alt` (maps to Shield)
- `fa-truck-moving` → `truck-moving` (maps to Truck)
- `fa-sparkles` → `sparkles`
- `fa-star` → `star`
- `fa-heart` → `heart`
- `fa-chevron-down` → `chevron-down`
- `fa-external-link-alt` → `external-link-alt` (maps to ExternalLink)

## Files Not to Modify

- `src/components/Icon.astro` - The icon component itself
- `src/layouts/BaseLayout.astro` - Will be done separately
- Any files already completed (see list above)

## Estimated Total Work Remaining

- **LocationLayout.astro:** 55 icons
- **ServiceLocationLayout.astro:** ~45 icons
- **Components (3 files):** ~35 icons
- **Service pages (9 files):** ~350 icons
- **Main pages (4 files):** ~100 icons

**Total:** ~585 icons across 18 files

## Migration Tools & Approaches

### Option 1: Manual Migration (Recommended for Quality)
Use the Edit tool to replace icons section by section, preserving exact formatting and context.

### Option 2: Automated Script
The `migrate-icons.py` script has been created but not executed. It uses regex to bulk-replace icons. **Use with caution** and review all changes.

### Option 3: Hybrid Approach (Recommended)
1. Use automated script for initial bulk replacement
2. Manually review and fix edge cases
3. Test each file after migration

## Testing Checklist

After migrating each file:
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in browser
- [ ] Icons render correctly
- [ ] Icon sizes look appropriate
- [ ] Colors are preserved
- [ ] Hover states work
- [ ] Responsive behavior intact

## Next Steps

1. Complete LocationLayout.astro (55 remaining icons)
2. Migrate ServiceLocationLayout.astro
3. Migrate component files
4. Migrate service pages (largest effort)
5. Migrate main pages
6. Final testing and cleanup
7. Remove Font Awesome dependency from package.json

## Notes

- Brand icons (fab) like `fa-google` may need special handling
- Some icons in scripts (spinner, check-circle, exclamation-circle in form handlers) will need JavaScript updates
- Preserve all Tailwind classes (colors, margins, etc.)
- Keep accessibility intact (alt text, aria labels)

---

**Last Updated:** 2025-12-05
**Migration Progress:** ~8% complete (8/104 files fully migrated)
