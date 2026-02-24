function doPost(e) {
    try {
        // 1. Parse the incoming JSON payload from the website
        var data = JSON.parse(e.postData.contents);

        // 2. Log exactly to your Google Sheet document
        var sheetId = "1JYsjuZgLbZEsWrItKERZosmX2vJgB8NB-tXSdYTDdV4";

        var doc = SpreadsheetApp.openById(sheetId);

        // Find the specific tab requested (gid=2088446548)
        var sheets = doc.getSheets();
        var targetSheet = sheets[0]; // fallback to first sheet
        for (var i = 0; i < sheets.length; i++) {
            if (sheets[i].getSheetId() == 2088446548) {
                targetSheet = sheets[i];
                break;
            }
        }

        // Append the applicant as a new row
        var timestamp = new Date();
        targetSheet.appendRow([
            timestamp,
            data.name || "N/A",
            data.email || "N/A",
            data.phone || "N/A",
            data.location || "N/A",
            data.message || "N/A",
            data.page_url || "N/A"
        ]);

        // 3. Email hiring@thevalleycleanteam.com
        var recipient = "hiring@thevalleycleanteam.com";
        var subject = "New Career Application: " + (data.name || "Unknown");

        // Format the email using HTML for readability
        var htmlBody = "<h2>New Employment Application</h2>" +
            "<p><strong>Name:</strong> " + (data.name || "N/A") + "</p>" +
            "<p><strong>Email:</strong> " + (data.email || "N/A") + "</p>" +
            "<p><strong>Phone:</strong> " + (data.phone || "N/A") + "</p>" +
            "<p><strong>Location:</strong> " + (data.location || "N/A") + "</p>" +
            "<p><strong>Application Details:</strong></p>" +
            "<pre style='white-space: pre-wrap; font-family: sans-serif;'>" + (data.message || "N/A") + "</pre>";

        // We use MailApp to send the email from the connected Google Account
        MailApp.sendEmail({
            to: recipient,
            replyTo: data.email || null,
            subject: subject,
            htmlBody: htmlBody
        });

        // 4. Return success response back to the website
        return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        // If something goes wrong, return the error
        return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// Needed to allow cross-origin requests
function doOptions(e) {
    var headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };
    return ContentService.createTextOutput("")
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeaders(headers);
}
