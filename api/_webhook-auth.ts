import { timingSafeEqual } from 'node:crypto';
import type { ApiRequest, ApiResponse } from './_types.js';

/**
 * Gate for inbound third-party webhooks.
 *
 * /api/bookingkoala-webhook writes to GoHighLevel, captures PostHog events and
 * sends mail from hello@thevalleycleanteam.com. Left open, anyone who found the
 * URL could inject fabricated customers into the CRM, poison the conversion
 * numbers, and use the endpoint as a spam relay pointed at our own inbox. So it
 * requires a shared secret, and fails closed when one is not configured.
 *
 * The credential is BK_WEBHOOK_SECRET. It is separate from ADMIN_SECRET on
 * purpose: this one is pasted into a third-party SaaS console, so it should be
 * rotatable without locking anyone out of the admin dashboard.
 *
 * Accepted (in order):
 *   - `x-bk-webhook-secret: <secret>` header  — preferred
 *   - `authorization: Bearer <secret>` header — for senders that only offer a
 *     generic bearer-token field
 *
 * Deliberately not accepted: `?key=<secret>` in the query string. Query strings
 * land in access logs, CDN cache keys and `Referer` headers, so a secret placed
 * there leaks in ways a header does not. If BookingKoala turns out not to send
 * custom headers on webhooks, that is a conversation to have before weakening
 * this — a signed-payload check or an IP allowlist are both better answers than
 * a URL secret.
 */

/** Matches ADMIN_SECRET_MIN_LENGTH — no reason for this one to be weaker. */
const SECRET_MIN_LENGTH = 16;

/** Constant-time compare that does not leak length through early return. */
function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Still burn a comparison so a wrong-length guess times like a wrong-value
    // one.
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

/**
 * Returns true when the caller presented the shared secret. When it returns
 * false it has already written the response, so callers should simply return.
 */
export function requireWebhookSecret(req: ApiRequest, res: ApiResponse): boolean {
  const secret = process.env.BK_WEBHOOK_SECRET;

  if (!secret || secret.length < SECRET_MIN_LENGTH) {
    console.error(
      'BK_WEBHOOK_SECRET missing or shorter than the minimum — rejecting webhook.'
    );
    res.status(503).json({
      error: 'Endpoint not configured',
      message:
        `This endpoint requires BK_WEBHOOK_SECRET to be set to at least ${SECRET_MIN_LENGTH} ` +
        'characters. Until it is, it denies all requests rather than accepting ' +
        'unauthenticated writes to the CRM and the lead inbox.',
    });
    return false;
  }

  const bearer = headerValue(req, 'authorization');
  const presented =
    headerValue(req, 'x-bk-webhook-secret') ??
    (bearer?.startsWith('Bearer ') ? bearer.slice('Bearer '.length) : undefined);

  if (!presented || !secretsMatch(presented, secret)) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Send the webhook secret as an `x-bk-webhook-secret` header.',
    });
    return false;
  }

  return true;
}
