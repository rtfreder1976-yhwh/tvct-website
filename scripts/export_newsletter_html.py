"""Convert newsletter editions to paste-ready brand-styled HTML."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from ghl_push_templates import md_body_to_html, parse_frontmatter, wrap_email  # noqa: E402

EDITIONS_DIR = Path("campaigns/newsletter/editions")
OUT_DIR = EDITIONS_DIR / "_html"


def _email_body_section(md: str) -> str:
    """Newsletter md uses '## Email Copy' delimiter like the welcome emails."""
    m = re.search(r"^## Email Copy\s*\n(.*?)(?:\n---|\Z)", md, re.S | re.M)
    if not m:
        # No header? Treat the whole thing past the frontmatter as the body.
        body = md.split("---", 2)[-1].strip()
        return body
    return m.group(1).strip()


def md_full_to_html(md: str) -> str:
    """Wrapper that respects newsletter format (no separate Email Copy header in some)."""
    if "## Email Copy" in md:
        return md_body_to_html(md)
    # Fallback: treat the post-frontmatter content as body
    body = _email_body_section(md)
    fake = "## Email Copy\n" + body
    return md_body_to_html(fake)


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(EDITIONS_DIR.glob("0*.md"))
    index = [
        "# Paste-ready HTML — Newsletter editions",
        "",
        "Each `.html` file is a fully self-contained brand-styled email body. Paste into GHL via **Marketing → Emails → Campaigns → + New → Import HTML** (newsletters typically go out as one-time campaigns, not templates).",
        "",
        "After pasting, set the subject + preview text from this table:",
        "",
        "| # | Send date | Subject (variant A) | Preview text | Sender |",
        "| - | - | - | - | - |",
    ]
    for i, f in enumerate(files, start=1):
        md = f.read_text(encoding="utf-8")
        fm, _ = parse_frontmatter(md)
        body_html = md_full_to_html(md)
        sender = fm.get("sender", "Todd")
        full = wrap_email(body_html, fm.get("preview_text", ""), sender)
        slug = re.sub(r"^\d+-", "", f.stem)
        dest = OUT_DIR / f"{f.stem}.html"
        dest.write_text(full, encoding="utf-8")
        index.append(
            f"| {fm.get('edition', i)} | {fm.get('send_date','-')} | {fm.get('subject_line_a','')} | {fm.get('preview_text','')} | {sender} |"
        )
        print(f"wrote {dest}")
    (OUT_DIR / "README.md").write_text("\n".join(index) + "\n", encoding="utf-8")
    print(f"\nIndex: {OUT_DIR / 'README.md'}")


if __name__ == "__main__":
    main()
