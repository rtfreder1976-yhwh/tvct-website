import { google } from 'googleapis';

type JWTAuth = InstanceType<typeof google.auth.JWT>;

/**
 * Which GA4 property and which Search Console property this site's data lives
 * in are both things the Google APIs can be *asked*. Requiring them as
 * hand-copied environment variables means every wrong value fails as an opaque
 * permission error that names neither the value nor the fix, and the two IDs
 * are easy to confuse with things that look similar:
 *
 *   - the GA4 *measurement* ID (`G-LXHE2DSZ7T`) is not the *property* ID
 *   - a Search Console domain property (`sc-domain:example.com`) is a different
 *     string from the URL-prefix property (`https://example.com/`), and only
 *     the exact verified string is accepted
 *
 * So we discover both at request time and treat the environment variables as
 * an optional override. When discovery comes back empty, the service account
 * simply has not been granted access yet — which is the one step no API can do
 * for us, so that error says so by name.
 */

/**
 * The measurement ID in the site's own gtag snippet
 * (src/layouts/BaseLayout.astro). Used to pick the right GA4 property when the
 * service account can see more than one.
 */
const SITE_MEASUREMENT_ID = process.env.GA4_MEASUREMENT_ID || 'G-LXHE2DSZ7T';

export type Resolution<T> =
  | { ok: true; value: T; source: 'env' | 'discovered'; note?: string }
  | { ok: false; error: string; message: string };

function grantAccessMessage(clientEmail: string, what: string, where: string): string {
  return (
    `The service account ${clientEmail} cannot see any ${what}. ` +
    `Grant it read access in ${where}, using that exact email address, then retry.`
  );
}

/** Cache per warm serverless instance — discovery is stable and costs a round trip. */
const propertyCache = new Map<string, string>();
const siteCache = new Map<string, { value: string; source: 'env' | 'discovered' }>();

/**
 * True when `entry` is a Search Console property covering `domain`, i.e. the
 * domain property for it or a URL-prefix property whose host is the domain or a
 * subdomain of it. A substring test is not enough: `https://nottheclub.com/`
 * contains `theclub.com`.
 */
function coversDomain(entry: string, domain: string): boolean {
  if (entry.startsWith('sc-domain:')) {
    const host = entry.slice('sc-domain:'.length);
    return host === domain || host.endsWith(`.${domain}`);
  }
  try {
    const host = new URL(entry).hostname;
    return host === domain || host.endsWith(`.${domain}`);
  } catch {
    return false;
  }
}

/**
 * Resolves the numeric GA4 property ID (e.g. `123456789`).
 *
 * `GA4_PROPERTY_ID` wins when it holds a plausible numeric ID. A value that is
 * obviously not one — most often the `G-XXXXXXX` measurement ID copied from the
 * site's tag — is reported and then ignored in favour of discovery, so a wrong
 * variable degrades to a warning rather than an outage.
 */
