/**
 * Blog integrity guard.
 *
 * Two failure modes have each regressed more than once in this repo, and
 * neither is caught by `astro check` or the claim validators:
 *
 *   1. ORPHANS — a post exists in src/pages/blog/ but has no entry in
 *      src/constants/blogPosts.ts, so /blog never links it. Ahrefs reports
 *      these as orphan pages; they get no internal links and effectively no
 *      traffic. Found twice: 42 orphans in 2026-07 (PR #92), 2 more on
 *      2026-08-25 (commercial-cleaning-nashville-tn, and
 *      move-out-cleaning-huntsville-al whose near-identical sibling slug
 *      masked it).
 *
 *   2. TEMPLATE DRIFT — a post stops using the shared BlogPostLayout /
 *      BlogByline pair and hand-rolls its byline, dates or schema. That
 *      breaks named-author E-E-A-T and lets stale hard-coded dates back in.
 *      The 2026-08 migration brought all 107 posts onto the template; this
 *      keeps them there.
 *
 * Dangling entries (a slug in blogPosts.ts with no matching file) are also
 * reported — those render as broken links from the blog index.
 */

import fs from 'node:fs';
import path from 'node:path';

const BLOG_DIR = 'src/pages/blog';
const INDEX_FILE = 'src/constants/blogPosts.ts';

const failures = [];

const files = fs
  .readdirSync(BLOG_DIR)
  .filter((f) => f.endsWith('.astro'))
  .map((f) => path.basename(f, '.astro'));

const indexSource = fs.readFileSync(INDEX_FILE, 'utf8');
const slugs = new Set(
  [...indexSource.matchAll(/slug:\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]),
);

// 1. Orphans: file on disk, no index entry.
const orphans = files.filter((f) => !slugs.has(f));
if (orphans.length > 0) {
  failures.push(
    `${orphans.length} orphaned blog post(s) — a file exists but no entry in ${INDEX_FILE}, ` +
      `so /blog never links it:\n` +
      orphans.map((o) => `    - ${o}`).join('\n') +
      `\n  Fix: add an entry to allBlogPosts (slug must equal the filename without .astro).`,
  );
}

// 2. Dangling entries: index entry, no file.
const dangling = [...slugs].filter((s) => !files.includes(s));
if (dangling.length > 0) {
  failures.push(
    `${dangling.length} dangling index entr(ies) — listed in ${INDEX_FILE} but no matching ` +
      `file in ${BLOG_DIR}/, which renders a broken link:\n` +
      dangling.map((d) => `    - ${d}`).join('\n'),
  );
}

// 3. Template drift: every post must render the shared layout and byline.
const missingLayout = [];
const missingByline = [];

for (const name of files) {
  const source = fs.readFileSync(path.join(BLOG_DIR, `${name}.astro`), 'utf8');
  if (!source.includes('<BlogPostLayout')) missingLayout.push(name);
  if (!source.includes('<BlogByline')) missingByline.push(name);
}

if (missingLayout.length > 0) {
  failures.push(
    `${missingLayout.length} post(s) do not render <BlogPostLayout>:\n` +
      missingLayout.map((m) => `    - ${m}`).join('\n') +
      `\n  Fix: use the shared layout rather than hand-rolling BaseLayout + schema.`,
  );
}

if (missingByline.length > 0) {
  failures.push(
    `${missingByline.length} post(s) do not render <BlogByline>:\n` +
      missingByline.map((m) => `    - ${m}`).join('\n') +
      `\n  Fix: named-author E-E-A-T depends on the shared byline component.`,
  );
}

if (failures.length > 0) {
  console.error('Blog integrity audit FAILED:\n');
  for (const f of failures) console.error(`  - ${f}\n`);
  process.exit(1);
}

console.log(
  `Blog integrity audit passed (${files.length} posts: all indexed, all on BlogPostLayout + BlogByline).`,
);
