
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();

        // 1. Validation
        const errors: Record<string, string> = {};
        if (!data.name) errors.name = "Name is required";
        if (!data.phone) errors.phone = "Phone is required";
        if (!data.service) errors.service = "Service selection is required";
        if (!data.square_footage && data.square_footage !== 0) errors.square_footage = "Square footage is required";

        if (Object.keys(errors).length > 0) {
            return new Response(JSON.stringify({ success: false, errors }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Data Processing - Send to GoHighLevel Webhook
        const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/a0203648-0f8e-4717-9873-b04879f90ac5";

        try {
            const webhookResponse = await fetch(GHL_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // Flatten data ensures GHL reads it easily
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
                console.error(`GHL Webhook Failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
                // We typically still return success to the user so they don't think it failed, 
                // but we log the error critical for debugging.
            }
        } catch (webhookError) {
            console.error("Critical Error sending to GHL:", webhookError);
        }

        console.log("✅ Lead sent to GoHighLevel:", data.email);

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
