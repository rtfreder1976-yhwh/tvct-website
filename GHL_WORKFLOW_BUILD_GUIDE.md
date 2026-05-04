# GHL Workflow: Website Quote Form — New Lead
**Workflow Name:** `Website Quote Form — New Lead`  
**Trigger:** Inbound Webhook (already set up)  
**Last Updated:** May 4, 2026

---

## Overview of the Full Flow

```
Quote Form Submitted
       ↓
Create/Update Contact in GHL
       ↓
Add Tag: "quote-form-submitted"
       ↓
Send Internal Notification Email (to Todd)
       ↓
Wait 2 Hours
       ↓
IF/ELSE: Does contact have tag "booked"?
   ├── YES → END (they already booked, do nothing)
   └── NO  → Send SMS: "Ready to book?"
              ↓
              Wait 22 Hours (24 hrs total from form submit)
              ↓
              IF/ELSE: Does contact have tag "booked"?
                 ├── YES → END
                 └── NO  → Send final follow-up SMS
                            ↓
                            END
```

---

## Step-by-Step Build in GHL

### Step 1 — Trigger (Already Done)
You already have the **Inbound Webhook** trigger set up. No changes needed here.

---

### Step 2 — Create/Update Contact

1. Click **+ Add Action**
2. Search for and select **Create/Update Contact**
3. Map the following fields using the `{{` picker — select **Custom Data** or **Trigger** to find the webhook fields:

| GHL Field | Webhook Field to Map |
|---|---|
| First Name | `{{contact.name}}` (GHL will split it) or map `name` |
| Phone | `{{phone}}` |
| Email | `{{email}}` |
| Source | type manually: `Website Quote Form` |
| Tags | type: `quote-form-submitted` |

4. Scroll down to **Custom Fields** and map:

| Custom Field | Webhook Field |
|---|---|
| Service Required | `{{service}}` |
| Est. Square Footage | `{{square_footage}}` |
| Location | `{{location}}` |
| Preferred Date | `{{preferred_date}}` |
| Notes / Message | `{{message}}` |
| Page URL | `{{page_url}}` |

5. Click **Save Action**

---

### Step 3 — Send Internal Notification Email (to Todd)

1. Click **+ Add Action**
2. Select **Send Email**
3. Fill in:
   - **To:** `todd@thevalleycleanteam.com`
   - **Subject:** `New Website Lead: {{contact.full_name}} — {{service}}`
   - **Body (plain text or HTML):**

```
New quote request from the website.

Name: {{contact.full_name}}
Phone: {{contact.phone}}
Email: {{contact.email}}
Service: {{service}}
Square Footage: {{square_footage}} sq ft
Location: {{location}}
Preferred Date: {{preferred_date}}
Message: {{message}}
Source: {{source}}
Page: {{page_url}}
Submitted: {{submitted_at}}

Log in to GHL to follow up:
https://app.gohighlevel.com/v2/location/iKQIBhpKVL2XVPgU7HMd/contacts/
```

4. Click **Save Action**

---

### Step 4 — Wait 2 Hours

1. Click **+ Add Action**
2. Select **Wait**
3. Set to: **2 Hours**
4. Click **Save Action**

---

### Step 5 — If/Else Branch (First Check)

1. Click **+ Add Action**
2. Select **If/Else**
3. Set the condition:
   - **Field:** Contact Tags
   - **Operator:** Contains
   - **Value:** `booked`
4. This creates two branches:

**YES Branch (contact has "booked" tag):**
- Click **+ Add Action** inside the YES branch
- Select **End** (or just leave it empty — no action means the workflow stops here)
- This handles clients who already completed the BookingKoala form

**NO Branch (contact does NOT have "booked" tag):**
- Continue to Step 6 below — add all remaining actions inside the NO branch

---

### Step 6 — Send First Follow-Up SMS (inside NO branch)

1. Inside the **NO branch**, click **+ Add Action**
2. Select **Send SMS**
3. **To:** `{{contact.phone}}`
4. **Message:**

```
Hi {{contact.first_name}}! This is The Valley Clean Team — we got your cleaning quote request and we'd love to get you on the schedule 🏡

Ready to book? It only takes 2 minutes:
👉 https://thevalleycleanteam.com/booking

Questions? Just reply to this text.
- The Valley Clean Team
```

5. Click **Save Action**

---

### Step 7 — Wait 22 Hours (inside NO branch)

1. Still inside the NO branch, click **+ Add Action**
2. Select **Wait**
3. Set to: **22 Hours**
   *(This brings the total to 24 hours from the original form submission)*
4. Click **Save Action**

---

### Step 8 — If/Else Branch (Second Check, inside NO branch)

1. Still inside the NO branch, click **+ Add Action**
2. Select **If/Else**
3. Same condition as Step 5:
   - **Field:** Contact Tags
   - **Operator:** Contains
   - **Value:** `booked`

**YES Branch:** Leave empty / End

**NO Branch (still not booked after 24 hours):**
- Continue to Step 9

---

### Step 9 — Send Final Follow-Up SMS (inside second NO branch)

1. Click **+ Add Action**
2. Select **Send SMS**
3. **To:** `{{contact.phone}}`
4. **Message:**

```
Hey {{contact.first_name}}, Todd here from The Valley Clean Team. Just wanted to personally follow up on your cleaning request.

We have openings this week — would love to take care of your home 🧹

Book here: https://thevalleycleanteam.com/booking

Or call/text us directly: (256) 826-1100
```

5. Click **Save Action**

---

### Step 10 — Publish the Workflow

1. Click the **Publish** toggle in the top right
2. Confirm it shows **Published** (green)
3. Done ✅

---

## Zapier Zap Required (Separate Setup)

For the If/Else branch to work, you need this Zapier Zap running:

**Zap Name:** `BookingKoala New Booking → Tag GHL Contact as Booked`

- **Trigger:** BookingKoala → New Booking
- **Action:** LeadConnector (GHL) → Add/Update Contact
  - Match by: Phone or Email
  - Tags: `booked`

Without this Zap, GHL won't know when someone completes the BookingKoala form, and the If/Else branch will always send the "book here" SMS even to clients who already booked.

---

## Field Reference (Webhook Payload)

These are the exact field names sent from the website form to the webhook:

| Field | Type | Example |
|---|---|---|
| `name` | string | `Megan Day` |
| `email` | string | `megan.brynn@gmail.com` |
| `phone` | string | `8016737096` |
| `service` | string | `Deep Cleaning` |
| `square_footage` | string | `4000` |
| `location` | string | `Huntsville, AL` |
| `preferred_date` | string | `2026-05-10` |
| `message` | string | `Looking for a move-in clean` |
| `source` | string | `Website Quote Form` |
| `page_url` | string | `https://thevalleycleanteam.com/get-quote` |
| `is_urgent` | boolean | `false` |
| `submitted_at` | ISO string | `2026-05-04T21:00:00.000Z` |
