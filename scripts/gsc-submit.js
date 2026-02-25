import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GSC_CLIENT_EMAIL,
        private_key: process.env.GSC_PRIVATE_KEY,
    },
    // We need webmasters scope to submit (write access)
    scopes: ['https://www.googleapis.com/auth/webmasters'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

async function submitSitemap() {
    const siteUrl = process.env.GSC_SITE_URL.endsWith('/') ? process.env.GSC_SITE_URL : process.env.GSC_SITE_URL + '/';
    const feedpath = `${siteUrl}sitemap-index.xml`;

    console.log(`Submitting sitemap: ${feedpath}`);
    console.log(`For site: ${siteUrl}`);

    try {
        await searchconsole.sitemaps.submit({
            siteUrl: siteUrl,
            feedpath: feedpath,
        });
        console.log("✅ Successfully submitted updated sitemap to Google Search Console.");
    } catch (e) {
        if (e.message.includes('403')) {
            console.log("⚠️ The service account only has 'read' permissions, which is good for security.");
            console.log("Since Google deprecated the ping endpoint, to force a crawl now you can paste the URL directly into your GSC Dashboard.");
        } else {
            console.error("Error submitting sitemap:", e.message);
        }
    }
}

submitSitemap();
