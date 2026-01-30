# 🤖 The Valley Clean Team: "Zero-Touch" Automation Blueprint

**Status**: Ready for Implementation
**Author**: Antigravity Automation Architect

---

## 🏗️ Core Architecture

The system bridges your **Astro Website** (Frontend) with **GoHighLevel** (CRM) using **n8n** (Logic Brain) to deliver instant quotes based on your Flat-Rate Pricing.

### 1. The "Instant Quote" Workflow (Pre-Booking)
*Objective: Capture the lead on the SEO page by giving value (a price) instantly, before asking for a full booking.*

**Trigger**: Users clicks "Get Instant Price" on any Location Page (e.g., `/locations/madison`).

**Input Form (Simple)**:
*   Name & Phone
*   Square Footage
*   Service Type (Standard / Deep / Move-In)
*   Zip Code (Hidden field based on page)

**The n8n Logic (Bot Details)**:
1.  **Receive Webhook**: Catch JSON payload from Astro.
2.  **Calculate Price**:
    *   Load `pricing_model.json`.
    *   Find tier: `WHERE sq_ft <= user_sq_ft`.
    *   Apply Modifier: `IF service == 'move_in' THEN price = deep_clean + $75`.
3.  **Check Territory**:
    *   `IF location == 'Mountain Brook' OR 'The Ledges' THEN tag = 'VIP_OPPORTUNITY'`.
4.  **Execute GHL Action**:
    *   Create Contact.
    *   Add Tag: `requested_quote`.
    *   Update Custom Field: `estimated_price`.
5.  **Send Response**:
    *   **SMS**: "Hi [Name], based on [SqFt]ft, your estimate is $[Price]. Ready to book? [Link]"
    *   **Email**: Professional breakdown + "Pet Friendly" badge.

---

## 2. The "Recurring Upsell" Workflow (Post-Clean)
*Objective: Convert 1-time deep cleans into recurring revenue.*

**Trigger**: Cleaner finishes the first "Deep Clean" job.

**Step 1: Cleaner Input (SMS/Form)**
*   System asks Cleaner: "How long to maintain this home?"
*   Cleaner replies: "4 hours" + "Desire $25/hr" (Internal data).

**Step 2: Price Calculation (The Formula)**
*   `Labor Cost` = 4 hours * $25 = $100.
*   `Your Formula` = Cost + 100% Markup = $200.
*   `Quote` = $200 per visit.

**Step 3: Client Proposal**
*   System sends Proposal to Client: "Love your clean home? Keep it this way for $200/visit."

---

## 🛠️ Implementation Plan (Next Steps)

1.  **n8n Setup**:
    *   Create the `pricing_calculator` workflow.
    *   Create the `ghl_integration` node.
2.  **Astro Update**:
    *   Build the `QuickQuote` React/Astro component.
    *   Place it on the `LocationLayout`.

**Shall I proceed with creating the n8n workflow file (`workflow.json`) that you can import?**
