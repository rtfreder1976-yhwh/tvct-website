const fs = require('fs');
const path = require('path');
const searchDirs = [path.resolve('src/pages'), path.resolve('src/layouts')];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else if (fullPath.endsWith('.astro')) {
            results.push(fullPath);
        }
    });
    return results;
}

// Helper to remove imports and tags
function cleanupFile(filePath) {
    // Skip BaseLayout.astro for component/main tag removal
    const isBaseLayout = filePath.endsWith('BaseLayout.astro');
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    if (!isBaseLayout) {
        // 1. Remove Navigation and Footer components (they are now in BaseLayout)
        content = content.replace(/import Navigation from ['"].*Navigation\.astro['"];?\n?/g, '');
        content = content.replace(/import Footer from ['"].*Footer\.astro['"];?\n?/g, '');
        content = content.replace(/<Navigation\s*\/>\n?/g, '');
        content = content.replace(/<Footer\s*\/>\n?/g, '');

        // 2. Replace redundant main tags with div to keep attributes (BaseLayout now provides the main landmark)
        content = content.replace(/<main([^>]*)>/g, '<div$1>');
        content = content.replace(/<\/main>/g, '</div>');
    }

    // 3. Fix common typos like | instead of || in scripts
    content = content.replace(/\s\|\s(['"]|null|undefined|data|res|result|stat\.textContent)/g, ' || $1');

    // 3. Fix form accessibility (labels for select and input)
    // This is a bit tricky with regex, but we can do a basic replacement for the common pattern in location pages

    // Find all forms
    const formRegex = /<form\s+id=["']location-quote-form["']>([\s\S]*?)<\/form>/g;
    content = content.replace(formRegex, (match, formContent) => {
        let fixedForm = formContent;

        // Fix Name Input
        if (fixedForm.includes('name="name"') && !fixedForm.includes('<label for="loc-name"')) {
            fixedForm = fixedForm.replace(/<input\s+type=["']text["']\s+name=["']name["']([\s\S]*?)>/,
                '<label for="loc-name" class="sr-only">Your Name</label>\n              <input type="text" id="loc-name" name="name"$1>');
        }

        // Fix Email Input
        if (fixedForm.includes('name="email"') && !fixedForm.includes('<label for="loc-email"')) {
            fixedForm = fixedForm.replace(/<input\s+type=["']email["']\s+name=["']email["']([\s\S]*?)>/,
                '<label for="loc-email" class="sr-only">Email Address</label>\n              <input type="email" id="loc-email" name="email"$1>');
        }

        // Fix Phone Input
        if (fixedForm.includes('name="phone"') && !fixedForm.includes('<label for="loc-phone"')) {
            fixedForm = fixedForm.replace(/<input\s+type=["']tel["']\s+name=["']phone["']([\s\S]*?)>/,
                '<label for="loc-phone" class="sr-only">Phone Number</label>\n              <input type="tel" id="loc-phone" name="phone"$1>');
        }

        // Fix Location Input
        if (fixedForm.includes('name="location"') && !fixedForm.includes('<label for="loc-address"')) {
            fixedForm = fixedForm.replace(/<input\s+type=["']text["']\s+name=["']location["']([\s\S]*?)>/,
                '<label for="loc-address" class="sr-only">Address/Neighborhood</label>\n              <input type="text" id="loc-address" name="location"$1>');
        }

        // Fix Service Select
        if (fixedForm.includes('name="service"') && !fixedForm.includes('<label for="loc-service"')) {
            fixedForm = fixedForm.replace(/<select\s+name=["']service["']([\s\S]*?)>/,
                '<label for="loc-service" class="sr-only">Select Service Type</label>\n              <select id="loc-service" name="service"$1>');
        }

        return `<form id="location-quote-form">${fixedForm}</form>`;
    });

    // 4. Fix broken heading tags (e.g., <h2 ...> ... </h3>)
    content = content.replace(/<(h[1-6])([^>]*)>([\s\S]*?)<\/(h[1-6])>/g, (match, openTag, attrs, inner, closeTag) => {
        if (openTag !== closeTag) {
            console.log(`Fixing mismatched tag in ${filePath}: ${openTag} vs ${closeTag}`);
            return `<${openTag}${attrs}>${inner}</${openTag}>`;
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

// Find all .astro files in search directories
searchDirs.forEach(dir => {
    const files = walk(dir);
    files.forEach(cleanupFile);
});

console.log('Cleanup complete.');
