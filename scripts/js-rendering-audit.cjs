/**
 * JavaScript Rendering Audit Script
 * Compares raw HTML vs JS-rendered content to verify Googlebot sees all content
 *
 * Usage: node scripts/js-rendering-audit.cjs [url]
 * Example: node scripts/js-rendering-audit.cjs https://thevalleycleanteam.com/
 */

const puppeteer = require('puppeteer');

// Pages to audit (add more as needed)
const DEFAULT_PAGES = [
  '/',
  '/services/deep-cleaning',
  '/locations/huntsville',
  '/locations/huntsville/hampton-cove',
  '/about',
  '/blog'
];

const BASE_URL = 'https://thevalleycleanteam.com';

async function fetchRawHTML(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
  });
  return await response.text();
}

function extractContent(html) {
  // Extract key SEO elements from HTML string
  const getMatch = (regex) => {
    const match = html.match(regex);
    return match ? match[1]?.trim() : null;
  };

  const getAllMatches = (regex) => {
    const matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
      matches.push(match[1]?.trim());
    }
    return matches;
  };

  return {
    title: getMatch(/<title[^>]*>([^<]+)<\/title>/i),
    metaDescription: getMatch(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i),
    canonical: getMatch(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    h1: getAllMatches(/<h1[^>]*>([^<]+)<\/h1>/gi),
    h2Count: (html.match(/<h2[^>]*>/gi) || []).length,
    h3Count: (html.match(/<h3[^>]*>/gi) || []).length,
    schemaCount: (html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>/gi) || []).length,
    internalLinks: (html.match(/href=["']\/[^"']*["']/gi) || []).length,
    images: (html.match(/<img[^>]*>/gi) || []).length,
    // Check for content that might be JS-dependent
    hasDataAttributes: (html.match(/data-[a-z]+-content/gi) || []).length,
    hasVueReact: /\b(v-if|v-for|ng-|data-reactroot)\b/i.test(html),
    bodyTextLength: html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').length
  };
}

