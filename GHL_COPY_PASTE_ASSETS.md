# GHL Abandoned-Booking — Copy/Paste Asset Pack

_Everything you need to paste into GoHighLevel. Last updated: 2026-06-05._

> ⚠️ **Pricing note before you start:** your `/pricing` page shows $99 / $175 /
> $225 (regular/deep/move-out) but the best-of pages show $176 / $276 / $325.
> These don't match. The templates below **avoid hardcoding a price** and send
> people to see *their own* estimate instead — so you can't send a wrong number.
> Reconcile the two pages when you get a chance; until then, leave the optional
> price lines out.

---

## 0) The recovery "magic link" (used in every message)

Paste this exact link anywhere you want the one-click pre-filled booking:

```
https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}
```

It drops them into BookingKoala with their info already filled.

---

## 1) SMS — Step 1 (send 30 min after `booking_started` if not booked)

**Primary (recommended):**
```
Hi {{contact.first_name}}, it's Todd with The Valley Clean Team 👋 Looks like you started booking but didn't finish. Get stuck or have a question? Reply here — or pick up right where you left off (your info's already filled in): https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}
```

**Shorter variant:**
```
{{contact.first_name}}, saw you started your cleaning quote with The Valley Clean Team but didn't finish. Want me to hold a spot? Finish in 60 sec (info pre-filled): https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}} — or just reply with any questions!
```

**Concierge / no-form variant (for people who hate forms):**
```
Hi {{contact.first_name}}, Todd here from The Valley Clean Team. No need to fill anything out — just reply with your address + # of beds/baths and I'll text you a flat price. Or finish your quote here: https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&email={{contact.email}}&phone={{contact.phone}}
```

---

## 2) SMS — Step 2 (send 1 day later if still not booked)

```
{{contact.first_name}}, still thinking it over? Totally fair. We're veteran- & women-owned, fully insured, 146 5-star reviews, and we send post-clean photos so you see exactly what you paid for. Happy to answer anything — or grab a spot here: https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}
```

---

## 3) Email — Subject line options (A/B test these)

```
Your cleaning quote is one click away, {{contact.first_name}}
You're 60 seconds from a clean home
Did you get stuck? Here's your spot, {{contact.first_name}}
Still want that clean? (your info's already filled in)
```

---

## 4) Email — HTML body (paste into GHL email builder → "Code" / custom HTML block)

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:24px 0;font-family:Arial,Helvetica,sans-serif;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;max-width:600px;">
      <tr>
        <td style="background:linear-gradient(135deg,#FFA985,#FFC67D);padding:28px 32px;">
          <h1 style="margin:0;color:#333333;font-size:24px;">You're one click from a clean home, {{contact.first_name}} 👋</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:28px 32px;color:#333333;font-size:16px;line-height:1.6;">
          <p style="margin:0 0 16px;">Looks like you started booking your cleaning with The Valley Clean Team but didn't quite finish. No worries — it happens.</p>
          <p style="margin:0 0 16px;">We saved your spot in line. Pick up right where you left off — <strong>your name, email, and phone are already filled in</strong>, so it takes about 60 seconds:</p>
          <p style="text-align:center;margin:28px 0;">
            <a href="https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}"
               style="background:#FFA985;color:#ffffff;text-decoration:none;font-weight:bold;font-size:18px;padding:16px 32px;border-radius:999px;display:inline-block;">
              Finish My Booking →
            </a>
          </p>
          <p style="margin:0 0 8px;font-weight:bold;">Why folks pick us:</p>
          <ul style="margin:0 0 16px;padding-left:20px;color:#555;">
            <li>Veteran-owned &amp; women-owned, fully insured &amp; bonded</li>
            <li>146 five-star reviews — and post-clean photos so you see what you paid for</li>
            <li>The same background-checked team every visit</li>
            <li>Flat price quoted upfront — no surprises</li>
          </ul>
          <p style="margin:0 0 16px;">Have a question or want a hand? Just reply to this email or call/text us:</p>
          <p style="margin:0 0 4px;"><strong>Alabama:</strong> <a href="tel:2568261100" style="color:#FFA985;">(256) 826-1100</a></p>
          <p style="margin:0 0 16px;"><strong>Tennessee:</strong> <a href="tel:6155101427" style="color:#FFA985;">(615) 510-1427</a></p>
          <p style="margin:24px 0 0;color:#888;font-size:13px;">Life is messy. We've got this. — The Valley Clean Team</p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
```

---

## 5) Email — plain-text fallback

```
You're one click from a clean home, {{contact.first_name}}.

Looks like you started booking with The Valley Clean Team but didn't quite finish — no worries, it happens.

We saved your spot. Pick up right where you left off (your info's already filled in, takes about 60 seconds):

https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}

Why folks pick us:
- Veteran-owned & women-owned, fully insured & bonded
- 146 five-star reviews + post-clean photos
- Same background-checked team every visit
- Flat price quoted upfront — no surprises

Questions? Reply here, or call/text:
Alabama (256) 826-1100  |  Tennessee (615) 510-1427

Life is messy. We've got this.
— The Valley Clean Team
```

---

## 6) Owner-call task (Step 3, ~1 day later for high-value services)

**Task title:**
```
Call {{contact.first_name}} {{contact.last_name}} — abandoned booking
```
**Task body:**
```
{{contact.first_name}} started a {{custom_values.service}} booking in {{custom_values.city}} and didn't finish. Personal call to close.
Phone: {{contact.phone}} | Email: {{contact.email}}
Magic link to text them: https://thevalleycleanteam.com/booking?f_name={{contact.first_name}}&l_name={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}
```

---

## 7) GHL workflow — exact build steps

**Custom values you may want to create** (Settings → Custom Values), or just use
the inbound fields directly:
- `service` ← from the webhook `service` field
- `city` ← from the webhook `location_city` field

**Workflow: "Abandoned Booking Recovery"**
1. **Trigger:** Inbound Webhook (your existing one) **→ Filter:** `funnel_event` **is** `booking_started`.
2. **Action:** Add Tag → `booking-started`.
3. **Wait:** 30 minutes.
4. **If/Else:** Does contact have tag `booked` (or received `funnel_event = booking_completed`)?
   - **Yes** → Goal met → End.
   - **No** → continue.
5. **Send SMS** → paste *Section 1 (Primary)*.
6. **Wait:** 1 hour.
7. **If/Else:** booked? Yes → End. No → continue.
8. **Send Email** → subject from *Section 3*, body from *Section 4 (HTML)*.
9. **Wait:** 1 day.
10. **If/Else:** booked? Yes → End. No → continue.
11. **Send SMS** → paste *Section 2*.
12. **Create Task** → *Section 6* (assign to Todd/Christen).

**Separate "stop" workflow (or a Goal on the one above):**
- **Trigger:** Inbound Webhook → Filter `funnel_event` **is** `booking_completed`
  → **Action:** Add tag `booked` + Remove contact from "Abandoned Booking Recovery".

---

## 8) Test it before going live
1. Open `https://thevalleycleanteam.com/booking` in your phone browser.
2. Start filling the BookingKoala form, then close the tab.
3. Check GHL — within seconds you should see an inbound event with
   `funnel_event: booking_abandoned` (and `booking_started` just before).
4. Confirm your workflow fires the SMS after the wait step.
5. Click the magic link from the SMS on a different device — confirm your name/
   email/phone are pre-filled in BookingKoala.

> Tip: while testing, temporarily set the first Wait to 1 minute so you're not
> waiting 30. Set it back to 30 min before going live.
