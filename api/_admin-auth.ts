import { timingSafeEqual } from 'node:crypto';
import type { ApiRequest, ApiResponse } from './_types.js';

/**
 * Gate for the endpoints that return business data.
 *
 * /api/traffic, /api/rankings and /api/leads were readable by anyone who knew
 * the URL: no authentication, `Access-Control-Allow-Origin: *`, and
 * `Cache-Control: public, max-age=3600`. /api/leads is the serious one — it
 * returns up to 1,000 GoHighLevel contact records, which is customer name,
 * email and phone data.
 *
 * The credential is ADMIN_SECRET, the same one /admin/dashboard already uses,
 * so there is one secret to rotate rather than two.
 *
 * Accepted:
 *   - `x-admin-key: <secret>` header  — for server-side fetches and curl
 *   - `admin_session=<secret>` cookie — set when logging in to the dashboard
 *
 * Deliberately not accepted: `?key=<secret>` in the query string. Query strings
 * land in access logs, CDN cache keys and `Referer` headers on any outbound
 * link, so a secret placed there leaks in ways a header does not. The dashboard
 * pages still take `?key=` for the initial login because they immediately
 * exchange it for the cookie.
 */

/**
 * Keep in step with ADMIN_SECRET_MIN_LENGTH in `src/lib/adminAuth.ts`, which
 * gates the dashboard pages that call these endpoints. If the page threshold is
 * lower, a short secret lets you into a dashboard whose every request then
 * fails here — the page loads, the data does not, and nothing says why.
 *
 * The two are not imported across the boundary on purpose: this file is bundled
 * by Vercel's own root-`api/` builder, not by Astro.
 */
const SECRET_MIN_LENGTH = 16;

/** Constant-time compare that does not leak length through early return. */
function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  // timingSafeEqual throws on length mismatch, so compare digests of equal size
  // instead of returning early on `length !==`, which would itself be a signal.
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so the timing of a wrong-length guess resembles a
    // wrong-value guess.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

function headerValue(req: ApiRequest, name: string): string | undefined {
  const raw = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

function cookieValue(req: ApiRequest, name: string): string | undefined {
  const parsed = req.cookies?.[name];
  if (parsed) return parsed;

  // Vercel populates req.cookies, but parse the raw header too rather than
  // depend on it: an auth check that silently stops finding the credential
  // fails open-looking (constant 401s) and is easy to misdiagnose as a bad key.
  const raw = headerValue(req, 'cookie');
  if (!raw) return undefined;
  for (const part of raw.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) return trimmed.slice(eq + 1);
  }
  return undefined;
}

/**
 * Returns true when the caller is authorised. When it returns false it has
 * already written the response, so callers should simply return.
 */
export function requireAdmin(req: ApiRequest, res: ApiResponse): boolean {
  const secret = process.env.ADMIN_SECRET;

  // Fail closed. An unset secret must not mean "let everyone in", and a short
  // one is guessable enough that accepting it would be false reassurance.
  if (!secret || secret.length < SECRET_MIN_LENGTH) {
    res.status(503).json({
      error: 'Endpoint not configured',
      message:
        `This endpoint requires ADMIN_SECRET to be set to at least ${SECRET_MIN_LENGTH} ` +
        'characters. Until it is, the endpoint denies all requests rather than serving ' +
        'business data publicly.',
    });
    return false;
  }

  const presented =
    headerValue(req, 'x-admin-key') ?? cookieValue(req, 'admin_session');

  if (!presented || !secretsMatch(presented, secret)) {
    res.status(401).json({
      error: 'Unauthorized',
      message:
        'Send the admin secret as an `x-admin-key` header, or sign in at ' +
        '/admin/dashboard to set the session cookie.',
    });
    return false;
  }

  return true;
}

/**
 * Response headers for an authenticated data endpoint.
 *
 * `public, max-age=3600` was the more dangerous half of the original problem:
 * it invites the CDN to store the response and serve that copy to whoever asks
 * next, which would hand out authenticated data without the request ever
 * reaching this function. `private, no-store` keeps it off shared caches.
 *
 * The wildcard CORS header is dropped entirely — with no
 * `Access-Control-Allow-Origin`, browsers refuse to expose the response to any
 * other origin, so a stolen cookie cannot be exercised from an attacker's page.
 */
export function setPrivateApiHeaders(res: ApiResponse): void {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Cookie, x-admin-key');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
}
