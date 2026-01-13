import type { VercelRequest, VercelResponse } from '@vercel/node';
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

    const response = await fetch(
      `https://services.leadconnectorhq.com/contacts/?locationId=${locationId}&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.status}`);
    }

    const data = await response.json();
    const contacts = data.contacts || [];

    const currentPeriodContacts = contacts.filter((contact: any) => {
      const createdAt = new Date(contact.dateAdded);
      return createdAt >= startDate && createdAt <= endDate;
    });

    const previousPeriodContacts = contacts.filter((contact: any) => {
      const createdAt = new Date(contact.dateAdded);
      return createdAt >= prevStartDate && createdAt <= prevEndDate;
    });

    const formSubmissions = currentPeriodContacts.filter((c: any) =>
      c.source?.toLowerCase().includes('form') ||
      c.source?.toLowerCase().includes('website') ||
      !c.source
    ).length;

    const phoneCalls = currentPeriodContacts.filter((c: any) =>
      c.source?.toLowerCase().includes('call') ||
      c.source?.toLowerCase().includes('phone')
    ).length;

    const emails = currentPeriodContacts.filter((c: any) =>
      c.source?.toLowerCase().includes('email')
    ).length;

    let bookings = 0;
    try {
      const opportunitiesResponse = await fetch(
        `https://services.leadconnectorhq.com/opportunities/search?locationId=${locationId}&limit=100`,
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

      if (opportunitiesResponse.ok) {
        const oppData = await opportunitiesResponse.json();
        bookings = (oppData.opportunities || []).filter((opp: any) =>
          opp.status === 'won' || opp.status === 'booked'
        ).length;
      }
    } catch (e) {
      console.error('Error fetching opportunities:', e);
    }

    const calculateMonthlyTrend = (contacts: any[]): number[] => {
      const months: { [key: string]: number } = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        months[key] = 0;
      }
      contacts.forEach((contact: any) => {
        const date = new Date(contact.dateAdded);
        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        if (months.hasOwnProperty(key)) {
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
