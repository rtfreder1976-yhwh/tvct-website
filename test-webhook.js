const webhookUrl = "https://script.google.com/macros/s/AKfycbyaMXdHzOVzvyRhS7ZJznT9BjKLZI1AglignqQbCr5Bd3ZRigUvOJP9mLDeFfpND442/exec";

async function test() {
    try {
        console.log("Sending POST to:", webhookUrl);
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Test User",
                email: "test@example.com",
                phone: "555-0100",
                location: "Test City, ST 12345",
                message: "This is a test application",
                page_url: "localhost"
            }),
            redirect: 'follow'
        });

        const text = await response.text();
        console.log("Status Code:", response.status);
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

test();
