"""Regenerate slide-01-cover with a tighter prompt to eliminate the duplicate 'take' typo."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from replicate_gen import run  # noqa: E402

PROMPT = (
    "Editorial typographic poster, 1080x1080 square. Soft light grey background "
    "(#E5E5EA), clean and smooth. The composition is type only — no "
    "illustrations, no icons, no people, no photography. "
    "Render the following text exactly, set in a warm high-contrast serif "
    "(Playfair Display style, charcoal color #333333), centered vertically and "
    "horizontally, generous negative space, 10 percent margin: "
    "Line 1 (large serif, two lines wrapped): \"Most cleaning quotes take 5 days.\" "
    "Then a blank line of vertical space. "
    "Line 2 (smaller serif, one line wrapped to two lines if needed): \"Here is how to "
    "get one in 2 hours.\" "
    "In the bottom-right corner only: a small peach (#FFA985) right-pointing "
    "arrow followed by the lowercase humanist sans-serif (Inter style) word \"swipe\". "
    "Do not duplicate, repeat, or stutter any word. Render the text exactly as quoted. "
    "Warm, friendly, approachable — not navy, not cream, not brass, not luxury editorial. "
    "Avoid: exclamation points, sparkles, gradients, drop shadows, neon, all-caps "
    "stacking."
)

dest = Path("creative-output/social-graphics/instagram/feed/2hr-checklist-carousel-01/slide-01-cover.png")
print("Regenerating slide 1...", flush=True)
res = run(PROMPT, str(dest), "1:1")
print(res)
