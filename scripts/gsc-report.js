import { google } from 'googleapis';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GSC_CLIENT_EMAIL,
        private_key: process.env.GSC_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole({ version: 'v1', auth });

async function runReport() {
    const siteUrl = process.env.GSC_SITE_URL;
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);

    const formatDate = (date) => date.toISOString().split('T')[0];
    const start = formatDate(thirtyDaysAgo);
    const end = formatDate(threeDaysAgo);

    console.log(`--- GSC SEO Performance Report (${start} to ${end}) ---`);

    try {
        // 1. Overall Totals
        const totals = await searchconsole.searchanalytics.query({
            siteUrl,
            requestBody: {
                startDate: start,
                endDate: end
            }
        });

        // 2. Top Queries
        const topQueries = await searchconsole.searchanalytics.query({
            siteUrl,
            requestBody: {
                startDate: start,
                endDate: end,
                dimensions: ['query'],
                rowLimit: 50
            }
        });

        // 3. Top Pages
        const topPages = await searchconsole.searchanalytics.query({
            siteUrl,
            requestBody: {
                startDate: start,
                endDate: end,
                dimensions: ['page'],
                rowLimit: 20
            }
        });

        const report = {
            summary: totals.data.rows ? totals.data.rows[0] : 'No data',
            queries: topQueries.data.rows || [],
            pages: topPages.data.rows || []
        };

        console.log('\n--- Overall Performance ---');
        console.table([report.summary]);

        console.log('\n--- Top 20 Search Queries ---');
        console.table(report.queries.slice(0, 20).map(q => ({
            query: q.keys[0],
            clicks: q.clicks,
            impressions: q.impressions,
            ctr: (q.ctr * 100).toFixed(2) + '%',
            position: q.position.toFixed(1)
        })));

        console.log('\n--- Top 10 Pages ---');
        console.table(report.pages.slice(0, 10).map(p => ({
            page: p.keys[0].replace('https://thevalleycleanteam.com', ''),
            clicks: p.clicks,
            impressions: p.impressions,
            ctr: (p.ctr * 100).toFixed(2) + '%',
            position: p.position.toFixed(1)
        })));

        // Analysis: Quick Wins (Queries with high impressions but low CTR/Rank 10-20)
        const quickWins = report.queries
            .filter(q => q.position > 8 && q.position < 25 && q.impressions > 5)
            .slice(0, 5);

        if (quickWins.length > 0) {
            console.log('\n--- SEO Quick Win Opportunities (Striking Distance) ---');
            console.log('These queries are ranking on page 2. Optimizing content for these could drive significant traffic.');
            console.table(quickWins.map(q => ({
                query: q.keys[0],
                impressions: q.impressions,
                current_pos: q.position.toFixed(1)
            })));
        }

    } catch (error) {
        console.error('Error running report:', error.message);
    }
}

runReport();
