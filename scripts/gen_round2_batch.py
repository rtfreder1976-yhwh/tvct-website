"""Generate the round-2 social visual batch (18 assets):
- IG carousel-02 (7 slides, black + white + red exposé treatment)
- IG reel-01 + reel-02 hook frames (9:16, photo-led)
- FB post-02 header + post-03 header (16:9)
- LinkedIn carousel slides 1/4/7/8 (4 slides, brand palette)
- Nextdoor posts 01/02/03 (3 photo-led images, 1:1)

Serialized at 12s gap.
"""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from replicate_gen import run  # noqa: E402

SUBMIT_GAP_S = 12

# ---- Shared fragments ----

# Carousel-02 "exposé" treatment — black + red. Deliberate departure from brand.
EXPOSE_BASE = (
    "Editorial typographic poster, 1080x1080 square. Deep black background "
    "(#0B0B0B) with subtle matte texture. Bold modern editorial serif "
    "typography in bright pure white. A single accent in vivid editorial red "
    "(#C32D2D) reserved for ONE element only — the quoted phrase, the headline "
    "key word, or the conclusion. Generous negative space. Single focal point. "
    "Aesthetic: Bloomberg Businessweek expose, late-night editorial. "
    "Avoid: cream backgrounds, brass tones, sparkles, gradients, drop shadows, "
    "glossy effects, exclamation points, all-caps stacking, comic effects."
)

# Brand-aligned cream and navy bases for LinkedIn / non-expose slides
CREAM_BASE = (
    "Editorial typographic poster, 1080x1080 square. Soft cream paper "
    "background (#F5EFE6) with subtle natural paper-grain texture. Bold "
    "modern editorial serif typography in deep navy (#1B2A41). Brass-gold "
    "accent (#C9A86B) reserved for ONE element only. Generous negative space, "
    "10 percent margin. Single focal point. Studio McGee and Kinfolk magazine "
    "aesthetic. Quietly premium. Avoid: exclamation points, sparkles, neon "
    "colors, gradients, drop shadows, photographic elements, cartoon, "
    "all-caps stacking."
)

NAVY_BASE = (
    "Editorial typographic poster, 1080x1080 square. Deep navy background "
    "(#1B2A41) with subtle matte texture. Bold modern editorial serif "
    "typography in soft cream (#F5EFE6). Brass-gold accent (#C9A86B) reserved "
    "for ONE element only. Generous negative space. Single focal point. "
    "Late-night editorial, Bloomberg Businessweek aesthetic. Quietly premium, "
    "restrained. Avoid: bright accents, sparkles, gradients, drop shadows, "
    "glossy effects, exclamation points, all-caps stacking, photographic "
    "elements."
)

PHOTO_BASE = (
    "Lifestyle photograph in the editorial style of Magnolia Journal or "
    "Kinfolk magazine. Soft morning light from an east-facing window, warm "
    "5000K color temperature, slight film grain. Real residential interior "
    "with white-oak cabinetry, soft cream walls. Composition has generous "
    "negative space for typography overlay. Avoid: stock-photo cleaners, "
    "feather dusters, sparkles, neon, harsh studio flash, multiple people, "
    "comic effects."
)


