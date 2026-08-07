import type { ApiRequest, ApiResponse } from './_types.js';
import { requireWebhookSecret } from './_webhook-auth.js';
import {
  captureToPostHog,
  normaliseLead,
  sendLeadEmail,
  sendToGhl,
  type FunnelEvent,
} from './_lead-delivery.js';

/**
 * Inbound webhooks from hosted BookingKoala.
 *
 * Why this exists: the quote and booking funnels used to run on this site and
 * POST to /api/submit-form, which fanned every lead out to GoHighLevel, PostHog
 * and the hello@ inbox. Two changes retired that path —
 *
 *   0ab7262 (2026-07-17) replaced the /get-quote form with a BookingKoala embed
 *   #109    (2026-07-27) 301'd /get-quote, /booking and /booking-commercial to
 *                        hosted BookingKoala outright
 *
 * — and nothing replaced the fan-out. PostHog `quote_form_submitted` stopped on
 * 2026-07-17, the GHL quote workflow stopped firing, and the last lead email
 * arrived 2026-07-17 14:54 UTC. (The three booking events had already stopped on
 * 2026-07-10, when the site-side beacons were removed in #94 for false-firing.)
 *
 * BookingKoala is now the system of record for both funnels, so its webhooks are
 * the only correct source. This endpoint restores all three destinations behind
 * one URL.
 *
 * ── Configuration ────────────────────────────────────────────────────────────
 * Required env: BK_WEBHOOK_SECRET (>= 16 chars), RESEND_API_KEY.
 * Optional env: GHL_BOOKING_WEBHOOK_URL, GHL_BOOKING_COMPLETED_WEBHOOK_URL.
 *
 * In BookingKoala, point each webhook at
 *   https://thevalleycleanteam.com/api/bookingkoala-webhook
 * with the header `x-bk-webhook-secret: <BK_WEBHOOK_SECRET>`.
 *
 * ── Payload mapping ──────────────────────────────────────────────────────────
 * BookingKoala's webhook field names are not pinned by a published schema we
 * control, and they vary by install and by event. Rather than hard-code one
 * guess, the reader below accepts the common aliases for each field and logs the
 * key names of anything it cannot classify, so the first real delivery tells us
 * the exact shape. Verify against a live payload before trusting the numbers —
 * see the checklist in GHL_ABANDONED_BOOKING_WORKFLOW.md.
 */

/** Container keys BookingKoala may nest the real payload under. */
const ENVELOPE_KEYS = ['data', 'payload', 'lead', 'booking', 'customer', 'object'];

/** Keys that may carry the event/topic name. */
const EVENT_TYPE_KEYS = ['event', 'event_type', 'eventType', 'type', 'topic', 'action', 'trigger'];

/**
 * BookingKoala event name (lowercased) -> our funnel event.
 *
 * Matching is substring-based against the incoming type so that install-specific
 * prefixes ("customer.booking.completed", "bk_booking_completed") still land.
 * Order matters: the first entry whose key appears in the incoming type wins, so
 * the more specific patterns are listed first.
 */
const EVENT_MAP: ReadonlyArray<readonly [string, FunnelEvent]> = [
  // Completion first — "booking_completed" also contains "booking".
  ['booking_completed', 'booking_completed'],
  ['booking.completed', 'booking_completed'],
  ['booking_confirmed', 'booking_completed'],
  ['job_created', 'booking_completed'],
  ['new_booking', 'booking_completed'],
  ['booking_created', 'booking_completed'],
  // Abandoned cart / "HOT leads" funnel.
  ['abandoned', 'booking_abandoned'],
  ['incomplete_booking', 'booking_abandoned'],
  // Someone entered the booking flow.
  ['booking_started', 'booking_started'],
  ['booking.started', 'booking_started'],
  ['cart_created', 'booking_started'],
  // Lead form.
  ['lead', 'quote_form_submitted'],
  ['quote', 'quote_form_submitted'],
  ['contact_form', 'quote_form_submitted'],
];

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

/**
 * Flatten one level of envelope nesting. Outer keys win over inner ones so an
 * explicit top-level `event` is not shadowed by a nested field of the same name.
 */
function unwrap(body: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = {};
  for (const key of ENVELOPE_KEYS) {
    const nested = asRecord(body[key]);
    if (nested) Object.assign(merged, nested);
  }
  return { ...merged, ...body };
}

