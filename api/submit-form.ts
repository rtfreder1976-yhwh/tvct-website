import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

/**
 * Escapes HTML special characters to prevent HTML injection in emails
 */
function escapeHtml(str: string | undefined | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates and normalizes phone number (US format)
 */
function isValidPhone(phone: string): boolean {
  // Remove all non-digit characters for validation
  const digits = phone.replace(/\D/g, '');
  // Valid US phone: 10 digits, or 11 digits starting with 1
  return digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
}

/**
 * Parses is_urgent to boolean, handling string 'true'/'false' and actual booleans
 */
function parseUrgent(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  return Boolean(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const ghlWebhookUrl = process.env.GHL_WEBHOOK_URL;

    if (!resendApiKey) {
      console.error('Missing RESEND_API_KEY environment variable');
      return res.status(500).json({
        error: 'Email service not configured'
      });
    }

    if (!ghlWebhookUrl) {
      console.error('Missing GHL_WEBHOOK_URL environment variable');
      // Continue without GHL integration rather than failing
    }

    const resend = new Resend(resendApiKey);

    const { name, email, phone, service, location, preferred_date, message, source, page_url, is_urgent, square_footage } = req.body;

    // Validate required fields
    if (!phone) {
      return res.status(400).json({
        error: 'Phone number is required'
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        error: 'Invalid phone number format'
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Parse is_urgent to handle both string and boolean inputs
    const isUrgent = parseUrgent(is_urgent);

    // Sanitize all user inputs for HTML embedding
    const sanitized = {
      name: escapeHtml(name),
      email: escapeHtml(email),
      phone: escapeHtml(phone),
      service: escapeHtml(service),
      location: escapeHtml(location),
      preferred_date: escapeHtml(preferred_date),
      message: escapeHtml(message),
      source: escapeHtml(source),
      page_url: escapeHtml(page_url),
      square_footage: escapeHtml(square_footage)
    };

    // Send to GHL webhook for CRM integration (if configured)
    if (ghlWebhookUrl) {
      try {
        await fetch(ghlWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name || '',
            email: email || '',
            phone: phone,
            service: service || '',
            location: location || '',
            square_footage: square_footage || '',
            preferred_date: preferred_date || '',
            message: message || '',
            source: source || 'Website',
            page_url: page_url || '',
            is_urgent: isUrgent,
            submitted_at: new Date().toISOString()
          })
        });
        console.log('Sent to GHL webhook');
      } catch (ghlError) {
        console.error('GHL webhook error:', ghlError);
        // Continue execution to send email backup even if GHL fails
      }
    }

    // Format the email content using sanitized values
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FFA985 0%, #FFC67D 100%); padding: 20px; text-align: center;">
          <h1 style="color: #333; margin: 0;">${isUrgent ? '🚀 PRIORITY - ' : ''}New Lead from Website</h1>
        </div>

        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #333; border-bottom: 2px solid #FFA985; padding-bottom: 10px;">Contact Information</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Name:</td>
              <td style="padding: 10px 0; color: #333;">${sanitized.name || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px 0; color: #333;"><a href="tel:${sanitized.phone}" style="color: #FFA985;">${sanitized.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px 0; color: #333;">${sanitized.email ? `<a href="mailto:${sanitized.email}" style="color: #FFA985;">${sanitized.email}</a>` : 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Service Requested:</td>
              <td style="padding: 10px 0; color: #333;">${sanitized.service || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Square Footage:</td>
              <td style="padding: 10px 0; color: #333;">${sanitized.square_footage || 'Not provided'} sq ft</td>
            </tr>
            ${sanitized.location ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Location:</td>
              <td style="padding: 10px 0; color: #333;">${sanitized.location}</td>
            </tr>
            ` : ''}
            ${sanitized.preferred_date ? `
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #555;">Preferred Date:</td>
              <td style="padding: 10px 0; color: #333;">${sanitized.preferred_date}</td>
            </tr>
            ` : ''}
          </table>

          ${sanitized.message ? `
          <h3 style="color: #333; margin-top: 20px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #FFA985;">
            ${sanitized.message}
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding: 15px; background: #fff; border-radius: 8px; font-size: 12px; color: #666;">
            <p style="margin: 5px 0;"><strong>Source:</strong> ${sanitized.source || 'Website'}</p>
            <p style="margin: 5px 0;"><strong>Page:</strong> ${sanitized.page_url || 'Unknown'}</p>
            <p style="margin: 5px 0;"><strong>Priority:</strong> ${isUrgent ? '<span style="color: #e11d48; font-weight: bold;">URGENT (Same Day/Next Day Request)</span>' : 'Standard'}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' })}</p>
          </div>
        </div>

        <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">The Valley Clean Team - Website Lead Notification</p>
        </div>
      </div>
    `;

    // Plain text version uses original values (no HTML injection risk in plain text)
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

    // Send email to GHL inbox for workflow automation
    const { data, error } = await resend.emails.send({
      from: 'The Valley Clean Team <hello@thevalleycleanteam.com>',
      to: ['hello@thevalleycleanteam.com'],
      subject: `${isUrgent ? '🚀 URGENT: ' : ''}New Lead: ${sanitized.service || 'Cleaning Service'} - ${sanitized.name || sanitized.phone}`,
      html: emailHtml,
      text: emailText,
      replyTo: email || undefined
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
