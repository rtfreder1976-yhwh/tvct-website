# GA4 connection

**Goal:** give Claude read access to GA4 the same way `scripts/gsc-*.js`
already reads Search Console, then use it to audit what the property records.

**Status:** script shipped, awaiting credentials from Todd.

## What shipped

| File | What it is |
| ---- | ---------- |
| `scripts/ga4-report.js` | GA4 Data API reader. `npm run ga4` |
| `.env.example` | Documents `GA4_PROPERTY_ID`, `GA4_CLIENT_EMAIL`, `GA4_PRIVATE_KEY` |
| `package.json` | `npm run ga4` |
| `audit-2026-08-31.md` | Code-side audit (done — 3 findings) |

No new dependency: `googleapis` was already installed for the GSC scripts and
includes the GA4 Data API.

`npm run ga4` reports totals, every event by name, contact clicks split by
label, key events, sessions by region, top landing pages, channels, and
sessions by hostname. Flags: `--days 90`, or `--start`/`--end`.

## Todd's part (~5 minutes)

The service account needs to be added to the GA4 property. Cloud project
access alone returns 403 — the same trap that bit Search Console.

**Secrets live in Vercel, not in a local file.** There is no `.env` on the dev
machine (confirmed 2026-08-31) — `.env.example` is only the committed template
and never holds real values. Pull secrets down with `vercel env pull .env`,
which writes a gitignored local `.env`. Do not hand-edit `.env.example`.

**If the existing GSC service account is reused (simplest):**

1. Enable the **Google Analytics Data API** in the Google Cloud project that
   owns the service account (Cloud console → APIs & Services). GSC being
   enabled does not enable this one — different API.
2. Get the service-account email (`GSC_CLIENT_EMAIL` in Vercel env).
3. GA4 → **Admin** → **Property access management** → **+** → add that email
   as **Viewer**. Cloud project access alone returns 403.
4. GA4 → **Admin** → **Property Settings** → copy the **numeric property ID**
   (`123456789`, not `G-LXHE2DSZ7T`).
5. Add `GA4_PROPERTY_ID` to Vercel env, then run `vercel env pull .env`.

The script falls back to `GSC_CLIENT_EMAIL` / `GSC_PRIVATE_KEY` when the GA4
credential vars are blank, so nothing else is needed.

**Check first:** this assumes the GSC service account exists and is in Vercel
env. If the `gsc-*.js` scripts have never actually been run, those credentials
may not exist at all — in which case step 0 is creating a service account in
Google Cloud, which is a longer job than the five minutes above.

Then run `npm run ga4` and paste the output back, or say the word and I will
run it.

## What the read access answers

- Whether anything is marked as a key event (suspected: nothing).
- Whether preview traffic is still leaking in (hostname report — the PR #167
  fix should hold, this confirms it).
- Real AL/TN sessions vs total, so conversion rates use an honest denominator.
- Which landing pages actually receive entrances, to point conversion work at
  real entry points rather than assumed ones.

## Open follow-up

The audit's finding 1 — the quote flow fires no analytics events at all — does
not depend on read access. It can be fixed now.
