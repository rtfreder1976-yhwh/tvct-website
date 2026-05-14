"""Push the 7-email welcome sequence into LeadConnector as HTML templates.

Each email's markdown body is extracted from campaigns/2-hour-quote-checklist/emails/0N-*.md,
converted to brand-styled HTML, and POSTed to /emails/builder. We also store the subject
line A/B variants and preview text in the template name so they're visible in the GHL UI.

Idempotent: if a template with the target name already exists, it is deleted first.
"""
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

# Load creds
SECRETS = Path(os.path.expanduser("~/.claude/.mcp-secrets.env"))
ENV = {}
if SECRETS.exists():
    for line in SECRETS.read_text().splitlines():
        if "=" in line and not line.strip().startswith("#"):
            k, v = line.split("=", 1)
            ENV[k.strip()] = v.strip().strip('"').strip("'")

KEY = ENV.get("LEADCONNECTOR_API_KEY") or os.environ.get("LEADCONNECTOR_API_KEY")
LOC = ENV.get("LEADCONNECTOR_LOCATION_ID") or os.environ.get("LEADCONNECTOR_LOCATION_ID")
if not (KEY and LOC):
    sys.exit("Missing LEADCONNECTOR_API_KEY or LEADCONNECTOR_LOCATION_ID")

BASE = "https://services.leadconnectorhq.com"
HEADERS = {
    "Authorization": f"Bearer {KEY}",
    "Version": "2021-07-28",
    "Content-Type": "application/json",
    "Accept": "application/json",
    # Cloudflare on services.leadconnectorhq.com bans default python-urllib UA.
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}

EMAILS_DIR = Path("campaigns/2-hour-quote-checklist/emails")
NAME_PREFIX = "TVCT — 2hr Checklist #"

# Brand tokens (from brand/creative-kit.md)
NAVY = "#1B2A41"
CREAM = "#F5EFE6"
BRASS = "#C9A86B"
GREY = "#6B7280"


