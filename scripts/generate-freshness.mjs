/**
 * Generate src/data/freshness.json — the committed map of route → last-commit
 * date used for both sitemap <lastmod> and the visible "Last updated" stamp.
 *
 * WHY A COMMITTED MANIFEST INSTEAD OF READING GIT AT BUILD TIME:
 * Vercel shallow-clones by default (git depth 1). Under a shallow clone every
 * file's "last commit" collapses to the single most recent commit, so the repo
 * (correctly) refuses to use git dates at all — which is why the deployed site
 * shipped with no <lastmod> and no visible dates, and why an AI-visibility
 * crawl found 0 of 4 freshness-relevant pages dated.
 *
 * So we resolve the dates where full history exists (a dev machine or CI) and
 * commit the result. The build then reads the manifest and gets real per-page
 * dates regardless of clone depth.
 *
 * Safety: if this runs against a shallow clone it EXITS WITHOUT WRITING, so a
 * Vercel build can never overwrite good data with the "everything changed in
 * the newest commit" garbage a shallow clone would produce.
 *
 * Usage: npm run freshness   (also runs automatically via prebuild)
 */
import { execFileSync } from "node:child_process";
import { readdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const OUT = join(projectRoot, "src/data/freshness.json");

const git = (args) =>
  execFileSync("git", args, {
    cwd: projectRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();

// --- Guard: never write from a shallow clone ------------------------------
let shallow = true;
try {
  shallow = git(["rev-parse", "--is-shallow-repository"]) !== "false";
} catch {
  console.log("[freshness] git unavailable — keeping existing manifest.");
  process.exit(0);
}
if (shallow) {
  const have = existsSync(OUT);
  console.log(
    `[freshness] shallow clone — keeping existing manifest${have ? "" : " (none present; dates will be omitted)"}.`,
  );
  process.exit(0);
}

// --- Walk src/pages -------------------------------------------------------
const pagesDir = join(projectRoot, "src/pages");
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".astro")) files.push(full);
  }
})(pagesDir);

/** src/pages/foo/index.astro → /foo ; src/pages/foo.astro → /foo */
function routeFor(absFile) {
  let p = "/" + relative(pagesDir, absFile).split(/[\\/]/).join("/");
  p = p.replace(/\.astro$/, "").replace(/\/index$/, "");
  return p === "" ? "/" : p;
}

const dateCache = new Map();
function lastCommit(relPath) {
  if (dateCache.has(relPath)) return dateCache.get(relPath);
  let iso = null;
  try {
    iso = git(["log", "-1", "--format=%cI", "--", relPath]) || null;
  } catch {
    /* leave null */
  }
  dateCache.set(relPath, iso);
  return iso;
}

const manifest = {};
let resolved = 0;
for (const abs of files) {
  const route = routeFor(abs);
  // Skip dynamic route templates — they have no single URL.
  if (route.includes("[")) continue;
  const iso = lastCommit(relative(projectRoot, abs));
  if (iso) {
    manifest[route] = iso;
    resolved++;
  }
}

// Data-driven routes served by locations/[city]/[slug].astro have no per-URL
// file; key their freshness on the route template plus both data files, and
// store it under a sentinel the runtime looks up as a fallback.
const dynamicSources = [
  "src/pages/locations/[city]/[slug].astro",
  "src/data/locations.json",
  "src/data/services.json",
];
let dynamicBest = null;
for (const src of dynamicSources) {
  const d = lastCommit(src);
  // Compare by absolute instant: `%cI` carries a local offset, so raw string
  // order can pick a stale date.
  if (d && (!dynamicBest || Date.parse(d) > Date.parse(dynamicBest))) dynamicBest = d;
}
if (dynamicBest) manifest["__locations_dynamic__"] = dynamicBest;

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
const json = JSON.stringify(sorted, null, 2) + "\n";

const prev = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
if (prev === json) {
  console.log(`[freshness] unchanged (${resolved} routes).`);
} else {
  writeFileSync(OUT, json);
  console.log(`[freshness] wrote ${resolved} routes → src/data/freshness.json`);
}
