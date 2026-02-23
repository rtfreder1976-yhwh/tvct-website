const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/pages/locations/athens');
const destDir = path.join(__dirname, 'src/pages/locations/huntsville');

const pages = [
    'same-day-cleaning.astro',
    'commercial-cleaning.astro',
    'recurring-maid-service.astro',
    'weekly-cleaning.astro',
    'green-cleaning.astro',
    'post-construction-cleaning.astro',
    'biweekly-cleaning.astro'
];

for (const page of pages) {
    const srcPath = path.join(srcDir, page);
    const destPath = path.join(destDir, page);

    if (fs.existsSync(srcPath)) {
        let content = fs.readFileSync(srcPath, 'utf8');

        // Simple string replacements for Geography and URLs
        content = content.replace(/Athens/g, 'Huntsville');
        content = content.replace(/athens/g, 'huntsville');
        content = content.replace(/Limestone/g, 'Madison');
        content = content.replace(/limestone/g, 'madison');

        fs.writeFileSync(destPath, content, 'utf8');
        console.log(`Copied and updated ${page}`);
    } else {
        console.log(`Source not found: ${page}`);
    }
}