/** First non-empty string among the given aliases. */
function pick(source: Record<string, unknown>, keys: readonly string[]): string {
  for (const key of keys) {
    const value = source[key];
    if (value === undefined || value === null) continue;
    if (typeof value === 'object') continue;
    const str = String(value).trim();
    if (str) return str;
  }
  return '';
}

function classify(source: Record<string, unknown>): FunnelEvent | null {
  const raw = pick(source, EVENT_TYPE_KEYS).toLowerCase().replace(/[\s-]+/g, '_');
  if (!raw) return null;
  for (const [needle, mapped] of EVENT_MAP) {
    if (raw.includes(needle)) return mapped;
  }
  return null;
}

function buildName(source: Record<string, unknown>): string {
  const full = pick(source, ['name', 'customer_name', 'full_name', 'fullName', 'client_name']);
  if (full) return full;
  const first = pick(source, ['first_name', 'firstName', 'fname']);
  const last = pick(source, ['last_name', 'lastName', 'lname']);
  return [first, last].filter(Boolean).join(' ');
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  // No CORS headers: this is a server-to-server webhook, never a browser fetch.
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!requireWebhookSecret(req, res)) return;

  try {
    const body = asRecord(req.body) ?? {};
    const source = unwrap(body);
    const funnelEvent = classify(source);

    if (!funnelEvent) {
      // Return 200 on purpose. An unrecognised event type is not transient, so
      // a retry would not help and repeated non-2xx replies get webhooks
      // disabled on the sender's side. Log the key names (not the values —
      // these payloads carry customer PII) so the shape can be read off the
      // logs and added to EVENT_MAP.
      console.warn(
        'BookingKoala webhook: unrecognised event type. type=%j keys=%j',
        pick(source, EVENT_TYPE_KEYS),
        Object.keys(source)
      );
      return res.status(200).json({ ok: true, classified: false });
    }

    const lead = normaliseLead({
      name: buildName(source),
      email: pick(source, ['email', 'customer_email', 'email_address', 'emailAddress']),
      phone: pick(source, ['phone', 'phone_number', 'customer_phone', 'mobile', 'phoneNumber']),
      service: pick(source, ['service', 'service_name', 'service_type', 'industry_name', 'serviceName']),
      location: pick(source, ['location', 'city', 'address', 'service_address', 'customer_address']),
      square_footage: pick(source, ['square_footage', 'sqft', 'square_feet', 'area']),
      bedrooms: pick(source, ['bedrooms', 'bedroom', 'beds', 'no_of_bedrooms']),
      bathrooms: pick(source, ['bathrooms', 'bathroom', 'baths', 'no_of_bathrooms']),
      preferred_date: pick(source, ['preferred_date', 'booking_date', 'scheduled_date', 'date', 'service_date']),
      message: pick(source, ['message', 'notes', 'comments', 'customer_note', 'special_instructions']),
      // Identifies the funnel in PostHog and GHL. Distinct from the retired
      // "Get Quote Form" value so the 2026-07-17 cutover stays legible in the
      // source breakdown rather than looking like uninterrupted history.
      source: 'BookingKoala',
      page_url: pick(source, ['page_url', 'url', 'referrer', 'source_url']),
      funnel_event: funnelEvent === 'quote_form_submitted' ? '' : funnelEvent,
    });

    // GHL first: it drives the customer-facing follow-up, so it matters most.
    // Both helpers swallow their own failures — one dead destination must not
    // take the others down with it.
    await sendToGhl(lead);
    const captured = await captureToPostHog(lead);

    // Only leads get the hello@ notification. Emailing every booking lifecycle
    // event would be the noise problem #94 called out, and BookingKoala already
    // sends its own confirmations for real bookings.
    let emailed = false;
    if (funnelEvent === 'quote_form_submitted') {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        console.error('Missing RESEND_API_KEY — lead notification not sent.');
      } else {
        try {
          await sendLeadEmail(resendApiKey, lead);
          emailed = true;
        } catch (emailError) {
          // The lead is already in GHL and PostHog by this point; a failed
          // notification is worth logging, not worth a retry storm that would
          // duplicate the CRM record.
          console.error('Lead notification email failed:', emailError);
        }
      }
    }

    return res.status(200).json({
      ok: true,
      classified: true,
      event: captured,
      emailed,
    });
  } catch (error) {
    console.error('BookingKoala webhook error:', error);
    // 500 here is deliberate: an unexpected throw may well be transient, and a
    // retry is the behaviour we want.
    return res.status(500).json({
      error: 'Webhook processing failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
