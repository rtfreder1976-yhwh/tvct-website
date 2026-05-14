"""Generate the full launch batch:
- 9 IG carousel slides (cream / navy / cream-photo per locked direction)
- 1 lead-magnet PDF cover (photo-led)
- 1 Facebook post-01 header (photo-led)

Serialized at 12s gap to stay under Replicate's <$5-credit throttle.
"""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from replicate_gen import run  # noqa: E402

SUBMIT_GAP_S = 12

# ---- Shared style fragments ----

CREAM_BASE = (
    "Editorial typographic poster, 1080x1080 square format. Soft cream paper background "
    "(#F5EFE6) with subtle natural paper-grain texture. Bold modern editorial serif "
    "typography in deep navy (#1B2A41). Brass-gold accent (#C9A86B) reserved for one "
    "element only — an arrow, a single underline, or a number. Generous negative space, "
    "10 percent margin on all sides. Single focal point. Studio McGee and Kinfolk magazine "
    "aesthetic. Quietly premium. Avoid: exclamation points, sparkles, neon colors, "
    "gradients, drop shadows, photographic elements, cartoon, all-caps stacking."
)

NAVY_BASE = (
    "Editorial typographic poster, 1080x1080 square format. Deep navy background (#1B2A41) "
    "with subtle matte texture. Bold modern editorial serif typography in soft cream "
    "(#F5EFE6). Brass-gold accent (#C9A86B) reserved for ONE element only — the large "
    "numeral or a single underline. Generous negative space. Single focal point. "
    "Late-night editorial, Bloomberg Businessweek aesthetic. Quietly premium, restrained. "
    "Avoid: bright accents, sparkles, gradients, drop shadows, glossy effects, "
    "exclamation points, all-caps stacking, photographic elements."
)

PHOTO_BASE = (
    "Lifestyle photograph in the editorial style of Magnolia Journal or Kinfolk magazine. "
    "Soft morning light from an east-facing window, warm 5000K color temperature, slight "
    "film grain. Real residential kitchen with white-oak cabinetry, white-oak island, "
    "cream walls. Composition has generous negative space for typography overlay. "
    "Avoid: stock-photo cleaners, feather dusters, sparkles, neon, harsh studio flash, "
    "multiple people, comic effects."
)