ASSETS = [
    # ---- IG Carousel-02 — "Starting At" Trap (7 slides) ----
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-01-cover.png", "1:1",
        EXPOSE_BASE + " Composition centered. A small white serif overline at top "
        "reads: \"The two most expensive words in cleaning:\" Then a blank line. "
        "Then a very large editorial serif headline, set in vivid red (#C32D2D), "
        "in quotation marks: \"starting at\". Below it, at the bottom right corner, "
        "a small white right-pointing arrow followed by lowercase humanist sans-serif "
        "word \"swipe\" in white."
    ),
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-02-the-pattern.png", "1:1",
        EXPOSE_BASE + " Composition left-aligned, four short lines stacked with "
        "vertical space between each, all in white editorial serif: Line 1 (in "
        "quotation marks): \"It is starting at $99.\" Line 2: \"You book.\" Line 3: "
        "\"The cleaner shows up.\" Line 4, in red (#C32D2D): \"The bill is $260.\""
    ),
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-03-why-it-happens.png", "1:1",
        EXPOSE_BASE + " A white serif heading at the top: \"Starting at means:\" "
        "Below the heading, five short lines in white humanist sans-serif, each "
        "preceded by a red (#C32D2D) right-pointing arrow: Line 1: \"Supplies, "
        "extra.\" Line 2: \"Travel, extra.\" Line 3: \"It needed extra time, "
        "extra.\" Line 4: \"Pets? Extra.\" Line 5: \"Two-story foyer? Extra.\" "
        "Below those, a single closing line in red serif: \"The starting price "
        "isn't the price.\""
    ),
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-04-the-fix.png", "1:1",
        EXPOSE_BASE + " A small white serif overline at top: \"The question that "
        "fixes it. Word for word:\" Below it, centered, a large white editorial "
        "serif headline in quotation marks: \"Can you give me a flat, all-in price "
        "for that, sent to me in writing?\" Below it, in smaller white humanist "
        "sans-serif: \"A real cleaner answers in under a minute.\""
    ),
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-05-in-writing.png", "1:1",
        EXPOSE_BASE + " Left-aligned editorial serif white text, three short lines "
        "stacked vertically with generous space: Line 1 (large): \"A text counts.\" "
        "Line 2 (large): \"A voice promise doesn't.\" A blank line. Then in smaller "
        "white serif: \"If they hedge —\" Then two italic indented lines in red "
        "(#C32D2D): \"every home is different…\" and \"we'll see when we get "
        "there…\" Below those, a closing line in white: \"keep calling.\""
    ),
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-06-our-flat-starts.png", "1:1",
        CREAM_BASE + " A navy serif headline at top: \"For reference, our flat "
        "starting prices:\" Below it, three lines arranged as a clean price list, "
        "each on its own line in navy humanist sans-serif: Line 1: \"Recurring — "
        "from $99\" Line 2: \"Deep clean — from $175\" Line 3: \"Move-in / out — "
        "from $225\" Below those, in smaller navy italic serif: \"Final price "
        "depends on size and condition.\" In brass-gold (#C9A86B), one final "
        "underlined line: \"Not on the day.\""
    ),
    (
        "instagram/feed/2hr-checklist-carousel-02", "slide-07-cta.png", "1:1",
        CREAM_BASE + " A navy serif headline, centered: \"The full 7-question "
        "checklist is free.\" Below the headline, in smaller navy humanist "
        "sans-serif: \"Link in bio · or DM \\\"checklist\\\"\" Below that, "
        "additional space, then a small brass-gold word-mark at the bottom: "
        "\"The Valley Clean Team — Same team, every time.\""
    ),

    # ---- IG Reel hook frames (9:16) ----
    (
        "instagram/reels", "reel-01-hook-frame-9x16.png", "9:16",
        PHOTO_BASE + " Aspect ratio 9:16 portrait. Close-up overhead photograph "
        "of a vintage analog stopwatch with large clear numerals (0:00) sitting on "
        "a clean white-oak kitchen counter. A hand reaches into frame from the "
        "left to press the start button. Soft morning light. Slight film grain. "
        "Across the upper third, large bold navy serif text overlay (on cream "
        "ground plate): \"If your cleaner is taking 3 days to quote you...\" "
        "Composition has the stopwatch in the lower two-thirds, generous negative "
        "space for the text in the upper third."
    ),
    (
        "instagram/reels", "reel-02-hook-frame-9x16.png", "9:16",
        PHOTO_BASE + " Aspect ratio 9:16 portrait. Close-up photograph of a "
        "smartphone screen at 9:47 PM Saturday: a Google search bar shows the "
        "phrase \"house cleaner Huntsville same day\" being typed (cursor visible). "
        "The phone is held in a hand, slightly tilted, with a softly blurred warm "
        "lamp-lit room in the background. Across the upper third, large bold "
        "centered text overlay in white (with a thin black drop shadow for "
        "legibility): \"$2,400 deposit on the line. 6 cleaners ghosted her.\""
    ),

    # ---- FB post headers (16:9) ----
    (
        "facebook", "post-02-deposit-story-16x9-v1.png", "16:9",
        PHOTO_BASE + " Aspect ratio 16:9. Empty residential interior: a tidy "
        "living room with three brown moving boxes neatly stacked beside the front "
        "door, white-oak hardwood floors, morning light pouring through tall "
        "windows. A house key rests on top of the front box. No people. The "
        "composition has the boxes in the right third, with generous negative "
        "space on the left for typography overlay. Subtle film grain. Editorial "
        "Magnolia Journal style."
    ),
    (
        "facebook", "post-03-pricing-honesty-16x9-v1.png", "16:9",
        EXPOSE_BASE + " Aspect ratio 16:9 widescreen. The composition reads as a "
        "single editorial spread: on the left third, a small white serif overline: "
        "\"A small rant about cleaning pricing.\" Below it, a very large editorial "
        "serif headline in quotation marks, set in red (#C32D2D): \"starting at\". "
        "Then a single closing line in white serif: \"isn't a price. It's a trap.\" "
        "On the right two-thirds, generous negative space — keep it deliberately "
        "empty for the social-post copy to dominate. No illustrations, no icons, "
        "no photography."
    ),

    # ---- LinkedIn carousel — slides 1, 4, 7, 8 (brand palette) ----
    (
        "linkedin/carousel", "slide-01-cover.png", "1:1",
        CREAM_BASE + " The composition reads on three lines, left-aligned, with "
        "generous vertical spacing: Line 1 (large navy editorial serif): \"Why your "
        "cleaner takes 5 days to quote you.\" Below it, in smaller italic navy "
        "serif, in parentheses on two lines: \"(And what we did differently when we "
        "built ours.)\" At the bottom, in small navy humanist sans-serif: "
        "\"— Todd Freder · The Valley Clean Team\""
    ),
    (
        "linkedin/carousel", "slide-04-the-inversion.png", "1:1",
        NAVY_BASE + " A cream serif heading at top: \"What if you ran it the other "
        "direction?\" Below it, four short lines in cream serif, each on its own "
        "line, with brass-gold (#C9A86B) right-pointing arrows preceding each: "
        "Line 1: \"Quote in under 2 hours.\" Line 2: \"Flat price (no starting "
        "at).\" Line 3: \"Same-day arrival window.\" Line 4: \"In writing.\""
    ),
    (
        "linkedin/carousel", "slide-07-the-lesson.png", "1:1",
        NAVY_BASE + " A cream serif headline centered: \"The lesson:\" A blank "
        "line. Then a slightly larger cream serif statement on three lines: "
        "\"Operational inconvenience\" \"is somebody else's\" \"competitive moat.\" "
        "Below, in smaller cream humanist sans-serif italic: \"Stay inconvenient.\""
    ),
    (
        "linkedin/carousel", "slide-08-cta.png", "1:1",
        CREAM_BASE + " A navy serif headline at top: \"If this helped, share it "
        "with whoever needs it.\" Below the headline, in smaller navy humanist "
        "sans-serif: \"And if you run a service business, the free 2-hour quote "
        "checklist we built is in the comments. Steal whatever's useful.\" Below "
        "that, a small brass-gold word-mark at the bottom: \"— Todd Freder · "
        "The Valley Clean Team\""
    ),

    # ---- Nextdoor posts (3 photo-led, 1:1) ----
    (
        "nextdoor", "post-01-huntsville-1x1.png", "1:1",
        PHOTO_BASE + " A real Huntsville-area kitchen interior: classic white "
        "Shaker cabinets, brushed-nickel hardware, a stoneware coffee mug on a "
        "white quartz island, soft morning light through tall windows. A small "
        "framed photograph on the island shows a family with a young child. "
        "Subtle film grain, warm 5000K morning light. No people in the frame. "
        "The composition has the island foreground in the lower two-thirds with "
        "the kitchen environment soft-blurred behind. Aesthetic: Southern Living "
        "magazine, neighborly residential."
    ),
    (
        "nextdoor", "post-02-shoals-1x1.png", "1:1",
        PHOTO_BASE + " A real Muscle Shoals area home interior: an older "
        "farmhouse-style kitchen with painted-cream cabinetry, a vintage "
        "porcelain farmhouse sink, wide-plank pine floors, lace curtains. A "
        "single cast-iron skillet hangs on the wall. Morning light through "
        "east-facing window. Slight film grain. No people. Composition reads as "
        "warm, lived-in, generational. Aesthetic: Magnolia Journal, small-town "
        "Southern home."
    ),
    (
        "nextdoor", "post-03-mountain-brook-nashville-1x1.png", "1:1",
        PHOTO_BASE + " A real upscale Mountain Brook / Belle Meade area home "
        "interior: a refined formal living room with antique heirloom furniture, "
        "wide-plank original oak hardwoods, a tall arched window with morning "
        "light, fresh white peonies in a stoneware vase on a low coffee table. No "
        "people. Subtle film grain, warm 5000K light. Aesthetic: Veranda magazine, "
        "Southern estate quietly premium. Generous negative space for typography "
        "overlay later."
    ),
]


def main():
    base = Path("creative-output/social-graphics")
    results = []
    for i, (subdir, fname, ratio, prompt) in enumerate(ASSETS):
        dest = base / subdir / fname
        dest.parent.mkdir(parents=True, exist_ok=True)
        if i > 0:
            time.sleep(SUBMIT_GAP_S)
        print(f"[start {i+1}/{len(ASSETS)}] {dest}", flush=True)
        res = run(prompt, str(dest), ratio)
        res["name"] = fname
        res["subdir"] = subdir
        results.append(res)
        print(f"[done  {i+1}/{len(ASSETS)}] {fname}: {'ok' if res.get('ok') else res.get('status') or res.get('error')}", flush=True)

    out = Path("creative-output/_round2_results.json")
    out.write_text(json.dumps(results, indent=2))
    succ = sum(1 for r in results if r.get("ok"))
    print(f"\n{succ}/{len(results)} succeeded")


if __name__ == "__main__":
    main()
