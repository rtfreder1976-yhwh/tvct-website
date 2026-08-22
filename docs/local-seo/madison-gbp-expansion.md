# Second GBP: Madison, AL

**Date:** 2026-08-21
**Status:** approved in principle — pending Christine's written consent
**Goal:** map-pack presence in the Huntsville/Madison market, which has ~5×
the search demand of the Shoals home market.

---

## Why a second profile is required

Map-pack results are driven by proximity to the profile **pin**, not by the
service areas listed on it. The Tuscumbia profile already lists Athens as a
service area and still returns SoLV 0.00 there. Adding Huntsville as a service
area would change nothing.

Distances from the current Tuscumbia pin (34.6134, -87.7582):

| To | Miles |
|---|---|
| Huntsville center | 67.1 |
| Madison | 57.7 |

Both far outside pack range. A second, properly located profile is the only
legitimate way into that market.

## Why Madison, not Huntsville

**Christine's Madison address is the better pin even though Huntsville has
more raw demand.**

Madison sits **9.5 miles** from downtown Huntsville — inside pack range for
both. A Madison pin covers the Huntsville market *and* owns Madison outright.

Demand, 90 days (GSC, 2026-05-21 → 2026-08-19):

| Sub-market | Queries | Impressions | Clicks | Avg pos |
|---|---|---|---|---|
| Huntsville | 199 | 9,092 | 6 | 27.5 |
| Madison | 71 | 1,454 | 0 | 23.3 |
| Meridianville | 4 | 306 | 0 | 10.9 |
| Big Cove | 1 | 245 | 0 | 3.2 |
| Hampton Cove | 1 | 236 | 0 | 6.9 |

Market totals for context:

| Market | Impressions | CTR |
|---|---|---|
| Nashville/Brentwood | 25,148 | 0.05% |
| **Huntsville/Madison** | **11,404** | 0.05% |
| Athens/Decatur | 2,669 | 0.07% |
| Shoals (current pack presence) | 2,298 | **0.26%** |

The Shoals CTR is 5× the others. That is what map-pack presence is worth —
and it is the only market where TVCT currently has it.

## The queries this unlocks

Already ranking page-1 organically with **zero clicks**, because the pack sits
above them:

| Query | Impressions | Position |
|---|---|---|
| post renovation cleaning huntsville | 243 | **3.2** |
| post construction cleaning huntsville | 242 | **6.6** |
| dental office cleaning huntsville | 286 | 7.1 |
| post construction cleaning madison | 332 | 9.6 |
| medical office cleaning huntsville | 224 | 9.4 |

`post construction cleaning madison` is the highest-impression query in the
whole Huntsville area, and post-construction is the highest-margin service
($526 starting). These are not speculative rankings — they already exist and
convert nothing.

---

## Setup

Do this in **business.google.com** as the owner. It cannot be done through
GoHighLevel Listings, Local Falcon, or any API — Google gates new-location
creation and verification behind owner action.

### 1. Before creating anything — Christine's written consent

Not a verbal yes. She should understand and agree in writing that:

- Her **home address** is registered to a business record with Google
- A **verification postcard** will arrive at her home (or a video call will
  show it)
- The address stays attached until deliberately removed
- If she **moves or leaves the company**, the listing must be re-verified
  elsewhere or taken down

Keep a copy of that agreement. This protects her and the business.

### 2. Create the location

- **Name:** The Valley Clean Team — must match the Tuscumbia profile exactly.
  Do **not** use "The Valley Clean Team Madison" or add keywords. Name
  variations between profiles are a spam signal.
- **Address:** Christine's Madison address
- **Hide the address:** yes — service-area business, same as Tuscumbia
- **Primary category:** House cleaning service
- **Additional categories:** Janitorial service, and others matching Tuscumbia

### 3. Service areas

Center on the Huntsville metro. Do **not** duplicate the Shoals areas — the
two profiles should not overlap, or they compete with each other:

Madison, Huntsville, Harvest, Meridianville, Hampton Cove, Big Cove,
Owens Cross Roads, Triana, New Market

Leave Athens and Decatur on whichever profile serves them in practice.
Do not list them on both.

### 4. Hours — be honest

If Christine is cleaning during the day, do **not** copy Tuscumbia's Mon-Fri
9-5. "Staffed during stated hours" is the actual requirement.

Narrower accurate hours are safer than wide inaccurate ones. A profile that
claims hours nobody is available for is the kind of thing that draws a
suspension review.

### 5. Phone — use a distinct number

Two profiles sharing (256) 826-1100 is a duplicate-listing signal.

Provision a separate number for Madison. Secondary benefit: it gives
per-market call attribution, which GoHighLevel cannot infer today — every
inbound call currently arrives with `attributionSource: sessionSource "Other"`
because a tel: tap destroys browser context before the call connects.

### 6. Verification

Postcard (1-2 weeks) or video call. The postcard goes to Christine's home —
she needs to know to watch for it and not discard it.

---

## After it goes live

### Reviews do not transfer

The new profile starts at **zero reviews**. The Tuscumbia profile's 4.9★/152
does not carry over. Expect weak initial pack position — reviews and velocity
are ranking factors and the profile has neither yet.

**This is where GoHighLevel's reputation tooling finally earns its place.**
Earlier in this project it was the wrong tool because the constraint was
visibility, not reviews. Now there is a profile that genuinely needs review
volume:

- Route **Madison/Huntsville customers' review requests to the Madison
  profile**, Shoals customers to Tuscumbia
- Requires the review link per profile, wired by service area or assigned
  cleaner in GHL
- Never ask a customer to review a location that did not serve them

### Update the listings sync

GoHighLevel Listings currently manages one entity (ID 6092310, Tuscumbia,
30 listings, 19 synced, Profile Health 100%). The Madison profile will need
its own entity, or it will drift out of sync with the other directories.

### Measurement

Re-run Local Falcon centered on Madison (34.6993, -86.7483), 7×7 grid,
10-mile radius — same shape as the Shoals baseline so results are comparable.

Baselines as of 2026-08-21:

| Scan | ARP | SoLV | Found in |
|---|---|---|---|
| Shoals (Tuscumbia center) | 5.84 | **32.65%** | 43/49 |
| Huntsville (current) | 21.00 | **0.00%** | 0/49 |

Target: any nonzero SoLV in Huntsville within 90 days of verification.

> **Note on Local Falcon:** its saved record for TVCT still holds stale
> coordinates (34.1276, -87.2360 — near Cullman, ~60 mi off). Scans run
> through the API with explicit lat/lng bypass this, but dashboard-initiated
> scans will be wrong. Delete and re-add the location in the Local Falcon
> dashboard to fix it permanently. `saveLocalFalconBusinessLocationToAccount`
> does not overwrite an existing record.

---

## Nashville — deferred, deliberately

Nashville is the largest market (25,148 impressions, 2× Huntsville) but is
deferred: at ~120 miles from Tuscumbia it needs its own staffed presence, and
Todd's assessment is that meeting that demand requires hiring there first.
Revisit once Madison is verified and producing, and once there is Nashville
staff to serve the work.

## Do not

- Use a Regus, virtual office, mailbox, or coworking address. Google's
  guidelines require a staffed location; these do not qualify. Suspension
  risk extends to the **Tuscumbia profile**, which currently holds 32.65%
  SoLV and 152 reviews — a working asset worth far more than the shortcut.
- Add keywords or a city name to the business name on either profile.
- Duplicate service areas across the two profiles.