SLIDES = [
    # (filename, aspect_ratio, prompt)
    (
        "slide-01-cover.png", "1:1",
        CREAM_BASE + " The composition reads on three lines, centered, with the headline "
        "taking the upper two-thirds: large navy serif headline reading \"Most cleaning "
        "quotes take 5 days.\" Below it, slightly smaller matching serif, also navy: "
        "\"Here is how to get one in 2 hours.\" In the bottom-right corner, a small "
        "brass-gold right-pointing arrow followed by the lowercase humanist sans-serif "
        "word \"swipe\". No other elements."
    ),
    (
        "slide-02-setup.png", "1:1",
        CREAM_BASE + " The text is left-aligned with a single brass-gold short horizontal "
        "rule above the headline. Navy serif headline reads: \"The way most cleaning gets "
        "sold is broken.\" Below it, three lines of body copy in a smaller humanist "
        "sans-serif, navy: \"Day 1 — you fill out a form.\" \"Day 3 — someone walks your "
        "house.\" \"Day 5 — \\\"starting at $X\\\" lands.\" Below that, a single closing "
        "line in serif: \"Here are 7 things to ask before you book anyone.\""
    ),
    (
        "slide-03-item-1.png", "1:1",
        NAVY_BASE + " The composition leads with a giant brass-gold numeral \"1\" in the "
        "upper-left, set in editorial serif at very large scale. To its right, a cream "
        "serif headline reads on two lines: \"Decide what kind of clean you actually "
        "need.\" Below the headline, three lines of smaller cream humanist sans-serif "
        "body copy: \"Recurring. Deep. Move-in or out.\" \"Three categories, three "
        "prices.\" \"If a cleaner can't tell which fits without an in-home visit, they "
        "are guessing.\""
    ),
    (
        "slide-04-item-4.png", "1:1",
        NAVY_BASE + " The composition leads with a giant brass-gold numeral \"4\" in the "
        "upper-left, set in editorial serif at very large scale. To its right, a cream "
        "serif headline: \"Time the response.\" Below the headline, four lines of cream "
        "humanist sans-serif body copy: \"A real local team replies in under 2 hours.\" "
        "\"Most chains take 24 to 72 hours.\" \"Aggregator apps reply fast — with a "
        "different stranger every visit.\""
    ),
    (
        "slide-05-item-6.png", "1:1",
        NAVY_BASE + " The composition leads with a giant brass-gold numeral \"6\" in the "
        "upper-left, set in editorial serif at very large scale. To its right, a cream "
        "serif headline on two lines: \"Get the arrival window in writing.\" Below the "
        "headline, three lines of cream humanist sans-serif body copy: \"A real same-day "
        "job comes with a 2 to 4 hour window, sent by text.\" \"\\\"We will try to fit "
        "you in\\\" is not same-day.\""
    ),
    (
        "slide-06-item-7.png", "1:1",
        NAVY_BASE + " The composition leads with a giant brass-gold numeral \"7\" in the "
        "upper-left, set in editorial serif at very large scale. To its right, a cream "
        "serif headline on two lines: \"Ask for a flat price. Not starting at.\" Below "
        "the headline, three lines of cream humanist sans-serif body copy: "
        "\"\\\"Starting at $X\\\" almost always becomes 30 to 80 percent more on the "
        "day.\" \"A flat number in writing is the price you will pay.\""
    ),
    (
        "slide-07-bonus.png", "1:1",
        NAVY_BASE + " A cream serif headline at top, left-aligned: \"3 bonus questions "
        "that reveal a serious cleaner.\" Below it, three numbered questions, each on its "
        "own line, in cream serif. Each question is preceded by a brass-gold short "
        "right-pointing arrow. Line 1: \"Are you insured? For how much, in dollars?\" "
        "Line 2: \"Is it the same team every time?\" Line 3: \"Do I get photos of the "
        "finished clean?\" Generous spacing between lines."
    ),
    (
        "slide-08-recap.png", "1:1",
        CREAM_BASE + " A navy serif headline at top, left-aligned: \"The full checklist.\""
        " Below the headline, seven numbered items in a single column, each on its own "
        "line, set in humanist sans-serif navy text. Each number is preceded by a small "
        "brass-gold checkmark glyph. Items: \"1. Decide the category.\" \"2. Bedrooms + "
        "baths ready.\" \"3. Flag deal-breaker rooms.\" \"4. Time the response.\" "
        "\"5. Have square footage ready.\" \"6. Arrival window in writing.\" \"7. Flat "
        "price, in writing.\" Generous spacing between lines."
    ),
    (
        "slide-09-cta.png", "1:1",
        PHOTO_BASE + " A clipboard holding a printed cream-paper checklist with a navy "
        "serif title reading \"The 2-Hour Quote Checklist\" rests on the white-oak "
        "kitchen island in soft morning light. A wooden pencil lies beside the clipboard. "
        "Composition: clipboard centered in the lower third, generous negative space in "
        "the upper two-thirds. Across the upper third, in bold navy serif typography "
        "overlaid on the kitchen scene: \"Want the full PDF?\" Below it, in smaller "
        "humanist sans-serif navy: \"Free. 5 minutes to read. Link in bio or DM "
        "\\\"checklist\\\".\" A small brass-gold word-mark reading \"The Valley Clean "
        "Team\" appears at the bottom edge."
    ),
    # Lead-magnet PDF cover (4:5 to fit standard portrait PDF preview thumb)
    (
        "lead-magnet-cover.png", "4:5",
        PHOTO_BASE + " Aspect ratio 4:5, 1080x1350. A single sheet of cream paper rests "
        "centered on the white-oak kitchen island in soft morning light. Printed on the "
        "paper in bold navy editorial serif typography, perfectly readable: \"The 2-Hour "
        "Quote Checklist\". Below the title, in smaller navy humanist sans-serif: "
        "\"7 things to know before you book any cleaner.\" Below that, a small "
        "brass-gold horizontal rule. Below the rule, in small navy serif italic: "
        "\"The Valley Clean Team.\" A wooden pencil rests beside the paper. Subtle film "
        "grain. The composition has the paper in the lower-center two-thirds with the "
        "kitchen environment soft-blurred in the upper third."
    ),
    # FB post-01 header (1.91:1 closest available is 16:9, Nano Banana Pro supports 16:9)
    (
        "fb-header.png", "16:9",
        PHOTO_BASE + " Aspect ratio 16:9. A smartphone lies flat on a white-oak kitchen "
        "island in soft morning light. The phone screen displays a PDF document open to "
        "its cover page; the cover reads in bold navy editorial serif: \"The 2-Hour Quote "
        "Checklist.\" Beside the phone, a stoneware mug of coffee. To the right of the "
        "phone, generous negative space on the wood surface for an overline. In that "
        "negative space, in small bold navy serif: \"The 2-Hour Quote Checklist · Free "
        "PDF.\" Composition: phone occupies the left third, copy space the right "
        "two-thirds. Subtle film grain. Warm morning light."
    ),
]


def main():
    out = Path("creative-output")
    carousel_dir = out / "social-graphics" / "instagram" / "feed" / "2hr-checklist-carousel-01"
    fb_dir = out / "social-graphics" / "facebook"
    lm_dir = out / "social-graphics" / "lead-magnet"
    for d in (carousel_dir, fb_dir, lm_dir):
        d.mkdir(parents=True, exist_ok=True)

    results = []
    for i, (fname, ratio, prompt) in enumerate(SLIDES):
        if fname.startswith("slide-"):
            dest = carousel_dir / fname
        elif fname == "fb-header.png":
            dest = fb_dir / "post-01-header-16x9-v1.png"
        elif fname == "lead-magnet-cover.png":
            dest = lm_dir / "checklist-cover-4x5-v1.png"
        else:
            dest = out / fname

        if i > 0:
            time.sleep(SUBMIT_GAP_S)
        print(f"[start] {fname} -> {dest}", flush=True)
        res = run(prompt, str(dest), ratio)
        res["name"] = fname
        results.append(res)
        print(f"[done]  {fname}: {'ok' if res.get('ok') else res.get('status') or res.get('error')}", flush=True)

    (out / "_final_batch_results.json").write_text(json.dumps(results, indent=2))
    succ = sum(1 for r in results if r.get("ok"))
    print(f"\n{succ}/{len(results)} succeeded")


if __name__ == "__main__":
    main()
