import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GSC_CLIENT_EMAIL,
        private_key: process.env.GSC_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

async function inspectUrls() {
    // The GSC API requires the exact verified property name, which includes the trailing slash
    const siteUrl = process.env.GSC_SITE_URL.endsWith('/') ? process.env.GSC_SITE_URL : process.env.GSC_SITE_URL + '/';
    const baseUrl = siteUrl.slice(0, -1);

    const urlsToInspect = [
        baseUrl + '/',
        baseUrl + '/locations/athens',
        baseUrl + '/locations/athens/ardmore',
        baseUrl + '/dashboard',
        baseUrl + '/services/deep-cleaning'
    ];

    console.log(`--- GSC URL Inspection Report ---`);

    for (const url of urlsToInspect) {
        try {
            console.log(`\nInspecting: ${url}`);
            const res = await searchconsole.urlInspection.index.inspect({
                requestBody: {
                    inspectionUrl: url,
                    siteUrl: siteUrl
                }
            });

            const result = res.data.inspectionResult;
            console.log(`Index Status: ${result.indexStatusResult.coverageState}`);
            console.log(`Crawled As: ${result.indexStatusResult.crawledAs}`);
            console.log(`Last Crawl: ${result.indexStatusResult.lastCrawlTime}`);

            if (result.indexStatusResult.robotsTxtState) {
                console.log(`Robots.txt State: ${result.indexStatusResult.robotsTxtState}`);
            }

            if (result.richResultsResult && result.richResultsResult.detectedItems) {
                console.log(`Rich Results Detected: ${result.richResultsResult.detectedItems.map(item => item.richResultType).join(', ')}`);
                const issues = result.richResultsResult.detectedItems.filter(item => item.items && item.items.some(i => i.issues && i.issues.length > 0));

                if (issues.length > 0) {
                    console.log('--- Rich Result Issues ---');
                    issues.forEach(item => {
                        console.log(`Type: ${item.richResultType}`);
                        item.items.forEach(i => {
                            if (i.issues) {
                                i.issues.forEach(issue => {
                                    console.log(`  - [${issue.severity}] ${issue.issueMessage}`);
                                });
                            }
                        });
                    });
                } else {
                    console.log('No Rich Result issues found.');
                }
            } else {
                console.log('No Rich Results detected.');
            }

        } catch (error) {
            console.error(`Error inspecting ${url}:`, error.message);
        }
    }
}

inspectUrls();
