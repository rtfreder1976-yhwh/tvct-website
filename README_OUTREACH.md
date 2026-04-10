# TVCT Outreach System Setup Guide

This system automates marketing outreach to local offices and churches using n8n for data processing and GoHighLevel (GHL) for communication.

## System Components

1.  **Contact List**: Your "outreach file" (CSV or Excel).
2.  **n8n Workflow** ([OUTREACH_WORKFLOW.json](file:///C:/Users/rtfre/.gemini/antigravity/scratch/TVCT%20Website/OUTREACH_WORKFLOW.json)):
    *   Reads your file.
    *   Uploads contacts to GHL with niche-specific tags.
3.  **GHL Automation** (Logic in [OUTREACH_GHL_LOGIC.md](file:///C:/Users/rtfre/.gemini/antigravity/scratch/TVCT%20Website/docs/OUTREACH_GHL_LOGIC.md)):
    *   Triggers when tags like `medical_outreach` or `church_outreach` are added.
    *   Sends personalized Email/SMS sequences.
4.  **Booking Koala**:
    *   Link included in all messages: `https://thevalleycleanteam.com/booking`
    *   Captures the booking and handles the cleaning schedule.

## How to Run Your First Campaign

### Step 1: Prep your Outreach File
Ensure your CSV has the following headers: 
`FirstName`, `LastName`, `Email`, `Phone`, `Organization`, `Category` (Medical, Dental, or Church).

### Step 2: Import n8n Workflow
1.  Open your n8n instance.
2.  Create a new workflow and **Import** the `OUTREACH_WORKFLOW.json` file.
3.  Configure your **GHL HTTP Request** node with your API Key and Location ID.

### Step 3: Setup GHL Campaign
1.  Create a new Workflow in GHL triggered by **Contact Tag Added**.
2.  Add branches for `medical_outreach`, `dental_outreach`, and `church_outreach`.
3.  Add the messaging templates provided in the `OUTREACH_GHL_LOGIC.md` file.

### Step 4: Execute
Click **Manual Trigger** in n8n to start the batch import!

---
**Note**: We recommend doing a "Pilot Batch" of 5-10 contacts first to verify the messaging tone and deliverability.
