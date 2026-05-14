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
    "direction-a-editorial-cream": (
        "Editorial typographic poster, 1080x1080 square format. Soft cream paper background (#F5EFE6) "
        "with subtle natural paper-grain texture. A bold modern editorial serif headline in deep navy "
        "(#1B2A41) reads on two lines, large and confident: \"Most cleaning quotes take 5 days.\" Below "
        "it, in slightly smaller matching serif, also navy: \"Here is how to get one in 2 hours.\" At the "
        "bottom, a small brass-gold (#C9A86B) right-pointing arrow next to the small lowercase word "
        "\"swipe\" in humanist sans-serif. Generous negative space, 10 percent margin on all sides. "
        "Single focal point. Type-led design — no illustrations, no icons, no people, no cleaning "
        "products. Magazine-cover quality. Studio McGee and Kinfolk magazine aesthetic. Quietly premium. "
        "Avoid: exclamation points, sparkles, neon colors, gradients, drop shadows, all-caps stacking."
    ),
    "direction-b-dark-navy-luxe": (
        "Premium dark mode poster, 1080x1080 square format. Deep navy background (#1B2A41) with subtle "
        "matte texture. Bold modern editorial serif headline in soft cream (#F5EFE6) reads on two lines, "
        "large and confident: \"Most cleaning quotes take 5 days.\" Below it, in slightly smaller "
        "matching serif also in cream: \"Here is how to get one in 2 hours.\" At the bottom, a brass-gold "
        "(#C9A86B) right-pointing arrow next to the lowercase word \"swipe\" in humanist sans-serif. "
        "Generous negative space. Single focal point. Type-led design, no illustrations, no icons. "
        "Aesthetic: late-night editorial, Bloomberg Businessweek meets a small-batch whiskey label. "
        "Quietly premium, confident, restrained. Avoid: bright accent colors, sparkles, gradients, "
        "drop shadows, glossy effects."
    ),
    "direction-c-photo-led": (
        "Square 1080x1080 social media post. Lifestyle photograph: a clipboard holding a single sheet "
        "of cream paper sits on a clean white-oak kitchen island in soft morning light from an "
        "east-facing window. A wooden pencil lies beside the clipboard. Nothing else on the island. "
        "Hand-lettered on the cream paper in dark navy ink: \"The 2-Hour Quote Checklist\". Subtle film "
        "grain. Warm 5000K color temperature. Composition: clipboard centered with generous negative "
        "space top and bottom. Across the top in a small bold serif overline in dark navy, set on the "
        "wood: \"Most quotes take 5 days. Here is the 2-hour version.\" Photograph in the editorial "
        "style of Magnolia Journal or Kinfolk magazine. Quietly premium, residential, warm. "
        "Avoid: staged stock-photo cleaners, feather dusters, sparkles, neon, comic effects, harsh "
        "studio flash, multiple people."
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
