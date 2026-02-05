import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

// Simple in-memory cache for Search Console results
interface CacheEntry {
  data: RankingResult[];
  avgPosition: string | null;
  timestamp: number;
}

interface RankingResult {
  keyword: string;
  position: number | null;
  clicks: number;
  impressions: number;
  ctr: string;
  url: string;
}

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache TTL
let rankingsCache: CacheEntry | null = null;

// Batch size for Search Console API requests to reduce quota pressure
const BATCH_SIZE = 4;

/**
 * Process keywords in batches to avoid API quota spikes
 */
async function processBatches<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    // Small delay between batches to spread out requests
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  return results;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check query params for cache bypass and operator preference
    const bypassCache = req.query.bypass_cache === 'true';
    // Use 'equals' for exact phrase matching, 'contains' for broader matching
    const useExactMatch = req.query.exact_match === 'true';

    // Return cached results if valid and not bypassed
    if (!bypassCache && rankingsCache && (Date.now() - rankingsCache.timestamp) < CACHE_TTL_MS) {
      return res.status(200).json({
        success: true,
        cached: true,
        data: {
          rankings: rankingsCache.data,
          avgPosition: rankingsCache.avgPosition,
          totalKeywords: rankingsCache.data.filter(r => r.position !== null).length,
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0]
          }
        }
      });
    }

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

    // Process keywords in batches to reduce API quota pressure
    const rankings = await processBatches(targetKeywords, BATCH_SIZE, async (keyword): Promise<RankingResult> => {
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
                // Use 'equals' for exact phrase tracking or 'contains' for broader matching
                operator: useExactMatch ? 'equals' : 'contains',
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
    });

    const validRankings = rankings
      .filter(r => r.position !== null)
      .sort((a, b) => (a.position || 100) - (b.position || 100));

    const avgPosition = validRankings.length > 0
      ? (validRankings.reduce((sum, r) => sum + (r.position || 0), 0) / validRankings.length).toFixed(1)
      : null;

    // Update cache with fresh results
    rankingsCache = {
      data: validRankings,
      avgPosition,
      timestamp: Date.now()
    };

    return res.status(200).json({
      success: true,
      cached: false,
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
