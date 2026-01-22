const fs = require('fs');
const path = require('path');

const summaryFile = path.resolve('audit-results', 'summary.json');
const summary = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));

summary.results.forEach(result => {
    if (result.accessibility < 100) {
        console.log(`--- URL: ${result.url} (Accessibility: ${result.accessibility}) ---`);
        const detailFile = path.resolve('audit-results', result.url.replace('https://thevalleycleanteam.com', 'audit-').replace(/\//g, '-') + '.json');
        if (fs.existsSync(detailFile)) {
            const detail = JSON.parse(fs.readFileSync(detailFile, 'utf8'));
            const audits = detail.lighthouseResult.audits;
            const accessibilityCategory = detail.lighthouseResult.categories.accessibility;

            accessibilityCategory.auditRefs.forEach(ref => {
                const audit = audits[ref.id];
                if (audit.score !== 1 && audit.score !== null) {
                    console.log(`[${ref.id}] ${audit.title}: ${audit.score}`);
                    if (audit.details && audit.details.items) {
                        audit.details.items.forEach(item => {
                            if (item.node) console.log(`  - Node: ${item.node.snippet || item.node.explanation || item.node.selector}`);
                            if (item.explanation) console.log(`  - Explanation: ${item.explanation}`);
                        });
                    }
                }
            });
        } else {
            console.log(`Detail file not found: ${detailFile}`);
        }
    }
});
