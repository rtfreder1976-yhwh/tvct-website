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

async function getSitemapStatus() {
    const siteUrl = process.env.GSC_SITE_URL.endsWith('/') ? process.env.GSC_SITE_URL : process.env.GSC_SITE_URL + '/';
    console.log(`Checking Sitemaps for ${siteUrl}`);
    try {
        const res = await searchconsole.sitemaps.list({ siteUrl });
        if (res.data.sitemap) {
            res.data.sitemap.forEach(s => {
                console.log(`Sitemap: ${s.path}`);
                console.log(`Last Downloaded: ${s.lastDownloaded}`);
                console.log(`Last Submitted: ${s.lastSubmitted}`);
                console.log(`Errors: ${s.errors}, Warnings: ${s.warnings}`);
                if (s.contents) {
                    s.contents.forEach(sc => {
                        console.log(` - Type: ${sc.type}, Submitted: ${sc.submitted}, Indexed: ${sc.indexed}`);
                    });
                }
                console.log('---');
            });
        } else {
            console.log("No sitemaps found.");
        }
    } catch (err) {
        console.error(err);
    }
}
getSitemapStatus();
