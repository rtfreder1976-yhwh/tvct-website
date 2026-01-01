import { promises as fs } from 'node:fs';
import path from 'node:path';

const siteUrl = 'https://thevalleycleanteam.com';
const pagesDir = path.join(process.cwd(), 'src/pages/locations');

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.astro')) {
      files.push(fullPath);
    }
  }

  return files;
};

const toRoute = (filePath) => {
  const relative = path.relative(pagesDir, filePath).replace(/\\/g, '/');
  const withoutExt = relative.replace(/\.astro$/, '');
  const routePart = withoutExt === 'index' ? '' : withoutExt.replace(/\/index$/, '');
  return `/locations${routePart ? `/${routePart}` : ''}`;
};

const main = async () => {
  const files = await walk(pagesDir);
  const errors = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const expectedCanonical = `${siteUrl}${toRoute(file)}`;
    const match = content.match(/canonicalUrl\s*=\s*["']([^"']+)["']/);

    if (match && match[1] !== expectedCanonical) {
      errors.push(`${file}: expected ${expectedCanonical} but found ${match[1]}`);
    }
  }

  if (errors.length > 0) {
    console.error('Canonical URL mismatches found in location pages:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Checked ${files.length} location pages. Canonical URLs are consistent.`);
};

await main();
