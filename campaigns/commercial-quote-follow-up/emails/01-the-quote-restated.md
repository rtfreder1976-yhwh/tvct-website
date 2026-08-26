---
email: 1
sequence: commercial-quote-follow-up
purpose: Deliver/restate the quote and show the three inputs behind the number
send_day: 0
send_time: "Within 2 business hours of the quote going out"
subject_line_a: "Your cleaning quote from The Valley Clean Team"
subject_line_b: "Square footage, task list, visits per week"
subject_line_c: "The quote, and how we built it"
recommended_subject: "a"
preview_text: "Priced from three things, and here they are."
cta: "Reply with questions, or call (256) 826-1100"
status: draft
---

# Email 1: The Quote, Restated

## Subject Line Variants

### A: "Your cleaning quote from The Valley Clean Team" — recommended
Names the sender, which makes the email findable later when the buyer searches their inbox during a vendor comparison. Highest open for a delivery email.

> **Optional upgrade:** if GHL's standard Company Name field is populated for these contacts, `"Your cleaning quote for {{contact.company_name}}"` performs better — naming the buyer's own organization gets past a scanning facility manager. Verified 2026-08-25 that no *custom* `company_name` field exists in this location (60 contact fields checked); GHL's built-in standard field may still be available but could not be confirmed via API. **Send one test to yourself before using the merge version** — an unresolved tag renders as literal text to a prospect.

### B: "Square footage, task list, visits per week"
The three inputs as the subject. Unusual enough to stand out, and it signals the quote is built from a method rather than a guess — which is the entire commercial angle.

### C: "The quote, and how we built it"
Plain and slightly transparent. Lower open ceiling, but attracts exactly the buyer who wants to understand the pricing rather than just compare totals.

**Recommended A/B test:** A vs B
**Reason:** Tests whether company-name personalization beats method-signaling for facility managers. The result tells us whether this audience responds to being known or to being shown a system.

## Preview Text
"Priced from three things, and here they are."

## Send Timing
Day 0, within 2 business hours of the quote. The 2-business-hour written quote is the commercial promise — the follow-up should demonstrate it rather than describe it.

---

## Email Copy

Hi {{contact.first_name}},

Your cleaning quote is attached, sent within two business hours as promised.

Three things set that number: the square footage of the space, the task list you want covered, and how many visits per week. Nothing else moves it. If any of those three change, the number changes and we will show you exactly how.

A few things worth knowing before you compare it to anything else:

Every visit works a written checklist built for your space, in the same order each time. Every cleaner is background-checked before entering the building. The company carries $2 million in liability insurance, and we can send the certificate today if procurement needs it on file.

If anything in the quote needs adjusting — a room added, a frequency changed, a task removed — reply and tell me and I will send a revised version the same day.

Todd Frederickson
The Valley Clean Team
(256) 826-1100

---

**P.S.** If you are collecting quotes from several companies, ask each one what their price is actually based on. The answer tells you a lot about whether the number will hold.
