# TVCT Lead Automation Fix Guide
**Date:** May 4, 2026  
**Status:** Action Required — GHL Workflow Must Be Created/Published

---

## What Was Fixed Already

- **Megan Day** created in BookingKoala (name, email, phone, source)
- **Megan Day** created in GHL by Todd manually
- Root cause of all failures identified (see below)

---

## Root Cause Summary

| Issue | Status |
|---|---|
| GHL workflow in TEST/DRAFT mode — never executed on real leads | Needs new workflow (see below) |
| Website form fires webhook correctly (200 OK) | Working |
| Resend email backup fires on every submission | Working |
| BookingKoala has no auto-connection to GHL | Not built yet |

---

## Part 1: Create the New GHL Workflow (10 minutes)

### Step 1 — Create a New Workflow

1. Log into GHL → **The Valley Clean Team** sub-account
2. Go to **Automation → Workflows**
3. Click **+ New Workflow** → choose **Start from Scratch**
4. Name it: `Website Quote Form — New Lead`

### Step 2 — Set the Trigger

1. Click **Add Trigger**
2. Select **Inbound Webhook**
3. Copy the webhook URL that GHL generates — it will look like:  
   `https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/XXXXXXXX`
4. **Save this URL** — you will need to update it in the website code (see Part 2)

### Step 3 — Add Action: Create/Update Contact

1. Click **+ Add Action**
2. Select **Create/Update Contact**
3. Map the fields from the webhook payload:
   - **First Name** → `{{contact.first_name}}` or map from `name` field
   - **Phone** → `{{phone}}`
   - **Email** → `{{email}}`
   - **Source** → set to `Website Quote Form`
4. Add **Tag**: `website-quote-request`
5. Add **Tag** (conditional): if `is_urgent = true` → add tag `urgent-lead`

### Step 4 — Add Action: Send SMS to Lead

1. Click **+ Add Action** → **Send SMS**
2. **To:** `{{contact.phone}}`
3. **Message:**
```
Hi {{contact.first_name}}, thanks for reaching out to The Valley Clean Team! 

We received your request for a {{service}} and will have your custom quote ready shortly.

In the meantime, you can book directly here: https://thevalleycleanteam.com/booking

Questions? Reply to this text or call (256) 826-1100.

- The Valley Clean Team
```

### Step 5 — Add Action: Send Internal Notification Email

1. Click **+ Add Action** → **Send Email**
2. **To:** `todd@thevalleycleanteam.com`
3. **Subject:** `New Website Lead: {{contact.full_name}} — {{service}}`
4. **Body:**
```
New quote request from the website.

Name: {{contact.full_name}}
Phone: {{contact.phone}}
Email: {{contact.email}}
Service: {{service}}
Square Footage: {{square_footage}} sq ft
Urgent: {{is_urgent}}
Page: {{page_url}}
Time: {{now}}

Log in to GHL to follow up: https://app.gohighlevel.com
```

### Step 6 — Add Action: Wait + Follow-Up SMS (24 hours later)

1. Click **+ Add Action** → **Wait**
2. Set to **1 Day**
3. Click **+ Add Action** → **Send SMS**
4. **Message:**
```
Hi {{contact.first_name}}, just following up on your cleaning quote request! 

Ready to get on the schedule? Book here: https://thevalleycleanteam.com/booking

Or reply to this text and we'll take care of everything.

- The Valley Clean Team
```

### Step 7 — PUBLISH the Workflow

1. Click the **Publish** toggle in the top right corner
2. Confirm it shows **Published** (green) — NOT Draft

---

## Part 2: Update the Webhook URL in the Website Code

Once you have the new webhook URL from Step 2 above, update it in the codebase:

**File:** `api/submit-form.ts` (line 37)

Change:
```typescript
const ghlWebhookUrl = 'https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/a0203648-0f8e-4717-9873-b04879f90ac5';
```

To:
```typescript
const ghlWebhookUrl = 'YOUR_NEW_WEBHOOK_URL_HERE';
```

Then commit and push:
```bash
git add api/submit-form.ts
git commit -m "fix: update GHL webhook URL to new published workflow"
git push origin main
```

Vercel will auto-deploy within ~60 seconds.

---

## Part 3: Connect BookingKoala → GHL (Zapier — 15 minutes)

This ensures anyone who books directly through the BookingKoala embed also gets created as a contact in GHL.

1. Log into **Zapier**
2. Create a new Zap:
   - **Trigger:** BookingKoala → **New Booking**
   - **Action:** LeadConnector (GHL) → **Create/Update Contact**
3. Map fields: name, email, phone, service type
4. Add second action: LeadConnector → **Add Tag** → `bookingkoala-booking`
5. Turn the Zap **ON**

---

## Current Webhook URL (OLD — DO NOT USE after new workflow is created)

```
https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/a0203648-0f8e-4717-9873-b04879f90ac5
```

This URL responds with `"Success: test request received"` — confirming the old workflow was never published.

---

## Verification Test

After completing Parts 1 and 2, run this test:

```bash
curl -X POST "https://thevalleycleanteam.com/api/submit-form" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Lead","phone":"2565550100","email":"test@test.com","service":"Deep Cleaning","square_footage":2000,"source":"Quote Form","page_url":"https://thevalleycleanteam.com/get-quote"}'
```

Expected result:
- GHL creates a new contact named "Test Lead"
- Test Lead receives an SMS within 60 seconds
- You receive an internal notification email
- Contact has tag `website-quote-request`
