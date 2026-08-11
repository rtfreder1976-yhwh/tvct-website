import { createHmac, timingSafeEqual } from 'node:crypto';

/** Server-side admin gate shared by the dashboard pages. */
export const ADMIN_SECRET_MIN_LENGTH = 16;
export const ADMIN_COOKIE_NAME = 'admin_session';

/** 8 hours. */
const SESSION_MAX_AGE = 28_800;
const SESSION_VERSION = 'v1';

/**
 * Hosting dashboards and copy/paste can add whitespace or wrapping quotes.
 * Normalise once before length checks, comparisons, and token signing.
 */
export function normalizeAdminSecret(value: string | undefined): string {
  const trimmed = (value ?? '').trim();
  if (trimmed.length >= 2) {
    const first = trimmed[0];
    const last = trimmed[trimmed.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

/** Constant-time compare that does not leak length through an early return. */
function secretsMatch(a: string, b: string): boolean {
  const digestA = createHmac('sha256', 'tvct-admin-compare').update(a).digest();
  const digestB = createHmac('sha256', 'tvct-admin-compare').update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function signSessionPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

/**
 * The browser gets a short-lived signed token, never ADMIN_SECRET itself.
 * Rotating ADMIN_SECRET invalidates all existing sessions automatically.
 */
function createSessionToken(secret: string, now = Date.now()): string {
  const expiresAt = Math.floor(now / 1000) + SESSION_MAX_AGE;
  const payload = `${SESSION_VERSION}.${expiresAt}`;
  return `${payload}.${signSessionPayload(payload, secret)}`;
}

function validSessionToken(token: string, secret: string, now = Date.now()): boolean {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== SESSION_VERSION) return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  return secretsMatch(parts[2], signSessionPayload(payload, secret));
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

/** Verify a submitted admin secret without ever putting it in a URL. */
export function adminSecretMatches(
  candidateRaw: string | undefined,
  adminSecretRaw: string | undefined,
): boolean {
  const candidate = normalizeAdminSecret(candidateRaw);
  const adminSecret = normalizeAdminSecret(adminSecretRaw);

  if (!candidate || adminSecret.length < ADMIN_SECRET_MIN_LENGTH) return false;
  return secretsMatch(candidate, adminSecret);
}

/** Mint the signed browser-session cookie after a successful POST login. */
export function createAdminSessionCookie(adminSecretRaw: string | undefined): string | null {
  const adminSecret = normalizeAdminSecret(adminSecretRaw);
  if (adminSecret.length < ADMIN_SECRET_MIN_LENGTH) return null;

  const token = createSessionToken(adminSecret);
  return (
    `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; ` +
    `Path=/; Max-Age=${SESSION_MAX_AGE}`
  );
}

export type AdminAuthResult =
  | { ok: true }
  | { ok: false; response: Response };

/**
 * Browser authorization is cookie-only. The admin secret itself is accepted
 * only by the POST login page, so it never needs to appear in browser history,
 * copied URLs, referrers, or server access logs.
 */
export function authorizeAdmin(
  request: Request,
  adminSecretRaw: string | undefined,
  loginPath = '/admin/login',
): AdminAuthResult {
  const adminSecret = normalizeAdminSecret(adminSecretRaw);

  if (!adminSecret) {
    return {
      ok: false,
      response: new Response(
        'This dashboard is not configured — ADMIN_SECRET is not set in the deployment environment.',
        {
          status: 503,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'private, no-store, max-age=0',
            'Referrer-Policy': 'no-referrer',
          },
        },
      ),
    };
  }

  if (adminSecret.length < ADMIN_SECRET_MIN_LENGTH) {
    return {
      ok: false,
      response: new Response(
        `ADMIN_SECRET must be at least ${ADMIN_SECRET_MIN_LENGTH} characters.`,
        {
          status: 503,
          headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'private, no-store, max-age=0',
            'Referrer-Policy': 'no-referrer',
          },
        },
      ),
    };
  }

  const cookie = request.headers.get('cookie') ?? '';
  const presented = cookieValue(cookie, ADMIN_COOKIE_NAME);
  if (presented && validSessionToken(presented, adminSecret)) {
    return { ok: true };
  }

  return {
    ok: false,
    response: new Response(null, {
      status: 303,
      headers: {
        Location: loginPath,
        'Cache-Control': 'private, no-store, max-age=0',
        'Referrer-Policy': 'no-referrer',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    }),
  };
}
