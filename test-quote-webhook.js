import crypto from 'crypto';

const webhookUrl = "https://script.google.com/macros/s/AKfycbwIvT4qvpRQpFv9-simgXnQG_Xf1xF8UhTWZWe0XiCovym9kt6ic7o36EYlw0Zzmhr6/exec";

const testPayload = {
    name: "Quote Simulator Bob",
    phone: "256-555-9999",
    email: "hiring@thevalleycleanteam.com", // Sending to you so it doesn't bounce
    service: "Deep Cleaning",
    square_footage: 2500,
    is_urgent: true,
    notes: "We have two dogs and need this done ASAP!",
    source: "Website Quote Form",
    location_city: "Huntsville Area",
    page_url: "http://localhost:4321",
    submission_id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
};

async function testQuoteWebhook() {
    console.log("Sending POST Quote Test Payload to:", webhookUrl);
    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(testPayload)
        });

        console.log("Status Code:", response.status);
        const text = await response.text();
        console.log("Response Body:", text);
    } catch (err) {
        console.error("Test Request Failed:", err);
    }
}

testQuoteWebhook();
