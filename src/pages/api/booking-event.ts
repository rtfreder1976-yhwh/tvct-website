import type { APIRoute } from 'astro';

export const prerender = false;

// ---------------------------------------------------------------------------
// Booking-funnel event relay.
//
// The /booking page (BookingKoala iframe) fires lightweight lifecycle events so
// GoHighLevel can tell apart "entered the booking form" vs "actually completed".
// Without this, an abandoned BookingKoala session is invisible — the gateway
// (/get-quote) already created the GHL lead, but nothing signals that they got
// stuck in the iframe. These events let a GHL workflow auto-follow-up.
//
// Events: booking_started | booking_abandoned | booking_completed
// Payload carries the lead identity captured at the gateway (name/phone/email)
// so GHL can match the event to the existing opportunity.
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20; // events are chatty (start + abandon); allow more than the form
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }
    if (entry.count >= RATE_LIMIT_MAX) return true;
    entry.count++;
    return false;
}

const ALLOWED_EVENTS = new Set([
    'booking_started',
    'booking_abandoned',
    'booking_completed',
]);

export const POST: APIRoute = async ({ request }) => {
    const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'unknown';

    if (isRateLimited(clientIp)) {
        return new Response(JSON.stringify({ success: false, error: 'rate_limited' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
    }

    try {
        const data = await request.json();
        const event = typeof data.event === 'string' && ALLOWED_EVENTS.has(data.event)
            ? data.event
            : null;

        if (!event) {
            return new Response(JSON.stringify({ success: false, error: 'invalid_event' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Prefer a dedicated booking-event webhook; fall back to the main GHL webhook.
        const WEBHOOK_URL =
            import.meta.env.GHL_BOOKING_EVENT_WEBHOOK_URL || import.meta.env.GHL_WEBHOOK_URL;

        if (!WEBHOOK_URL) {
            console.error('No GHL webhook configured for booking events.');
        } else {
            try {
                await fetch(WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // Event lifecycle marker — drives the GHL workflow branch
                        event,
                        funnel_stage: event,
                        // Lead identity carried over from the gateway form (for matching)
                        name: typeof data.name === 'string' ? data.name.slice(0, 120) : '',
                        phone: typeof data.phone === 'string' ? data.phone.slice(0, 40) : '',
                        email: typeof data.email === 'string' ? data.email.slice(0, 160) : '',
                        service: typeof data.service === 'string' ? data.service.slice(0, 80) : '',
                        location_city: typeof data.location === 'string' ? data.location.slice(0, 80) : '',
                        source: 'Booking Page Pre-Capture',
                        seconds_in_iframe:
                            typeof data.seconds === 'number' && isFinite(data.seconds)
                                ? Math.max(0, Math.round(data.seconds))
                                : undefined,
                        submission_id: crypto.randomUUID(),
                        timestamp: new Date().toISOString(),
                    }),
                });
            } catch (err) {
                console.error('Booking-event webhook failed:', err instanceof Error ? err.message : 'unknown');
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('booking-event error:', error instanceof Error ? error.message : 'unknown');
        return new Response(JSON.stringify({ success: false, error: 'server_error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
