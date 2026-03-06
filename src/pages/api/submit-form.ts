
import type { APIRoute } from 'astro';

// ── Rate limiting (in-memory, per-IP) ────────────────────────────────────────
// Allows 5 submissions per IP per 10-minute window.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

interface RateEntry { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateEntry>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return true; // allowed
    }
    if (entry.count >= RATE_LIMIT_MAX) {
        return false; // blocked
    }
    entry.count++;
    return true; // allowed
}

// ── HTML escaping (prevents XSS / HTML injection in email bodies) ─────────────
function escapeHtml(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// ── Sanitize a plain-text string (strip control characters) ──────────────────
function sanitizeText(value: unknown): string {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    // ── Rate limiting ────────────────────────────────────────────────────────
    const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('cf-connecting-ip') ||
        'unknown';

    if (!checkRateLimit(clientIp)) {
        return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please try again later.' }), {
            status: 429,
            headers: { 'Content-Type': 'application/json', 'Retry-After': '600' }
        });
    }

    try {
        const data = await request.json();

        // ── Validation ───────────────────────────────────────────────────────
        const errors: Record<string, string> = {};

        // Newsletter subscription only requires email
        if (data.source === 'Blog Newsletter Subscription') {
            if (!data.email) errors.email = "Email is required";
        } else if (data.source === 'Career Application') {
            if (!data.name) errors.name = "Name is required";
            if (!data.phone) errors.phone = "Phone is required";
            if (!data.email) errors.email = "Email is required";
        } else {
            // Quote form validation
            if (!data.name) errors.name = "Name is required";
            if (!data.phone) errors.phone = "Phone is required";
            if (!data.service) errors.service = "Service selection is required";
            if (!data.square_footage && data.square_footage !== 0) errors.square_footage = "Square footage is required";
        }

        if (Object.keys(errors).length > 0) {
            return new Response(JSON.stringify({ success: false, errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // ── Data Processing - Send to Webhook ────────────────────────────────
        // Fields are sanitized and HTML-escaped to prevent injection in email bodies.
        // Default to the Quotes Google Apps Script webhook.
        let webhookUrl = "https://script.google.com/macros/s/AKfycbwIvT4qvpRQpFv9-simgXnQG_Xf1xF8UhTWZWe0XiCovym9kt6ic7o36EYlw0Zzmhr6/exec";

        if (data.source === 'Career Application') {
            webhookUrl = "https://script.google.com/macros/s/AKfycbyaMXdHzOVzvyRhS7ZJznT9BjKLZI1AglignqQbCr5Bd3ZRigUvOJP9mLDeFfpND442/exec";
        }

        try {
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Text fields: sanitized (strip control chars) for storage,
                    // HTML-escaped variants provided for email rendering.
                    name: sanitizeText(data.name),
                    name_html: escapeHtml(data.name),
                    phone: sanitizeText(data.phone),
                    email: sanitizeText(data.email) || "",
                    service: sanitizeText(data.service),
                    service_html: escapeHtml(data.service),
                    square_footage: Number(data.square_footage), // Ensure number
                    is_urgent: !!data.is_urgent,
                    notes: sanitizeText(data.message) || "",
                    notes_html: escapeHtml(data.message),
                    source: sanitizeText(data.source),
                    location_city: sanitizeText(data.location) || "",
                    location_city_html: escapeHtml(data.location),
                    page_url: sanitizeText(data.page_url),
                    submission_id: crypto.randomUUID(),
                    timestamp: new Date().toISOString()
                })
            });

            if (!webhookResponse.ok) {
                console.error(`Webhook Failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
                // We typically still return success to the user so they don't think it failed,
                // but we log the error critical for debugging.
            }
        } catch (webhookError) {
            console.error("Critical Error sending to webhook:", webhookError);
        }

        console.log(`✅ Lead sent to ${data.source === 'Career Application' ? 'Career webhook' : 'Quotes webhook'}:`, sanitizeText(data.email));

        // ── Return Success ────────────────────────────────────────────────────
        return new Response(JSON.stringify({
            success: true,
            message: "Quote request received successfully",
            id: crypto.randomUUID()
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error("Submission Error:", error);
        return new Response(JSON.stringify({
            success: false,
            error: "Internal server error"
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
