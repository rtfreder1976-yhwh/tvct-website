
import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates and normalizes phone number (US format)
 */
function isValidPhone(phone: string): boolean {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}

/**
 * Parses is_urgent to boolean, handling string 'true'/'false' and actual booleans
 */
function parseUrgent(value: unknown): boolean {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return Boolean(value);
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // 1. Validation
        const errors: Record<string, string> = {};

        // Newsletter subscription only requires email
        if (data.source === 'Blog Newsletter Subscription') {
            if (!data.email) errors.email = "Email is required";
            if (data.email && !isValidEmail(data.email)) errors.email = "Invalid email format";
        } else {
            // Quote form validation
            if (!data.name) errors.name = "Name is required";
            if (!data.phone) errors.phone = "Phone is required";
            if (data.phone && !isValidPhone(data.phone)) errors.phone = "Invalid phone number format";
            if (data.email && !isValidEmail(data.email)) errors.email = "Invalid email format";
            if (!data.service) errors.service = "Service selection is required";
            if (!data.square_footage && data.square_footage !== 0) errors.square_footage = "Square footage is required";
        }

        if (Object.keys(errors).length > 0) {
            return new Response(JSON.stringify({ success: false, errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Data Processing - Send to n8n Webhook
        const N8N_WEBHOOK_URL = import.meta.env.N8N_WEBHOOK_URL;

        if (!N8N_WEBHOOK_URL) {
            console.error("Missing N8N_WEBHOOK_URL environment variable");
            // Continue to return success to user but log the error
        }

        // Parse is_urgent consistently
        const isUrgent = parseUrgent(data.is_urgent);

        if (N8N_WEBHOOK_URL) {
            try {
                const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        // Payload for n8n
                        name: data.name,
                        phone: data.phone,
                        email: data.email || "",
                        service: data.service,
                        square_footage: Number(data.square_footage), // Ensure number
                        is_urgent: isUrgent,
                        notes: data.message || "",
                        source: data.source,
                        location_city: data.location || "",
                        page_url: data.page_url,
                        submission_id: crypto.randomUUID(),
                        timestamp: new Date().toISOString()
                    })
                });

                if (!webhookResponse.ok) {
                    console.error(`n8n Webhook Failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
                    // We typically still return success to the user so they don't think it failed,
                    // but we log the error critical for debugging.
                }
            } catch (webhookError) {
                console.error("Critical Error sending to n8n:", webhookError);
            }

            console.log("✅ Lead sent to n8n:", data.email);
        }

        // 3. Return Success
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
