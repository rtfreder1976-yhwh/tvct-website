"""Poll Replicate until the account has spendable credit, then run explorations."""
import json
import os
import subprocess
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path

TOKEN = os.environ.get("REPLICATE_API_TOKEN")
if not TOKEN:
    secrets = Path(os.path.expanduser("~/.claude/.mcp-secrets.env"))
    if secrets.exists():
        for line in secrets.read_text().splitlines():
            if line.startswith("REPLICATE_API_TOKEN="):
                TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
                break

# Use a 1-shot tiny test against the predictions endpoint.
# We submit, immediately cancel if accepted, so we don't actually pay for anything.
PROBE = {
    "input": {
        "prompt": "test",
        "aspect_ratio": "1:1",
        "output_format": "png",
    }
}


def probe():
    body = json.dumps(PROBE).encode()
    req = urllib.request.Request(
        "https://api.replicate.com/v1/models/google/nano-banana-pro/predictions",
        data=body,
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read())
        # accepted — cancel immediately to avoid spend
        pid = data.get("id")
        cancel_url = data.get("urls", {}).get("cancel")
        if cancel_url:
            try:
                creq = urllib.request.Request(
                    cancel_url,
                    headers={"Authorization": f"Bearer {TOKEN}"},
                    method="POST",
                )
                urllib.request.urlopen(creq, timeout=10).read()
            except Exception:
                pass
        return ("ok", pid)
    except urllib.error.HTTPError as e:
        return (e.code, e.read().decode()[:200])


def main():
    deadline = time.time() + 60 * 30  # 30 min max
    attempt = 0
    while time.time() < deadline:
        attempt += 1
        status, info = probe()
        ts = time.strftime("%H:%M:%S")
        print(f"[{ts}] attempt {attempt}: {status} {info if status != 'ok' else '(probe accepted)'}", flush=True)
        if status == "ok":
            print("Credit available. Launching explorations...", flush=True)
            r = subprocess.run([sys.executable, "scripts/gen_explorations.py"])
            sys.exit(r.returncode)
        if status == 402:
            time.sleep(90)
            continue
        if status == 429:
            time.sleep(60)
            continue
        # any other error — stop
        print(f"Unexpected status {status}: {info}", flush=True)
        sys.exit(2)
    print("Timed out waiting for credit (30 min).", flush=True)
    sys.exit(3)


if __name__ == "__main__":
    main()
