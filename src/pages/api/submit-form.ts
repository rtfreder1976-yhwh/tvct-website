
import type { APIRoute } from 'astro';

export const prerender = false;

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per-IP, 5 requests per 60 seconds).
// Note: resets on cold-start in serverless environments. Adequate for low
// traffic — upgrade to Upstash/Redis for strict enforcement at scale.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;
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

// ---------------------------------------------------------------------------
// Validate page_url — must belong to the site domain or be empty.
// ---------------------------------------------------------------------------
const ALLOWED_HOSTNAME = 'thevalleycleanteam.com';

function sanitizePageUrl(raw: unknown): string {
    if (!raw || typeof raw !== 'string') return '';
    try {
        const parsed = new URL(raw);
        if (parsed.hostname === ALLOWED_HOSTNAME || parsed.hostname.endsWith(`.${ALLOWED_HOSTNAME}`)) {
            return parsed.href;
        }
    } catch {
        // Not a valid URL — ignore it
    }
    return '';
}

// ---------------------------------------------------------------------------
// Allowlist for the `source` field so attacker-controlled strings can't
// pollute the CRM with arbitrary values.
// ---------------------------------------------------------------------------
const ALLOWED_SOURCES = new Set([
    'Blog Newsletter Subscription',
    'Quote Form',
    'Homepage Form',
    'Location Page',
    'Service Page',
    'Neighborhood Landing Page',
    'Blog Page',
    'Booking Page Pre-Capture',
    '2-Hour Quote Checklist Opt-in',
]);

function sanitizeSource(raw: unknown): string {
    if (typeof raw === 'string' && ALLOWED_SOURCES.has(raw)) return raw;
    // Partial match for dynamic sources like "{hoodName} Landing Page"
    if (typeof raw === 'string' && raw.endsWith('Landing Page')) return raw.slice(0, 100);
    return 'Unknown';
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------
export const POST: APIRoute = async ({ request }) => {
    // Rate limit by IP
    const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        request.headers.get('x-real-ip') ??
        'unknown';

    if (isRateLimited(clientIp)) {
        return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please try again in a minute.' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
        });
    }

    try {
        const data = await request.json();

        // 1. Validation
        const errors: Record<string, string> = {};

        // Newsletter subscription only requires email
        if (data.source === 'Blog Newsletter Subscription' || data.source === '2-Hour Quote Checklist Opt-in') {
            if (!data.email) errors.email = 'Email is required';
        } else if (data.source === 'Booking Page Pre-Capture') {
            // Pre-capture only requires name or phone (partial lead)
            if (!data.name && !data.phone && !data.email) errors.contact = 'At least one contact field is required';
        } else {
            // Quote form validation
            if (!data.name) errors.name = 'Name is required';
            if (!data.phone) errors.phone = 'Phone is required';
            if (!data.service) errors.service = 'Service selection is required';
            if (!data.square_footage && data.square_footage !== 0) errors.square_footage = 'Square footage is required';
        }

        if (Object.keys(errors).length > 0) {
            return new Response(JSON.stringify({ success: false, errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // 2. Send to GHL Webhook
        const GHL_WEBHOOK_URL = import.meta.env.GHL_WEBHOOK_URL;
        
        if (!GHL_WEBHOOK_URL) {
            console.error('GHL_WEBHOOK_URL environment variable is not configured.');
        } else {
            try {
                const webhookResponse = await fetch(GHL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: data.name,
                        phone: data.phone,
                        email: data.email || '',
                        service: data.service,
                        square_footage: Number(data.square_footage),
                        is_urgent: !!data.is_urgent,
                        notes: data.message || '',
                        source: sanitizeSource(data.source),
                        location_city: data.location || '',
                        page_url: sanitizePageUrl(data.page_url),
                        submission_id: crypto.randomUUID(),
                        timestamp: new Date().toISOString(),
                        optin_zip: typeof data.optin_zip === 'string' ? data.optin_zip.slice(0, 10) : '',
                        first_name: typeof data.first_name === 'string' ? data.first_name.slice(0, 60) : '',
                    }),
                });

                if (!webhookResponse.ok) {
                    console.error(`GHL Webhook Failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
                }
            } catch (webhookError) {
                console.error('Critical Error sending to GHL:', webhookError instanceof Error ? webhookError.message : 'unknown error');
            }
        }

        // 3. Return Success
        return new Response(JSON.stringify({
            success: true,
            message: 'Quote request received successfully',
            id: crypto.randomUUID(),
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Submission Error:', error instanceof Error ? error.message : 'unknown error');
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
