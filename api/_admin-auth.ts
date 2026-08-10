import { createHmac, timingSafeEqual } from 'node:crypto';
import type { ApiRequest, ApiResponse } from './_types.js';

const SECRET_MIN_LENGTH = 16;
const SESSION_VERSION = 'v1';

function normalizeSecret(value: string | undefined): string {
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

/** Compare arbitrary strings in constant time by comparing fixed-size digests. */
function secretsMatch(a: string, b: string): boolean {
  const digestA = createHmac('sha256', 'tvct-admin-compare').update(a).digest();
  const digestB = createHmac('sha256', 'tvct-admin-compare').update(b).digest();
  return timingSafeEqual(digestA, digestB);
}

function signSessionPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function validSessionToken(token: string, secret: string, now = Date.now()): boolean {
  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== SESSION_VERSION) return false;

  const expiresAt = Number(parts[1]);
  if (!Number.isInteger(expiresAt) || expiresAt <= Math.floor(now / 1000)) return false;

  const payload = `${parts[0]}.${parts[1]}`;
  return secretsMatch(parts[2], signSessionPayload(payload, secret));
}

function headerValue(req: ApiRequest, name: string): string | undefined {
  const raw = req.headers?.[name] ?? req.headers?.[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

function cookieValue(req: ApiRequest, name: string): string | undefined {
  const parsed = req.cookies?.[name];
  if (parsed) return parsed;

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
 * Authorize either a trusted server-to-server request carrying ADMIN_SECRET in
 * x-admin-key, or a browser request carrying the short-lived HMAC session token
 * minted by src/lib/adminAuth.ts. The browser never receives ADMIN_SECRET.
 */
export function requireAdmin(req: ApiRequest, res: ApiResponse): boolean {
  const secret = normalizeSecret(process.env.ADMIN_SECRET);

  if (!secret || secret.length < SECRET_MIN_LENGTH) {
    res.status(503).json({
      error: 'Endpoint not configured',
      message: `This endpoint requires ADMIN_SECRET to be at least ${SECRET_MIN_LENGTH} characters.`,
    });
    return false;
  }

  const headerKey = normalizeSecret(headerValue(req, 'x-admin-key'));
  if (headerKey && secretsMatch(headerKey, secret)) return true;

  const session = cookieValue(req, 'admin_session');
  if (session && validSessionToken(session, secret)) return true;

  res.status(401).json({
    error: 'Unauthorized',
    message:
      'Send the admin secret as an x-admin-key header from a trusted server, ' +
      'or sign in at /admin/dashboard to establish a temporary browser session.',
  });
  return false;
}

export function setPrivateApiHeaders(res: ApiResponse): void {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Cookie, x-admin-key');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  res.setHeader('Referrer-Policy', 'no-referrer');
}
