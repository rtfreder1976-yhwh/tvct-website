# GHL Setup Guide — 2-Hour Quote Checklist Welcome Sequence
_Generated 2026-05-14. The API has already done everything it can; this is the UI work that remains._

## What's already done (via API)

The following live inside LeadConnector right now (location: `iKQIBhpKVL2XVPgU7HMd`):

### Email templates (7) — under **Marketing → Emails → Templates**
| # | Template name | Subject (variant A) | GHL template ID |
|---|---|---|---|
| 1 | TVCT — 2hr Checklist #1 — Delivery | The 2-Hour Quote Checklist (inside) | `6a061902a2ad6768366a15d9` |
| 2 | TVCT — 2hr Checklist #2 — Connection | Why we built this checklist | `6a0619037e2221dbfcbe5b4d` |
| 3 | TVCT — 2hr Checklist #3 — Quick Win | The one question that kills 'starting at' pricing | `6a061905f8e18a3809be53a3` |
| 4 | TVCT — 2hr Checklist #4 — Value Story | What happened on a Hampton Cove move-out | `6a0619067e22216385be5b80` |
| 5 | TVCT — 2hr Checklist #5 — Bridge | The checklist works once. Then what? | `6a061908f8e18a340dbe53c2` |
| 6 | TVCT — 2hr Checklist #6 — Soft Pitch | The actual cost of one-off cleans (do the math) | `6a061909a2ad67b60f6a1664` |
| 7 | TVCT — 2hr Checklist #7 — Direct Pitch | Last note about cleaning, then I'll stop | `6a06190b6578fb43ca901d76` |

All 7 are full HTML, brand-styled (Valley Navy + Cream + Brass), with `{{first_name}}`, `{{download_link}}`, `{{unsubscribe_url}}`, and `{{update_profile_url}}` merge tags.

### Tag
- **`2hr-checklist-optin`** (id `XDbdW3DodlWipxHUadFo`)

### Custom fields (contact)
- **Opt-in ZIP** — `contact.optin_zip` (id `nr7YDOuinHvO6cJdPR2B`)
- **Opt-in Source** — `contact.optin_source` (id `UnrSRwuERykbjiHWyrhN`)

### Verified working end-to-end
- A probe contact was created via API, tag applied, both custom fields populated, then deleted. The plumbing works.

---

## What you do in the GHL UI (~15–20 min total)

### Step 1 — Create the opt-in form (~5 min)

1. Sidebar → **Sites → Forms → Builder → + New Form**
2. Name it: **"2-Hour Quote Checklist Opt-in"**
3. Add fields, in order:
   - **First Name** (required)
   - **Email** (required, validated)
   - **Opt-in ZIP** — drag from "Custom Fields" panel (optional)
4. Style: keep stock for now — landing page will style the wrapper anyway
5. **Settings → Embed** — copy the embed script and the public form URL. You'll need both for the landing page.
6. Submit settings: pick **"Show success message"** with copy:
   > Check your inbox — the checklist is on its way (gives some inboxes ~60 seconds).
   > If your house needs to be clean today, call or text us:
   > AL (256) 826-1100 · TN (615) 510-1427
7. Save.

### Step 2 — Build the workflow (~10 min)

This is the only piece the v2 API doesn't expose.

1. Sidebar → **Automation → Workflows → + Create Workflow → Start from scratch**
2. Name: **"2-Hour Quote Checklist — Welcome Sequence (7 emails)"**
3. **Trigger** → **Form Submitted** → select **"2-Hour Quote Checklist Opt-in"** (the form you just made)
4. **Add Action → Add Contact Tag** → select `2hr-checklist-optin`
5. **Add Action → Set Custom Field**:
   - `Opt-in Source` = `2hr-checklist`
6. **Add Action → Send Email** → choose template `TVCT — 2hr Checklist #1 — Delivery`
   - Subject is already set to variant A. To run an A/B test, add a second branch (see "A/B testing" below).
   - In the email body, the merge tag `{{download_link}}` needs to point at the PDF. Two options:
     - (a) Upload the PDF to GHL **Files** and copy its public URL → replace `{{download_link}}` in the template body with that URL.
     - (b) Use a custom value (sidebar → **Settings → Custom Values → + Add**, key `download_link`, value = the URL). The merge tag will pick it up automatically.
   - Pick option (b) — set it once, every email template reuses it.
