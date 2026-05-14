"""Clean up + export workflow:

1. Find every email template in GHL named exactly 'New Template' OR starting
   with '_PROBE_' / '_probe_' / '_yesterday_'. Print each one for review.
2. After confirmation (--delete flag), remove them via DELETE.
3. Regenerate the 7 brand-styled HTML files to disk at
   campaigns/2-hour-quote-checklist/emails/_html/ so the user can paste them
   directly into GHL's email builder.

Run:
    python scripts/ghl_cleanup_and_export.py            # dry run (lists only)
    python scripts/ghl_cleanup_and_export.py --delete   # actually delete
    python scripts/ghl_cleanup_and_export.py --export   # write HTML files
    python scripts/ghl_cleanup_and_export.py --delete --export
"""
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# Reuse the conversion helpers from the existing push script
sys.path.insert(0, str(Path(__file__).parent))
from ghl_push_templates import (  # noqa: E402
    md_body_to_html,
    parse_frontmatter,
    wrap_email,
    EMAILS_DIR,
)

SECRETS = Path(os.path.expanduser("~/.claude/.mcp-secrets.env"))
ENV = {}
if SECRETS.exists():
    for line in SECRETS.read_text().splitlines():
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            ENV[k.strip()] = v.strip().strip('"').strip("'")

KEY = ENV.get("LEADCONNECTOR_API_KEY") or os.environ.get("LEADCONNECTOR_API_KEY")
LOC = ENV.get("LEADCONNECTOR_LOCATION_ID") or os.environ.get("LEADCONNECTOR_LOCATION_ID")
BASE = "https://services.leadconnectorhq.com"
HEADERS = {
    "Authorization": f"Bearer {KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}


def api(method: str, path: str, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:400]}


# ---- Cleanup ----

JUNK_PATTERNS = [
    r"^New Template$",
    r"^_PROBE_",
    r"^_probe_",
    r"^_yesterday_",
]


def is_junk(name: str) -> bool:
    return any(re.match(p, name) for p in JUNK_PATTERNS)


def list_all():
    out = []
    offset = 0
    while True:
        path = f"/emails/builder?locationId={LOC}&limit=100&offset={offset}"
        r = api("GET", path)
        if r.get("_error"):
            print(f"List error: {r}", file=sys.stderr)
            break
        batch = r.get("builders", [])
        out.extend(batch)
        if len(batch) < 100:
            break
        offset += 100
        if offset > 1000:
            break
    return out


def cleanup(do_delete: bool):
    templates = list_all()
    junk = [t for t in templates if is_junk(t.get("name", ""))]

    # Only target templates created in the last 7 days (so we don't accidentally
    # touch a legitimate older "New Template" left by previous work)
    recent_cutoff = "2026-05-07"  # 7 days before today
    recent_junk = [
        t for t in junk
        if t.get("dateAdded", "") >= recent_cutoff
    ]

    print(f"Total templates in account: {len(templates)}")
    print(f"Junk-pattern matches: {len(junk)}")
    print(f"Recent (since {recent_cutoff}) junk matches: {len(recent_junk)}")
    print()
    if not recent_junk:
        print("Nothing to delete.")
        return

    print("Would delete:")
    for t in recent_junk:
        print(f"  - {t.get('dateAdded','-')[:19]}  {t['id']}  type={t.get('templateType','?'):<8} {t.get('name','')!r}")

    if not do_delete:
        print("\n[dry run — pass --delete to actually remove these]")
        return

    print(f"\nDeleting {len(recent_junk)}...")
    for t in recent_junk:
        r = api("DELETE", f"/emails/builder/{LOC}/{t['id']}")
        ok = r.get("ok") or r.get("succeded") or (not r.get("_error"))
        print(f"  delete {t['id']} -> {'OK' if ok else r}")
        time.sleep(0.4)
    print("Done.")


# ---- HTML export ----

def export_html():
    out_dir = EMAILS_DIR / "_html"
    out_dir.mkdir(parents=True, exist_ok=True)
    files = sorted(EMAILS_DIR.glob("0[1-7]-*.md"))
    christen = {1, 2, 4, 7}
    index_lines = [
        "# Paste-ready HTML for GHL email templates",
        "",
        "Each `.html` file below is a fully self-contained brand-styled email body. Paste the entire HTML into GHL's email builder using the **HTML import** option (Marketing → Emails → + New → Import HTML).",
        "",
        "Use these subject lines + preview text when GHL prompts for them:",
        "",
        "| # | Template name (in GHL) | Subject (variant A) | Preview text |",
        "| - | - | - | - |",
    ]
    for i, f in enumerate(files, start=1):
        md = f.read_text(encoding="utf-8")
        fm, _ = parse_frontmatter(md)
        body_html = md_body_to_html(md)
        signoff = "Christen" if i in christen else "Todd"
        full = wrap_email(body_html, fm.get("preview_text", ""), signoff)
        slug = re.sub(r"^\d+-", "", f.stem)
        dest = out_dir / f"{i:02d}-{slug}.html"
        dest.write_text(full, encoding="utf-8")
        name = f"TVCT — 2hr Checklist #{i} — {slug.replace('-', ' ').title()}"
        index_lines.append(
            f"| {i} | `{name}` | {fm.get('subject_line_a','')} | {fm.get('preview_text','')} |"
        )
        print(f"wrote {dest}")
    (out_dir / "README.md").write_text("\n".join(index_lines) + "\n", encoding="utf-8")
    print(f"\nIndex: {out_dir / 'README.md'}")


def main():
    do_delete = "--delete" in sys.argv
    do_export = "--export" in sys.argv
    if not (do_delete or do_export):
        # default: cleanup dry-run + export
        do_export = True
    if do_delete or "--cleanup" in sys.argv or not do_export:
        cleanup(do_delete)
        print()
    if do_export:
        export_html()


if __name__ == "__main__":
    main()
