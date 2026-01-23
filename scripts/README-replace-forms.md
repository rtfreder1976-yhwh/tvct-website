# Form Replacement Script

This script automatically replaces manual form implementations with the reusable `QuoteForm` component across all location pages.

## Features

✨ **Automatic Detection**: Finds all `.astro` files with manual forms
🔍 **Smart Replacement**: Intelligently replaces forms while preserving page structure
📊 **Detailed Reporting**: Shows exactly what was changed
🛡️ **Safe Mode**: Dry-run option to preview changes before applying
🎯 **Context-Aware**: Automatically detects city, state, and service type

## Usage

### 1. Preview Changes (Dry Run)
```bash
node scripts/replace-forms.js --dry-run
```

This will show you what would be changed without modifying any files.

### 2. Apply Changes
```bash
node scripts/replace-forms.js
```

This will actually replace the forms in all location pages.

## What It Does

1. **Scans** all `.astro` files in `src/pages/locations/`
2. **Skips** files that already use `QuoteForm`
3. **Adds** the QuoteForm import statement
4. **Replaces** manual `<form>` tags with `<QuoteForm>` component
5. **Removes** associated form handling scripts
6. **Detects** special cases:
   - Same-day cleaning pages (adds `urgentMode={true}`)
   - Recurring service pages
   - Deep cleaning pages

## Example Transformation

### Before:
```astro
import Icon from '../../../components/Icon.astro';

<form id="hartselle-form">
  <div class="mb-4">
    <input type="text" name="name" ... />
  </div>
  <!-- More form fields -->
  <button type="submit">Get Free Quote</button>
</form>

<script>
  document.getElementById('hartselle-form')?.addEventListener('submit', async function(e) {
    // Form handling code
  });
</script>
```

### After:
```astro
import Icon from '../../../components/Icon.astro';
import QuoteForm from '../../../components/QuoteForm.astro';

<QuoteForm 
  formId="hartselle-quote-form"
  city="Hartselle"
  state="Alabama"
  serviceName="General Cleaning"
  source="Hartselle Landing Page"
/>
```

## Output

The script provides detailed output:
- ✅ Files successfully modified
- ⏭️ Files skipped (already using QuoteForm or no form found)
- ⚠️ Files with no changes
- ❌ Errors encountered

## Safety

- **Dry run first**: Always use `--dry-run` to preview changes
- **Git recommended**: Commit your work before running
- **Backup**: The script doesn't create backups, so use version control

## Troubleshooting

If the script doesn't work as expected:

1. Check that you're in the project root directory
2. Ensure Node.js is installed (`node --version`)
3. Review the error messages in the output
4. Manually inspect files that show warnings

## Notes

- The script skips `index.astro` files (hub pages)
- It only processes files in the `locations` directory
- Form IDs are automatically generated from city names
- State is inferred from the hub directory name
