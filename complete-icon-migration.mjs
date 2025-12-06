#!/usr/bin/env node
/**
 * Complete Font Awesome to Lucide Icon Migration
 * This script finishes migrating all remaining FA icons to the Icon component
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files to process
const FILES_TO_MIGRATE = [
  'src/layouts/LocationLayout.astro',
  'src/layouts/ServiceLocationLayout.astro',
  'src/components/BeforeAfterGallery.astro',
  'src/components/ResponseTimeStats.astro',
  'src/components/ServiceAreaMap.astro',
  'src/pages/locations.astro',
  'src/pages/pricing.astro',
  'src/pages/booking.astro',
  'src/pages/blog.astro',
  'src/pages/services/index.astro',
  'src/pages/services/deep-cleaning.astro',
  'src/pages/services/regular-cleaning.astro',
  'src/pages/services/move-in-out-cleaning.astro',
  'src/pages/services/green-cleaning.astro',
  'src/pages/services/airbnb-cleaning.astro',
  'src/pages/services/post-construction-cleaning.astro',
  'src/pages/services/commercial-cleaning.astro',
  'src/pages/services/event-cleaning.astro',
];

// Icon replacements with proper size mapping
function replaceIcons(content) {
  let result = content;

  // Pattern 1: Icons with specific text sizes
  const sizeMap = {
    'text-xs': 'w-3 h-3',
    'text-sm': 'w-4 h-4',
    'text-base': 'w-5 h-5',
    'text-lg': 'w-5 h-5',
    'text-xl': 'w-5 h-5',
    'text-2xl': 'w-6 h-6',
    'text-3xl': 'w-8 h-8',
    'text-4xl': 'w-10 h-10',
    'text-5xl': 'w-12 h-12',
    'text-6xl': 'w-16 h-16',
  };

  // Replace icons with text-* sizes
  Object.entries(sizeMap).forEach(([textSize, wh]) => {
    // Self-closing pattern
    const regex1 = new RegExp(
      `<i class="(fas|far|fab) fa-([a-z0-9-]+)([^"]*?)${textSize}([^"]*?)"\\s*></i>`,
      'g'
    );
    result = result.replace(regex1, (match, fasType, iconName, before, after) => {
      const classes = `${wh}${before}${after}`.replace(textSize, '').trim();
      return `<Icon name="${iconName}" class="${classes}" />`;
    });

    // Non-self-closing pattern
    const regex2 = new RegExp(
      `<i class="(fas|far|fab) fa-([a-z0-9-]+)([^"]*?)${textSize}([^"]*?)">`,
      'g'
    );
    result = result.replace(regex2, (match, fasType, iconName, before, after) => {
      const classes = `${wh}${before}${after} inline-block`.replace(textSize, '').trim();
      return `<Icon name="${iconName}" class="${classes}" />`;
    });
  });

  // Pattern 2: Icons without specific text-* size (default to w-5 h-5)
  // Self-closing
  result = result.replace(
    /<i class="(fas|far|fab) fa-([a-z0-9-]+)([^"]*?)">\s*<\/i>/g,
    (match, fasType, iconName, classes) => {
      const cleanClasses = classes.trim();
      return `<Icon name="${iconName}" class="w-5 h-5${cleanClasses ? ' ' + cleanClasses : ''}" />`;
    }
  );

  // Non-self-closing (inline)
  result = result.replace(
    /<i class="(fas|far|fab) fa-([a-z0-9-]+)([^"]*?)">/g,
    (match, fasType, iconName, classes) => {
      const cleanClasses = classes.trim();
      return `<Icon name="${iconName}" class="w-5 h-5 inline-block${cleanClasses ? ' ' + cleanClasses : ''}" />`;
    }
  );

  return result;
}

function addIconImport(content, filepath) {
  // Check if Icon import already exists
  if (content.includes('import Icon from')) {
    return content;
  }

  // Determine correct import path based on file location
  let importPath = '../components/Icon.astro';
  if (filepath.includes('/layouts/')) {
    importPath = '../components/Icon.astro';
  } else if (filepath.includes('/pages/services/')) {
    importPath = '../../components/Icon.astro';
  } else if (filepath.includes('/pages/')) {
    importPath = '../components/Icon.astro';
  } else if (filepath.includes('/components/')) {
    importPath = './Icon.astro';
  }

  // Find the frontmatter section and add import after last import
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1];
    const importRegex = /^import .+ from .+;$/gm;
    const imports = frontmatter.match(importRegex);

    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const importIndex = content.indexOf(lastImport) + lastImport.length;
      const iconImport = `\nimport Icon from '${importPath}';`;
      return content.slice(0, importIndex) + iconImport + content.slice(importIndex);
    }
  }

  return content;
}

function migrateFile(filepath) {
  console.log(`\nProcessing: ${filepath}`);

  try {
    const fullPath = path.join(__dirname, filepath);

    if (!fs.existsSync(fullPath)) {
      console.log(`  ⚠️  File not found: ${filepath}`);
      return false;
    }

    const original = fs.readFileSync(fullPath, 'utf8');
    let content = original;

    // Add Icon import if needed
    content = addIconImport(content, filepath);

    // Replace all FA icons
    content = replaceIcons(content);

    // Count changes
    const originalIconCount = (original.match(/<i class="fa[srab]/g) || []).length;
    const newIconCount = (content.match(/<i class="fa[srab]/g) || []).length;
    const iconsReplaced = originalIconCount - newIconCount;

    if (content !== original) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`  ✅ Migrated ${iconsReplaced} icons`);
      if (newIconCount > 0) {
        console.log(`  ⚠️  ${newIconCount} icons remaining (may need manual review)`);
      }
      return true;
    } else {
      console.log(`  ℹ️  No changes needed`);
      return false;
    }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting Font Awesome to Lucide Icon Migration...\n');
  console.log('=' .repeat(60));

  let filesUpdated = 0;

  FILES_TO_MIGRATE.forEach(filepath => {
    const updated = migrateFile(filepath);
    if (updated) filesUpdated++;
  });

  console.log('\n' + '='.repeat(60));
  console.log(`\n✨ Migration Complete!`);
  console.log(`   Files updated: ${filesUpdated}/${FILES_TO_MIGRATE.length}`);
  console.log(`\n📝 Next steps:`);
  console.log(`   1. Review changed files for accuracy`);
  console.log(`   2. Test build: npm run build`);
  console.log(`   3. Check browser console for errors`);
  console.log(`   4. Verify icon rendering and sizes`);
  console.log(`   5. Update FONT_AWESOME_TO_LUCIDE_MIGRATION_STATUS.md`);
  console.log('');
}

main();
