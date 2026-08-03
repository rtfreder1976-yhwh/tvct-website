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
  adminSecret: string | undefined,
  loginPath: string,
): AdminAuthResult {
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

  const queryKey = url.searchParams.get('key');
  if (queryKey && secretsMatch(queryKey, adminSecret)) {
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

  return deny(
    `Unauthorized — visit ${loginPath}?key=YOUR_ADMIN_SECRET to log in.`,
    401,
  );
}
