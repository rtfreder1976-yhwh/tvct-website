# Creative Kit — The Valley Clean Team

## Last Updated
2026-08-23 by /creative (setup mode). No assets generated; Replicate not called. Palette from the brand guide PDF "TCVT Brand Colors 2025" (Todd, 2026-07-18). Typography, logo, and photo inventory pulled from the repo, not guessed.

> **Read this first.** A previous /creative run (2026-05-14) invented a navy/cream/brass "editorial premium" palette. It was wrong, it never matched the live site, and it cost a whole batch of regenerated assets. The palette below is the only palette. If a prompt, mockup, or output drifts toward navy, cream, brass, gold-foil, or "luxury editorial," stop and regenerate.

---

## Identity

- **Who:** premium residential cleaning company (commercial secondary). North Alabama (the Shoals, Huntsville/Madison) and Middle Tennessee (Nashville). Veteran-owned and woman-owned.
- **Tagline:** "Life is messy. We've got this." (logo lockup reads "Life is Messy. We've got this part.")
- **Position to express visually (positioning.md ⭐):** The Experts Who Happen to Be Likable. Proof: The Exact Price. Headline register: "We're not the cheapest option. That's intentional."
- **Mood in three words:** warm, specific, unhurried.
- **The visual rule that follows from the brief:** expertise is shown through *specificity*, never through luxury props. A checklist line item, one particular spot before and after, the phone with a real number on it. Not a chandelier, not a champagne flute, not a marble foyer.
- **Not:** navy-editorial, luxury, gig-app cheer, franchise brochure, sparkle clip-art, comedy.

---

## Palette (authoritative)

| Hex | Name | Role | Use |
| --- | ---- | ---- | --- |
| `#FFA985` | Peach | **Signature accent.** The one colored element. | CTA buttons, the brushstroke underline, one highlighted phrase per composition, the house-outline mark. Live site: `.btn-primary`, `.gold-gradient`, favicon. |
| `#333333` | Charcoal | Text and dark ground | All body and headline text on light grounds. Dark card ground when a dark variant is needed. Live site: `body { color: #333 }`, headings `text-[#333333]`. |
| `#E5E5EA` | Light grey | Soft background ground | Card and social backgrounds. Plain white `#FFFFFF` is equally fine. |
| `#FFC67D` | Apricot | Gradient partner (support) | Only as the end stop of the peach-to-apricot band: `linear-gradient(135deg, #FFA985 0%, #FFC67D 100%)`. Never on its own. |
| `#87CEEB` | Sky blue | Support, sparingly | A second accent when one is unavoidable (e.g., "before" label vs peach "after"). Max one composition in five. |
| `#BCE3C5` | Sage green | Support, sparingly | Same rule as sky blue. Reads well behind a checklist tick. |
| `#FFD700` | Gold | Support, rare | Star glyph in a review reference only. Never as a ground, never as a foil/metal texture. |

**Do**
- One peach element per composition. If you need two, one of them should be the brushstroke underline.
- Light ground + charcoal text + peach accent. That trio is the brand.
- Let white space do the "premium" work. Restraint reads as confidence (Aesop borrow).
- Peach-to-apricot gradient only on bands and buttons, never on text larger than a phrase.

**Don't**
- No navy (`#0F172A`, `#1E293B`, or any dark blue), no cream (`#F5F0E6` family), no brass/bronze/gold-foil texture. That was the wrong kit.
- No pure black text; charcoal only.
- No peach as a full-bleed background behind body text; contrast fails and it stops being an accent.
- No neon, no rainbow, no more than two support colors ever.

---

## Typography (from the repo)

| Role | Face | Weights in use | Source |
| ---- | ---- | -------------- | ------ |
| Headlines (h1-h3) | **Playfair Display**, Georgia, serif | 700 (self-hosted `/fonts/playfair-display-700.woff2`) | `src/layouts/BaseLayout.astro` critical CSS; Tailwind `font-playfair` |
| Body / UI / buttons | **Inter**, system-ui, -apple-system, sans-serif | 400, 500, 600, 700 | Google Fonts link in `BaseLayout.astro` |
| Logo tagline | Inter-like sans (in the raster) | regular | `public/images/logo.png` |

