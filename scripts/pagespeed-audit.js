import fs from 'fs';
import path from 'path';

const API_KEY = process.env.PAGESPEED_API_KEY;
const SITE_URL = 'https://thevalleycleanteam.com';
const URLS = [
    '/',
    '/services/deep-cleaning',
    '/services/move-in-out-cleaning',
    '/locations/huntsville',
    '/locations/nashville'
];

// Ensure results directory exists
const resultsDir = path.join(process.cwd(), 'audit-results');
if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
}

async function runAudit(url) {
    const fullUrl = `${SITE_URL}${url}`;
    console.log(`Auditing ${fullUrl}...`);

    const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(fullUrl)}&key=${API_KEY}&${categories.map(c => `category=${c}`).join('&')}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            console.error(`Error auditing ${url}:`, data.error.message);
            return null;
        }

        const scores = {
            url: fullUrl,
            performance: data.lighthouseResult.categories.performance.score * 100,
            accessibility: data.lighthouseResult.categories.accessibility.score * 100,
            bestPractices: data.lighthouseResult.categories['best-practices'].score * 100,
            seo: data.lighthouseResult.categories.seo.score * 100,
        };

        return { scores, fullResult: data };
    } catch (error) {
        console.error(`Fetch error for ${url}:`, error.message);
        return null;
    }
}

async function main() {
    if (!API_KEY) {
        console.error('Error: PAGESPEED_API_KEY environment variable is not set.');
        process.exit(1);
    }

    const results = [];
    for (const url of URLS) {
        const result = await runAudit(url);
        if (result) {
            results.push(result.scores);
            // Save full results for deep analysis
            const fileName = `audit-${url.replace(/\//g, '-') || 'home'}.json`;
            fs.writeFileSync(path.join(process.cwd(), 'audit-results', fileName), JSON.stringify(result.fullResult, null, 2));
        }
    }

    console.table(results);

    // Create a summary report
    const summary = {
        date: new Date().toISOString(),
        results
    };
    fs.writeFileSync(path.join(process.cwd(), 'audit-results', 'summary.json'), JSON.stringify(summary, null, 2));
}

main().catch(console.error);
