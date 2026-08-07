import { Resend } from 'resend';

/**
 * The three destinations a lead has to reach: GoHighLevel (CRM + automation),
 * PostHog (analytics), and the hello@ inbox (the human-visible copy).
 *
 * This lives in its own module because two endpoints now feed it:
 *
 *   - `/api/submit-form` — the remaining on-site forms (careers, the
 *     commercial-quote / Belle Meade QuoteForm component, blog newsletter).
 *   - `/api/bookingkoala-webhook` — everything from the hosted BookingKoala
 *     flow, which is where the main quote and booking funnels moved.
 *
 * Before this split the fan-out lived inline in submit-form.ts. When
 * /get-quote was replaced by a BookingKoala embed (0ab7262, 2026-07-17) and
 * then retired altogether (#109, 2026-07-27), the only caller of that fan-out
 * disappeared and all three destinations went quiet — no PostHog
 * `quote_form_submitted` after 2026-07-17, no GHL quote-workflow trigger, and
 * no lead email after 14:54 UTC that day. Keeping one implementation means the
 * webhook path cannot drift away from the form path again.
 */

/** Normalised lead, the shape every destination is fed from. */
export interface Lead {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  square_footage: string;
  bedrooms: string;
  bathrooms: string;
  preferred_date: string;
  message: string;
  source: string;
  page_url: string;
  is_urgent: boolean;
  /** '' for ordinary leads; one of the three booking values otherwise. */
  funnel_event: string;
  /** Seconds spent in the booking flow, when the sender measured it. */
  seconds: number | null;
}

export const BOOKING_EVENTS = [
  'booking_started',
  'booking_abandoned',
  'booking_completed',
] as const;

export type BookingEvent = (typeof BOOKING_EVENTS)[number];
export type FunnelEvent = BookingEvent | 'quote_form_submitted';

export function isBookingEvent(value: unknown): value is BookingEvent {
  return (BOOKING_EVENTS as readonly string[]).includes(String(value));
}

/**
 * GHL routing. Each booking webhook falls back to the one below it so a
 * missing env var degrades to "lands in the main workflow" rather than
 * "silently dropped".
 */
export const QUOTE_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/aa1b4261-4253-40a8-84c4-07bff1d053e0';

export function ghlWebhookUrlFor(funnelEvent: string): string {
  const recovery = process.env.GHL_BOOKING_WEBHOOK_URL || QUOTE_WEBHOOK_URL;
  const completed = process.env.GHL_BOOKING_COMPLETED_WEBHOOK_URL || recovery;

  if (!isBookingEvent(funnelEvent)) return QUOTE_WEBHOOK_URL;
  return funnelEvent === 'booking_completed' ? completed : recovery;
}

const POSTHOG_PROJECT_KEY = 'phc_AJmz2EtAwrZZpTJEXDtFWwtiE6cwYou2TPxzbCMsgXZB';

/** Build a Lead from a loosely-typed request body, filling every field. */
export function normaliseLead(input: Record<string, unknown>): Lead {
  const str = (value: unknown): string =>
    value === undefined || value === null ? '' : String(value);

  const rawSeconds = input.seconds;
  const seconds =
    typeof rawSeconds === 'number' && isFinite(rawSeconds)
      ? Math.max(0, Math.round(rawSeconds))
      : null;

  return {
    name: str(input.name),
    email: str(input.email),
    phone: str(input.phone),
    service: str(input.service),
    location: str(input.location),
    square_footage: str(input.square_footage),
    bedrooms: str(input.bedrooms),
    bathrooms: str(input.bathrooms),
    preferred_date: str(input.preferred_date),
    message: str(input.message),
    source: str(input.source) || 'Website',
    page_url: str(input.page_url),
    // Preserved from the original inline version: the on-site forms send the
    // string 'true', not a boolean, so compare against the string.
    is_urgent: str(input.is_urgent) === 'true',
    funnel_event: isBookingEvent(input.funnel_event) ? String(input.funnel_event) : '',
    seconds,
  };
}

/**
 * POST the lead to GoHighLevel. Never throws — a CRM outage must not cost us
 * the email copy or the analytics event.
 */
export async function sendToGhl(lead: Lead): Promise<boolean> {
  const url = ghlWebhookUrlFor(lead.funnel_event);
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        location: lead.location,
        square_footage: lead.square_footage,
        bedrooms: lead.bedrooms,
        bathrooms: lead.bathrooms,
        preferred_date: lead.preferred_date,
        message: lead.message,
        source: lead.source,
        page_url: lead.page_url,
        is_urgent: lead.is_urgent,
        // Booking-funnel lifecycle marker for the abandoned-booking workflow
        // (booking_started | booking_abandoned | booking_completed; '' for
        // ordinary leads).
        funnel_event: lead.funnel_event,
        seconds_in_iframe: lead.seconds === null ? '' : lead.seconds,
        submitted_at: new Date().toISOString(),
      }),
    });
    console.log('Sent to GHL webhook');
    return true;
  } catch (ghlError) {
    console.error('GHL webhook error:', ghlError);
    return false;
  }
}

