import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const siteUrl = process.env.GOOGLE_SITE_URL || 'https://thevalleycleanteam.com';

    if (!clientEmail || !privateKey) {
      return res.status(500).json({
        error: 'Missing Google API credentials',
        message: 'Set GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY environment variables'
      });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
    });

    const searchconsole = google.searchconsole({ version: 'v1', auth });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const targetKeywords = [
      'house cleaning huntsville al',
      'cleaning service birmingham al',
      'maid service nashville',
      'deep cleaning huntsville',
      'move out cleaning madison al',
      'airbnb cleaning muscle shoals',
      'weekly cleaning service athens al',
      'mountain brook house cleaning',
      'cleaning service huntsville',
      'house cleaning nashville tn',
      'maid service birmingham al',
      'office cleaning huntsville al'
    ];

    const rankings = await Promise.all(
      targetKeywords.map(async (keyword) => {
        try {
          const response = await searchconsole.searchanalytics.query({
            siteUrl: siteUrl,
            requestBody: {
              startDate: formatDate(startDate),
              endDate: formatDate(endDate),
              dimensions: ['query', 'page'],
              dimensionFilterGroups: [{
                filters: [{
                  dimension: 'query',
                  operator: 'contains',
                  expression: keyword
                }]
              }],
              rowLimit: 1
            }
          });

          const row = response.data.rows?.[0];
          if (row) {
            return {
              keyword,
              position: Math.round(row.position || 0),
              clicks: row.clicks || 0,
              impressions: row.impressions || 0,
              ctr: ((row.ctr || 0) * 100).toFixed(2),
              url: row.keys?.[1] || ''
            };
          }
          return { keyword, position: null, clicks: 0, impressions: 0, ctr: '0', url: '' };
        } catch (err) {
          console.error(`Error fetching ranking for "${keyword}":`, err);
          return { keyword, position: null, clicks: 0, impressions: 0, ctr: '0', url: '' };
        }
      })
    );

    const validRankings = rankings
      .filter(r => r.position !== null)
      .sort((a, b) => (a.position || 100) - (b.position || 100));

    const avgPosition = validRankings.length > 0
      ? (validRankings.reduce((sum, r) => sum + (r.position || 0), 0) / validRankings.length).toFixed(1)
      : null;

    return res.status(200).json({
      success: true,
      data: {
        rankings: validRankings,
        avgPosition,
        totalKeywords: validRankings.length,
        dateRange: {
          start: formatDate(startDate),
          end: formatDate(endDate)
        }
      }
    });

  } catch (error) {
    console.error('Search Console API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch rankings',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
