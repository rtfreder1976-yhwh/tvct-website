#!/usr/bin/env node
/**
 * indexnow-ping.js
 * Notifies IndexNow participants (Bing, Yandex, Seznam, …) that the site has
 * been redeployed, so they re-crawl sooner than their normal schedule.
 *
 * Runs from .github/workflows/indexnow.yml once a PRODUCTION deployment has
 * reported success — not at build time. Pinging during the build tells engines
 * to come and look before the new content is actually live, which is worse than
 * not pinging at all.
 *
 * URLs come from the live sitemap rather than from src/pages, because most of
 * this site's routes are generated (locations, services, blog) and never exist
 * as .astro files. scripts/indexnow-submit.js walks src/pages instead and will
 * happily submit a literal "[slug]" as a URL; prefer this script.
 *
 * The IndexNow key is public by design — it is served at keyLocation so engines
 * can verify ownership. It is not a secret and does not belong in GH secrets.
 *
 * Never exits non-zero. A missed ping is not a failed deploy.
 */

const SITE = "https://thevalleycleanteam.com";
const KEY = "f7a3e9c1b5d2f8a4e6c0b3d7f9a2e5c1";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 100;

const STATUS = {
  200: "OK — URLs submitted",
  202: "Accepted — key validation pending",
  400: "Bad request — invalid format",
  403: "Forbidden — key not valid, or key file not reachable at keyLocation",
  422: "Unprocessable — URLs do not belong to the host, or key mismatch",
  429: "Rate limited",
};

async function getText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
  return res.text();
}

/** Pull every <loc> out of a sitemap or sitemap index. */
function locs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
}

/**
 * Resolve a sitemap index into the full page list. One level of nesting is all
 * Astro's integration produces; deeper nesting would need real XML parsing.
 */
async function collectUrls() {
  const index = await getText(`${SITE}/sitemap-index.xml`);
  const entries = locs(index);
  const children = entries.filter((u) => u.endsWith(".xml"));

  if (children.length === 0) return entries;

  const pages = [];
  for (const child of children) {
    try {
      pages.push(...locs(await getText(child)));
    } catch (err) {
      console.log(`  ! skipped ${child}: ${err.message}`);
    }
  }
  return pages;
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });
  return { status: res.status, note: STATUS[res.status] ?? "unknown status" };
}

async function main() {
  console.log(`IndexNow ping — ${SITE}`);

  let urls;
  try {
    urls = await collectUrls();
  } catch (err) {
    console.log(`Could not read the sitemap (${err.message}). Nothing submitted.`);
    return;
  }

  // Own-host only: IndexNow rejects the whole batch (422) if one URL is foreign.
  const before = urls.length;
  urls = [...new Set(urls)].filter((u) => u.startsWith(`${SITE}/`) || u === SITE);
  if (urls.length !== before) {
    console.log(`Filtered ${before - urls.length} duplicate/off-host URL(s).`);
  }

  if (urls.length === 0) {
    console.log("Sitemap resolved to 0 usable URLs. Nothing submitted.");
    return;
  }

  console.log(`Submitting ${urls.length} URL(s) in batches of ${BATCH_SIZE}.`);

  let failures = 0;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const n = Math.floor(i / BATCH_SIZE) + 1;
    try {
      const { status, note } = await submit(batch);
      const ok = status === 200 || status === 202;
      if (!ok) failures++;
      console.log(`  batch ${n} (${batch.length}): HTTP ${status} — ${note}`);
    } catch (err) {
      failures++;
      console.log(`  batch ${n} (${batch.length}): request failed — ${err.message}`);
    }
    if (i + BATCH_SIZE < urls.length) await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(
    failures === 0
      ? "Done — all batches accepted."
      : `Done — ${failures} batch(es) not accepted. Engines will still crawl on their normal schedule.`,
  );
}

main().catch((err) => {
  console.log(`indexnow-ping error: ${err.message}`);
});