export async function resolveGa4PropertyId(
  auth: JWTAuth,
  clientEmail: string
): Promise<Resolution<string>> {
  const configured = process.env.GA4_PROPERTY_ID?.trim();
  let note: string | undefined;

  if (configured) {
    // `properties/123456789` is what the API itself returns, so accept it.
    const bare = configured.replace(/^properties\//, '');
    if (/^\d+$/.test(bare)) {
      return { ok: true, value: bare, source: 'env' };
    }
    note =
      `GA4_PROPERTY_ID is set to "${configured}", which is not a property ID — ` +
      (configured.startsWith('G-')
        ? 'that is the measurement ID from the site\'s gtag snippet. '
        : 'a property ID is digits only. ') +
      'Ignoring it and using the property the service account actually has access to.';
  }

  const cached = propertyCache.get(clientEmail);
  if (cached) return { ok: true, value: cached, source: 'discovered', note };

  const admin = google.analyticsadmin({ version: 'v1beta', auth });

  let summaries;
  try {
    const res = await admin.accountSummaries.list({ pageSize: 200 });
    summaries = res.data.accountSummaries || [];
  } catch (err) {
    return {
      ok: false,
      error: 'Cannot list Google Analytics properties',
      message:
        `${err instanceof Error ? err.message : String(err)} — ` +
        grantAccessMessage(
          clientEmail,
          'Google Analytics properties',
          'GA4 → Admin → Property access management (role: Viewer)'
        ),
    };
  }

  const properties = summaries.flatMap((account) =>
    (account.propertySummaries || []).map((p) => ({
      id: (p.property || '').replace(/^properties\//, ''),
      name: p.displayName || '(unnamed)',
      account: account.displayName || '(unnamed account)',
    }))
  ).filter((p) => p.id);

  if (properties.length === 0) {
    return {
      ok: false,
      error: 'No Google Analytics property available',
      message: grantAccessMessage(
        clientEmail,
        'Google Analytics properties',
        'GA4 → Admin → Property access management (role: Viewer)'
      ),
    };
  }

  if (properties.length === 1) {
    propertyCache.set(clientEmail, properties[0].id);
    return { ok: true, value: properties[0].id, source: 'discovered', note };
  }

  // More than one: the site's own measurement ID identifies which property it
  // reports into, so ask each property for its web data streams.
  const matches: string[] = [];
  for (const property of properties) {
    try {
      const streams = await admin.properties.dataStreams.list({
        parent: `properties/${property.id}`,
        pageSize: 200,
      });
      const hit = (streams.data.dataStreams || []).some(
        (s) => s.webStreamData?.measurementId === SITE_MEASUREMENT_ID
      );
      if (hit) matches.push(property.id);
    } catch {
      /* a property we cannot read streams for simply cannot be the match */
    }
  }

  if (matches.length === 1) {
    propertyCache.set(clientEmail, matches[0]);
    return { ok: true, value: matches[0], source: 'discovered', note };
  }

  const list = properties.map((p) => `${p.id} (${p.account} → ${p.name})`).join(', ');
  return {
    ok: false,
    error: 'Ambiguous Google Analytics property',
    message:
      `The service account can see ${properties.length} properties and none of them ` +
      `has a web data stream for ${SITE_MEASUREMENT_ID}. Set GA4_PROPERTY_ID to one ` +
      `of: ${list}`,
  };
}

/**
 * Resolves the Search Console property string.
 *
 * Search Console only accepts the exact verified string, and a domain property
 * (`sc-domain:example.com`) and a URL-prefix property (`https://example.com/`)
 * are different properties even for the same site. Rather than have that
 * distinction be something to get right by hand, list what the service account
 * is verified for and pick the entry that covers this site — preferring the
 * domain property, which spans http/https and every subdomain.
 */
export async function resolveSearchConsoleSite(
  auth: JWTAuth,
  clientEmail: string,
  domain: string
): Promise<Resolution<string>> {
  const configured = process.env.GOOGLE_SITE_URL?.trim();

  // Cache the decision, not just the discovered value: a valid GOOGLE_SITE_URL
  // returns before any caching would otherwise happen, which would leave every
  // request re-listing properties to reach the same answer.
  const cacheKey = `${clientEmail}|${domain}`;
  const cached = siteCache.get(cacheKey);
  if (cached) return { ok: true, value: cached.value, source: cached.source };

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  let entries;
  try {
    const res = await searchconsole.sites.list({});
    entries = (res.data.siteEntry || [])
      .map((e) => e.siteUrl)
      .filter((u): u is string => Boolean(u));
  } catch (err) {
    return {
      ok: false,
      error: 'Cannot list Search Console properties',
      message:
        `${err instanceof Error ? err.message : String(err)} — ` +
        grantAccessMessage(
          clientEmail,
          'Search Console properties',
          'Search Console → Settings → Users and permissions → Add user (permission: Full or Restricted)'
        ),
    };
  }

  if (configured && entries.includes(configured)) {
    siteCache.set(cacheKey, { value: configured, source: 'env' });
    return { ok: true, value: configured, source: 'env' };
  }

  if (entries.length === 0) {
    return {
      ok: false,
      error: 'No Search Console property available',
      message: grantAccessMessage(
        clientEmail,
        'Search Console properties',
        'Search Console → Settings → Users and permissions → Add user (permission: Full or Restricted)'
      ),
    };
  }

  // Preference order: domain property, then www, then bare https, then any
  // entry that mentions the domain at all.
  const bare = domain.replace(/^www\./, '');
  const preferred = [
    `sc-domain:${bare}`,
    `https://www.${bare}/`,
    `https://${bare}/`,
    `http://www.${bare}/`,
    `http://${bare}/`,
  ];
  const match =
    preferred.find((candidate) => entries.includes(candidate)) ||
    entries.find((entry) => coversDomain(entry, bare));

  if (!match) {
    return {
      ok: false,
      error: 'No Search Console property matches this site',
      message:
        `The service account is verified for ${entries.join(', ')}, none of which ` +
        `covers ${bare}. Add it in Search Console → Settings → Users and permissions, ` +
        `or set GOOGLE_SITE_URL to one of those exact strings.`,
    };
  }

  siteCache.set(cacheKey, { value: match, source: 'discovered' });
  return {
    ok: true,
    value: match,
    source: 'discovered',
    note: configured
      ? `GOOGLE_SITE_URL is set to "${configured}", which is not a property this ` +
        `service account is verified for. Using "${match}" instead.`
      : undefined,
  };
}
