export const prerender = false;

// Markets: map city/state/tag text → market slug
const MARKET_KEYWORDS: Record<string, string[]> = {
  huntsville: ['huntsville', 'madison', 'hampton cove', 'harvest', 'meridianville', 'owens cross roads'],
  athens: ['athens'],
  florence: ['florence', 'muscle shoals', 'tuscumbia', 'sheffield', 'killen', 'rogersville'],
  birmingham: ['mountain brook', 'birmingham', 'crestline', 'vestavia', 'hoover'],
  nashville: ['nashville', 'brentwood', 'franklin', 'green hills', 'belle meade', 'east nashville'],
};

function detectMarket(city = '', state = '', tags: string[] = []): string | null {
  const text = [city, state, ...tags].join(' ').toLowerCase();
  for (const [market, keywords] of Object.entries(MARKET_KEYWORDS)) {
    if (keywords.some(k => text.includes(k))) return market;
  }
  return null;
}

function detectSource(source = ''): 'quoteForms' | 'phoneCalls' | 'chat' {
  const s = source.toLowerCase();
  if (s.includes('phone') || s.includes('call') || s.includes('inbound')) return 'phoneCalls';
  if (s.includes('chat') || s.includes('live chat') || s.includes('web chat')) return 'chat';
  // Default: website, organic, form, email, google → quoteForms
  return 'quoteForms';
}

const FALLBACK = {
  success: true,
  data: {
    totalLeads: 26,
    quoteForms: 16,
    phoneCalls: 8,
    chat: 2,
    previousTotal: 22,
    change: 18.2,
    byMarket: { huntsville: 12, athens: 5, florence: 4, birmingham: 3, nashville: 2 },
    bySource: { quoteForms: 16, phoneCalls: 8, chat: 2 },
    weeklyTrend: [18, 20, 24, 26],
  },
};

export async function GET() {
  const GHL_API_KEY = process.env.GHL_API_KEY;
  const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

  if (!GHL_API_KEY || !GHL_LOCATION_ID) {
    console.warn('GHL credentials not configured — using fallback lead data.');
    return new Response(JSON.stringify({ ...FALLBACK, source: 'fallback' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const sixtyDaysAgo = now - 60 * 24 * 60 * 60 * 1000;

    // Fetch contacts added in the last 60 days (covers both current and previous periods)
    const res = await fetch(
      `https://rest.gohighlevel.com/v1/contacts/?locationId=${GHL_LOCATION_ID}&startAfter=${sixtyDaysAgo}&limit=100`,
      {
        headers: { Authorization: `Bearer ${GHL_API_KEY}` },
      }
    );

    if (!res.ok) {
      console.error(`GHL API returned ${res.status}`);
      return new Response(JSON.stringify({ ...FALLBACK, source: 'fallback', error: `GHL ${res.status}` }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await res.json();
    const allContacts: any[] = body.contacts ?? [];

    // Split into current (last 30d) and previous (30–60d ago) periods
    const current = allContacts.filter(c => new Date(c.dateAdded).getTime() >= thirtyDaysAgo);
    const previous = allContacts.filter(c => {
      const t = new Date(c.dateAdded).getTime();
      return t >= sixtyDaysAgo && t < thirtyDaysAgo;
    });

    // Tally source and market for current period
    const bySource = { quoteForms: 0, phoneCalls: 0, chat: 0 };
    const byMarket: Record<string, number> = {
      huntsville: 0, athens: 0, florence: 0, birmingham: 0, nashville: 0,
    };

    for (const c of current) {
      bySource[detectSource(c.source ?? '')]++;
      const market = detectMarket(c.city ?? '', c.state ?? '', c.tags ?? []);
      if (market) byMarket[market]++;
    }

    const currentTotal = current.length;
    const previousTotal = previous.length;
    const change = previousTotal > 0
      ? parseFloat(((currentTotal - previousTotal) / previousTotal * 100).toFixed(1))
      : 0;

    // Build 4-week trend (oldest → newest)
    const weeklyTrend = [3, 2, 1, 0].map(weeksAgo => {
      const start = now - (weeksAgo + 1) * 7 * 24 * 60 * 60 * 1000;
      const end = now - weeksAgo * 7 * 24 * 60 * 60 * 1000;
      return allContacts.filter(c => {
        const t = new Date(c.dateAdded).getTime();
        return t >= start && t < end;
      }).length;
    });

    return new Response(
      JSON.stringify({
        success: true,
        source: 'live',
        data: {
          totalLeads: currentTotal,
          quoteForms: bySource.quoteForms,
          phoneCalls: bySource.phoneCalls,
          chat: bySource.chat,
          previousTotal,
          change,
          byMarket,
          bySource,
          weeklyTrend,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('GHL leads fetch error:', err.message);
    return new Response(JSON.stringify({ ...FALLBACK, source: 'fallback', error: err.message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
