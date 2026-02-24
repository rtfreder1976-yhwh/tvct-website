function doPost(e) {
    try {
        var data = JSON.parse(e.postData.contents);
        var timestamp = new Date();

        // --- 1. CONFIGURATION: TODO - USER MUST FILL THESE IN ---
        var GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/584279e8-7aa5-4645-9826-183820461978";
        var GOOGLE_SHEET_ID = "1JYsjuZgLbZEsWrItKERZosmX2vJgB8NB-tXSdYTDdV4"; // Using the old Careers sheet for now
        var GOOGLE_SHEET_GID = 0; // Defaulting to the first tab (Index 0)
        var FROM_EMAIL = "hiring@thevalleycleanteam.com"; // Your Google Workspace Email

        // --- 2. TVCT PRICING MATRIX LOGIC ---
        var sqft = Number(data.square_footage) || 0;
        var service = data.service || "Standard Clean";

        // Find the correct bracket based on square footage
        var brackets = [750, 1000, 1250, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 4000, 4400, 4700, 5200, 5600, 6000];

        // Base Rates
        var standardRates = [176, 211, 246, 281, 316, 351, 381, 436, 491, 546, 601, 656, 711, 766, 821, 876, 931];
        var deepRates = [276, 311, 346, 381, 416, 451, 506, 561, 616, 671, 726, 781, 836, 891, 946, 1001, 1056];
        var constructionRates = [526, 579, 631, 684, 736, 789, 871, 954, 1036, 1119, 1201, 1284, 1366, 1449, 1531, 1614, 1696];

        // Find which index the sqft falls into (rounding UP to the nearest bracket)
        var bIndex = 0;
        for (var i = 0; i < brackets.length; i++) {
            if (sqft <= brackets[i]) {
                bIndex = i;
                break;
            }
            if (i === brackets.length - 1) bIndex = i; // Max out at highest tier if they go over 6000
        }

        // Calculate the Quote Price Based on Dropdown Selection
        var calculatedPrice = 0;

        if (service.indexOf("Deep") > -1) {
            calculatedPrice = deepRates[bIndex];
        } else if (service.indexOf("Move In/Out") > -1) {
            calculatedPrice = deepRates[bIndex] + 75; // Matrix rules: $75 more than Deep Clean
        } else if (service.indexOf("Construction") > -1) {
            calculatedPrice = constructionRates[bIndex]; // Matrix rules: approx 50% more than Move In/Out
        } else {
            // Default to Standard Clean for Regular, Commercial, Event, or unknown services
            calculatedPrice = standardRates[bIndex];
        }

        data.calculated_quote = "$" + calculatedPrice + ".00";

        // --- 3. LOG TO GOOGLE SHEETS ---
        try {
            var doc = SpreadsheetApp.openById(GOOGLE_SHEET_ID);
            var sheets = doc.getSheets();
            var targetSheet = sheets[0];

            // Try to find specific GID tab if provided, else use first tab
            if (GOOGLE_SHEET_GID !== 0) {
                for (var s = 0; s < sheets.length; s++) {
                    if (sheets[s].getSheetId() == GOOGLE_SHEET_GID) {
                        targetSheet = sheets[s];
                        break;
                    }
                }
            }

            var newRow = [
                timestamp,
                data.name || "N/A",
                data.email || "N/A",
                data.phone || "N/A",
                data.location_city || "N/A",
                service,
                sqft,
                data.is_urgent ? "YES" : "NO",
                data.calculated_quote,
                data.notes || "N/A",
                data.source || "Website Quote Form"
            ];

            targetSheet.insertRowBefore(2);
            targetSheet.getRange(2, 1, 1, newRow.length).setValues([newRow]);
        } catch (sheetError) {
            console.error("Google Sheet Logging Failed:", sheetError);
            // We don't abort the script here, we still want to email them and send to GHL!
        }

        // --- 4. SEND EMAIL TO CLIENT ---
        if (data.email && data.email !== "N/A") {
            var emailSubject = "Your Cleaning Quote from The Valley Clean Team";
            var emailBody = "<h2>Your Custom Quote</h2>" +
                "<p>Hi " + (data.name ? data.name.split(" ")[0] : "there") + ",</p>" +
                "<p>Thank you for requesting a quote for your <strong>" + sqft + " sq ft</strong> home in " + (data.location_city || "the valley") + "!</p>" +
                "<p>Based on the size of your home and your request for a <strong>" + service + "</strong>, your estimated price is <strong>" + data.calculated_quote + "</strong>.</p>" +
                "<br>" +
                "<p>Our team will be reviewing your specific request details and reaching out shortly to confirm availability and get you officially on the schedule.</p>" +
                "<p>If you need immediate assistance, please reply directly to this email or call us at (256) 826-1100.</p>" +
                "<br>" +
                "<p>Best regards,</p>" +
                "<p><strong>The Valley Clean Team</strong></p>";

            try {
                MailApp.sendEmail({
                    to: data.email,
                    name: "The Valley Clean Team Quotes",
                    replyTo: FROM_EMAIL,
                    subject: emailSubject,
                    htmlBody: emailBody
                });
            } catch (emailError) {
                console.error("Client Email Failed:", emailError);
            }
        }

        // Send internal notification to TVCT to let you know a new quote just dropped
        try {
            MailApp.sendEmail({
                to: FROM_EMAIL,
                replyTo: data.email || null,
                subject: "New Website Lead: " + (data.name || "Unknown") + " - " + data.calculated_quote,
                htmlBody: "<h2>New Quote Request</h2><p><strong>Name:</strong> " + (data.name || "N/A") + "</p><p><strong>Email:</strong> " + (data.email || "N/A") + "</p><p><strong>Phone:</strong> " + (data.phone || "N/A") + "</p><p><strong>Service:</strong> " + service + "</p><p><strong>SqFt:</strong> " + sqft + "</p><p><strong>Estimated Quote:</strong> " + data.calculated_quote + "</p><p><strong>Urgent:</strong> " + (data.is_urgent ? "YES" : "NO") + "</p><p><strong>Notes:</strong></p><pre>" + (data.notes || "N/A") + "</pre>"
            });
        } catch (e) { }


        // --- 5. FORWARD DATA TO GOHIGHLEVEL ---
        if (GHL_WEBHOOK_URL !== "YOUR_GHL_WEBHOOK_URL_HERE") {
            try {
                // We use UrlFetchApp inside Google Scripts instead of 'fetch'
                UrlFetchApp.fetch(GHL_WEBHOOK_URL, {
                    method: 'post',
                    contentType: 'application/json',
                    payload: JSON.stringify(data),
                    muteHttpExceptions: true // Don't crash if GHL has an error
                });
            } catch (ghlError) {
                console.error("GHL Forwarding Failed:", ghlError);
            }
        }

        // --- 6. RETURN SUCCESS TO WEBSITE ---
        return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);

    } catch (error) {
        return ContentService.createTextOutput("Error: " + error.toString()).setMimeType(ContentService.MimeType.TEXT);
    }
}

// Needed to allow cross-origin requests
function doOptions(e) {
    return ContentService.createTextOutput("success").setMimeType(ContentService.MimeType.TEXT);
}

// Run this ONCE to force Google to prompt for manual authorization
function setupPermissions() {
    SpreadsheetApp.getActiveSpreadsheet();
    MailApp.getRemainingDailyQuota();
    UrlFetchApp.fetch("https://google.com", { muteHttpExceptions: true });
    console.log("Permissions granted successfully!");
}
