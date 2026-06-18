# Phone Number Decision Needed — Tennessee / NAP Consistency

**Date:** 2026-06-18
**Owner to decide:** Todd
**Blocking:** A design/SEO audit fix (market-correct phone numbers in CTAs). No code will change until these are answered.

## Why this needs you
Phone numbers are business data and affect **NAP consistency** (Name/Address/Phone), which is a local-SEO ranking signal. Right now the site shows **three different customer-facing numbers**, and on Tennessee pages they conflict. I won't guess — picking wrong makes NAP *worse*.

## What the code actually shows today (verified, not from memory)

| Number | Where it's used | Notes |
|---|---|---|
| **(256) 826-1100** | Alabama line. Hardcoded in the shared `LocationLayout.astro` hero, CTAs, FAQs, and in `QuoteForm.astro` error fallback — **including on Nashville pages**. Also Footer/Nav as "AL". | The AL line |
| **(615) 510-1427** | Tennessee line. ~140 uses across 27 Nashville files; also in Footer/Nav as "TN". | The "main" TN line? |
| **(615) 961-0028** | Used on ~13 Nashville & West-Nashville **service** pages — in body copy, `tel:` links, AND LocalBusiness schema `"telephone"`. | A second TN line — intentional? |

Good news: the previously-flagged **wrong** number **(256) 856-1006** is **no longer present anywhere** in the site source — already cleaned up.

## The specific questions

1. **Which number should Tennessee pages show as the primary customer-facing line?**
   - [ ] (615) 510-1427
   - [ ] (615) 961-0028
   - [ ] Other: ____________________

2. **Is having BOTH 615 numbers on the site intentional** (e.g., two real lines for different purposes), or should one be standardized away?
   - [ ] Keep both — explain which is for what: ____________________
   - [ ] Standardize to one: ____________________

3. **On the shared Nashville/West-Nashville pages** (the ones driven by `LocationLayout.astro`), the hero "Call Now" button currently dials the **Alabama** number. Should those switch to the chosen TN number?
   - [ ] Yes — switch TN pages to the TN number
   - [ ] No — keep as-is (explain): ____________________

4. **Confirm the canonical numbers for the record (for NAP everywhere):**
   - Alabama: ____________________ (currently (256) 826-1100)
   - Tennessee: ____________________

## Once answered
I'll update the affected files (shared layouts + the schema `telephone` fields so structured data matches what's displayed) in one consistent pass and re-verify. Estimated scope: `LocationLayout.astro`, `QuoteForm.astro`, the ~13 service pages carrying 615-961-0028, and any LocalBusiness schema telephone fields for TN.
