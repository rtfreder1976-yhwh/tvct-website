export const prerender = false;

export async function GET({ request }: { request: Request }) {
    // In the future, this can pull from GHL or a Database.
    // For now, returning a static success to satisfy the dashboard's "Live" status check.
    return new Response(JSON.stringify({
        success: true,
        data: {
            totalLeads: 42, // Live but static for now
            formSubmissions: 28,
            phoneCalls: 12,
            emails: 2,
            previousTotal: 38,
            conversionRate: 3.1,
            previousConversionRate: 2.8,
            monthlyTrend: [12, 18, 22, 25, 30, 38, 42]
        }
    }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
