import type { VercelRequest, VercelResponse } from '@vercel/node';

const GHL_BASE_URL = 'https://services.leadconnectorhq.com';
const PAGE_LIMIT = 100;
const MAX_PAGES = 10; // Safety limit to prevent infinite loops

interface GHLContact {
  dateAdded: string;
  source?: string;
  [key: string]: unknown;
}

interface GHLOpportunity {
  status: string;
  [key: string]: unknown;
}

/**
 * Fetches all contacts using pagination
 */
async function fetchAllContacts(
  apiKey: string,
  locationId: string
): Promise<GHLContact[]> {
  const allContacts: GHLContact[] = [];
  let startAfterId: string | undefined;
  let pageCount = 0;

  while (pageCount < MAX_PAGES) {
    const url = new URL(`${GHL_BASE_URL}/contacts/`);
    url.searchParams.set('locationId', locationId);
    url.searchParams.set('limit', PAGE_LIMIT.toString());
    if (startAfterId) {
      url.searchParams.set('startAfterId', startAfterId);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.status}`);
    }

    const data = await response.json();
    const contacts = data.contacts || [];

    if (contacts.length === 0) {
      break;
    }

    allContacts.push(...contacts);

    // Check if there are more pages
    if (contacts.length < PAGE_LIMIT || !data.meta?.nextPageUrl) {
      break;
    }

    // Get the last contact ID for pagination
    startAfterId = contacts[contacts.length - 1].id;
    pageCount++;
  }

  return allContacts;
}

/**
 * Fetches all opportunities using pagination
 */
async function fetchAllOpportunities(
  apiKey: string,
  locationId: string,
  startDate: Date,
  endDate: Date
): Promise<GHLOpportunity[]> {
  const allOpportunities: GHLOpportunity[] = [];
  let startAfterId: string | undefined;
  let pageCount = 0;

  while (pageCount < MAX_PAGES) {
    const response = await fetch(
      `${GHL_BASE_URL}/opportunities/search?locationId=${locationId}&limit=${PAGE_LIMIT}${startAfterId ? `&startAfterId=${startAfterId}` : ''}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          locationId,
          startAfter: startDate.toISOString(),
          endBefore: endDate.toISOString()
        })
      }
    );

    if (!response.ok) {
      throw new Error(`GHL Opportunities API error: ${response.status}`);
    }

    const data = await response.json();
    const opportunities = data.opportunities || [];

    if (opportunities.length === 0) {
      break;
    }

    allOpportunities.push(...opportunities);

    // Check if there are more pages
    if (opportunities.length < PAGE_LIMIT || !data.meta?.nextPageUrl) {
      break;
    }

    startAfterId = opportunities[opportunities.length - 1].id;
    pageCount++;
  }

  return allOpportunities;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 'public, max-age=3600');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!apiKey || !locationId) {
      return res.status(500).json({
        error: 'Missing GoHighLevel credentials',
        message: 'Set GHL_API_KEY and GHL_LOCATION_ID environment variables'
      });
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const prevEndDate = new Date(startDate);
    prevEndDate.setDate(prevEndDate.getDate() - 1);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevStartDate.getDate() - 30);

    // Fetch all contacts with pagination
    const contacts = await fetchAllContacts(apiKey, locationId);

    const currentPeriodContacts = contacts.filter((contact) => {
      const createdAt = new Date(contact.dateAdded);
      return createdAt >= startDate && createdAt <= endDate;
    });

    const previousPeriodContacts = contacts.filter((contact) => {
      const createdAt = new Date(contact.dateAdded);
      return createdAt >= prevStartDate && createdAt <= prevEndDate;
    });

    const formSubmissions = currentPeriodContacts.filter((c) =>
      c.source?.toLowerCase().includes('form') ||
      c.source?.toLowerCase().includes('website') ||
      !c.source
    ).length;

    const phoneCalls = currentPeriodContacts.filter((c) =>
      c.source?.toLowerCase().includes('call') ||
      c.source?.toLowerCase().includes('phone')
    ).length;

    const emails = currentPeriodContacts.filter((c) =>
      c.source?.toLowerCase().includes('email')
    ).length;

    // Fetch all opportunities with pagination
    let bookings = 0;
    try {
      const opportunities = await fetchAllOpportunities(apiKey, locationId, startDate, endDate);
      bookings = opportunities.filter((opp) =>
        opp.status === 'won' || opp.status === 'booked'
      ).length;
    } catch (e) {
      console.error('Error fetching opportunities:', e);
    }

    const calculateMonthlyTrend = (contactList: GHLContact[]): number[] => {
      const months: { [key: string]: number } = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        months[key] = 0;
      }
      contactList.forEach((contact) => {
        const date = new Date(contact.dateAdded);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (Object.prototype.hasOwnProperty.call(months, key)) {
          months[key]++;
        }
      });
      return Object.values(months);
    };

    return res.status(200).json({
      success: true,
      data: {
        totalLeads: currentPeriodContacts.length,
        previousTotal: previousPeriodContacts.length,
        formSubmissions,
        phoneCalls,
        emails,
        bookings,
        conversionRate: currentPeriodContacts.length > 0
          ? ((bookings / currentPeriodContacts.length) * 100).toFixed(2)
          : '0',
        monthlyTrend: calculateMonthlyTrend(contacts),
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: endDate.toISOString().split('T')[0]
        }
      }
    });

  } catch (error) {
    console.error('GoHighLevel API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch lead data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
