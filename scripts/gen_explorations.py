"""Generate 3 direction explorations for IG carousel slide 1, in parallel."""
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from replicate_gen import run  # noqa: E402

# Replicate throttles accounts with <$5 credit to 6/min with burst=1.
# Serialize submissions with a safe gap.
SUBMIT_GAP_S = 12

OUT = Path("creative-output/explorations/2hr-checklist")

DIRECTIONS = {
    "direction-a-light-peach": (
        "Editorial typographic poster, 1080x1080 square format. Soft light grey background (#E5E5EA), "
        "clean and smooth. A warm high-contrast serif headline (Playfair Display style) in charcoal "
        "(#333333) reads on two lines, large and confident: \"Most cleaning quotes take 5 days.\" Below "
        "it, in slightly smaller matching serif, also charcoal: \"Here is how to get one in 2 hours.\" At "
        "the bottom, a small peach (#FFA985) right-pointing arrow next to the small lowercase word "
        "\"swipe\" in humanist sans-serif (Inter style). Generous negative space, 10 percent margin on all "
        "sides. Single focal point. Type-led design — no illustrations, no icons, no people, no cleaning "
        "products. Warm, friendly, approachable, trustworthy. "
        "Avoid: navy, cream, brass, gold, luxury editorial styling, exclamation points, sparkles, neon "
        "colors, gradients, drop shadows, all-caps stacking."
    ),
    "direction-b-charcoal-ground": (
        "Editorial typographic poster, 1080x1080 square format. Deep charcoal background (#333333) with "
        "a subtle matte texture. A warm high-contrast serif headline (Playfair Display style) in soft "
        "off-white reads on two lines, large and confident: \"Most cleaning quotes take 5 days.\" Below "
        "it, in slightly smaller matching serif, also off-white: \"Here is how to get one in 2 hours.\" "
        "At the bottom, a peach (#FFA985) right-pointing arrow next to the lowercase word \"swipe\" in "
        "humanist sans-serif (Inter style). Peach is the ONLY colored element. Generous negative space. "
        "Single focal point. Type-led design, no illustrations, no icons. Warm and confident rather than "
        "cold or corporate. "
        "Avoid: navy, cream, brass, gold, sparkles, gradients, drop shadows, glossy effects."
    ),
    "direction-c-photo-led": (
        "Square 1080x1080 social media post. Lifestyle photograph: a clipboard holding a single sheet "
        "of white paper sits on a clean white-oak kitchen island in soft natural daylight from a "
        "window. A wooden pencil lies beside the clipboard. Nothing else on the island. "
        "Hand-lettered on the paper in charcoal (#333333) ink: \"The 2-Hour Quote Checklist\". Subtle film "
        "grain. Warm 5000K color temperature. Composition: clipboard centered with generous negative "
        "space top and bottom. Across the top in a small bold serif overline in charcoal, set on the "
        "wood: \"Most quotes take 5 days. Here is the 2-hour version.\" A single short peach (#FFA985) "
        "brushstroke underline sits beneath the overline. Warm, real, lived-in residential photography — "
        "a home someone actually lives in, not a showroom. "
        "Avoid: staged stock-photo cleaners, feather dusters, sparkles, neon, comic effects, harsh "
        "studio flash, multiple people, cream or brass color grading."
    ),
}


def gen(name: str, prompt: str):
    dest = OUT / f"{name}.png"
    print(f"[start] {name}", flush=True)
    res = run(prompt, str(dest), "1:1")
    res["name"] = name
    print(f"[done]  {name} -> {res.get('status') or ('ok' if res.get('ok') else 'fail')}", flush=True)
    return res


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    items = list(DIRECTIONS.items())
    for i, (name, prompt) in enumerate(items):
        if i > 0:
            time.sleep(SUBMIT_GAP_S)
        results.append(gen(name, prompt))
    (OUT / "_results.json").write_text(json.dumps(results, indent=2))
    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
