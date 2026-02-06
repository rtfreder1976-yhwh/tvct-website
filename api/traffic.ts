import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';
import { enforceAnalyticsToken, enforceRateLimit } from './_utils/analyticsAuth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, X-Analytics-Token, Content-Type');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!enforceRateLimit(req, res)) {
    return;
  }

  if (!enforceAnalyticsToken(req, res)) {
    return;
  }

  try {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const propertyId = process.env.GA4_PROPERTY_ID;

    if (!clientEmail || !privateKey || !propertyId) {
      return res.status(500).json({
        error: 'Missing Google Analytics credentials',
        message: 'Set GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GA4_PROPERTY_ID environment variables'
      });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    const analyticsData = google.analyticsdata({ version: 'v1beta', auth });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const currentPeriod = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
          { name: 'activeUsers' }
        ]
      }
    });

    const previousPeriod = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: formatDate(prevStartDate), endDate: formatDate(prevEndDate) }],
        metrics: [
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' }
        ]
      }
    });

    const trendStartDate = new Date();
    trendStartDate.setMonth(trendStartDate.getMonth() - 6);
    trendStartDate.setDate(1);

    const monthlyTrend = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: formatDate(trendStartDate), endDate: formatDate(endDate) }],
        dimensions: [{ name: 'yearMonth' }],
        metrics: [{ name: 'sessions' }],
        orderBys: [{ dimension: { dimensionName: 'yearMonth' } }]
      }
    });

    const topPages = await analyticsData.properties.runReport({
      property: `properties/${propertyId}`,
      requestBody: {
        dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'sessions' },
          { name: 'conversions' }
        ],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: '10'
      }
    });

    const currentRow = currentPeriod.data?.rows?.[0]?.metricValues || [];
    const previousRow = previousPeriod.data?.rows?.[0]?.metricValues || [];

    const formatDuration = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const current = {
      sessions: parseInt(currentRow[0]?.value || '0'),
      pageviews: parseInt(currentRow[1]?.value || '0'),
      avgDuration: formatDuration(parseFloat(currentRow[2]?.value || '0')),
      bounceRate: Math.round(parseFloat(currentRow[3]?.value || '0') * 100),
      activeUsers: parseInt(currentRow[4]?.value || '0')
    };

    const previous = {
      sessions: parseInt(previousRow[0]?.value || '0'),
      pageviews: parseInt(previousRow[1]?.value || '0'),
      avgDuration: formatDuration(parseFloat(previousRow[2]?.value || '0')),
      bounceRate: Math.round(parseFloat(previousRow[3]?.value || '0') * 100)
    };

    const trend = (monthlyTrend.data?.rows || []).map(row => ({
      month: row.dimensionValues?.[0]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0')
    }));

    const pages = (topPages.data?.rows || []).slice(0, 5).map(row => ({
      page: row.dimensionValues?.[0]?.value || '',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
      conversions: parseInt(row.metricValues?.[1]?.value || '0')
    }));

    return res.status(200).json({
      success: true,
      data: {
        current,
        previous,
        monthlyTrend: trend.map(t => t.sessions),
        topPages: pages,
        dateRange: {
          start: formatDate(startDate),
          end: formatDate(endDate)
        }
      }
    });

  } catch (error) {
    console.error('Google Analytics API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch traffic data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
