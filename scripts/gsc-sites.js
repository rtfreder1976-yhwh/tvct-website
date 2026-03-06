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

async function listSites() {
    try {
        const res = await searchconsole.sites.list();
        console.log("Verified Sites:");
        if (res.data.siteEntry) {
            res.data.siteEntry.forEach(site => {
                console.log(`- ${site.siteUrl}`);
            });
        } else {
            console.log("No sites verified for this service account.");
        }
    } catch (err) {
        console.error(err);
    }
}
listSites();
