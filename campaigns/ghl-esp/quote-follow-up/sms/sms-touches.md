# SMS — Quote Follow-Up (Residential)

_Created 2026-08-25. Status: DRAFT. GHL SMS confirmed live by Todd 2026-08-25._

## Rules these obey (`brand/voice-profile.md`, SMS row)

- **Under 300 characters**, every one. Counts noted below.
- First name. Signed **Todd** (customer-facing replies are signed by Todd — Christen's Review Rules).
- Shortest and warmest register. Courtesy first, the specific second, next step third.
- At most one exclamation mark per message, only for thanks or welcome, **never attached to a claim or a number**. None of these use one.
- No emoji. No banned oversell words. No scarcity.
- AL: **(256) 826-1100**. TN contacts: **(615) 510-1427** — branch on contact state in GHL.

## Compliance

Todd confirmed GHL SMS is set up (A2P 10DLC). Every message below is transactional follow-up to someone who **requested a quote**, which is the consent basis. Still true regardless:

- Honor STOP/opt-out immediately (GHL handles this natively — do not override).
- Send only 8:00 AM - 8:00 PM in the **contact's** local time. AL and TN are both Central, but Nashville-area contacts near the line should be treated as Central.
- Never send the first SMS before the first email. The email establishes who is texting.

## The touches

Two only. Email carries the sequence; SMS is for the moments where a text genuinely beats an email.

---

### SMS 1 — Day 1 (the morning after the quote)

**Send:** Day 1, 9:00 AM CT. One day after the quote so it does not collide with the Day 0 email.

> Hi {{contact.first_name}} — Todd with The Valley Clean Team. Sent your exact price yesterday by email in case it went to spam. Any questions, just reply here or call (256) 826-1100. — Todd

**219 characters.** Purpose: rescue a quote lost to a spam folder. This is the single highest-value SMS in the set, because a quote nobody saw looks identical to a quote somebody ignored.

---

### SMS 2 — Day 6 (between the recurring email and the close)

**Send:** Day 6, 5:30 PM CT. Evening, when household decisions get made.

> Hi {{contact.first_name}} — checking in on your cleaning quote. No rush and no pressure; if it is a no, that is genuinely fine and you can just say so. If you want to book, reply here or call (256) 826-1100. — Todd

**212 characters.** Purpose: make "no" easy. A cheap no is worth more than an expensive maybe — it stops the sequence and frees the slot.

---

## Optional third touch — VSL (only once the video exists)

Do not send with `[VIDEO LINK]` unresolved.

**Send:** Day 3, 9:00 AM CT — replaces nothing; adds a touch for lists where video engagement is being tested.

> Hi {{contact.first_name}} — Todd here. Recorded about 3 minutes on why our price is what it is, and who we are not the right fit for: [VIDEO LINK] Questions, reply here. — Todd

**~175 characters + link.** Keep the framing plain. A text that oversells a video reads like spam.

## What is deliberately NOT an SMS

- The recurring-discount explanation — needs the 30/25/15 detail, which is an email job.
- The honest close — asking for a decision deserves the longer form.
- Anything with a price in it. Numbers in a text invite a negotiation the phone call is meant to settle.
