#!/usr/bin/env node

/**
 * Performance Audit Agent
 * File: scripts/perf-audit.js
 *
 * Runs automated performance checks before committing changes.
 * Claude Code should run this script after making changes.
 *
 * Usage: node scripts/perf-audit.js [--fix]
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  srcDir: './src',
  publicDir: './public',
  distDir: './dist',
  maxImageSize: 100 * 1024, // 100KB for content images
  maxHeroImageSize: 200 * 1024, // 200KB for hero images
  maxJsBundleSize: 100 * 1024, // 100KB
  maxCssBundleSize: 50 * 1024, // 50KB
  allowedImageFormats: ['.webp', '.svg'],
  requiredImageAttrs: ['width', 'height', 'alt'],
};

// ANSI colors for output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  error: (msg) => console.log(`${colors.red}✗ ERROR:${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ WARN:${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
};

let errors = [];
let warnings = [];

// Check 1: Image format and size
function checkImages() {
  log.info('Checking images...');
  
  const imageDir = path.join(CONFIG.publicDir, 'images');
  if (!fs.existsSync(imageDir)) {
    log.warn('No images directory found');
    return;
  }
  
  const files = getAllFiles(imageDir);
  
  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    const stats = fs.statSync(file);
    const fileName = path.basename(file);
    const isHero = fileName.includes('hero') || fileName.includes('banner');
    const maxSize = isHero ? CONFIG.maxHeroImageSize : CONFIG.maxImageSize;
    
    // Check format
    if (!CONFIG.allowedImageFormats.includes(ext) && 
        !['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      // Unknown format - warning
      warnings.push(`Unknown image format: ${file}`);
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      // Non-WebP format - should be converted
      warnings.push(`Non-WebP image found: ${file} - Consider converting to WebP`);
    }
    
    // Check size
    if (stats.size > maxSize) {
      errors.push(
        `Image too large: ${file} (${formatBytes(stats.size)} > ${formatBytes(maxSize)})`
      );
    }
  });
  
  log.success(`Checked ${files.length} images`);
}

// Check 2: Image tags in HTML/Astro files
function checkImageTags() {
  log.info('Checking image tags in templates...');
  
  const files = getAllFiles(CONFIG.srcDir, ['.astro', '.html', '.jsx', '.tsx']);
  let issueCount = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Find all img tags
    const imgRegex = /<img[^>]*>/gi;
    const matches = content.match(imgRegex) || [];
    
    matches.forEach(imgTag => {
      // Skip Astro Image component (handled differently)
      if (imgTag.includes('Image') && imgTag.includes('src={')) return;
      
      // Check for required attributes
      if (!imgTag.includes('width=')) {
        warnings.push(`Missing width attribute: ${file} - ${imgTag.substring(0, 50)}...`);
        issueCount++;
      }
      if (!imgTag.includes('height=')) {
        warnings.push(`Missing height attribute: ${file} - ${imgTag.substring(0, 50)}...`);
        issueCount++;
      }
      if (!imgTag.includes('alt=')) {
        errors.push(`Missing alt attribute: ${file} - ${imgTag.substring(0, 50)}...`);
        issueCount++;
      }
      
      // Check for lazy loading on non-hero images
      if (!imgTag.includes('loading=') && 
          !imgTag.includes('hero') && 
          !imgTag.includes('banner') &&
          !imgTag.includes('logo')) {
        warnings.push(`Consider lazy loading: ${file} - ${imgTag.substring(0, 50)}...`);
      }
    });
  });
  
  if (issueCount === 0) {
    log.success('All image tags have required attributes');
  } else {
    log.warn(`Found ${issueCount} image tag issues`);
  }
}

// Check 3: Schema markup
function checkSchema() {
  log.info('Checking schema markup...');
  
  const files = getAllFiles(CONFIG.srcDir, ['.astro', '.html']);
  let pagesWithSchema = 0;
  let pagesWithoutSchema = 0;
  
  files.forEach(file => {
    // Skip components and layouts that shouldn't have schema
    if (file.includes('/components/') || file.includes('/layouts/')) return;
    
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for JSON-LD schema
    if (content.includes('application/ld+json')) {
      pagesWithSchema++;
      
      // Extract and validate JSON
      const schemaMatch = content.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
      if (schemaMatch) {
        try {
          // Try to parse - this is basic validation
          const schemaContent = schemaMatch[1].trim();
          if (!schemaContent.includes('{')) {
            // Dynamic schema (Astro expression) - can't validate
          } else {
            JSON.parse(schemaContent);
          }
        } catch (e) {
          errors.push(`Invalid JSON-LD schema in: ${file}`);
        }
      }
    } else if (file.includes('/pages/')) {
      // Page files should have schema
      pagesWithoutSchema++;
      warnings.push(`No schema markup found: ${file}`);
    }
  });
  
  log.success(`Schema found in ${pagesWithSchema} pages`);
  if (pagesWithoutSchema > 0) {
    log.warn(`${pagesWithoutSchema} pages missing schema`);
  }
}

// Check 4: Meta tags
function checkMetaTags() {
  log.info('Checking meta tags...');
  
  const files = getAllFiles(CONFIG.srcDir, ['.astro', '.html']);
  
  files.forEach(file => {
    // Skip non-page files
    if (!file.includes('/pages/')) return;
    
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for title
    if (!content.includes('<title>') && !content.includes('title=') && !content.includes('title:')) {
      warnings.push(`No title found: ${file}`);
    }
    
    // Check for meta description
    if (!content.includes('name="description"') && 
        !content.includes('description=') &&
        !content.includes('description:')) {
      warnings.push(`No meta description found: ${file}`);
    }
    
    // Check for canonical
    if (!content.includes('rel="canonical"') && !content.includes('canonicalURL')) {
      warnings.push(`No canonical URL found: ${file}`);
    }
  });
  
  log.success('Meta tag check complete');
}

// Check 5: Internal links
function checkInternalLinks() {
  log.info('Checking internal links...');
  
  const files = getAllFiles(CONFIG.srcDir, ['.astro', '.html', '.md', '.mdx']);
  let brokenLinks = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Find internal links (starting with /)
    const linkRegex = /href=["'](\/[^"'#]*)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const link = match[1];
      
      // Skip external links and anchors
      if (link.startsWith('//') || link.startsWith('/http')) continue;
      
      // Check if target exists (simplified check)
      const targetPath = path.join(CONFIG.srcDir, 'pages', link.replace(/\/$/, '') + '.astro');
      const targetPath2 = path.join(CONFIG.srcDir, 'pages', link, 'index.astro');
      
      // This is a simplified check - in real implementation would be more thorough
      // Just checking for obviously broken patterns
      if (link.includes(' ') || link.includes('undefined')) {
        brokenLinks.push(`Potentially broken link in ${file}: ${link}`);
      }
    }
  });
  
  if (brokenLinks.length > 0) {
    brokenLinks.forEach(link => warnings.push(link));
    log.warn(`Found ${brokenLinks.length} potentially broken internal links`);
  } else {
    log.success('Internal links look okay');
  }
}

// Check 6: Render-blocking resources
function checkRenderBlocking() {
  log.info('Checking for render-blocking resources...');
  
  const files = getAllFiles(CONFIG.srcDir, ['.astro', '.html']);
  let issues = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    // Check for render-blocking scripts in head
    const headMatch = content.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (headMatch) {
      const headContent = headMatch[1];
      
      // Check for non-async/defer scripts
      const scriptRegex = /<script[^>]*src=[^>]*>/gi;
      const scriptMatches = headContent.match(scriptRegex) || [];
      
      scriptMatches.forEach(script => {
        if (!script.includes('defer') && 
            !script.includes('async') && 
            !script.includes('type="module"')) {
          errors.push(`Render-blocking script in <head>: ${file}`);
          issues++;
        }
      });
      
      // Check for non-async stylesheets (except critical inline)
      if (headContent.includes('<link') && 
          headContent.includes('stylesheet') &&
          !headContent.includes('media="print"') &&
          !headContent.includes('onload=')) {
        // This could be intentional for critical CSS, so just warn
        // warnings.push(`Potentially render-blocking stylesheet: ${file}`);
      }
    }
  });
  
  if (issues === 0) {
    log.success('No render-blocking scripts found');
  }
}

// Utility: Get all files recursively
function getAllFiles(dir, extensions = null) {
  if (!fs.existsSync(dir)) return [];
  
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(getAllFiles(filePath, extensions));
      }
    } else {
      if (!extensions || extensions.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Utility: Format bytes
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Main execution
function main() {
  console.log('\n🔍 Running Performance Audit...\n');
  
  // Run all checks
  checkImages();
  checkImageTags();
  checkSchema();
  checkMetaTags();
  checkInternalLinks();
  checkRenderBlocking();
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('AUDIT SUMMARY');
  console.log('='.repeat(50));
  
  if (errors.length === 0 && warnings.length === 0) {
    log.success('All checks passed! 🎉');
    process.exit(0);
  }
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}Warnings (${warnings.length}):${colors.reset}`);
    warnings.slice(0, 10).forEach(w => console.log(`  • ${w}`));
    if (warnings.length > 10) {
      console.log(`  ... and ${warnings.length - 10} more`);
    }
  }
  
  if (errors.length > 0) {
    console.log(`\n${colors.red}Errors (${errors.length}):${colors.reset}`);
    errors.forEach(e => console.log(`  • ${e}`));
    console.log(`\n${colors.red}Fix these errors before committing!${colors.reset}`);
    process.exit(1);
  }
  
  console.log(`\n${colors.yellow}Warnings found but not blocking. Consider fixing.${colors.reset}`);
  process.exit(0);
}

main();
