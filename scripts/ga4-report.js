/**
 * GA4 read access — the analytics counterpart to scripts/gsc-*.js.
 *
 * Auth mirrors the GSC scripts exactly: a Google Cloud service account whose
 * email must ALSO be added to the GA4 property (Admin → Property access
 * management → Viewer). Cloud project access alone returns 403, the same trap
 * documented for Search Console in .env.example.
 *
 * Usage:
 *   node scripts/ga4-report.js                 # last 28 days
 *   node scripts/ga4-report.js --days 90
 *   node scripts/ga4-report.js --start 2026-08-01 --end 2026-08-31
 *
 * Every report filters to real traffic. Preview deployments were ~55% of all
 * events before PR #167; BaseLayout now gates on hostname, but datacenter and
 * out-of-market traffic still inflates raw totals, so geography and hostname
 * are reported rather than assumed.
 */
import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const CLIENT_EMAIL = process.env.GA4_CLIENT_EMAIL || process.env.GSC_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GA4_PRIVATE_KEY || process.env.GSC_PRIVATE_KEY;

if (!PROPERTY_ID) {
  console.error('GA4_PROPERTY_ID is not set. This is the numeric property ID');
  console.error('(GA4 Admin → Property Settings), NOT the G-XXXXXXX measurement ID.');
  process.exit(1);
}
if (!CLIENT_EMAIL || !PRIVATE_KEY) {
  console.error('No service-account credentials found.');
  console.error('Set GA4_CLIENT_EMAIL/GA4_PRIVATE_KEY, or reuse the existing');
  console.error('GSC_CLIENT_EMAIL/GSC_PRIVATE_KEY pair if it is the same account.');
  process.exit(1);
}

function parseArgs(argv) {
  const args = { days: 28 };
  for (let i = 2; i < argv.length; i++) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === '--days') { args.days = Number(value); i++; }
    else if (flag === '--start') { args.start = value; i++; }
    else if (flag === '--end') { args.end = value; i++; }
  }
  return args;
}

const fmt = (d) => d.toISOString().split('T')[0];
const args = parseArgs(process.argv);
let startDate = args.start;
let endDate = args.end;
if (!startDate || !endDate) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - args.days);
  startDate = fmt(start);
  endDate = fmt(today);
}