7. **Add Action → Wait** → **2 days, until Tuesday at 7:30 AM Central Time**
8. **Send Email** → template `TVCT — 2hr Checklist #2 — Connection`
9. **Wait** → 2 days, until Thursday 7:30 AM CT
10. **Send Email** → template `#3 — Quick Win`
11. **Wait** → 2 days, until Tuesday 7:30 AM CT
12. **Send Email** → `#4 — Value Story`
13. **Wait** → 2 days, until Thursday 7:30 AM CT
14. **Send Email** → `#5 — Bridge`
15. **Wait** → 2 days, until Tuesday 7:30 AM CT
16. **Send Email** → `#6 — Soft Pitch`
17. **Wait** → 2 days, until Thursday 7:30 AM CT
18. **Send Email** → `#7 — Direct Pitch`
19. **(Optional) End action**: Remove tag, add contact to "TVCT — Passive Sequence" (existing workflow).

20. **Settings → Workflow re-entry**: set to **Once per contact** (no re-entry on second opt-in).

21. **Publish** (top-right). Confirm green "Published" badge appears.

### Step 3 — Custom value for download link (~1 min)

Sidebar → **Settings → Custom Values → + Add**
- Key: `download_link`
- Value: paste the public URL of the lead-magnet PDF (you'll upload that to GHL Files, Google Drive, or your CDN — anywhere with a stable URL).

### Step 4 — Smoke test (~3 min)

1. Open the form preview in an incognito tab
2. Submit with a real email address you can check (not the GHL primary admin email — it can short-circuit some triggers)
3. Confirm within 60 seconds:
   - Contact appears in **Contacts** with the `2hr-checklist-optin` tag
   - Custom fields show `Opt-in ZIP` and `Opt-in Source` populated
   - Email #1 arrives in your inbox (check Promotions tab if Gmail)
   - In the workflow's **History** tab, the contact is paused at the first Wait step

If all four happen, the sequence is live. Delete the test contact to keep stats clean.

---

## A/B testing (optional, after launch)

The email frontmatter contains subject A/B variants (see `campaigns/2-hour-quote-checklist/emails/`). To test:

1. In the workflow, click the "Send Email" action for the email you want to test
2. Toggle **"A/B subject test"** (GHL native feature, requires Pro plan)
3. Paste variant B from the markdown frontmatter (`subject_line_b`)
4. Set split: 50/50 for the first 200 sends, then auto-pick winner

Priority tests per `sequence-overview.md`:
- Email 1: A vs C (sets voice register for the list)
- Email 6: A vs B (tells you how much "math marketing" the audience tolerates)
- Email 7: A vs C (informs ongoing close-out copy)

---

## Things to verify before launch

- [ ] `download_link` custom value is set and the URL works incognito
- [ ] All 7 templates render correctly when previewed (open each → "Preview")
- [ ] First email subject "(inside)" doesn't trigger spam filter in Gmail (test send to a Gmail account)
- [ ] Unsubscribe link in footer goes to a working unsubscribe page
- [ ] The "Christen" / "Todd" alternating sign-offs match: 1 Christen, 2 Christen, 3 Todd, 4 Christen, 5 Todd, 6 Todd, 7 Christen
- [ ] Sending domain SPF/DKIM is verified in GHL (Settings → Email Services → check green badges)

---

## When something breaks

- **Templates not visible in workflow dropdown**: refresh the workflow builder tab. GHL caches the template list.
- **Wait step skipped**: GHL's "Wait until Tuesday 7:30 AM CT" doesn't fire if the contact enters within ~30 min of the target time. Push the first wait by an explicit 2-day delay instead of "next Tuesday" if you see this.
- **Email lands in Promotions**: that's actually fine — Gmail puts well-formatted HTML emails there by default. The "drag to Primary" P.S. on email #1 handles it.
- **Contact missing custom field values**: confirm the form has both `Opt-in ZIP` and `Opt-in Source` mapped to the right custom fields (form builder → click field → "Map to custom field").

---

## What to do after the sequence

Once email 7 sends, the contact should drop into the existing **"TVCT — Passive Sequence"** (already in your workflow list, currently `draft` — publish it when you're ready). That sequence handles 1 email every 2 weeks; build it with `/newsletter` if you don't have content yet.

If a contact **books** during the sequence, the existing workflow **"1) Cleaning Booked → Remove From Nurture Workflows"** (already published) will pull them out automatically.

---

## Reference

- Campaign assets: `campaigns/2-hour-quote-checklist/`
- Email markdown sources: `campaigns/2-hour-quote-checklist/emails/`
- Visual assets: `creative-output/social-graphics/`
- API push results: `creative-output/_ghl_push_results.json`
- Script used: `scripts/ghl_push_templates.py` (idempotent — safe to re-run if you need to regenerate templates)
