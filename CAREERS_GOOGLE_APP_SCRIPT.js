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

        // Append the applicant as a new row AT THE TOP (Row 2)
        // This avoids the common issue where appendRow() inserts at Row 1000 due to cell formatting
        var timestamp = new Date();
        var newRow = [
            timestamp,
            data.name || "N/A",
            data.email || "N/A",
            data.phone || "N/A",
            data.location || "N/A",
            data.message || "N/A",
            data.page_url || "N/A"
        ];

        targetSheet.insertRowBefore(2);
        targetSheet.getRange(2, 1, 1, newRow.length).setValues([newRow]);

        // 3. Email hiring@thevalleycleanteam.com
        var recipient = "hiring@thevalleycleanteam.com";
        var subject = "New Applicant: " + (data.name || "Unknown");

        // Format the email using HTML for readability
        var htmlBody = "<h2>New Applicant Details</h2>" +
            "<p><strong>Name:</strong> " + (data.name || "N/A") + "</p>" +
            "<p><strong>Email:</strong> " + (data.email || "N/A") + "</p>" +
            "<p><strong>Phone:</strong> " + (data.phone || "N/A") + "</p>" +
            "<p><strong>Location:</strong> " + (data.location || "N/A") + "</p>" +
            "<p><strong>Application Details:</strong></p>" +
            "<pre style='white-space: pre-wrap; font-family: sans-serif;'>" + (data.message || "N/A") + "</pre>";

        // Send internal notification email
        MailApp.sendEmail({
            to: recipient,
            replyTo: data.email || null,
            subject: subject,
            htmlBody: htmlBody
        });

        // 4. Send Auto-Responder Email to the Applicant
        if (data.email && data.email !== "N/A") {
            var applicantSubject = "Application Received - The Valley Clean Team";
            var applicantBody = "<h2>Thank you for your application!</h2>" +
                "<p>Hi " + (data.name || "there") + ",</p>" +
                "<p>We have successfully received your employment application to join The Valley Clean Team.</p>" +
                "<p>Our hiring team will be reviewing your application shortly to see if your experience matches our current needs. We will reach out to you directly if we would like to schedule an interview.</p>" +
                "<br>" +
                "<p>Best regards,</p>" +
                "<p><strong>The Valley Clean Team Hiring Department</strong></p>";

            MailApp.sendEmail({
                to: data.email,
                name: "The Valley Clean Team Careers",
                replyTo: "hiring@thevalleycleanteam.com",
                subject: applicantSubject,
                htmlBody: applicantBody
            });
        }

        // 5. Return success response back to the website using text
        return ContentService.createTextOutput("success")
            .setMimeType(ContentService.MimeType.TEXT);

    } catch (error) {
        // If something goes wrong, return the error
        return ContentService.createTextOutput("Error: " + error.toString())
            .setMimeType(ContentService.MimeType.TEXT);
    }
}

// Needed to allow cross-origin requests
function doOptions(e) {
    return ContentService.createTextOutput("success")
        .setMimeType(ContentService.MimeType.TEXT);
}

// Run this function ONCE from the editor to force Google to ask for permissions
function setupPermissions() {
    SpreadsheetApp.getActiveSpreadsheet();
    MailApp.getRemainingDailyQuota();
    console.log("Permissions granted successfully!");
}
