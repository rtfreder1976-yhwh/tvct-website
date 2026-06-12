import type { ApiRequest, ApiResponse } from './_types.js';
import { Resend } from 'resend';

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return res.status(500).json({
        error: 'Email service not configured'
      });
    }

    const resend = new Resend(resendApiKey);

    const { name, email, phone, service, location, preferred_date, message, source, page_url, is_urgent, square_footage, bedrooms, bathrooms, funnel_event, seconds } = req.body;

    // Booking-funnel lifecycle events (booking_started/abandoned/completed) come
    // from /booking and may be partial (e.g. abandon fired on tab close). Don't
    // require phone for those — relay whatever identity we have to GHL.
    const isBookingEvent = source === 'Booking Page Pre-Capture' || !!funnel_event;

    if (!isBookingEvent && !phone) {
      return res.status(400).json({
        error: 'Phone number is required'
      });
    }

    // Send to GHL webhook for CRM integration. Three separate webhooks:
    //   Quote-form leads -> ...d053e0 (the "Website Quote Form - New Lead" wf)
    //   booking_started/abandoned -> GHL_BOOKING_WEBHOOK_URL (Abandoned Booking
    //     Recovery wf)
    //   booking_completed -> GHL_BOOKING_COMPLETED_WEBHOOK_URL (the stop wf
    //     that adds the 'booked' tag and removes the contact from recovery).
    // Each falls back to the main quote webhook if its env var is not set so
    // nothing breaks before configuration.
    const QUOTE_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/iKQIBhpKVL2XVPgU7HMd/webhook-trigger/aa1b4261-4253-40a8-84c4-07bff1d053e0';
    const BOOKING_RECOVERY_WEBHOOK_URL = process.env.GHL_BOOKING_WEBHOOK_URL || QUOTE_WEBHOOK_URL;
    const BOOKING_COMPLETED_WEBHOOK_URL = process.env.GHL_BOOKING_COMPLETED_WEBHOOK_URL || BOOKING_RECOVERY_WEBHOOK_URL;
    const ghlWebhookUrl = !isBookingEvent
        ? QUOTE_WEBHOOK_URL
        : String(funnel_event) === 'booking_completed'
            ? BOOKING_COMPLETED_WEBHOOK_URL
            : BOOKING_RECOVERY_WEBHOOK_URL;

    try {
      await fetch(ghlWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name || '',
          email: email || '',
          phone: phone || '',
          service: service || '',
          location: location || '',
          square_footage: square_footage || '',
          bedrooms: bedrooms || '',
          bathrooms: bathrooms || '',
          preferred_date: preferred_date || '',
          message: message || '',
          source: source || 'Website',
          page_url: page_url || '',
          is_urgent: is_urgent === 'true',
          // Booking-funnel lifecycle marker for the abandoned-booking workflow
          // (booking_started | booking_abandoned | booking_completed; '' for normal leads)
          funnel_event:
            ['booking_started', 'booking_abandoned', 'booking_completed'].includes(String(funnel_event))
              ? String(funnel_event)
              : '',
          seconds_in_iframe:
            typeof seconds === 'number' && isFinite(seconds) ? Math.max(0, Math.round(seconds)) : '',
          submitted_at: new Date().toISOString()
        })
      });
      console.log('Sent to GHL webhook');
    } catch (ghlError) {
      console.error('GHL webhook error:', ghlError);
      // Continue execution to send email backup even if GHL fails
    }

    // Server-side PostHog capture — ties every lead/booking event to analytics
    // even when the browser snippet is blocked. phc_ key is public (same class
    // as the GA4 measurement ID). Never let analytics failure break the lead.
    try {
      const phEvent = ['booking_started', 'booking_abandoned', 'booking_completed'].includes(String(funnel_event))
        ? String(funnel_event)
        : 'quote_form_submitted';
      await fetch('https://us.i.posthog.com/i/v0/e/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: 'phc_AJmz2EtAwrZZpTJEXDtFWwtiE6cwYou2TPxzbCMsgXZB',
          event: phEvent,
          distinct_id: (typeof phone === 'string' && phone) || (typeof email === 'string' && email) || 'anonymous-lead',
          properties: {
            service: service || '',
            location: location || '',
            source: source || 'Website',
            page_url: page_url || '',
            is_urgent: is_urgent === 'true',
          },
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (phError) {
      console.error('PostHog capture error (non-fatal):', phError);
    }

    // Format the email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFA985 0%, #FFC67D 100%); padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">${is_urgent === 'true' ? '🚀 PRIORITY - ' : ''}New Lead from Website</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; border-bottom: 2px solid #FFA985; padding-bottom: 10px;">Contact Information</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${name || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${phone}" style="color: #FFA985;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;">${email ? `<a href="mailto:${email}" style="color: #FFA985;">${email}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Service Requested:</td>
              <td style="padding: 10px 0; color: #333;">${service || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Square Footage:</td>
              <td style="padding: 10px 0; color: #333;">${square_footage || 'Not provided'} sq ft</td>
            </tr>
            ${location ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 10px 0; color: #333;">${location}</td>
            </tr>
            ` : ''}
            ${preferred_date ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 10px 0; color: #333;">${preferred_date}</td>
            </tr>
            ` : ''}
          </table>

          ${message ? `
          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #FFA985;">
            ${message}
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 15px; background: #fff; border-radius: 8px; font-size: 12px; color: #666;">
            <p style="margin: 5px 0;"><strong>Source:</strong> ${source || 'Website'}</p>
            <p style="margin: 5px 0;"><strong>Page:</strong> ${page_url || 'Unknown'}</p>
            <p style="margin: 5px 0;"><strong>Priority:</strong> ${is_urgent === 'true' ? '<span style="color: #e11d48; font-weight: bold;">URGENT (Same Day/Next Day Request)</span>' : 'Standard'}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
          </div>
        </div>

        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">The Valley Clean Team - Website Lead Notification</p>
        </div>
      </div>
    `;

    const emailText = `
New Lead from Website

Name: ${name || 'Not provided'}
Phone: ${phone}
Email: ${email || 'Not provided'}
Service: ${service || 'Not specified'}
Square Footage: ${square_footage || 'Not provided'} sq ft
${location ? `Location: ${location}` : ''}
${preferred_date ? `Preferred Date: ${preferred_date}` : ''}
${message ? `\nMessage:\n${message}` : ''}

---
Source: ${source || 'Website'}
Page: ${page_url || 'Unknown'}
Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}
    `.trim();

    // Booking-funnel lifecycle events are handled by GHL only — don't email a
    // notification for every started/abandoned event (that would be noisy).
    // GHL's abandoned-booking workflow drives the follow-up instead.
    if (isBookingEvent) {
      return res.status(200).json({ success: true, message: 'Event received', funnel_event: funnel_event || '' });
    }

    // Send email to GHL inbox for workflow automation
    const { data, error } = await resend.emails.send({
      from: 'The Valley Clean Team <hello@thevalleycleanteam.com>',
      to: ['hello@thevalleycleanteam.com'],
      subject: `${is_urgent === 'true' ? '🚀 URGENT: ' : ''}New Lead: ${service || 'Cleaning Service'} - ${name || phone}`,
      html: emailHtml,
      text: emailText,
      replyTo: typeof email === 'string' ? email : undefined
    });

    if (error) {
      console.error('Resend error:', error);
      throw new Error(error.message);
    }

    return res.status(200).json({
      success: true,
      message: "We're calculating your price now. Check your texts!",
      emailId: data?.id
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
