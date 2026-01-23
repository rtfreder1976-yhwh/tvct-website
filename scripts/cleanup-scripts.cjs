const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages', 'locations');

function cleanup() {
    const files = glob.sync('**/*.astro', { cwd: PAGES_DIR, absolute: true });
    let cleanedCount = 0;

    files.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');

        // If it uses QuoteForm AND has a manual fetch script
        if (content.includes('<QuoteForm') && content.includes("fetch('/api/submit-form'")) {
            // Find the <script> block that contains the fetch
            // This is a simple regex that matches <script>...</script> containing the fetch
            const scriptRegex = /<script>[\s\S]*?fetch\('\/api\/submit-form'[\s\S]*?<\/script>/g;

            if (scriptRegex.test(content)) {
                content = content.replace(scriptRegex, '');
                fs.writeFileSync(file, content);
                cleanedCount++;
                console.log(`Cleaned up script in: ${path.relative(process.cwd(), file)}`);
            }
        }
    });

    console.log(`Finished. Cleaned up ${cleanedCount} files.`);
}

cleanup();