- **Heading accent treatment:** `.gold-gradient` clips a peach gradient (`#FFA985` to `#FF8C61`) into the text of *one phrase* inside a charcoal headline. Live example: "We're not the cheapest cleaning company in Alabama or Tennessee. **That's intentional.**" The class name says gold; the color is peach. Use the same idea on visuals: charcoal headline, one phrase in peach.
- **Button:** Inter 600, charcoal text on the peach-to-apricot pill (`border-radius: 9999px`).
- **On generated visuals:** Playfair Display for the one big line, Inter for everything else. Never all-caps Playfair. Never a script or hand-lettered face for headlines (the old before/after photos used one; retire it).
- Sentence case. Digits, never spelled-out numbers. Dollar signs always. No exclamation marks.

---

## Logo

- **Files:** `public/images/logo.png` (332x95, RGBA), `public/images/logo.webp` (same), `public/images/logo-animated.gif` and `logo-animated-slow.gif` (animated variant; use only in email/social where motion is welcome, never as the static mark).
- **What it is:** a simple peach house outline (the raster leans a touch deeper orange than `#FFA985`), open at the bottom, sitting left of a two-line wordmark: "The Valley Clean Team" in a bold serif (charcoal), with "Life is Messy. We've got this part." in a small sans beneath.
- **Rules**
  - Only on light grounds (white or `#E5E5EA`). There is no reversed/white version in the repo; do not fake one by inverting. If a dark ground is unavoidable, place the logo in a white rounded tile with padding.
  - Clear space: the height of the house mark on all four sides.
  - Minimum width 160 px on screen; below that use the house mark alone (crop from the PNG) with the wordmark dropped.
  - Never recolor, stretch, add a drop shadow, or put it on the peach gradient.
  - Placement on social/ad formats: bottom-right or bottom-left, small, inside the safe area. The logo is a signature, not a headline.

---

## Photography

**What exists** (`public/images/`): `hero-1280w.avif` / `hero-400w.avif` (staged showroom living room, warm greige, obviously stock), `gallery/{bathroom,kitchen,move_out}.webp` (classic stock kitchen etc.), `services/Cleaningpic*.webp` (13 real phone photos: before/after of a specific spot such as a cabinet top edge, watermarked with the logo and a script caption), `neighborhoods/*_clean_*.webp` (16 AI-generated interiors keyed to neighborhood names; the Twickenham one is a Victorian parlor with gilt frames, i.e., the luxury drift we are steering away from).

**What the current library says, honestly:** the real crew photos are the most on-brand things in the folder, and they're the worst-produced. The polished images are stock or AI rooms with nobody in them. The direction below closes that gap.

**Direction**
- **Subjects:** real crews in real Southern homes. A person doing one specific task (wiping the top of a fridge, running a cloth along a baseboard, checking a line on a printed checklist). Hands and tools beat wide empty rooms.
- **Light:** natural window light, warm but not orange. Overcast-day softness. No studio strobes, no HDR real-estate look.
- **Homes:** 1,500-3,500 sq ft, lived-in, mid-to-upper suburban AL/TN. Brick ranch, craftsman, newer subdivision. Not a showroom, not a mansion, not a loft.
- **Color in frame:** neutral interiors so the one peach element (a cloth, a caddy, the overlay accent) is the only warm pop.
- **Framing:** eye-level or slightly above, 35-50 mm feel, subject off-center with room for text on the quiet side.
- **Before/after:** same spot, same framing, same light; a narrow charcoal divider, "before" and "after" in Inter 600. The specificity of the spot is the point.
- **Never:** the smiling stock cleaning lady with a spray bottle and a thumbs-up; sparkle/shine overlays; matching branded uniforms in a line; gloves-and-bucket flat-lays; empty luxury rooms; fisheye interiors; anything that reads "hospital."

---

## Illustration and graphic style

