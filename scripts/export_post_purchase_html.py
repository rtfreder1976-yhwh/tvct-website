"""Convert post-purchase sequence markdown emails to paste-ready brand-styled HTML."""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from ghl_push_templates import md_body_to_html, parse_frontmatter, wrap_email  # noqa: E402

EMAILS_DIR = Path("campaigns/post-purchase-sequence/emails")
OUT_DIR = EMAILS_DIR / "_html"


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    files = sorted(EMAILS_DIR.glob("0[1-4]-*.md"))
    christen_emails = {1, 3}  # Christen: anxiety-reduce + review ask. Todd: ops + math.
    index = [
        "# Paste-ready HTML for GHL — Post-Purchase Sequence",
        "",
        "Each `.html` file below is a fully self-contained brand-styled email body. Paste each into GHL's email builder using **Marketing → Emails → Templates → + New → Import HTML**.",
        "",
        "After pasting, set the template name, subject line, and preview text from this table:",
        "",
        "| # | GHL template name | Subject (variant A) | Preview text |",
        "| - | - | - | - |",
    ]
    for i, f in enumerate(files, start=1):
        md = f.read_text(encoding="utf-8")
        fm, _ = parse_frontmatter(md)
        body_html = md_body_to_html(md)
        signoff = "Christen" if i in christen_emails else "Todd"
        full = wrap_email(body_html, fm.get("preview_text", ""), signoff)
        slug = re.sub(r"^\d+-", "", f.stem)
        dest = OUT_DIR / f"{i:02d}-{slug}.html"
        dest.write_text(full, encoding="utf-8")
        name = f"TVCT — Post-Purchase #{i} — {slug.replace('-', ' ').title()}"
        index.append(
            f"| {i} | `{name}` | {fm.get('subject_line_a','')} | {fm.get('preview_text','')} |"
        )
        print(f"wrote {dest}")
    (OUT_DIR / "README.md").write_text("\n".join(index) + "\n", encoding="utf-8")
    print(f"\nIndex: {OUT_DIR / 'README.md'}")


if __name__ == "__main__":
    main()
