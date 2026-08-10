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

/**
 * URLSearchParams interprets `+` as a space. Try the decoded value and the
 * common base64 recovery form so a correctly generated secret is not rejected
 * merely because it was pasted into a URL. `&` still must be percent-encoded.
 */
function queryKeyCandidates(url: URL): string[] {
  const decoded = url.searchParams.get('key');
  if (!decoded) return [];
  const candidates = new Set<string>([decoded, decoded.replace(/ /g, '+')]);
  return [...candidates].map(normalizeAdminSecret).filter(Boolean);
}

export type AdminAuthResult =
  | { ok: true; setCookie?: string }
  | { ok: false; response: Response };

export function authorizeAdmin(
  url: URL,
  request: Request,
  adminSecretRaw: string | undefined,
  loginPath: string,
): AdminAuthResult {
  const deny = (message: string, status: number): AdminAuthResult => ({
    ok: false,
    response: new Response(message, {
      status,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'private, no-store, max-age=0',
        'Referrer-Policy': 'no-referrer',
      },
    }),
  });

  const adminSecret = normalizeAdminSecret(adminSecretRaw);
  if (!adminSecret) {
    return deny(
      'This dashboard is not configured — ADMIN_SECRET is not set in the deployment environment.',
      503,
    );
  }

  if (adminSecret.length < ADMIN_SECRET_MIN_LENGTH) {
    return deny(
      `ADMIN_SECRET must be at least ${ADMIN_SECRET_MIN_LENGTH} characters.`,
      503,
    );
  }

  for (const queryKey of queryKeyCandidates(url)) {
    if (secretsMatch(queryKey, adminSecret)) {
      const token = createSessionToken(adminSecret);
      return {
        ok: true,
        setCookie:
          `${ADMIN_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; ` +
          `Path=/; Max-Age=${SESSION_MAX_AGE}`,
      };
    }
  }

  const cookie = request.headers.get('cookie') ?? '';
  const presented = cookieValue(cookie, ADMIN_COOKIE_NAME);
  if (presented && validSessionToken(presented, adminSecret)) {
    return { ok: true };
  }

  return deny(
    `Unauthorized — visit ${loginPath}?key=YOUR_ADMIN_SECRET to establish a temporary session. ` +
      'If the secret contains & or other reserved URL characters, percent-encode them.',
    401,
  );
}