const auth = new google.auth.GoogleAuth({
  credentials: { client_email: CLIENT_EMAIL, private_key: PRIVATE_KEY },
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

const analyticsdata = google.analyticsdata({ version: 'v1beta', auth });
const property = `properties/${PROPERTY_ID}`;

async function runReport(body) {
  const res = await analyticsdata.properties.runReport({
    property,
    requestBody: { dateRanges: [{ startDate, endDate }], ...body },
  });
  return res.data;
}

const cell = (row, i) => (row.dimensionValues?.[i]?.value ?? '');
const metric = (row, i) => Number(row.metricValues?.[i]?.value ?? 0);

function table(title, rows) {
  console.log(`\n-- ${title} ${'-'.repeat(Math.max(0, 58 - title.length))}`);
  if (!rows.length) { console.log('   (no data)'); return; }
  console.table(rows);
}

async function main() {
  console.log(`GA4 report - property ${PROPERTY_ID} - ${startDate} to ${endDate}`);

  // 1. Totals. The denominator for every conversion rate below.
  const totals = await runReport({
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'engagementRate' },
    ],
  });
  const t = totals.rows?.[0];
  table('Totals', t ? [{
    sessions: metric(t, 0),
    users: metric(t, 1),
    pageviews: metric(t, 2),
    engagementRate: `${(metric(t, 3) * 100).toFixed(1)}%`,
  }] : []);

  // 2. Every event by name. This is the audit surface: it shows whether the
  //    conversions arrive under useful names or are buried inside a generic
  //    "click" event.
  const events = await runReport({
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }, { name: 'totalUsers' }],
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 40,
  });
  table('Events by name', (events.rows ?? []).map((r) => ({
    event: cell(r, 0), count: metric(r, 0), users: metric(r, 1),
  })));

  // 3. Contact clicks. BaseLayout sends phone and email taps as a generic
  //    `click` with UA-style category/label params, so the label is the only
  //    thing separating a phone tap from an email tap.
  const contact = await runReport({
    dimensions: [{ name: 'eventName' }, { name: 'customEvent:event_label' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: { values: ['click', 'cta_click', 'contact_call', 'phone_click'] },
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
    limit: 25,
  }).catch((e) => {
    console.log('\n   (contact breakdown unavailable - event_label may not be');
    console.log('    registered as a custom dimension in GA4: ' + (e.message || e) + ')');
    return { rows: [] };
  });
  table('Contact clicks (phone vs email)', (contact.rows ?? []).map((r) => ({
    event: cell(r, 0), label: cell(r, 1) || '(not set)', count: metric(r, 0),
  })));

  // 4. Key events - what GA4 actually counts as a conversion. An empty result
  //    means nothing on the site is marked as a key event.
  const key = await runReport({
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'keyEvents' }],
    orderBys: [{ metric: { metricName: 'keyEvents' }, desc: true }],
    limit: 20,
  }).catch(() => ({ rows: [] }));
  const keyRows = (key.rows ?? [])
    .map((r) => ({ event: cell(r, 0), keyEvents: metric(r, 0) }))
    .filter((r) => r.keyEvents > 0);
  table('Key events (GA4 conversions)', keyRows);
  if (!keyRows.length) {
    console.log('   WARNING: no key events recorded. GA4 is counting traffic but');
    console.log('   no conversions - nothing is marked as a key event.');
  }

  // 5. Geography. ~85% of raw visitors have been datacenter traffic; AL/TN is
  //    the only segment that can actually buy.
  const geo = await runReport({
    dimensions: [{ name: 'region' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 12,
  });
  table('Sessions by region', (geo.rows ?? []).map((r) => ({
    region: cell(r, 0) || '(not set)', sessions: metric(r, 0),
  })));

  // 6. Landing pages, so conversion work can be pointed at real entry points.
  const pages = await runReport({
    dimensions: [{ name: 'landingPagePlusQueryString' }],
    metrics: [{ name: 'sessions' }, { name: 'engagementRate' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 20,
  });
  table('Top landing pages', (pages.rows ?? []).map((r) => ({
    page: cell(r, 0), sessions: metric(r, 0),
    engagement: `${(metric(r, 1) * 100).toFixed(1)}%`,
  })));

  // 7. Channels.
  const channels = await runReport({
    dimensions: [{ name: 'sessionDefaultChannelGroup' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 12,
  });
  table('Sessions by channel', (channels.rows ?? []).map((r) => ({
    channel: cell(r, 0), sessions: metric(r, 0),
  })));

  // 8. Hostname check. Confirms the production-only guard is holding and no
  //    preview deployment is leaking into the property.
  const hosts = await runReport({
    dimensions: [{ name: 'hostName' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10,
  });
  table('Sessions by hostname', (hosts.rows ?? []).map((r) => ({
    hostname: cell(r, 0) || '(not set)', sessions: metric(r, 0),
  })));
}

main().catch((error) => {
  console.error('\nGA4 request failed.');
  const status = error?.response?.status ?? error?.code;
  if (status === 403) {
    console.error('403 - the service account can reach the API but not this');
    console.error('property. Add ' + CLIENT_EMAIL);
    console.error('in GA4 Admin -> Property access management as a Viewer.');
  } else if (status === 404) {
    console.error('404 - GA4_PROPERTY_ID looks wrong. It is the numeric ID from');
    console.error('GA4 Admin -> Property Settings, not the G-XXXXXXX tag.');
  } else if (error?.response?.data) {
    console.error(JSON.stringify(error.response.data, null, 2));
  } else {
    console.error(error.message || error);
  }
  process.exit(1);
});
