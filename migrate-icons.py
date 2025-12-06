#!/usr/bin/env python3
"""
Font Awesome to Lucide Icon Migration Script
Migrates all FA icon usage to the Icon component with Lucide icons
"""

import re
import os
from pathlib import Path

# Icon mapping with size adjustments
ICON_REPLACEMENTS = [
    # Common patterns with text-* sizes
    (r'<i class="fas fa-([a-z-]+) text-xl([^"]*)">', r'<Icon name="\1" class="w-5 h-5\2" />'),
    (r'<i class="fas fa-([a-z-]+) text-2xl([^"]*)">', r'<Icon name="\1" class="w-6 h-6\2" />'),
    (r'<i class="fas fa-([a-z-]+) text-3xl([^"]*)">', r'<Icon name="\1" class="w-8 h-8\2" />'),
    (r'<i class="fas fa-([a-z-]+) text-4xl([^"]*)">', r'<Icon name="\1" class="w-10 h-10\2" />'),
    (r'<i class="fas fa-([a-z-]+) text-5xl([^"]*)">', r'<Icon name="\1" class="w-12 h-12\2" />'),
    (r'<i class="fas fa-([a-z-]+) text-6xl([^"]*)">', r'<Icon name="\1" class="w-16 h-16\2" />'),

    # Standard pattern without explicit size (default to w-5 h-5)
    (r'<i class="fas fa-([a-z-]+)([^"]*)">\s*</i>', r'<Icon name="\1" class="w-5 h-5\2" />'),
    (r'<i class="fas fa-([a-z-]+)([^"]*)">', r'<Icon name="\1" class="w-5 h-5\2 inline-block" />'),

    # fab (brand icons) - keep as-is for Google, etc.
    # We'll handle these manually
]

# Files to migrate
FILES_TO_MIGRATE = [
    "src/layouts/LocationLayout.astro",
    "src/layouts/ServiceLocationLayout.astro",
    "src/components/BeforeAfterGallery.astro",
    "src/components/ResponseTimeStats.astro",
    "src/components/ServiceAreaMap.astro",
    "src/pages/locations.astro",
    "src/pages/pricing.astro",
    "src/pages/booking.astro",
    "src/pages/blog.astro",
    "src/pages/services/index.astro",
    "src/pages/services/deep-cleaning.astro",
    "src/pages/services/regular-cleaning.astro",
    "src/pages/services/move-in-out-cleaning.astro",
    "src/pages/services/green-cleaning.astro",
    "src/pages/services/airbnb-cleaning.astro",
    "src/pages/services/post-construction-cleaning.astro",
    "src/pages/services/commercial-cleaning.astro",
    "src/pages/services/event-cleaning.astro",
]

def add_icon_import(content):
    """Add Icon import if not present"""
    if "import Icon from" in content:
        return content

    # Find the last import statement
    import_pattern = r"(import [^;]+from ['\"][^'\"]+['\"];?\n)"
    imports = list(re.finditer(import_pattern, content))

    if imports:
        last_import = imports[-1]
        # Determine the correct path based on file location
        icon_import = "import Icon from '../components/Icon.astro';\n"
        insert_pos = last_import.end()
        content = content[:insert_pos] + icon_import + content[insert_pos:]

    return content

def migrate_file(filepath):
    """Migrate a single file"""
    print(f"Processing {filepath}...")

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Add Icon import
    content = add_icon_import(content)

    # Apply icon replacements
    for pattern, replacement in ICON_REPLACEMENTS:
        content = re.sub(pattern, replacement, content)

    # Write back if changed
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {filepath}")
        return True
    else:
        print(f"  - No changes needed for {filepath}")
        return False

def main():
    """Main migration function"""
    project_root = Path(__file__).parent
    updated_count = 0

    for file_path in FILES_TO_MIGRATE:
        full_path = project_root / file_path
        if full_path.exists():
            if migrate_file(full_path):
                updated_count += 1
        else:
            print(f"  ! File not found: {full_path}")

    print(f"\nMigration complete! Updated {updated_count} files.")

if __name__ == "__main__":
    main()
