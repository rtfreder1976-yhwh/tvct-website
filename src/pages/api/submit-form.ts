
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // 1. Validation
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

        // 2. Data Processing - Send to Webhook (n8n or Google Script)
        let webhookUrl = "https://singingriver.app.n8n.cloud/webhook-test/a3c2f1c9-c7a5-4436-825a-be12a8c1c0da";

        if (data.source === 'Career Application') {
            webhookUrl = "https://script.google.com/macros/s/AKfycbyaMXdHzOVzvyRhS7ZJznT9BjKLZI1AglignqQbCr5Bd3ZRigUvOJP9mLDeFfpND442/exec";
        }

        try {
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Payload
                    name: data.name,
                    phone: data.phone,
                    email: data.email || "",
                    service: data.service,
                    square_footage: Number(data.square_footage), // Ensure number
                    is_urgent: !!data.is_urgent,
                    notes: data.message || "",
                    source: data.source,
                    location_city: data.location || "",
                    page_url: data.page_url,
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

        console.log(`✅ Lead sent to ${data.source === 'Career Application' ? 'Google Apps Script' : 'n8n'}:`, data.email);

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