async function getRenderedContent(browser, url) {
  const page = await browser.newPage();

  // Emulate Googlebot
  await page.setUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');

  await page.goto(url, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Wait a bit for any lazy JS to execute
  await new Promise(r => setTimeout(r, 2000));

  const html = await page.content();
  await page.close();

  return html;
}

function compareResults(rawContent, renderedContent, url) {
  const issues = [];
  const passed = [];

  // Compare title
  if (rawContent.title === renderedContent.title) {
    passed.push(`Title matches: "${rawContent.title?.substring(0, 50)}..."`);
  } else {
    issues.push(`Title mismatch!\n  Raw: ${rawContent.title}\n  Rendered: ${renderedContent.title}`);
  }

  // Compare meta description
  if (rawContent.metaDescription === renderedContent.metaDescription) {
    passed.push('Meta description matches');
  } else {
    issues.push(`Meta description mismatch!\n  Raw: ${rawContent.metaDescription}\n  Rendered: ${renderedContent.metaDescription}`);
  }

  // Compare H1
  if (JSON.stringify(rawContent.h1) === JSON.stringify(renderedContent.h1)) {
    passed.push(`H1 matches: ${rawContent.h1.length} heading(s)`);
  } else {
    issues.push(`H1 mismatch!\n  Raw: ${rawContent.h1.join(', ')}\n  Rendered: ${renderedContent.h1.join(', ')}`);
  }

  // Compare heading counts
  if (rawContent.h2Count === renderedContent.h2Count) {
    passed.push(`H2 count matches: ${rawContent.h2Count}`);
  } else {
    issues.push(`H2 count mismatch! Raw: ${rawContent.h2Count}, Rendered: ${renderedContent.h2Count}`);
  }

  // Compare schema markup
  if (rawContent.schemaCount === renderedContent.schemaCount) {
    passed.push(`Schema markup count matches: ${rawContent.schemaCount}`);
  } else {
    issues.push(`Schema count mismatch! Raw: ${rawContent.schemaCount}, Rendered: ${renderedContent.schemaCount}`);
  }

  // Compare canonical
  if (rawContent.canonical === renderedContent.canonical) {
    passed.push('Canonical URL matches');
  } else {
    issues.push(`Canonical mismatch!\n  Raw: ${rawContent.canonical}\n  Rendered: ${renderedContent.canonical}`);
  }

  // Check body text length (shouldn't differ by more than 5%)
  const textDiff = Math.abs(rawContent.bodyTextLength - renderedContent.bodyTextLength);
  const textDiffPercent = (textDiff / rawContent.bodyTextLength) * 100;
  if (textDiffPercent < 5) {
    passed.push(`Body text length similar (${textDiffPercent.toFixed(1)}% difference)`);
  } else {
    issues.push(`Body text length differs by ${textDiffPercent.toFixed(1)}%! Raw: ${rawContent.bodyTextLength}, Rendered: ${renderedContent.bodyTextLength}`);
  }

  // Check for JS framework markers
  if (rawContent.hasVueReact) {
    issues.push('Warning: Detected Vue/React/Angular markers - content may be JS-dependent');
  }

  return { issues, passed, rawContent, renderedContent };
}

async function auditPage(browser, pagePath) {
  const url = pagePath.startsWith('http') ? pagePath : `${BASE_URL}${pagePath}`;

  console.log(`\n${'='.repeat(70)}`);
  console.log(`AUDITING: ${url}`);
  console.log('='.repeat(70));

  try {
    // Fetch raw HTML
    console.log('Fetching raw HTML...');
    const rawHTML = await fetchRawHTML(url);
    const rawContent = extractContent(rawHTML);

    // Get JS-rendered content
    console.log('Rendering with Puppeteer (simulating Googlebot)...');
    const renderedHTML = await getRenderedContent(browser, url);
    const renderedContent = extractContent(renderedHTML);

    // Compare
    const { issues, passed, rawContent: raw, renderedContent: rendered } = compareResults(rawContent, renderedContent, url);

    // Output results
    console.log('\n--- CONTENT SUMMARY ---');
    console.log(`Title: ${raw.title?.substring(0, 60)}...`);
    console.log(`H1: ${raw.h1.join(' | ')}`);
    console.log(`H2 count: ${raw.h2Count}`);
    console.log(`Schema blocks: ${raw.schemaCount}`);
    console.log(`Internal links: ${raw.internalLinks}`);
    console.log(`Images: ${raw.images}`);

    if (passed.length > 0) {
      console.log('\n--- PASSED CHECKS ---');
      passed.forEach(p => console.log(`  [PASS] ${p}`));
    }

    if (issues.length > 0) {
      console.log('\n--- ISSUES FOUND ---');
      issues.forEach(i => console.log(`  [WARN] ${i}`));
    } else {
      console.log('\n[SUCCESS] No JS rendering issues detected!');
    }

    return { url, issues, passed };

  } catch (error) {
    console.error(`[ERROR] Failed to audit ${url}: ${error.message}`);
    return { url, error: error.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const pagesToAudit = args.length > 0 ? args : DEFAULT_PAGES;

  console.log('\n');
  console.log('*'.repeat(70));
  console.log('*  JAVASCRIPT RENDERING AUDIT - Googlebot Simulation');
  console.log('*  Comparing raw HTML vs JS-rendered content');
  console.log('*'.repeat(70));

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const results = [];
    for (const page of pagesToAudit) {
      const result = await auditPage(browser, page);
      results.push(result);
    }

    // Summary
    console.log('\n\n');
    console.log('*'.repeat(70));
    console.log('*  AUDIT SUMMARY');
    console.log('*'.repeat(70));

    const pagesWithIssues = results.filter(r => r.issues && r.issues.length > 0);
    const pagesWithErrors = results.filter(r => r.error);
    const pagesPassed = results.filter(r => !r.error && (!r.issues || r.issues.length === 0));

    console.log(`\nTotal pages audited: ${results.length}`);
    console.log(`Pages PASSED: ${pagesPassed.length}`);
    console.log(`Pages with WARNINGS: ${pagesWithIssues.length}`);
    console.log(`Pages with ERRORS: ${pagesWithErrors.length}`);

    if (pagesWithIssues.length > 0) {
      console.log('\nPages needing attention:');
      pagesWithIssues.forEach(p => {
        console.log(`  - ${p.url}: ${p.issues.length} issue(s)`);
      });
    }

    if (pagesPassed.length === results.length) {
      console.log('\n[SUCCESS] All pages passed! Googlebot sees identical content with or without JS.');
    }

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();