def api(method: str, path: str, body=None):
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(f"{BASE}{path}", data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            raw = r.read()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return {"_error": e.code, "_body": e.read().decode()[:600]}


# ---- Markdown -> HTML conversion (minimal, purpose-built) ----

def md_body_to_html(md: str) -> str:
    """Convert the email-copy section of an email markdown file to inline-styled HTML."""
    # Pull only what's between "## Email Copy" and the next "---" or EOF
    m = re.search(r"^## Email Copy\s*\n(.*?)(?:\n---|\Z)", md, re.S | re.M)
    if not m:
        raise ValueError("No '## Email Copy' section found")
    body = m.group(1).strip()

    lines = body.split("\n")
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        s = line.strip()
        if not s:
            i += 1
            continue
        # Blockquote
        if s.startswith(">"):
            quote = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote.append(lines[i].strip().lstrip(">").strip())
                i += 1
            out.append(
                f'<blockquote style="margin:24px 0;padding:16px 20px;'
                f'border-left:3px solid {BRASS};background:{CREAM};'
                f'color:{NAVY};font-style:italic;font-size:17px;line-height:1.6;">'
                + " ".join(quote) + "</blockquote>"
            )
            continue
        # Ordered list
        if re.match(r"^\d+\.\s", s):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s", lines[i].strip()):
                items.append(re.sub(r"^\d+\.\s", "", lines[i].strip()))
                i += 1
            ol = '<ol style="margin:16px 0 16px 24px;padding:0;color:' + NAVY + ';font-size:17px;line-height:1.7;">'
            for it in items:
                ol += '<li style="margin:8px 0;">' + inline_md(it) + "</li>"
            ol += "</ol>"
            out.append(ol)
            continue
        # Unordered list
        if s.startswith("- ") or s.startswith("* "):
            items = []
            while i < len(lines) and (lines[i].strip().startswith("- ") or lines[i].strip().startswith("* ")):
                items.append(lines[i].strip()[2:])
                i += 1
            ul = '<ul style="margin:16px 0 16px 24px;padding:0;color:' + NAVY + ';font-size:17px;line-height:1.7;">'
            for it in items:
                ul += '<li style="margin:8px 0;">' + inline_md(it) + "</li>"
            ul += "</ul>"
            out.append(ul)
            continue
        # P.S. line in bold (matches "**P.S.** ...")
        # Plain paragraph (may span lines until blank)
        para = [s]
        i += 1
        while i < len(lines) and lines[i].strip() and not (
            lines[i].strip().startswith(">")
            or lines[i].strip().startswith("- ")
            or lines[i].strip().startswith("* ")
            or re.match(r"^\d+\.\s", lines[i].strip())
        ):
            para.append(lines[i].strip())
            i += 1
        text = " ".join(para)
        out.append(
            f'<p style="margin:0 0 16px;color:{NAVY};font-size:17px;'
            f'line-height:1.7;">' + inline_md(text) + "</p>"
        )
    return "\n".join(out)


def inline_md(s: str) -> str:
    """Bold, italic, links, inline placeholders preserved."""
    # links: [text](url)
    s = re.sub(
        r"\[([^\]]+)\]\(([^)]+)\)",
        lambda m: f'<a href="{m.group(2)}" style="color:{NAVY};text-decoration:underline;">{m.group(1)}</a>',
        s,
    )
    # bold: **text**
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    # italic: *text*
    s = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", s)
    # CTA placeholder [ Download the PDF → ]
    s = re.sub(
        r"\[\s*(Download the PDF →|Download the PDF -&gt;)\s*\]",
        lambda _: (
            f'<a href="{{{{download_link}}}}" '
            f'style="display:inline-block;background:{NAVY};color:{CREAM};'
            f'padding:14px 28px;text-decoration:none;font-weight:600;border-radius:4px;'
            f'margin:8px 0;font-size:16px;">Download the PDF →</a>'
        ),
        s,
    )
    return s


# ---- Frontmatter parse ----

def parse_frontmatter(md: str) -> tuple[dict, str]:
    if not md.startswith("---"):
        return {}, md
    end = md.find("\n---", 3)
    if end == -1:
        return {}, md
    fm_block = md[3:end].strip()
    body = md[end + 4:].lstrip("\n")
    fm = {}
    for line in fm_block.splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        fm[k.strip()] = v.strip().strip('"').strip("'")
    return fm, body


# ---- HTML wrapper ----

def wrap_email(body_html: str, preview_text: str, signoff_name: str) -> str:
    """Full HTML email scaffold with brand styling."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Valley Clean Team</title>
</head>
<body style="margin:0;padding:0;background:{CREAM};font-family:Georgia, 'Times New Roman', serif;">
<!-- Preheader (hidden in inbox preview only) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:{CREAM};opacity:0;">
  {preview_text}
</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:{CREAM};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:6px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="padding:28px 32px 16px;border-bottom:1px solid #EEE7DC;">
            <div style="font-family:Georgia, serif;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:{BRASS};font-weight:600;">The Valley Clean Team</div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px 8px;">
            {body_html}
          </td>
        </tr>
        <!-- Sign-off / Footer -->
        <tr>
          <td style="padding:8px 32px 28px;border-top:1px solid #EEE7DC;color:{GREY};font-size:13px;line-height:1.6;">
            <p style="margin:16px 0 0;color:{GREY};font-size:13px;">
              The Valley Clean Team · Tuscumbia, AL · Veteran-owned, women-led, $2M insured.<br>
              Alabama: (256) 826-1100 &nbsp;·&nbsp; Tennessee: (615) 510-1427<br>
              <a href="{{{{unsubscribe_url}}}}" style="color:{GREY};text-decoration:underline;">Unsubscribe</a>
              &nbsp;·&nbsp;
              <a href="{{{{update_profile_url}}}}" style="color:{GREY};text-decoration:underline;">Update preferences</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>
"""


# ---- List + delete pre-existing templates with same prefix ----

def find_existing_templates() -> list[dict]:
    """List templates matching our prefix so we can replace them idempotently."""
    out = []
    offset = 0
    limit = 100
    while True:
        path = f"/emails/builder?locationId={LOC}&limit={limit}&offset={offset}"
        r = api("GET", path)
        if r.get("_error"):
            print(f"List error: {r}", file=sys.stderr)
            break
        batch = r.get("builders") or []
        out.extend([b for b in batch if b.get("name", "").startswith(NAME_PREFIX)])
        if len(batch) < limit:
            break
        offset += limit
    return out


def delete_template(tid: str):
    return api("DELETE", f"/emails/builder/{LOC}/{tid}")


# ---- Push templates ----

def push_one(idx: int, file_path: Path) -> dict:
    md = file_path.read_text(encoding="utf-8")
    fm, _ = parse_frontmatter(md)
    body_html = md_body_to_html(md)

    # Choose sign-off name based on email number (from sequence-overview.md)
    christen_emails = {1, 2, 4, 7}
    signoff = "Christen" if idx in christen_emails else "Todd"

    full_html = wrap_email(
        body_html=body_html,
        preview_text=fm.get("preview_text", ""),
        signoff_name=signoff,
    )

    subj_a = fm.get("subject_line_a", "")
    subj_b = fm.get("subject_line_b", "")
    name = f"{NAME_PREFIX}{idx} — {file_path.stem.split('-', 1)[1].replace('-', ' ').title()}"

    payload = {
        "locationId": LOC,
        "name": name,
        "type": "html",
        "html": full_html,
        "isPlainText": False,
        "subject": subj_a,  # primary subject (variant A)
    }
    res = api("POST", "/emails/builder", payload)
    return {
        "idx": idx,
        "file": file_path.name,
        "name": name,
        "subject_a": subj_a,
        "subject_b": subj_b,
        "result": res,
    }


def main():
    files = sorted(EMAILS_DIR.glob("0[1-7]-*.md"))
    assert len(files) == 7, f"Expected 7 emails, found {len(files)}"

    # Clean up existing TVCT templates with our prefix
    existing = find_existing_templates()
    if existing:
        print(f"Removing {len(existing)} pre-existing templates with prefix '{NAME_PREFIX}'")
        for t in existing:
            r = delete_template(t["id"])
            print(f"  delete {t['name']!r} -> {r}")

    # Push each new template
    results = []
    for i, f in enumerate(files, start=1):
        print(f"\n[{i}/7] pushing {f.name}...")
        r = push_one(i, f)
        results.append(r)
        print(json.dumps({
            "name": r["name"],
            "subject_a": r["subject_a"],
            "id": r["result"].get("id") or r["result"].get("redirect"),
            "error": r["result"].get("_error"),
            "errbody": r["result"].get("_body"),
        }, indent=2))
        time.sleep(1)  # be polite

    out_path = Path("creative-output/_ghl_push_results.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(results, indent=2, default=str))
    ok = sum(1 for r in results if r["result"].get("id"))
    print(f"\n{ok}/7 templates uploaded successfully")
    print(f"Results written to {out_path}")


if __name__ == "__main__":
    main()
