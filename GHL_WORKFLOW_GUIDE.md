# GoHighLevel Workflow Guide: "Incoming Quote Form - Hybrid V2"

This guide outlines the step-by-step process to build the Master Workflow in GoHighLevel for The Valley Clean Team. This workflow handles both standard residential quotes (instant pricing) and complex commercial/construction quotes (AI Conversation Bot) in a single automation.

## **1. The Trigger**
*   **Add Trigger:** `Inbound Webhook`
*   **Settings:**
    *   **Name:** "Incoming Quote Form"
    *   **Webhook URL:** Use your existing URL ending in `...0ac5`.
    *(Note: Ensure your website form is currently sending data to this URL).*

---

## **2. Action Step 1: Save the Contact**
*   **Add Action:** `Create or Update Contact`
*   **Field Mapping:**
    *   `name` -> **Full Name**
    *   `phone` -> **Phone**
    *   `email` -> **Email**
    *   `service_type` -> **Service Type** (Custom Field)
    *   `square_footage` -> **Square Footage** (Custom Field)
    *   `notes` -> **Appointment Notes** (Custom Field)
    *   `source` -> **Source**
    *   *(Optional)* Map `page_url` to a custom field if desired.

---

## **3. Action Step 2: The Traffic Cop (If/Else)**
This step directs the lead based on the service they selected.

*   **Add Action:** `If/Else`
*   **Name:** "Check Service Type"

### **Branch 1: "Standard Residential"**
*   **Condition:** `Contact Details > Service Type` **Contains** `Regular`
*   **OR** `Contact Details > Service Type` **Contains** `Deep`
*   **OR** `Contact Details > Service Type` **Contains** `Move`
*   **OR** `Contact Details > Service Type` **Contains** `Airbnb`

### **Branch 2: "Complex Commercial"**
*   **Condition:** `Contact Details > Service Type` **Contains** `Construction`
*   **OR** `Contact Details > Service Type` **Contains** `Commercial`
*   **OR** `Contact Details > Service Type` **Contains** `Event`

---

## **4. Path A: "Standard Residential" (Instant Quote)**
*(This path runs for leads in Branch 1)*

1.  **Add Action:** `Math Operation`
    *   **Field to Update:** `estimated_price` (Custom Field)
    *   **Equation Examples:**
        *   General: `{{ contact.square_footage }} * 0.10`
        *   *(You can add nested If/Else steps here if you want different rates for Deep vs Regular).*
2.  **Add Action:** `Create Opportunity`
    *   **Pipeline:** Main Pipeline
    *   **Stage:** "Quote Sent"
    *   **Opportunity Name:** `{{ contact.name }} - {{ contact.service_type }}`
    *   **Lead Value:** `{{ contact.estimated_price }}`
3.  **Add Action:** `Send SMS`
    *   **Message:**
        > "Hi {{ contact.first_name }}! 👋 Thanks for choosing The Valley Clean Team.
        >
        > Based on your **{{ contact.square_footage }} sq ft** home, your instant estimate for **{{ contact.service_type }}** is **${{ contact.estimated_price }}**.
        >
        > We have openings this week. Would you like to secure this rate? Reply YES to proceed."

---

## **5. Path B: "Complex Commercial" (AI Concierge)**
*(This path runs for leads in Branch 2)*

1.  **Add Action:** `Add Contact Tag`
    *   **Tag:** `AI_CONCIERGE` (or `AI_ACTIVE`)
2.  **Add Action:** `Conversation AI`
    *   **Settings:** Enable / Set to **Autopilot Mode**.
    *   *(Ensure your AI Bot "Sarah" is configured in Settings > Conversation AI with the prompt to ask qualifying questions).*
3.  **Add Action:** `Send SMS` (The "Kickoff" Message)
    *   **Message:**
        > "Hi {{ contact.first_name }}, thanks for contacting Valley Clean Team! for **{{ contact.service_type }}**.
        >
        > Since this is a specialized project, I just need to ask one quick question to ensure I give you the right price. Do you have a moment?"
4.  **Add Action:** `Internal Notification`
    *   **Type:** Email or App Notification
    *   **Message:** "New Commercial Lead: {{ contact.name }}. AI Bot has started conversation."

---

## **6. Final Step**
*   **Publish:** Toggle the switch in the top right corner to "Publish".
*   **Save:** Click the "Save" button.

### **Checklist Before Testing**
- [ ] Confirm Webhook URL match.
- [ ] Confirm Custom Fields exists (`service_type`, `square_footage`, `estimated_price`).
- [ ] Confirm AI Personality ("Sarah") is active in GHL Settings.
