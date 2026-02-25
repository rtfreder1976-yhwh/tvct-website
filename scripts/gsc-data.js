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

async function getSearchData() {
    try {
        const today = new Date();
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 10);
        const threeDaysAgo = new Date(today);
        threeDaysAgo.setDate(today.getDate() - 3);

        const formatDate = (date) => date.toISOString().split('T')[0];

        const res = await searchconsole.searchanalytics.query({
            siteUrl: process.env.GSC_SITE_URL,
            requestBody: {
                startDate: formatDate(tenDaysAgo),
                endDate: formatDate(threeDaysAgo),
                dimensions: ['query'],
                rowLimit: 10
            }
        });

        if (res.data.rows && res.data.rows.length > 0) {
            console.log('Search Performance Data (Top 10 Queries):');
            console.table(res.data.rows);
        } else {
            console.log('No data found for the specified range.');
        }
    } catch (error) {
        console.error('Error fetching GSC data:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error);
        }
    }
}

getSearchData();
