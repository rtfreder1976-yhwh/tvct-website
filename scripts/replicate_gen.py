#!/usr/bin/env python3
"""Submit + poll Replicate Nano Banana Pro predictions. Used by the creative skill."""
import json
import os
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

TOKEN = os.environ.get("REPLICATE_API_TOKEN")
if not TOKEN:
    # fall back to reading the mcp-secrets.env file
    secrets = Path(os.path.expanduser("~/.claude/.mcp-secrets.env"))
    if secrets.exists():
        for line in secrets.read_text().splitlines():
            if line.startswith("REPLICATE_API_TOKEN="):
                TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
                break

if not TOKEN:
    print("ERR: no REPLICATE_API_TOKEN", file=sys.stderr)
    sys.exit(1)


def submit(prompt: str, aspect_ratio: str = "1:1") -> dict:
    body = json.dumps({
        "input": {
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "output_format": "png",
        }
    }).encode()
    req = urllib.request.Request(
        "https://api.replicate.com/v1/models/google/nano-banana-pro/predictions",
        data=body,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
            "Prefer": "wait=60",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"HTTPError {e.code}: {e.read().decode()[:500]}", file=sys.stderr)
        raise


def poll(get_url: str, timeout_s: int = 240) -> dict:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        req = urllib.request.Request(get_url, headers={"Authorization": f"Bearer {TOKEN}"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read())
        status = data.get("status")
        if status in ("succeeded", "failed", "canceled"):
            return data
        time.sleep(3)
    return {"status": "timeout"}


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url, timeout=60) as r:
        dest.write_bytes(r.read())


def run(prompt: str, dest_path: str, aspect_ratio: str = "1:1") -> dict:
    pred = submit(prompt, aspect_ratio)
    status = pred.get("status")
    if status not in ("succeeded", "failed", "canceled"):
        pred = poll(pred["urls"]["get"])
    if pred.get("status") != "succeeded":
        return {"ok": False, "status": pred.get("status"), "error": pred.get("error"), "id": pred.get("id")}
    output = pred.get("output")
    url = output if isinstance(output, str) else (output[0] if output else None)
    if not url:
        return {"ok": False, "status": "no_output", "id": pred.get("id")}
    dest = Path(dest_path)
    download(url, dest)
    return {"ok": True, "id": pred.get("id"), "url": url, "path": str(dest)}


if __name__ == "__main__":
    # CLI: python replicate_gen.py <dest_path> <aspect_ratio> <<<prompt
    dest = sys.argv[1]
    ratio = sys.argv[2] if len(sys.argv) > 2 else "1:1"
    prompt = sys.stdin.read().strip()
    result = run(prompt, dest, ratio)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result.get("ok") else 1)
