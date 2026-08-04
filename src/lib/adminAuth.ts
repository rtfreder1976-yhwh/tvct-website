import { timingSafeEqual } from 'node:crypto';

/**
 * Server-side admin gate shared by /admin/dashboard and /dashboard.
 *
 * Both pages had their own copy of this check, and neither enforced a minimum
 * secret length while `api/_admin-auth.ts` did. That disagreement produced a
 * confusing half-broken state: with a short ADMIN_SECRET the pages would let
 * you in, then every API call behind them returned 503, so the dashboard
 * rendered with all its data missing and nothing explained why.
 *
 * Keep ADMIN_SECRET_MIN_LENGTH in step with SECRET_MIN_LENGTH in
 * `api/_admin-auth.ts`. The two live in different build contexts — Astro pages
 * versus Vercel's own root `api/` functions — so they are deliberately not
 * imported across that boundary.
 */
export const ADMIN_SECRET_MIN_LENGTH = 16;

export const ADMIN_COOKIE_NAME = 'admin_session';

/** 8 hours. */
const SESSION_MAX_AGE = 28800;

/** Constant-time compare that does not leak length through an early return. */
function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

/**
 * Environment variables acquire stray characters when pasted into a dashboard:
 * a trailing newline, a trailing space, or the quotes that came along with the
 * value. Each one makes the secret compare unequal to the identical-looking
 * string typed by a human, with nothing to see in the UI.
 *
 * A trailing newline is also more than an inconvenience here: the value goes
 * into a Set-Cookie header, and a raw newline in a header value is exactly the
 * shape of a response-splitting payload — Node rejects it at best.
 */
export function normalizeSecret(raw: string | undefined): string | undefined {
  if (raw === undefined) return undefined;
  let s = raw.trim();
  if (s.length >= 2 &&
      ((s.startsWith('"') && s.endsWith('"')) ||
       (s.startsWith("'") && s.endsWith("'")))) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

/**
 * Every way the `?key=` value can survive a trip through a URL bar.
 *
 * `URLSearchParams` decodes `+` as a space, because in a query string that is
 * what `+` means. So a base64 secret — which `openssl rand -base64` readily
 * produces — silently arrives with spaces where its plus signs were, and the
 * login fails with no indication why. Rather than require whoever logs in to
 * know that, try the readings that could have produced this URL and accept the
 * one that matches.
 *
 * A literal `&` in the secret still truncates it: that is the query-string
 * delimiter and nothing downstream can recover the rest. Percent-encoding is
 * the only fix there, so the failure message says so.
 */
function candidateKeys(url: URL): string[] {
  const found: string[] = [];
  const add = (v: string | null | undefined) => {
    if (v && !found.includes(v)) found.push(v);
  };

  const decoded = url.searchParams.get('key');
  add(decoded);
  // The same string with spaces read back as the plus signs they came from.
  if (decoded?.includes(' ')) add(decoded.replace(/ /g, '+'));

  // The undecoded substring, for a value that was already literal.
  const rawParam = url.search
    .replace(/^\?/, '')
    .split('&')
    .find((p) => p.startsWith('key='))
    ?.slice(4);
  add(rawParam);

  return found;
}

function cookieValue(cookieHeader: string, name: string): string | undefined {
  for (const part of cookieHeader.split(';')) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    if (trimmed.slice(0, eq) === name) return trimmed.slice(eq + 1);
  }
  return undefined;
}

export type AdminAuthResult =
  | { ok: true; setCookie?: string }
  | { ok: false; response: Response };

/**
 * Authorises a dashboard request.
 *
 * On success, `setCookie` is present when the caller arrived with `?key=` and
 * should have it exchanged for a session cookie — which both stops the secret
 * sitting in the URL bar and gives the page's browser-side `/api/*` fetches the
 * credential they need.
 */
export function authorizeAdmin(
  url: URL,
  request: Request,
  rawAdminSecret: string | undefined,
  loginPath: string,
): AdminAuthResult {
  const adminSecret = normalizeSecret(rawAdminSecret);

  const deny = (message: string, status: number): AdminAuthResult => ({
    ok: false,
    response: new Response(message, {
      status,
      headers: { 'Content-Type': 'text/plain' },
    }),
  });

  // Fail closed, and say which of the two problems it is. "Unauthorized" when
  // the secret was never configured sends you hunting for a wrong password.
  if (!adminSecret) {
    return deny(
      'This dashboard is not configured — ADMIN_SECRET is not set in the ' +
        'deployment environment. Until it is, access is denied rather than ' +
        'left open.',
      503,
    );
  }

  if (adminSecret.length < ADMIN_SECRET_MIN_LENGTH) {
    return deny(
      `ADMIN_SECRET is set but shorter than ${ADMIN_SECRET_MIN_LENGTH} ` +
        'characters, which the API endpoints behind this dashboard reject. ' +
        'Lengthen it so the page and its data agree.',
      503,
    );
  }

  const candidates = candidateKeys(url);
  if (candidates.some((candidate) => secretsMatch(candidate, adminSecret))) {
    return {
      ok: true,
      setCookie:
        `${ADMIN_COOKIE_NAME}=${adminSecret}; HttpOnly; Secure; ` +
        `SameSite=Strict; Path=/; Max-Age=${SESSION_MAX_AGE}`,
    };
  }

  const cookie = request.headers.get('cookie') ?? '';
  const presented = cookieValue(cookie, ADMIN_COOKIE_NAME);
  if (presented && secretsMatch(presented, adminSecret)) {
    return { ok: true };
  }

  // A key was supplied and rejected — say what to check. "Unauthorized" alone
  // reads as "wrong password" when the usual cause is a character the URL bar
  // altered on the way in.
  if (candidates.length > 0) {
    return deny(
      'Unauthorized — that key did not match ADMIN_SECRET. If the secret ' +
        'contains "+", "&", "/", "=" or a space, percent-encode it in the URL ' +
        '(+ becomes %2B, & becomes %26), or set ADMIN_SECRET to letters and ' +
        'digits only. Also check the value in the deployment environment for a ' +
        'trailing space, newline, or wrapping quotes.',
      401,
    );
  }

  return deny(
    `Unauthorized — visit ${loginPath}?key=YOUR_ADMIN_SECRET to log in.`,
    401,
  );
}
