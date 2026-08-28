# Cancellation Notes, Verbatim — 2026 YTD

_Pulled 2026-08-25 from BookingKoala → Bookings → Cancelled bookings, 01/01/2026-08/25/2026, all industries/locations. 50 rows across 3 pages. Read-only._

**Why this file exists:** the summary report (Reports → Cancellation reports) buckets 55% of churn as "Other" or "No reason provided," which looked like missing data. It is not. Todd noted that selecting "Other" requires a written note, and those notes live on the booking row, not in the report. **The notes change the conclusion.**

---

## What the notes actually say

Re-coded from the verbatim text, not the dropdown label:

| Real cause | Count | Share |
| --- | --- | --- |
| **Our capacity / availability** | **12** | **24%** |
| Data hygiene (duplicates, admin cleanup) | 7 | 14% |
| Customer life circumstance | 9 | 18% |
| Customer financial | 6 | 12% |
| Pausing — "I will be back" | 6 | 12% |
| Customer not home / asleep / unreachable | 4 | 8% |
| Service quality or conduct | 3 | 6% |
| Moving | 3 | 6% |

### The capacity bucket, verbatim (12)

- "You did not have the time I wanted" ×6 (Bret Jourden, Alex Shearer, Bianca Brown-Levesque, Miranda Hunkler, Gage Montalto, Billi Graham)
- Billi Graham's note: *"Customer wanted us to work her in and was not willing to wait to get worked in and decided to cancel one day later."*
- Julie Adams: *"Client was unhappy with not being able to reschedule sooner."*
- Anita Allfrey: *"Client found another service before using ours"*
- Saadya Abdulai: *"Cleaner not available"*
- Teena Belew: *"No cleaner was available and the client was unreachable."*
- Thomas Creighton: *"Cleaner was not available for a 1:30 cleaning"*
- Julie Adams: *"Cleaners were sick"*

**One in four cancellations is us not having a slot.** Not price, not quality — availability and rescheduling latency.

### Service quality / conduct (3)

- Alexis Hamrick: *"The cleaner left and did not return"* — a walk-off mid-job
- Barbara Gholston: *"Cleaner did not show up."*
- Holly Cain: "Not happy with the customer service"
- (Penny Davis: "Not happy with the quality of the service" — dropdown only, no note)

Small in count, severe in kind. Two are no-shows, which feed directly back into the capacity problem.

### Price-related (1 of 50)

Only **Sharon Powell**, and the note shows it was a **billing-process misunderstanding, not the price**:

> *"Customer did not understand that we pre-authorized her card for the amount the morning of the appointment. She texted to cancel, per our terms of service, we charge a cancellation fee."*

"Financial reason" (6) reads as the customer's own budget, and one is explicitly a competitor situation (Curtis Kuetemeyer: *"He is trying to get a financial client for his business and going with his cleaning company"* — a reciprocal-business loss, not a price loss).

### Pausing, not leaving (6)

"I will be back" — Jackson Warren, Amy Smith, Diane Lizardo, Bonnie Summey, Carolyn Hardin, plus Pamela Layne's note: *"Pamela is traveling and will sign back up for services when she gets back in town."*

**A named win-back list with contact details, self-identified as temporary.** Nobody is working it.

### Life circumstance (9)

Home health taking over cleaning (Jason Fiorillo ×2: *"Has home health"*, *"Homehealth is coming in and might do housecleaning for Jim"*), renovations (Janessa Arellano, Maryellen Rawls), a mother who cleaned the home instead (Kathleen Roark), property already sold (Jeff Gibbs), an Airbnb guest cancellation (Bradley Barnett), traveling, no-longer-needed.

Mostly not winnable, and not our fault. Worth noting the **compassionate-clean adjacency**: two are home-health transitions, which is the same trigger `/services/compassionate-clean` targets.

### Data hygiene (7)

"Duplicate" ×5, "Cleaning up pending charges", "Changing schedule". **14% of the churn number is not churn at all** — it's admin noise inflating the cancellation count.

---

## What this overturns

1. **My earlier read said price was not the churn driver. That holds, and is now stronger** — 1 of 50 mentions price, and that one is a billing-communication failure. The premium positioning is not costing customers.
2. **The dominant, fixable cause is capacity**, at 24%. Copy cannot fix this. More slots, faster rescheduling, and better cleaner coverage can. The honest wrong-fit line ("we book 2-3 days out") is *truthful*, but it is describing the single largest reason people leave.
3. **True churn is ~43, not 51** once duplicates and admin cleanup are removed.
4. **Two no-shows and a walk-off** are the most damaging entries in the file. Those are the reviews that don't get written.

## Copy and campaign implications

- **Do not** write copy defending the price. The data does not support that being the problem.
- **Win-back sequence** for the 6 "I will be back" customers — named, contactable, self-identified as pausing. Highest-ROI email on the board.
- **Billing-clarity line**: at least one cancellation came from surprise at the morning pre-authorization. Saying "we pre-authorize your card the morning of the clean" in the confirmation email costs nothing and prevents that.
- **The 2-3 day booking window** should stay in copy — it is honest — but the operational fix is worth more than any wording change.
- **Home-health / compassionate-clean** shows up twice as a transition trigger; may deserve its own nurture given `/services/compassionate-clean` already draws traffic.

## Caveat

These are the **office's** words, not always the customer's. Notes are written by whoever processed the cancellation, so they carry staff interpretation. Treat verbatim quotes as near-verbatim.