/**
 * Server-side PostHog capture — ties every lead/booking event to analytics even
 * when the browser snippet is blocked, and is now the *only* source for these
 * four events since the site-side beacons and forms were retired. The phc_ key
 * is public (same class as the GA4 measurement ID). Never let an analytics
 * failure break the lead.
 */
export async function captureToPostHog(lead: Lead): Promise<FunnelEvent> {
  const event: FunnelEvent = isBookingEvent(lead.funnel_event)
    ? lead.funnel_event
    : 'quote_form_submitted';

  try {
    await fetch('https://us.i.posthog.com/i/v0/e/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_PROJECT_KEY,
        event,
        distinct_id: lead.phone || lead.email || 'anonymous-lead',
        properties: {
          service: lead.service,
          location: lead.location,
          source: lead.source,
          page_url: lead.page_url,
          is_urgent: lead.is_urgent,
        },
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (phError) {
    console.error('PostHog capture error (non-fatal):', phError);
  }

  return event;
}

/** Escape interpolated lead data so a quote or angle bracket cannot break the
 *  email markup (these values come from a public form and a third-party
 *  webhook, so neither is trusted markup). */
function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildLeadEmailHtml(lead: Lead): string {
  const urgentPrefix = lead.is_urgent ? '🚀 PRIORITY - ' : '';
  return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFA985 0%, #FFC67D 100%); padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">${urgentPrefix}New Lead from Website</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; border-bottom: 2px solid #FFA985; padding-bottom: 10px;">Contact Information</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${esc(lead.name) || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${encodeURIComponent(lead.phone)}" style="color: #FFA985;">${esc(lead.phone)}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;">${lead.email ? `<a href="mailto:${encodeURIComponent(lead.email)}" style="color: #FFA985;">${esc(lead.email)}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Service Requested:</td>
              <td style="padding: 10px 0; color: #333;">${esc(lead.service) || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Square Footage:</td>
              <td style="padding: 10px 0; color: #333;">${esc(lead.square_footage) || 'Not provided'} sq ft</td>
            </tr>
            ${lead.location ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 10px 0; color: #333;">${esc(lead.location)}</td>
            </tr>
            ` : ''}
            ${lead.preferred_date ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 10px 0; color: #333;">${esc(lead.preferred_date)}</td>
            </tr>
            ` : ''}
          </table>

          ${lead.message ? `
          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #FFA985;">
            ${esc(lead.message)}
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 15px; background: #fff; border-radius: 8px; font-size: 12px; color: #666;">
            <p style="margin: 5px 0;"><strong>Source:</strong> ${esc(lead.source)}</p>
            <p style="margin: 5px 0;"><strong>Page:</strong> ${esc(lead.page_url) || 'Unknown'}</p>
            <p style="margin: 5px 0;"><strong>Priority:</strong> ${lead.is_urgent ? '<span style="color: #e11d48; font-weight: bold;">URGENT (Same Day/Next Day Request)</span>' : 'Standard'}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
          </div>
        </div>

        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">The Valley Clean Team - Website Lead Notification</p>
        </div>
      </div>
    `;
}

export function buildLeadEmailText(lead: Lead): string {
  return `
New Lead from Website

Name: ${lead.name || 'Not provided'}
Phone: ${lead.phone}
Email: ${lead.email || 'Not provided'}
Service: ${lead.service || 'Not specified'}
Square Footage: ${lead.square_footage || 'Not provided'} sq ft
${lead.location ? `Location: ${lead.location}` : ''}
${lead.preferred_date ? `Preferred Date: ${lead.preferred_date}` : ''}
${lead.message ? `\nMessage:\n${lead.message}` : ''}

---
Source: ${lead.source}
Page: ${lead.page_url || 'Unknown'}
Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
    `.trim();
}

/** Send the hello@ notification. Returns the Resend message id. Throws on a
 *  Resend-reported error so the caller can decide how loud to be. */
export async function sendLeadEmail(
  resendApiKey: string,
  lead: Lead
): Promise<string | undefined> {
  const resend = new Resend(resendApiKey);
  const { data, error } = await resend.emails.send({
    from: 'The Valley Clean Team <hello@thevalleycleanteam.com>',
    to: ['hello@thevalleycleanteam.com'],
    subject: `${lead.is_urgent ? '🚀 URGENT: ' : ''}New Lead: ${lead.service || 'Cleaning Service'} - ${lead.name || lead.phone}`,
    html: buildLeadEmailHtml(lead),
    text: buildLeadEmailText(lead),
    replyTo: lead.email || undefined,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error(error.message);
  }

  return data?.id;
}
