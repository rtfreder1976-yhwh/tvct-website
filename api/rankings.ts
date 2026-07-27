import type { ApiRequest, ApiResponse } from './_types.js';
import { google } from 'googleapis';
import { normalizePrivateKey } from './_google-auth.js';
import { resolveSearchConsoleSite } from './_google-discovery.js';
import { requireAdmin, setPrivateApiHeaders } from './_admin-auth.js';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  setPrivateApiHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireAdmin(req, res)) return;

  try {
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawKey = process.env.GOOGLE_PRIVATE_KEY;

    // Validate the key up front so a malformed one is reported as a credential
    // problem. Previously a bad key threw inside the per-keyword loop, where the
    // catch turned it into `position: null`; those rows were then filtered out
    // and the endpoint answered 200 with `rankings: []` — an auth failure
    // presented as "no keywords ranked".
    let privateKey: string | undefined;
    let keyError: string | null = null;
    if (rawKey) {
      try {
        privateKey = normalizePrivateKey(rawKey);
      } catch (err) {
        keyError = err instanceof Error ? err.message : String(err);
      }
    }

    if (keyError) {
      return res.status(500).json({
        error: 'Invalid Google credentials',
        message: keyError,
      });
    }

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

    // The previous default — a bare `https://thevalleycleanteam.com` — is only
    // correct if that exact URL-prefix property exists. For a domain property
    // the verified string is `sc-domain:thevalleycleanteam.com`, and querying
    // the wrong one returns a permission error per keyword that this endpoint
    // used to swallow into an empty rankings list. Ask which properties the
    // service account is actually verified for instead of assuming.
    const resolvedSite = await resolveSearchConsoleSite(
      auth,
      clientEmail,
      'thevalleycleanteam.com'
    );
    if (!resolvedSite.ok) {
      return res.status(500).json({
        error: resolvedSite.error,
        message: resolvedSite.message,
      });
    }
    const siteUrl = resolvedSite.value;

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
        },
        site: {
          url: siteUrl,
          source: resolvedSite.source,
          ...(resolvedSite.note ? { warning: resolvedSite.note } : {})
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