- **The brushstroke underline.** The confirmed card style: light ground, charcoal text, one word or phrase underlined with a soft, hand-drawn peach brushstroke (slightly uneven weight, dry-brush edges, a single stroke, not a marker highlight and not a scribble). It mirrors the `.gold-gradient` phrase on the site. It is not yet in the codebase as an SVG; when it is first generated, save the vector as the reusable asset.
- **Icons:** thin-line, single weight, charcoal. Peach only for a filled checklist tick. No 3D, no emoji-style, no gradient icons.
- **Shapes:** rounded corners (16-24 px on cards, full pill on buttons). No sharp editorial rules, no ornamental frames, no foil borders.
- **Texture:** none, or a barely-there paper grain. No marble, no linen, no bokeh.
- **Composition rules:** one focal point, one message, one peach element. Charcoal headline top-left or centered, 40% of the canvas left quiet. Logo small in a corner. Phone number, when present, is the second-most-visible element and always in Inter 600.
- **Grid:** 8 px base; margins at least 6% of the short edge; text never closer than 10% to any edge on story formats.

---

## Format specs

| Format | Size / ratio | Layout | Notes |
| ------ | ------------ | ------ | ----- |
| Social square (IG/FB feed) | 1080x1080, 1:1 | Light ground; headline in Playfair 700 with one brushstroke phrase; sub-line Inter 400; logo bottom-right | 12 words of headline max. Also export 1080x1350 (4:5) for feed reach. |
| Story / Reel cover | 1080x1920, 9:16 | Photo top 60% (text-safe quiet side), light band bottom 40% with headline + phone | Keep the top 250 px and bottom 300 px free of text (UI overlays). |
| GBP post image | 1200x900, 4:3 | Photo-led or checklist-card; single line of text max; no logo needed (profile shows it) | GBP crops to 4:3 in feed; keep text in the center 80%. Never a "5-star" badge; "4.9 from 148 reviews" only if pulled from claims.ts at write time. |
| Blog hero | 1600x900, 16:9 (also 1200x630 OG) | Photo or teaching graphic; no text baked in (the template sets the title) | Match `BlogPostLayout`; keep explicit width/height; export AVIF/WebP. |
| Ad creative (Meta/Google display) | 1080x1080 and 1200x628 | Headline from the 12-ad matrix in positioning.md; one proof number; phone as CTA | Residential ads: phone-first CTA (AL 256-826-1100 / TN 615-510-1427; TN targeting dials TN). Commercial ads CTA to /request-a-quote?service=commercial. |
| Talking-head thumbnail | 1280x720, 16:9 | Presenter right third, natural light, charcoal 3-5 word title left in Playfair, one peach brushstroke | No pointing-at-text pose, no shocked face, no red arrows. |

---

## Text-overlay rules

