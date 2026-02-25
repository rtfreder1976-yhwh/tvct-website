import { BetaAnalyticsDataClient } from '@google-analytics/data';

export const prerender = false;

export async function GET({ request }: { request: Request }) {
    try {
        const url = new URL(request.url);
        const range = parseInt(url.searchParams.get("range") || "30", 10);

        if (!process.env.GSC_CLIENT_EMAIL || !process.env.GSC_PRIVATE_KEY || !process.env.GA_PROPERTY_ID) {
            return new Response(JSON.stringify({ success: false, error: "Missing config for GA" }), { status: 500 });
        }

        // Auth directly to Google Analytics Beta client via existing credentials 
        const analyticsDataClient = new BetaAnalyticsDataClient({
            credentials: {
                client_email: process.env.GSC_CLIENT_EMAIL,
                private_key: process.env.GSC_PRIVATE_KEY.replace(/\\n/g, '\n'),
            }
        });

        const endDateStr = "today";
        const startDateStr = `${range}daysAgo`;

        // For comparison
        const prevEndDateStr = `${range}daysAgo`;
        const prevStartDateStr = `${range * 2}daysAgo`;

        // Fetch this period
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${process.env.GA_PROPERTY_ID}`,
            dateRanges: [
                { startDate: startDateStr, endDate: endDateStr },
                { startDate: prevStartDateStr, endDate: prevEndDateStr }, // Compare against previous period
            ],
            dimensions: [{ name: 'date' }], // Group by day for the chart
            metrics: [
                { name: 'sessions' },
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' }
            ],
            keepEmptyRows: true, // We need zeros for trendline consistency 
        });

        let currentSessions = 0;
        let currentViews = 0;
        let currentDurationSum = 0;
        let currentBounceSum = 0;
        let currentDaysCount = 0;

        let previousSessions = 0;
        let previousViews = 0;

        const monthlyTrend = new Array(range).fill(0);

        const todayDate = new Date();

        // Parse Google's complex dual-dateRange response
        if (response.rows) {
            response.rows.forEach(row => {
                const dateStr = row.dimensionValues?.[0].value; // Format: YYYYMMDD

                // Period 0 is "current range", Period 1 is "previous format"
                const isCurrentPeriod = row.dimensionValues?.[1]?.value !== 'date_range_1';

                const sessions = parseInt(row.metricValues?.[0].value || "0", 10);
                const views = parseInt(row.metricValues?.[1].value || "0", 10);
                const rawDuration = parseFloat(row.metricValues?.[2].value || "0");
                const rawBounceRate = parseFloat(row.metricValues?.[3].value || "0");

                if (isCurrentPeriod) {
                    currentSessions += sessions;
                    currentViews += views;

                    if (sessions > 0) {
                        currentDurationSum += rawDuration;
                        currentBounceSum += rawBounceRate;
                        currentDaysCount++;
                    }

                    // Place into chronological trend array
                    if (dateStr) {
                        const rowYear = parseInt(dateStr.substring(0, 4));
                        const rowMonth = parseInt(dateStr.substring(4, 6)) - 1;
                        const rowDay = parseInt(dateStr.substring(6, 8));

                        const rowDateVar = new Date(rowYear, rowMonth, rowDay);

                        // calculate days ago (roughly) to slot into the array index
                        const diffTime = Math.abs(todayDate.getTime() - rowDateVar.getTime());
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        const arrayIndex = (range - 1) - diffDays;
                        if (arrayIndex >= 0 && arrayIndex < range) {
                            monthlyTrend[arrayIndex] = sessions;
                        }
                    }
                } else {
                    previousSessions += sessions;
                    previousViews += views;
                }
            });
        }

        // Averages
        const avgDurationSeconds = currentDaysCount > 0 ? (currentDurationSum / currentDaysCount) : 0;
        const avgBounceRate = currentDaysCount > 0 ? (currentBounceSum / currentDaysCount) * 100 : 0;

        // Format mm:ss
        const minutes = Math.floor(avgDurationSeconds / 60);
        const seconds = Math.floor(avgDurationSeconds % 60).toString().padStart(2, '0');

        return new Response(JSON.stringify({
            success: true,
            data: {
                current: {
                    sessions: currentSessions,
                    pageviews: currentViews,
                    avgDuration: `${minutes}:${seconds}`,
                    bounceRate: avgBounceRate.toFixed(1),
                },
                previous: {
                    sessions: previousSessions,
                    pageviews: previousViews,
                },
                monthlyTrend: monthlyTrend,
            }
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("GA API Error:", error);
        return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
    }
}
