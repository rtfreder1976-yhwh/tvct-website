# NAP Consistency Audit Report
**The Valley Clean Team**
**Date:** January 2026

---

## Canonical NAP Information

| Field | Alabama | Tennessee |
|-------|---------|-----------|
| **Business Name** | The Valley Clean Team | The Valley Clean Team |
| **Phone** | (256) 826-1100 | (615) 510-1427 |
| **Schema Format** | +1-256-826-1100 | +1-615-510-1427 |
| **Email** | hello@thevalleycleanteam.com | hello@thevalleycleanteam.com |
| **Address** | Service Area Business (no physical address) | Service Area Business (no physical address) |
| **Website** | https://thevalleycleanteam.com | https://thevalleycleanteam.com |

---

## Website Audit Summary

### Phone Number Format Inconsistencies

| Format | Count | Files | Status |
|--------|-------|-------|--------|
| `256-826-1100` | 243 files | Most pages | ✅ Primary format |
| `(256) 826-1100` | 80 occurrences in 50 files | Blog posts, some location pages | ⚠️ Inconsistent |
| `+1-256-826-1100` | Schema markup only | SchemaMarkup.astro | ✅ Correct for schema |
| `615-510-1427` | 33 files | Nashville pages only | ✅ Correct regional |

### Findings

#### ✅ GOOD: Regional Phone Segmentation
- Alabama pages correctly use: 256-826-1100
- Nashville/Tennessee pages correctly use: 615-510-1427
- Schema markup uses proper international format with +1 prefix

#### ⚠️ ISSUE: Phone Format Inconsistency
50 files use parentheses format `(256) 826-1100` instead of the dash format `256-826-1100`.

**Affected file categories:**
- Blog posts (location-specific pricing/cleaning guides)
- Some location service pages (Tuscumbia, Decatur neighborhoods)
- Navigation component

**Recommendation:** Standardize all phone displays to `256-826-1100` (no parentheses) for consistency. Schema markup should keep `+1-256-826-1100` format.

#### ✅ GOOD: Business Name Consistency
- "The Valley Clean Team" appears consistently across 219 files (609 total occurrences)
- No variations like "Valley Clean Team" or "TVCT" found in customer-facing content

#### ✅ GOOD: Email Consistency
- `hello@thevalleycleanteam.com` used consistently throughout

---

## External Citation NAP Issues (from 90-Day Plan)

| Issue | Severity | Status |
|-------|----------|--------|
| BBB duplicate listings | CRITICAL | Action Required - Contact BBB |
| 17 directories with wrong NAP | CRITICAL | 47% listing score - actively bleeding leads |
| Bing Places not claimed | HIGH | Needs claiming |
| Apple Maps not claimed | HIGH | Needs claiming |

---

## Recommended Actions

### Immediate (Week 1)
1. [ ] Contact BBB to consolidate duplicate listings
2. [ ] Claim Bing Places listing
3. [ ] Claim Apple Maps listing
4. [ ] Fix NAP on 17 directories identified in audit

### Website Cleanup (Optional)
5. [ ] Standardize phone format to `256-826-1100` across all 50 files with parentheses format
   - Low priority - does not affect SEO significantly
   - Schema markup is correct which is what matters for search engines

---

## Files with Parentheses Phone Format

The following files use `(256) 826-1100` instead of `256-826-1100`:

### Navigation Component
- `src/components/Navigation.astro`

### Blog Posts
- `src/pages/blog/deep-vs-standard-cleaning-*.astro` (5 files)
- `src/pages/blog/commercial-cleaning-*.astro` (5 files)
- `src/pages/blog/house-cleaning-cost-*.astro` (6 files)
- `src/pages/blog/move-out-cleaning-*.astro` (5 files)
- `src/pages/blog/reliable-cleaning-company-*.astro` (5 files)
- `src/pages/blog/spring-cleaning-guide-*.astro` (5 files)
- `src/pages/blog/what-to-expect-first-cleaning.astro`

### Location Pages
- `src/pages/locations/tuscumbia/*.astro` (multiple service pages)
- `src/pages/locations/decatur/*.astro` (neighborhood pages)
- `src/pages/locations/huntsville/*.astro` (some service pages)
- `src/pages/locations/florence/post-construction-cleaning.astro`

---

## Conclusion

**Overall NAP Health Score: 85/100**

The website has good NAP consistency for the most critical elements:
- ✅ Business name is consistent
- ✅ Email is consistent
- ✅ Regional phone numbers are correctly segmented
- ✅ Schema markup uses correct formats

The minor phone format inconsistency (parentheses vs dashes) is a cosmetic issue that doesn't affect SEO since schema markup is correct.

**Priority Focus:** External citation cleanup (BBB duplicates, unclaimed listings, wrong NAP in 17 directories) is far more impactful than fixing internal phone formatting.
