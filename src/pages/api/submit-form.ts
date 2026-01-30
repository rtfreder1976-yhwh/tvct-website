
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

        // 2. Data Processing (Simulation)
        // In a real app, you would send this to GoHighLevel, Resend, or a Database.
        // We'll log it for now.
        console.log("📝 New Quote Request Received:");
        console.log("--------------------------------");
        console.log("Service:", data.service);
        console.log("Name:", data.name);
        console.log("Phone:", data.phone);
        console.log("Email:", data.email || "N/A");
        console.log("Sq Ft:", data.square_footage);
        console.log("Urgent?:", data.is_urgent ? "YES 🚨" : "No");
        console.log("Source:", data.source);
        console.log("Location:", data.location);
        console.log("--------------------------------");

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