- Every line on a visual must pass the VCT Voice Test (brand-brief.md, 10 questions). Shortcut: would we say it standing in the customer's kitchen? Does it show expertise or announce it?
- Banned on visuals: best, premium, luxury, exceptional, superior, unmatched, unparalleled, elite, five-star; the 15 generic cleaning phrases (sparkle, "sit back and relax," "attention to detail," "we treat your home like our own," etc.).
- Witty, not funny: the joke, if any, is a dry aside in the sub-line, never the headline, never the price, never the CTA. Never the customer as the butt.
- Prices and numbers only from `src/data/claims.ts` at write time (from $200 / $276 / $351 / $125 / $526; 44-item checklist; 4.9 from 148; 1,500+ customers *served*; 2 business hours). Never a retired price: $99, $119, $129, $135, $149, $175, $176, $225, $275, $400.
- Never same-day or emergency. Never a clinical/medical framing. Never "5-star" (we're 4.9). Never "same team every visit," "bonded," "workers' comp," or any certification.
- Phones exactly: (256) 826-1100 Alabama, (615) 510-1427 Tennessee.
- No emoji, no exclamation marks, no all-caps shouting, no "y'all."

---

## Prompt scaffolds (Replicate; not run in setup mode)

Models per `stack.md` and the skill's registry: **google/nano-banana-pro** for all stills (social, GBP, blog hero, ad stills, thumbnails); **kwaivgi/kling-v2.5-turbo-pro** for default video and image-to-video; **google/veo-3.1** and **openai/sora-2** only for hero-video comparisons run in parallel; **kwaivgi/kling-lip-sync** for talking head. Never ask the user which model.

**Shared negative / guardrail block (append to every prompt):**
`no navy blue, no cream, no brass or gold foil, no marble, no chandelier, no sparkle or shine effects, no stock-photo cleaning lady with spray bottle, no thumbs up, no matching uniforms, no medical or hospital setting, no text unless specified, no watermark, no emoji, no 5-star badge`

**1. Photo (real crew, real home)**
```
Documentary-style photograph, natural window light, overcast softness. A cleaner in plain clothes wipes the top edge of a white kitchen cabinet with a microfiber cloth, in a lived-in suburban home in North Alabama: quartz counter, wood floor, family photos. One peach-colored (#FFA985) microfiber cloth is the only warm color in the frame; everything else is neutral white, greige, and wood. Eye level, 35mm feel, subject in the right third, quiet uncluttered space on the left for text. Honest, unposed, mid-task. Warm but not orange color grade.
[shared negative block]
```

**2. Social card (brushstroke underline)**
```
Flat graphic design, 1080x1080. Light grey (#E5E5EA) background. Headline in a bold serif (Playfair Display style), charcoal (#333333), sentence case, top-left: "We're not the cheapest option. That's intentional." The words "That's intentional." are underlined by a single soft hand-drawn peach (#FFA985) brushstroke with dry-brush edges. Below, one line of small clean sans-serif (Inter style) in charcoal: "Here's what you're actually paying for." Generous white space, rounded-corner feel, no other colors, no icons, no photos. Leave the bottom-right corner empty for a logo.
[shared negative block]
```

**3. Before/after (one specific spot)**
```
Two-panel before/after photograph, same framing, same natural light. Subject: the top of a refrigerator in an ordinary suburban kitchen. Left panel: dust and a greasy film, honest, not exaggerated. Right panel: the same surface clean, no shine effects. Panels separated by a thin charcoal (#333333) vertical divider. Small labels "before" and "after" in a clean sans-serif, charcoal. Neutral kitchen colors; the only warm color is a peach (#FFA985) cloth resting in the right panel. Phone-camera realism, slightly overhead angle.
[shared negative block]
```

---

## Anti-patterns (with the cautionary tale)

- **The navy/cream/brass kit (2026-05-14).** /creative had no palette on file, read "premium" in the positioning, and guessed "editorial luxury": deep navy grounds, cream type, brass rules. Every generated asset clashed with the live peach site, and the batch was thrown out. The lesson is procedural: the palette comes from the brand guide or from the live CSS, never from the word "premium." If neither is available, stop and ask.
- Luxury props as proof of expertise (chandeliers, marble foyers, Victorian parlors like the Twickenham AI interior). Expertise is a specific spot, a checklist line, a number.
- Sparkle overlays, lens flares, "shine" lines. The brief bans "sparkle" in copy; it's banned in pixels too.
- The stock cleaning lady: spray bottle, gloves, grin, thumbs-up, spotless white uniform.
- Empty AI rooms with nobody in them as the default hero.
- Script or hand-lettered headline fonts (the old watermark style on `services/Cleaningpic*`).
- Badges: "5-star," "#1 rated," "best in Huntsville," shield/ribbon graphics.
- Clinical cues on healthcare/dental content: scrubs, masks, blue-white surgical light.
- Peach gradient as a background behind paragraphs of text.

---

## QA checklist (run before any asset is saved to assets.md)

- [ ] Palette: only `#FFA985`, `#333333`, `#E5E5EA`/white, plus at most one support color. No navy, cream, brass.
- [ ] Exactly one peach element (or peach plus its brushstroke underline).
- [ ] Headline is Playfair-style serif, sentence case; everything else Inter-style sans.
- [ ] Logo on a light ground, clear space equals mark height, not recolored, not on the gradient.
- [ ] Photo reads as a real crew in a real Southern home in natural light; no stock/luxury/sparkle cues.
- [ ] Every word passes the VCT Voice Test; no oversell words, no banned phrases, no jokes at the customer's expense.
- [ ] Numbers verified against `src/data/claims.ts` at generation time; no retired prices; "1,500+" means customers served.
- [ ] No same-day/emergency, no clinical framing, no "5-star."
- [ ] Phone correct for the market: (256) 826-1100 AL, (615) 510-1427 TN.
- [ ] Correct dimensions and safe areas for the format; text legible at mobile thumbnail size.
- [ ] No AI artifacts (hands, melted text, impossible geometry); explicit width/height and AVIF/WebP export if it ships to the site.
- [ ] Row appended to `brand/assets.md` with path, format, and status `draft`.
