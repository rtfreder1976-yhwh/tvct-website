import type { ApiRequest, ApiResponse } from './_types.js';
import {
  captureToPostHog,
  normaliseLead,
  sendLeadEmail,
  sendToGhl,
} from './_lead-delivery.js';

/**
 * On-site form endpoint.
 *
 * Still live for: the careers application, the QuoteForm component
 * (/commercial-quote and /locations/nashville/belle-meade) and the blog
 * newsletter. The main quote and booking funnels no longer reach here — they
 * moved to hosted BookingKoala and arrive via /api/bookingkoala-webhook.
 *
 * The funnel_event handling below is kept because the endpoint is public and
 * documented, but no site code sends it any more; BookingKoala webhooks are the
 * live source of the three booking events.
 */
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

    const body = req.body ?? {};
    const lead = normaliseLead(body);

    // Booking-funnel lifecycle events (booking_started/abandoned/completed) may
    // be partial (e.g. abandon fired on tab close). Don't require phone for
    // those — relay whatever identity we have to GHL.
    //
    // Gate on the *raw* funnel_event rather than the validated one: any truthy
    // value has always been enough to take this branch, and only whitelisted
    // values are relayed onward. Narrowing it here would start rejecting
    // phone-less callers that the endpoint has accepted since it shipped.
    const isBookingLifecycle =
      lead.source === 'Booking Page Pre-Capture' || !!body.funnel_event;

    if (!isBookingLifecycle && !lead.phone) {
      return res.status(400).json({
        error: 'Phone number is required'
      });
    }

    await sendToGhl(lead);
    await captureToPostHog(lead);

    // Booking-funnel lifecycle events are handled by GHL only — don't email a
    // notification for every started/abandoned event (that would be noisy).
    // GHL's abandoned-booking workflow drives the follow-up instead.
    if (isBookingLifecycle) {
      return res.status(200).json({
        success: true,
        message: 'Event received',
        funnel_event: lead.funnel_event,
      });
    }

    const emailId = await sendLeadEmail(resendApiKey, lead);

    return res.status(200).json({
      success: true,
      message: "We're calculating your price now. Check your texts!",
      emailId
    });

  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({
      error: 'Failed to submit form',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
