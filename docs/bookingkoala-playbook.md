# BookingKoala Branding Playbook

Everything below is verified against the live TVCT BookingKoala setup (2026-07-10).
The single source of truth for the CSS is [`bookingkoala-brand.css`](./bookingkoala-brand.css).

---

## ✅ Already done (live in production)
- **Booking form** — recolored to brand peach (buttons, TOTAL, links, checkboxes) + "Live Reviews" module hidden
- **Login page** — published, recolored

---

## 📋 Page-by-page CSS checklist

**The CSS is identical for every page** — paste the same block from
[`bookingkoala-brand.css`](./bookingkoala-brand.css) into each page's
**Design ▾ → Custom CSS** box, then **Save & Publish**. All BK customer pages share
the same classes, so one stylesheet styles them all.

**Per page:** Theme Builder → **Page:** dropdown → pick page → Design → Custom CSS →
if the box already has content, paste this block AFTER it (don't wipe the existing
`TVCT Premium Booking Success` block); if empty, paste fresh → **Update → Save & Publish**
→ glance at the live page (buttons/links peach).

| Page | Status |
|---|---|
| Book Now | ✅ done |
| Login | ✅ done |
| Thankyou Page | ⬜ CSS in box — needs publish (+ 2 copy fixes, see below) |
| Home | ⬜ (also has off-brand "Top Providers" copy) |
| Sign Up | ⬜ |
| Get Quote | ⬜ |
| Gift Cards | ⬜ |
| Earn Credits | ⬜ |
| Forgot Password | ⬜ (few buttons — minimal visible change, fine) |
| Reset Password | ⬜ (few buttons — minimal visible change, fine) |
| Customer Dashboard pages (submenu) | ⬜ each dashboard page |

**Note:** Facebook (blue) / Google (white) social-login buttons intentionally keep their
official colors — that's correct, not a miss.

### Thankyou Page copy fixes (manual — the BK text editor can't be automated)
Click the paragraph → **Edit** → select all → paste. Two blocks, both swap the
marketplace phrase "once a provider has accepted the job":

Block 1 (main): `Your booking is saved! A confirmation will arrive by email shortly, once our team locks in your appointment time. From your account, you can reschedule anytime, refer friends, or send gift cards.`

Block 2 (NEW USERS section): `Your booking is saved! A confirmation will arrive by email shortly, once our team locks in your appointment time. To finish setting up your account, please set your password.`
   - Sign In button + "Sign Up" link should turn peach.
   - **Expected to stay unchanged:** the Facebook (blue) and Google (white) social-login buttons — those keep their official brand colors on purpose. Not a miss.

### 2. Wording changes — in **Settings → Services** (NOT the theme builder)
Edit each service/add-on's **name** field.
⚠️ **RENAME ONLY — never delete/recreate a service.** Deleting changes the `service_id`, which
breaks the website's recurring deep-link (`/booking?service_id=38&frequency_id=...`).

**Services:**
| Change from | To |
|---|---|
| The Top-to-Bottom - Deep Clean | **The Top-to-Bottom Deep Clean** |
| The Maintenance Clean - Recurring Clean | **The Maintenance Clean** |
| The Fresh Start Move-In/Out Clean | *(keep)* |
| Vacation Rental Turnover | *(keep)* |

**Add-ons / Extras:**
| Change from | To |
|---|---|
| The Shedder Pet Hair Treatment | **Pet Hair Treatment** |
| The Home Love Condition Package (Heavy Duty) | **Heavy-Duty Deep Condition** |
| The Sink-to-Cabinet Dish Service | **Dishes & Cabinet Fronts** |

### 3. Other BK customer pages (repeat the login pattern)
Each page has its own Custom CSS box **and** its own Publish. For each page:
Theme Builder → **Page:** dropdown → pick page → **Design → Custom CSS** → confirm the brand
block is present (paste from `bookingkoala-brand.css` if missing) → **Update → Save & Publish** → verify live.

Priority order (by how many customers see it):
1. **Thank-you / confirmation** (every booker sees it next)
2. **Customer dashboard** (returning clients — reschedule / pay / rebook)
3. **Reschedule / manage booking**
4. **Review / feedback page**

### 4. Optional
- **Facebook Coupon module** on the booking form — a coupon widget reads off-brand for a premium
  service. Hide it the same way Live Reviews was hidden: Theme Builder → Book Now form →
  **Rearrange** tab (or select it in the preview and use the module's hide control).

---

## How this works (so it stays consistent)
- All BookingKoala customer pages share the same CSS classes (`.btn-primary`, `a`,
  `.bk-form-title`, `.bk-form-sum-total-value`, `.form-check-input`, etc.).
- So the **same** CSS block styles every page — you paste the identical block into each page's
  Custom CSS box, then Publish that page.
- The Custom CSS box appears to carry the block across pages, but **verify page-by-page** — don't
  assume. Confirm the block is present before publishing each page.
- If a page's box is ever missing the block or gets wiped, re-paste from `bookingkoala-brand.css`.

## Brand color reference
| Use | Hex |
|---|---|
| Peach accent (borders, focus rings) | `#FFA985` |
| Button peach (contrast-safe w/ white text) | `#F5915C` |
| Link / TOTAL peach (readable on white) | `#E07B47` |
| Link hover | `#C75B2A` |
| Ink (headings/text) | `#333333` |

## Notes to bring back to the next session
1. **The "Page:" dropdown contents** — list what pages it shows, so we can confirm exactly which
   still need the CSS and whether the box is truly per-page or shared.
2. **Anything that didn't recolor** after publishing — screenshot it and we'll add the selector.
